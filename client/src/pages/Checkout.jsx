import { useState } from "react";
import PageTransition from "../components/common/PageTransition";

export default function Checkout() {
  const [step, setStep] = useState(1);
  return (
    <PageTransition>
      <div className="rounded-2xl border border-white/10 bg-shoppop-surface p-6">
        <div className="mb-6 flex items-center gap-2 text-sm">{[1, 2, 3].map((s) => <div key={s} className={`rounded-full px-3 py-1 ${s <= step ? "bg-shoppop-amber-400 text-black" : "bg-shoppop-high"}`}>Step {s}</div>)}</div>
        {step === 1 && <div className="space-y-3"><h2 className="text-xl font-bold">Delivery Address</h2><input className="w-full rounded border border-white/10 bg-shoppop-high p-2" placeholder="Full name" /><input className="w-full rounded border border-white/10 bg-shoppop-high p-2" placeholder="Phone" /><textarea className="w-full rounded border border-white/10 bg-shoppop-high p-2" placeholder="Address" /></div>}
        {step === 2 && <div><h2 className="text-xl font-bold">Delivery Slot</h2><div className="mt-3 grid gap-2 sm:grid-cols-3">{["Morning", "Afternoon", "Evening"].map((s) => <button key={s} className="rounded-xl border border-white/10 bg-shoppop-high px-3 py-2">{s}</button>)}</div></div>}
        {step === 3 && <div><h2 className="text-xl font-bold">Payment</h2><div className="mt-3 space-y-2"><label className="block rounded-xl border border-white/10 p-3">UPI</label><label className="block rounded-xl border border-white/10 p-3">Card</label><label className="block rounded-xl border border-white/10 p-3">Cash on Delivery</label></div><button className="mt-4 rounded-xl bg-amber-gradient px-4 py-2 font-semibold text-black">Pay ₹6,998</button></div>}
        <div className="mt-6 flex justify-between"><button disabled={step === 1} onClick={() => setStep((s) => s - 1)} className="rounded border border-white/20 px-3 py-1 disabled:opacity-40">Back</button><button disabled={step === 3} onClick={() => setStep((s) => s + 1)} className="rounded bg-shoppop-amber-400 px-3 py-1 font-semibold text-black disabled:opacity-40">Next</button></div>
      </div>
    </PageTransition>
  );
}
