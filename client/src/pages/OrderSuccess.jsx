import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";

const confetti = Array.from({ length: 24 }, (_, i) => i);

export default function OrderSuccess() {
  const { orderId } = useParams();
  const estimated = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <PageTransition>
      <div className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="pointer-events-none absolute inset-0">
          {confetti.map((i) => (
            <span key={i} className={`confetti confetti-${i % 6}`} style={{ left: `${(i * 97) % 100}%`, animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>

        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20">
          <motion.svg viewBox="0 0 52 52" className="h-14 w-14">
            <circle cx="26" cy="26" r="24" fill="none" stroke="#22c55e" strokeWidth="3" />
            <motion.path
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 27l8 8 16-16"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
          </motion.svg>
        </motion.div>

        <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
        <p className="mt-2 text-zivvo-text-muted">Order ID: {orderId}</p>
        <p className="mt-1 text-zivvo-text-muted">Estimated delivery: {estimated}</p>

        <div className="mt-6 flex gap-3">
          <Link to={`/orders/${orderId}`} className="rounded-lg bg-zivvo-amber-brand px-5 py-3 text-sm font-semibold text-black">Track Order</Link>
          <Link to="/" className="rounded-lg border border-zivvo-dark-raised px-5 py-3 text-sm">Continue Shopping</Link>
        </div>
      </div>

      <style>{`
        .confetti { position:absolute; top:-12px; width:8px; height:14px; opacity:0.75; animation: fall 2.6s linear infinite; }
        .confetti-0 { background:#ef9f27; }
        .confetti-1 { background:#22c55e; }
        .confetti-2 { background:#38bdf8; }
        .confetti-3 { background:#f43f5e; }
        .confetti-4 { background:#facc15; }
        .confetti-5 { background:#a78bfa; }
        @keyframes fall { to { transform: translateY(85vh) rotate(540deg); opacity:0.9; } }
      `}</style>
    </PageTransition>
  );
}
