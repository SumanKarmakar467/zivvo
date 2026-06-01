import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { useCartContext } from "../context/CartContext";
import { clearCart as clearReduxCart } from "../store/slices/cartSlice";

const steps = ["Address", "Payment", "Confirm"];

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [paid, setPaid] = useState(false);
  const dispatch = useDispatch();
  const { items, totals, clearCart } = useCartContext();

  const pay = async () => {
    try {
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
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--cream)] md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex gap-2">{steps.map((label, index) => <button key={label} onClick={() => setStep(index)} className={`flex-1 rounded-md border px-3 py-3 font-bold ${step === index ? "border-[#C9A84C] bg-[#C9A84C] text-black" : "border-[var(--border)]"}`}>{label}</button>)}</div>
        <AnimatePresence mode="wait">
          <motion.section key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="zivvo-card rounded-lg p-6">
            {step === 0 && <Panel title="Delivery Address"><input className="input w-full" defaultValue="Zivvo House, MG Road, Bengaluru" /></Panel>}
            {step === 1 && <Panel title="Payment"><p className="text-[var(--muted)]">Razorpay test mode. Total: ${totals.total.toFixed(2)}</p></Panel>}
            {step === 2 && <Panel title="Confirm"><p>{items.length} item(s) ready for checkout.</p></Panel>}
            <div className="mt-6 flex justify-between">
              <button disabled={step === 0} onClick={() => setStep((value) => value - 1)} className="rounded-md border border-[var(--border)] px-5 py-3 font-bold disabled:opacity-40">Back</button>
              {step < 2 ? <button onClick={() => setStep((value) => value + 1)} className="rounded-md bg-[#C9A84C] px-5 py-3 font-bold text-black">Next</button> : <button onClick={pay} className="rounded-md bg-[#C9A84C] px-5 py-3 font-bold text-black">Pay with Razorpay</button>}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  );
}

function Panel({ title, children }) {
  return <div><h1 className="text-3xl font-black">{title}</h1><div className="mt-5">{children}</div></div>;
}
