import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import api from "../../api/axios";
import { notifyError, notifySuccess } from "../../components/common/Toast";

const emptyForm = {
  code: "",
  type: "flat",
  value: "",
  maxDiscount: "",
  minOrderValue: "",
  usageLimit: "",
  perUserLimit: "1",
  validFrom: "",
  validUntil: "",
  applicableCategories: "",
  isActive: true
};

export default function SellerCouponsPage() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/coupons");
        setItems(data);
      } catch (error) {
        notifyError(error?.response?.data?.message || "Failed to fetch coupons");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || (user.role !== "seller" && user.role !== "admin")) return <Navigate to="/" replace />;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (coupon) => {
    setEditing(coupon);
    setForm({
      code: coupon.code || "",
      type: coupon.type || "flat",
      value: coupon.value ?? "",
      maxDiscount: coupon.maxDiscount ?? "",
      minOrderValue: coupon.minOrderValue ?? "",
      usageLimit: coupon.usageLimit ?? "",
      perUserLimit: coupon.perUserLimit ?? 1,
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 10) : "",
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 10) : "",
      applicableCategories: Array.isArray(coupon.applicableCategories) ? coupon.applicableCategories.join(", ") : "",
      isActive: coupon.isActive !== false
    });
    setShowModal(true);
  };

  const save = async () => {
    if (!/^[A-Z0-9-]{1,20}$/.test(form.code.toUpperCase())) return notifyError("Code must be max 20 chars, alphanumeric or dash");
    if (Number(form.value) <= 0) return notifyError("Value must be greater than 0");
    if (form.type === "percent" && Number(form.value) > 90) return notifyError("Percent value must be <= 90");

    const payload = {
      ...form,
      code: form.code.toUpperCase(),
      applicableCategories: form.applicableCategories.split(",").map((x) => x.trim()).filter(Boolean),
      scope: user.role === "admin" ? "platform" : "seller"
    };

    try {
      if (editing) {
        const { data } = await api.patch(`/coupons/${editing._id}`, payload);
        setItems((prev) => prev.map((item) => (item._id === data._id ? data : item)));
        notifySuccess("Coupon updated");
      } else {
        const { data } = await api.post("/coupons", payload);
        setItems((prev) => [data, ...prev]);
        notifySuccess("Coupon created");
      }
      setShowModal(false);
    } catch (error) {
      notifyError(error?.response?.data?.message || "Failed to save coupon");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
      notifySuccess("Coupon deleted");
    } catch (error) {
      notifyError(error?.response?.data?.message || "Failed to delete coupon");
    }
  };

  const toggleActive = async (coupon) => {
    try {
      const { data } = await api.patch(`/coupons/${coupon._id}`, { isActive: !coupon.isActive });
      setItems((prev) => prev.map((item) => (item._id === data._id ? data : item)));
    } catch (error) {
      notifyError(error?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <main className="min-h-screen bg-[#19120b] px-4 py-6 text-[#efe0d3] md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Seller Coupons</h1>
          <button type="button" onClick={openCreate} className="rounded-md bg-[#ef9f27] px-4 py-2 text-sm font-semibold text-black">Create coupon</button>
        </div>

        {loading ? <div className="h-40 animate-pulse rounded-xl bg-zinc-800" /> : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#1f1a14]">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-400">
                  <th className="px-3 py-2">Code</th><th>Type</th><th>Value</th><th>Usage</th><th>Validity</th><th>Active</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((coupon) => (
                  <tr key={coupon._id} className="border-t border-zinc-800">
                    <td className="px-3 py-2 font-semibold">{coupon.code}</td>
                    <td>{coupon.type}</td>
                    <td>{coupon.type === "percent" ? `${coupon.value}%` : `₹${coupon.value}`}</td>
                    <td>{coupon.usedCount}/{coupon.usageLimit ?? "∞"}</td>
                    <td>{coupon.validFrom ? new Date(coupon.validFrom).toLocaleDateString() : "-"} → {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString() : "-"}</td>
                    <td><button type="button" onClick={() => toggleActive(coupon)} className={`rounded-full px-2 py-1 text-xs ${coupon.isActive ? "bg-green-900 text-green-300" : "bg-zinc-800 text-zinc-400"}`}>{coupon.isActive ? "Active" : "Inactive"}</button></td>
                    <td>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEdit(coupon)} className="rounded bg-zinc-800 px-2 py-1 text-xs">Edit</button>
                        <button type="button" onClick={() => remove(coupon._id)} className="rounded bg-red-900 px-2 py-1 text-xs text-red-200">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl rounded-xl border border-zinc-800 bg-[#1f1a14] p-5">
            <h2 className="mb-4 text-lg font-bold">{editing ? "Edit Coupon" : "Create Coupon"}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={form.code} onChange={(e) => setForm((s) => ({ ...s, code: e.target.value.toUpperCase() }))} placeholder="Code" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
              <select value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))} className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"><option value="flat">Flat</option><option value="percent">Percent</option></select>
              <input type="number" value={form.value} onChange={(e) => setForm((s) => ({ ...s, value: e.target.value }))} placeholder="Value" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
              <input type="number" value={form.maxDiscount} onChange={(e) => setForm((s) => ({ ...s, maxDiscount: e.target.value }))} placeholder="Max discount" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
              <input type="number" value={form.minOrderValue} onChange={(e) => setForm((s) => ({ ...s, minOrderValue: e.target.value }))} placeholder="Min order value" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
              <input type="number" value={form.usageLimit} onChange={(e) => setForm((s) => ({ ...s, usageLimit: e.target.value }))} placeholder="Usage limit" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
              <input type="number" value={form.perUserLimit} onChange={(e) => setForm((s) => ({ ...s, perUserLimit: e.target.value }))} placeholder="Per user limit" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
              <input type="date" value={form.validFrom} onChange={(e) => setForm((s) => ({ ...s, validFrom: e.target.value }))} className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
              <input type="date" value={form.validUntil} onChange={(e) => setForm((s) => ({ ...s, validUntil: e.target.value }))} className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm" />
              <input value={form.applicableCategories} onChange={(e) => setForm((s) => ({ ...s, applicableCategories: e.target.value }))} placeholder="Categories (comma)" className="rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm sm:col-span-2" />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded border border-zinc-700 py-2 text-sm">Cancel</button>
              <button type="button" onClick={save} className="flex-1 rounded bg-[#ef9f27] py-2 text-sm font-semibold text-black">Save</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
