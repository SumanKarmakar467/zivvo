import PageTransition from "../components/common/PageTransition";

export default function OrderTracking() {
  const steps = ["Order Placed", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];
  return <PageTransition><div className="rounded-2xl border border-white/10 bg-shoppop-surface p-6"><h1 className="text-2xl font-bold">Order #SP-102938</h1><p className="text-shoppop-text-muted">Placed 6 May 2026</p><div className="mt-6 space-y-3">{steps.map((step, i) => <div key={step} className="flex items-center gap-3"><span className={`h-3 w-3 rounded-full ${i < 5 ? "bg-green-400" : "bg-gray-500"}`} /><p>{step}</p></div>)}</div></div></PageTransition>;
}
