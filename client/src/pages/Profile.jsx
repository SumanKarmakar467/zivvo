import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Camera, LogOut, Mail, MapPin, Phone, Plus, Save, Trash2, User } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

const STORAGE_KEY = "zivvo_profile";

const defaultProfile = {
  name: "Zivvo Shopper",
  email: "shopper@zivvo.dev",
  phone: "+91 98765 43210",
  avatar: "",
  addresses: [
    {
      id: "home",
      label: "Home",
      line: "221B Skyline Avenue, Salt Lake",
      city: "Kolkata",
      pin: "700091"
    }
  ]
};

const readProfile = () => {
  try {
    return { ...defaultProfile, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return defaultProfile;
  }
};

export default function Profile() {
  const [profile, setProfile] = useState(readProfile);
  const [draftAddress, setDraftAddress] = useState({ label: "", line: "", city: "", pin: "" });
  const authUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  useEffect(() => {
    if (!authUser) return;
    setProfile((current) => ({
      ...current,
      name: authUser.name || current.name || defaultProfile.name,
      email: authUser.email || current.email || defaultProfile.email,
      avatar: authUser.avatar || current.avatar || ""
    }));
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateField = (field, value) => setProfile((current) => ({ ...current, [field]: value }));

  const uploadAvatar = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateField("avatar", url);
  };

  const addAddress = () => {
    if (!draftAddress.line.trim()) return;
    setProfile((current) => ({
      ...current,
      addresses: [...current.addresses, { ...draftAddress, id: crypto.randomUUID(), label: draftAddress.label || "Address" }]
    }));
    setDraftAddress({ label: "", line: "", city: "", pin: "" });
  };

  const removeAddress = (id) => {
    setProfile((current) => ({ ...current, addresses: current.addresses.filter((address) => address.id !== id) }));
  };

  const deleteContact = (field) => updateField(field, "");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <main className="cosmic-container py-10 lg:py-14">
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-label-caps font-bold uppercase tracking-[0.18em] text-neon-cyan">Member Profile</p>
          <h1 className="cosmic-title mt-4 text-5xl md:text-6xl">Your ZIVVO Control Room</h1>
          <p className="mt-4 max-w-2xl text-on-surface-variant">Manage your email, phone number, delivery addresses, avatar, and session from one glass dashboard.</p>
        </div>
        <button onClick={handleLogout} className="btn-ghost px-6 text-error">
          <LogOut className="h-5 w-5" /> Log Out
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="glass-card rounded-[2rem] p-6 lg:sticky lg:top-28 lg:self-start">
          <div className="relative mx-auto h-36 w-36">
            <img src={profile.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(profile.name || "Zivvo")}`} alt="Profile avatar" className="h-full w-full rounded-full border border-neon-cyan/40 object-cover shadow-cyan" />
            <label className="absolute bottom-1 right-1 grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-gradient-to-r from-electric-violet to-neon-cyan text-white shadow-cyan">
              <Camera className="h-5 w-5" />
              <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadAvatar(event.target.files?.[0])} />
            </label>
          </div>
          <div className="mt-6 text-center">
            <h2 className="cosmic-title text-3xl">{profile.name || "Unnamed User"}</h2>
            <p className="mt-2 text-on-surface-variant">{profile.email || "No email added"}</p>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              ["12", "Orders"],
              ["3", "Coupons"],
              ["4.9", "Trust"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-xl bg-white/5 p-3">
                <p className="font-black text-stellar-gold">{value}</p>
                <p className="text-xs text-outline">{label}</p>
              </div>
            ))}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="glass-card rounded-[2rem] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="cosmic-title text-3xl">Account Details</h2>
              <Save className="h-6 w-6 text-neon-cyan" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field icon={User} label="Full Name" value={profile.name} onChange={(value) => updateField("name", value)} />
              <Field icon={Mail} label="Email" value={profile.email} onChange={(value) => updateField("email", value)} onDelete={() => deleteContact("email")} />
              <Field icon={Phone} label="Phone Number" value={profile.phone} onChange={(value) => updateField("phone", value)} onDelete={() => deleteContact("phone")} />
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="cosmic-title text-3xl">Delivery Addresses</h2>
              <MapPin className="h-6 w-6 text-neon-cyan" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {profile.addresses.map((address) => (
                <article key={address.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-label-caps font-bold uppercase tracking-[0.14em] text-neon-cyan">{address.label}</p>
                      <p className="mt-3 font-bold">{address.line}</p>
                      <p className="mt-1 text-on-surface-variant">{address.city} - {address.pin}</p>
                    </div>
                    <button onClick={() => removeAddress(address.id)} className="text-outline-variant hover:text-error" aria-label={`Delete ${address.label} address`}>
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-cosmic-black/35 p-4 md:grid-cols-[0.7fr_1.4fr_0.8fr_0.6fr_auto]">
              <input className="input-cosmic px-4" placeholder="Label" value={draftAddress.label} onChange={(event) => setDraftAddress((value) => ({ ...value, label: event.target.value }))} />
              <input className="input-cosmic px-4" placeholder="Street address" value={draftAddress.line} onChange={(event) => setDraftAddress((value) => ({ ...value, line: event.target.value }))} />
              <input className="input-cosmic px-4" placeholder="City" value={draftAddress.city} onChange={(event) => setDraftAddress((value) => ({ ...value, city: event.target.value }))} />
              <input className="input-cosmic px-4" placeholder="PIN" value={draftAddress.pin} onChange={(event) => setDraftAddress((value) => ({ ...value, pin: event.target.value }))} />
              <button onClick={addAddress} className="btn-primary px-5" aria-label="Add address">
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ icon: Icon, label, value, onChange, onDelete }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-label-caps font-bold uppercase tracking-[0.14em] text-neon-cyan">
        <Icon className="h-4 w-4" /> {label}
      </span>
      <span className="flex gap-2">
        <input className="input-cosmic w-full px-4" value={value} onChange={(event) => onChange(event.target.value)} />
        {onDelete && (
          <button type="button" onClick={onDelete} className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-outline-variant hover:text-error" aria-label={`Delete ${label}`}>
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </span>
    </label>
  );
}
