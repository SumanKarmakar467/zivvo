import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PageTransition from "../components/common/PageTransition";
import ProductCard from "../components/ProductCard";
import { notifyError, notifySuccess } from "../components/common/Toast";
import { fetchWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { selectWishlistItems } from "../store/selectors";

const sections = ["Profile", "My Orders", "Wishlist", "Addresses", "Change Password"];
const baseAddress = { fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", country: "India", isDefault: false };

export default function Account() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  // TODO: Replace with memoized selector from store/selectors.js
  const { isAuthenticated, accessToken } = useSelector((s) => s.auth);
  const [active, setActive] = useState("Profile");
  const [profile, setProfile] = useState({ name: "", phone: "", email: "", avatar: "" });
  const [addresses, setAddresses] = useState([]);
  const wishlistProducts = useSelector(selectWishlistItems);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(baseAddress);
  const [editAddressId, setEditAddressId] = useState("");
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState({ c: false, n: false, x: false });
  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${accessToken}` }), [accessToken]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    const load = async () => {
      const [pRes, aRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/users/profile`, { credentials: "include", headers: authHeaders }),
        fetch(`${import.meta.env.VITE_API_URL}/users/addresses`, { credentials: "include", headers: authHeaders })
      ]);
      const pData = await pRes.json();
      const aData = await aRes.json();
      if (pRes.ok) setProfile({ name: pData.name || "", phone: pData.phone || "", email: pData.email || "", avatar: pData.avatar || "" });
      if (aRes.ok) setAddresses(aData.addresses || []);
      dispatch(fetchWishlist());
    };
    load();
  }, [isAuthenticated, accessToken, authHeaders, dispatch]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const saveProfile = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/profile`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json", ...authHeaders }, body: JSON.stringify({ name: profile.name, phone: profile.phone }) });
    const data = await res.json();
    if (!res.ok) return notifyError(data?.message || "Profile update failed");
    notifySuccess("Profile updated");
  };

  const onAvatar = async (file) => {
    const form = new FormData();
    form.append("avatar", file);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/avatar`, { method: "POST", credentials: "include", headers: authHeaders, body: form });
    const data = await res.json();
    if (!res.ok) return notifyError(data?.message || "Avatar upload failed");
    setProfile((s) => ({ ...s, avatar: data.avatar }));
    notifySuccess("Avatar updated");
  };

  const saveAddress = async () => {
    if (!/^\d{10}$/.test(addressForm.phone)) return notifyError("Phone must be 10 digits");
    if (!/^\d{6}$/.test(addressForm.pincode)) return notifyError("Pincode must be 6 digits");
    const isEdit = Boolean(editAddressId);
    const url = isEdit ? `${import.meta.env.VITE_API_URL}/users/addresses/${editAddressId}` : `${import.meta.env.VITE_API_URL}/users/addresses`;
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, credentials: "include", headers: { "Content-Type": "application/json", ...authHeaders }, body: JSON.stringify(addressForm) });
    const data = await res.json();
    if (!res.ok) return notifyError(data?.message || "Address save failed");
    setAddresses(data.addresses || []);
    setAddressForm(baseAddress);
    setEditAddressId("");
    setShowAddressForm(false);
    notifySuccess("Address saved");
  };

  const deleteAddress = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/addresses/${id}`, { method: "DELETE", credentials: "include", headers: authHeaders });
    const data = await res.json();
    if (!res.ok) return notifyError(data?.message || "Delete failed");
    setAddresses(data.addresses || []);
    notifySuccess("Address deleted");
  };

  const setDefault = async (addr) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/addresses/${addr._id}`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json", ...authHeaders }, body: JSON.stringify({ ...addr, isDefault: true }) });
    const data = await res.json();
    if (!res.ok) return notifyError(data?.message || "Failed to set default");
    setAddresses(data.addresses || []);
  };

  const removeWish = async (id) => {
    try {
      await dispatch(removeFromWishlist(id)).unwrap();
      notifySuccess("Removed from wishlist");
    } catch (error) {
      notifyError(error?.message || "Failed");
    }
  };

  const changePassword = async () => {
    if (pw.newPassword !== pw.confirmPassword) return notifyError("Passwords do not match");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/password`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json", ...authHeaders }, body: JSON.stringify({ currentPassword: pw.currentPassword, newPassword: pw.newPassword }) });
    const data = await res.json();
    if (!res.ok) return notifyError(data?.message || "Password change failed");
    setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
    notifySuccess("Password changed");
  };

  const strength = Math.min(100, (pw.newPassword.length / 12) * 100);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[250px,1fr]">
          <aside className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-3">
            <div className="hidden space-y-1 lg:block">
              {sections.map((s) => <button key={s} onClick={() => setActive(s)} className={`w-full rounded-md px-3 py-2 text-left text-sm ${active === s ? "bg-zivvo-amber-brand text-black" : "text-zivvo-text-muted hover:bg-zivvo-dark-raised"}`}>{s}</button>)}
            </div>
            <div className="flex gap-2 overflow-x-auto lg:hidden">
              {sections.map((s) => <button key={s} onClick={() => setActive(s)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${active === s ? "bg-zivvo-amber-brand text-black" : "bg-zivvo-dark-raised text-zivvo-text-muted"}`}>{s}</button>)}
            </div>
          </aside>
          <section className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-5">
            {active === "Profile" && (
              <div>
                <h2 className="text-xl font-bold">Profile</h2>
                <div className="mt-4 flex items-center gap-4">
                  <img src={profile.avatar || "https://picsum.photos/120"} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
                  <div>
                    <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onAvatar(e.target.files[0])} />
                    <button onClick={() => fileRef.current?.click()} className="rounded-md border border-zivvo-amber-brand px-3 py-2 text-xs text-zivvo-amber-brand">Upload Avatar</button>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input value={profile.name} onChange={(e) => setProfile((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className="rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" />
                  <input value={profile.phone} onChange={(e) => setProfile((s) => ({ ...s, phone: e.target.value }))} placeholder="Phone" className="rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" />
                </div>
                <button onClick={saveProfile} className="mt-4 rounded-md bg-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-black">Save</button>
              </div>
            )}
            {active === "My Orders" && <Link to="/account/orders" className="rounded-md bg-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-black">Go to My Orders</Link>}
            {active === "Wishlist" && (
              wishlistProducts.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{wishlistProducts.map((p) => <div key={p._id} className="relative"><button onClick={() => removeWish(p._id)} className="absolute right-2 top-2 z-10 rounded-full bg-red-500 px-2 py-1 text-xs">x</button><ProductCard product={p} /></div>)}</div> : <div className="py-16 text-center text-zivvo-text-muted"><div className="text-5xl">♡</div><p className="mt-2">Your wishlist is empty</p></div>
            )}
            {active === "Addresses" && (
              <div>
                <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Addresses</h2><button onClick={() => { setShowAddressForm((v) => !v); setEditAddressId(""); setAddressForm(baseAddress); }} className="rounded-md border border-zivvo-amber-brand px-3 py-2 text-xs text-zivvo-amber-brand">Add New Address</button></div>
                <div className="space-y-3">{addresses.map((a) => <div key={a._id} className="rounded-lg border border-zivvo-dark-raised p-3"><div className="flex items-start justify-between gap-2"><p className="text-sm">{a.fullName}, {a.phone}<br />{a.addressLine1}, {a.addressLine2}, {a.city}, {a.state} - {a.pincode}</p>{a.isDefault && <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-300">Default</span>}</div><div className="mt-2 flex gap-2"><button onClick={() => { setEditAddressId(a._id); setAddressForm({ ...a }); setShowAddressForm(true); }} className="rounded border border-zivvo-dark-raised px-2 py-1 text-xs">Edit</button><button onClick={() => deleteAddress(a._id)} className="rounded border border-red-500/60 px-2 py-1 text-xs text-red-300">Delete</button>{!a.isDefault && <button onClick={() => setDefault(a)} className="rounded border border-zivvo-amber-brand px-2 py-1 text-xs text-zivvo-amber-brand">Set as Default</button>}</div></div>)}</div>
                {showAddressForm && <div className="mt-4 grid gap-2 sm:grid-cols-2">{Object.keys(baseAddress).filter((k) => k !== "isDefault").map((k) => <input key={k} value={addressForm[k] || ""} onChange={(e) => setAddressForm((s) => ({ ...s, [k]: e.target.value }))} placeholder={k.replace(/([A-Z])/g, " $1")} className="rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" />)}<label className="col-span-full flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(addressForm.isDefault)} onChange={(e) => setAddressForm((s) => ({ ...s, isDefault: e.target.checked }))} /> Set as default</label><button onClick={saveAddress} className="rounded-md bg-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-black">Save Address</button></div>}
              </div>
            )}
            {active === "Change Password" && (
              <div className="max-w-md">
                <h2 className="text-xl font-bold">Change Password</h2>
                {[{ k: "currentPassword", label: "Current Password", t: "c" }, { k: "newPassword", label: "New Password", t: "n" }, { k: "confirmPassword", label: "Confirm New Password", t: "x" }].map((f) => <div key={f.k} className="mt-3"><label className="mb-1 block text-sm text-zivvo-text-muted">{f.label}</label><div className="flex rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg"><input type={showPw[f.t] ? "text" : "password"} value={pw[f.k]} onChange={(e) => setPw((s) => ({ ...s, [f.k]: e.target.value }))} className="w-full bg-transparent px-3 py-2 text-sm outline-none" /><button onClick={() => setShowPw((s) => ({ ...s, [f.t]: !s[f.t] }))} className="px-3 text-xs text-zivvo-text-muted">{showPw[f.t] ? "Hide" : "Show"}</button></div></div>)}
                <div className="mt-3 h-2 w-full rounded-full bg-zivvo-dark-raised"><div className="h-full rounded-full bg-zivvo-amber-brand" style={{ width: `${strength}%` }} /></div>
                <button onClick={changePassword} className="mt-4 rounded-md bg-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-black">Update Password</button>
              </div>
            )}
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
