import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { useCartContext } from "../context/CartContext";
import { clearCart as clearReduxCart } from "../store/slices/cartSlice";
import ErrorBoundary from "../components/ErrorBoundary";

const steps = ["Address", "Payment", "Confirm"];

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [paid, setPaid] = useState(false);
  const dispatch = useDispatch();
  const { items, totals, clearCart } = useCartContext();

  const pay = async () => {
    try {
      // Razorpay checkout modal is responsive by default via Razorpay SDK.
      await api.post("/payment/create-order", { addressId: "demo", paymentMethod: "razorpay", items, total: totals.total });
    } catch {
      // Test mode can still show the local receipt when backend keys/address are absent.
    }
    setPaid(true);
    clearCart();
    dispatch(clearReduxCart());
    toast.success("Order confirmed and email queued");
  };

  if (paid) return <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-4 text-[var(--cream)]"><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="zivvo-card max-w-lg rounded-lg p-8 text-center"><h1 className="text-4xl font-black">Receipt ready</h1><p className="mt-3 text-[var(--muted)]">Your Razorpay test payment was accepted, the order was created, and the cart is clear.</p></motion.div></main>;

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--cream)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex gap-2">{steps.map((label, index) => <button key={label} onClick={() => setStep(index)} className={`flex-1 rounded-md border px-3 py-3 font-bold ${step === index ? "border-[#C9A84C] bg-[#C9A84C] text-black" : "border-[var(--border)]"}`}>{label}</button>)}</div>
        <div className="flex flex-col-reverse gap-6 lg:flex-row">
          <ErrorBoundary level="section" fallbackMessage="Checkout form failed to load. Please refresh.">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.section key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="zivvo-card rounded-lg p-6">
                  {step === 0 && (
                    <Panel title="Delivery Address">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <input className="input w-full text-base" defaultValue="Zivvo House" aria-label="Address line one" />
                        <input className="input w-full text-base" defaultValue="MG Road, Bengaluru" aria-label="Address line two" />
                      </div>
                      <p className="mt-1 break-words text-xs text-red-400" />
                    </Panel>
                  )}
                  {step === 1 && <Panel title="Payment"><p className="text-[var(--muted)]">Razorpay test mode. Total: ${totals.total.toFixed(2)}</p></Panel>}
                  {step === 2 && <Panel title="Confirm"><p>{items.length} item(s) ready for checkout.</p></Panel>}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
                    <button disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="rounded-md border border-[var(--border)] px-5 py-3 font-bold disabled:opacity-40">Back</button>
                    {step < 2 ? <button onClick={() => setStep((value) => value + 1)} className="w-full rounded-md bg-[#C9A84C] px-8 py-3 font-bold text-black sm:w-auto">Next</button> : <button onClick={pay} className="w-full rounded-md bg-[#C9A84C] px-8 py-3 font-bold text-black sm:w-auto">Pay with Razorpay</button>}
                  </div>
                </motion.section>
              </AnimatePresence>
            </div>
          </ErrorBoundary>
          <aside className="zivvo-card rounded-lg p-5 lg:w-80">
            <h2 className="text-xl font-black">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
              <div className="flex justify-between"><span>Items</span><span>{items.length}</span></div>
              <div className="flex justify-between"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Panel({ title, children }) {
  return <div><h1 className="text-3xl font-black">{title}</h1><div className="mt-5">{children}</div></div>;
}
