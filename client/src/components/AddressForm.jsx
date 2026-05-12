import { useState } from "react";
import { notifyError } from "./common/Toast";

const INDIAN_STATES_UT = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function AddressForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(
    initialData || { label: "home", fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", country: "India", isDefault: false }
  );

  const onBlurPincode = async () => {
    if (!/^\d{6}$/.test(form.pincode)) return;
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${form.pincode}`);
      const data = await res.json();
      const office = data?.[0]?.PostOffice?.[0];
      if (office) {
        setForm((prev) => ({ ...prev, city: prev.city || office.District, state: prev.state || office.State }));
      }
    } catch {
      // ignore silent fallback
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(form.phone)) return notifyError("Phone must be 10 digits");
    if (!/^\d{6}$/.test(form.pincode)) return notifyError("Pincode must be 6 digits");
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <select value={form.label} onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))} className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm">
        <option value="home">Home</option>
        <option value="work">Work</option>
        <option value="other">Other</option>
      </select>
      <input value={form.fullName} onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))} placeholder="Full name" className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" required />
      <input value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} placeholder="Phone" className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" required />
      <input value={form.pincode} onBlur={onBlurPincode} onChange={(e) => setForm((s) => ({ ...s, pincode: e.target.value }))} placeholder="Pincode" className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" required />
      <input value={form.line1} onChange={(e) => setForm((s) => ({ ...s, line1: e.target.value }))} placeholder="Address line 1" className="sm:col-span-2 rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" required />
      <input value={form.line2} onChange={(e) => setForm((s) => ({ ...s, line2: e.target.value }))} placeholder="Address line 2" className="sm:col-span-2 rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" />
      <input value={form.city} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} placeholder="City" className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" required />
      <select value={form.state} onChange={(e) => setForm((s) => ({ ...s, state: e.target.value }))} className="rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm" required>
        <option value="">Select state / UT</option>
        {INDIAN_STATES_UT.map((state) => <option key={state} value={state}>{state}</option>)}
      </select>
      <label className="sm:col-span-2 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={Boolean(form.isDefault)} onChange={(e) => setForm((s) => ({ ...s, isDefault: e.target.checked }))} />
        Set as default
      </label>
      <div className="sm:col-span-2 flex gap-2">
        <button disabled={loading} className="rounded bg-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-black">{loading ? "Saving..." : "Save address"}</button>
        <button type="button" onClick={onCancel} className="rounded border border-zivvo-dark-raised px-4 py-2 text-sm">Cancel</button>
      </div>
    </form>
  );
}
