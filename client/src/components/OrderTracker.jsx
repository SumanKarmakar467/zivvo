import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import confetti from "canvas-confetti";
import gsap from "gsap";
import { CalendarDays, Check, Home, Package, ReceiptText, Truck } from "lucide-react";

const steps = [
  { label: "Order Placed", icon: ReceiptText, desc: "Payment confirmed" },
  { label: "Confirmed", icon: Check, desc: "Seller confirmed & packed" },
  { label: "Shipped", icon: Package, desc: "In transit" },
  { label: "Out for Delivery", icon: Truck, desc: "Arriving today" },
  { label: "Delivered", icon: Home, desc: "Delivered to your door" }
];

export default function OrderTracker({ order, allOrders = [], onOrderSelect }) {
  const [selectedOrder, setSelectedOrder] = useState(order);
  const progressLineRef = useRef(null);
  const etaCardRef = useRef(null);
  const dotRefs = useRef([]);
  const trackingStep = clampStep(selectedOrder?.trackingStep ?? 0);
  const isTerminal = selectedOrder?.status === "delivered" || selectedOrder?.status === "cancelled";
  const currentStep = selectedOrder?.status === "cancelled" ? "Cancelled" : steps[trackingStep]?.label;
  const targetHeight = `${(trackingStep / 4) * 100}%`;
  const stats = useMemo(() => {
    const delivered = allOrders.filter((item) => item.status === "delivered").length;
    const cancelled = allOrders.filter((item) => item.status === "cancelled").length;
    return { total: allOrders.length, delivered, cancelled };
  }, [allOrders]);

  useEffect(() => {
    setSelectedOrder(order);
  }, [order]);

  useEffect(() => {
    gsap.fromTo(dotRefs.current.filter(Boolean), { scale: 0, opacity: 0 }, {
      scale: 1,
      opacity: 1,
      duration: 0.35,
      stagger: 0.15,
      ease: "back.out(1.8)"
    });
  }, [selectedOrder?.id]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.to(progressLineRef.current, { height: targetHeight, duration: 1.0, ease: "power2.out" })
      .from(dotRefs.current[trackingStep], { scale: 0, duration: 0.3, ease: "back.out(2)" }, "-=0.2")
      .to(etaCardRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.1");
    return () => tl.kill();
  }, [trackingStep, targetHeight, selectedOrder?.id]);

  useEffect(() => {
    if (!selectedOrder || selectedOrder.status !== "delivered") return;
    const key = `celebrated_${selectedOrder.id}`;
    if (localStorage.getItem(key)) return;

    confetti({
      particleCount: 140,
      spread: 86,
      colors: ["#C9A84C", "#F5F0E8"],
      origin: { y: 0.62 }
    });
    localStorage.setItem(key, "true");
  }, [selectedOrder]);

  if (!selectedOrder) {
    return (
      <section className="rounded-lg border border-white/10 bg-[#141414] p-6 text-[#F5F0E8]">
        No order selected.
      </section>
    );
  }

  const chooseOrder = (nextOrder) => {
    setSelectedOrder(nextOrder);
    onOrderSelect?.(nextOrder);
  };

  return (
    <section className="space-y-5 text-[#F5F0E8]">
      <article className="rounded-lg border border-white/10 bg-[#141414] p-5">
        <div className="flex gap-4">
          <img src={selectedOrder.productImage} alt={selectedOrder.productName} className="h-24 w-24 shrink-0 rounded-md object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="line-clamp-2 text-xl font-black">{selectedOrder.productName}</h2>
                <p className="mt-1 text-sm text-[#888780]">Size {selectedOrder.size} · Qty {selectedOrder.quantity}</p>
              </div>
              <p className="text-2xl font-black text-[#C9A84C]">${Number(selectedOrder.productPrice || 0).toFixed(2)}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#888780]">
              <span>Order <code className="rounded bg-[#0A0A0A] px-2 py-1 font-mono text-[#F5F0E8]">#{selectedOrder.id}</code></span>
              <span>Placed {formatDate(selectedOrder.placedAt)}</span>
              {selectedOrder.paymentId && <span>Payment <code className="font-mono">{selectedOrder.paymentId}</code></span>}
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-lg border border-white/10 bg-[#141414] p-5">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className={selectedOrder.status === "cancelled" ? "font-bold text-[#E24B4A]" : "font-bold text-[#C9A84C]"}>{currentStep}</span>
          {!isTerminal && <span className="text-[#888780]">ETA {formatDate(selectedOrder.estimatedDelivery)}</span>}
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#0A0A0A]">
          <motion.div
            className={selectedOrder.status === "cancelled" ? "h-full bg-[#E24B4A]" : "h-full bg-[#C9A84C]"}
            initial={{ width: 0 }}
            animate={{ width: selectedOrder.status === "cancelled" ? "100%" : `${(trackingStep / 4) * 100}%` }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </article>

      <article className="rounded-lg border border-white/10 bg-[#141414] p-5">
        <div className="relative pl-2">
          <div className="absolute left-[22px] top-5 h-[calc(100%-40px)] w-px bg-white/10" />
          <div ref={progressLineRef} className="absolute left-[22px] top-5 w-px bg-[#C9A84C]" style={{ height: 0 }} />

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const done = index < trackingStep && selectedOrder.status !== "cancelled";
              const active = index === trackingStep && selectedOrder.status !== "cancelled";
              const pending = index > trackingStep || selectedOrder.status === "cancelled";

              return (
                <div key={step.label} className="relative flex gap-4">
                  <span
                    ref={(node) => {
                      dotRefs.current[index] = node;
                    }}
                    className={`z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border ${
                      done
                        ? "border-[#C9A84C] bg-[#C9A84C] text-black"
                        : active
                          ? "tracker-pulse border-[#C9A84C] bg-[#141414] text-[#C9A84C]"
                          : "border-white/10 bg-[#0A0A0A] text-[#888780]"
                    } ${pending ? "opacity-90" : ""}`}
                  >
                    {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0 pt-1">
                    <h3 className="font-black">{step.label}</h3>
                    <p className={active ? "mt-1 text-sm font-semibold text-[#C9A84C]" : "mt-1 text-sm text-[#888780]"}>
                      {step.desc}
                    </p>
                    {active && (
                      <p className="mt-1 text-xs text-[#888780]">
                        {formatDateTime(selectedOrder.estimatedDelivery)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </article>

      {!isTerminal && (
        <article ref={etaCardRef} className="rounded-lg border border-[#1D9E75]/30 bg-[#1D9E75]/15 p-5 opacity-0 translate-y-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1D9E75] text-black">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-[#F5F0E8]/80">Estimated delivery</p>
              <p className="eta-date-pulse text-xl font-black text-[#F5F0E8]">{formatDate(selectedOrder.estimatedDelivery)}</p>
            </div>
          </div>
        </article>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        <StatBox label="Total Orders" value={stats.total} color="#C9A84C" />
        <StatBox label="Delivered" value={stats.delivered} color="#1D9E75" />
        <StatBox label="Cancelled" value={stats.cancelled} color="#E24B4A" />
      </div>

      <article className="rounded-lg border border-white/10 bg-[#141414] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-black">Past Orders</h2>
          <span className="text-sm text-[#888780]">{allOrders.length} orders</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {allOrders.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => chooseOrder(item)}
              className={`min-w-64 rounded-lg border p-4 text-left transition ${
                item.id === selectedOrder.id ? "border-[#C9A84C] bg-[#C9A84C]/10" : "border-white/10 bg-[#0A0A0A] hover:border-[#C9A84C]/60"
              }`}
            >
              <p className="line-clamp-1 font-black">{item.productName}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-black ${badgeClass(item.status)}`}>
                  {humanStatus(item.status)}
                </span>
                <span className="font-black text-[#C9A84C]">${Number(item.productPrice || 0).toFixed(2)}</span>
              </div>
            </button>
          ))}
        </div>
      </article>

      <style>{`
        .tracker-pulse {
          animation: trackerPulse 1.5s ease-in-out infinite;
        }
        @keyframes trackerPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.55); }
          50% { box-shadow: 0 0 0 8px rgba(201, 168, 76, 0); }
        }
        .eta-date-pulse {
          animation: etaPulse 1.8s ease-in-out infinite;
        }
        @keyframes etaPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.68; }
        }
      `}</style>
    </section>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#141414] p-5">
      <p className="text-3xl font-black" style={{ color }}>
        <CountUp end={value} duration={1.5} />
      </p>
      <p className="mt-1 text-sm text-[#888780]">{label}</p>
    </div>
  );
}

const clampStep = (step) => Math.max(0, Math.min(4, Number(step) || 0));

const formatDate = (value) => {
  if (!value) return "TBA";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
};

const formatDateTime = (value) => {
  if (!value) return "Updated just now";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
};

const humanStatus = (status = "") => status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const badgeClass = (status) => {
  if (status === "delivered") return "bg-[#1D9E75]/20 text-[#1D9E75]";
  if (status === "cancelled") return "bg-[#E24B4A]/20 text-[#E24B4A]";
  return "bg-[#C9A84C]/15 text-[#C9A84C]";
};
