import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";
import { useCancelOrderMutation, useGetOrderByIdQuery } from "../services/orderApi";
import { notifyError, notifySuccess } from "../components/common/Toast";

const steps = [
  { key: "placed", title: "Order Placed" },
  { key: "confirmed", title: "Confirmed" },
  { key: "packed", title: "Packed" },
  { key: "shipped", title: "Shipped" },
  { key: "out_for_delivery", title: "Out for Delivery" },
  { key: "delivered", title: "Delivered" }
];

export default function OrderTracking() {
  const { id } = useParams();
  const { data: order, isLoading, refetch } = useGetOrderByIdQuery(id);
  const [cancelOrder] = useCancelOrderMutation();
  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState("Changed my mind");

  const currentIndex = useMemo(() => {
    const idx = steps.findIndex((s) => s.key === order?.orderStatus);
    return idx === -1 ? 0 : idx;
  }, [order?.orderStatus]);

  const byStatus = useMemo(() => {
    const map = {};
    (order?.statusHistory || []).forEach((item) => {
      map[item.status] = item;
    });
    return map;
  }, [order?.statusHistory]);

  const doCancel = async () => {
    try {
      await cancelOrder({ id, reason }).unwrap();
      notifySuccess("Order cancelled successfully");
      setShowCancel(false);
      refetch();
    } catch (err) {
      notifyError(err?.data?.message || "Cancellation failed");
    }
  };

  if (isLoading) return <PageTransition><div className="p-6 text-zivvo-text-muted">Loading order...</div></PageTransition>;
  if (!order) return <PageTransition><div className="p-6 text-zivvo-text-muted">Order not found.</div></PageTransition>;

  const canCancel = ["placed", "confirmed"].includes(order.orderStatus);

  return (
    <PageTransition>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8 lg:grid-cols-[1.1fr,1fr]">
        <section className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-5">
          <h1 className="text-2xl font-bold">Track Order</h1>
          <p className="mt-1 text-xs text-zivvo-text-soft">Order ID: {order._id}</p>

          <div className="mt-6 space-y-0">
            {steps.map((step, idx) => {
              const reached = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              const info = byStatus[step.key];

              return (
                <div key={step.key} className="relative pl-10 pb-7 last:pb-0">
                  {idx !== steps.length - 1 && (
                    <span className={`absolute left-[11px] top-6 h-[calc(100%-6px)] w-0.5 ${idx < currentIndex ? "bg-zivvo-amber-brand" : "bg-zivvo-dark-raised"}`} />
                  )}
                  <span className={`absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full text-xs ${reached ? "bg-zivvo-amber-brand text-black" : "bg-zivvo-dark-raised text-zivvo-text-soft"} ${isCurrent ? "animate-pulse" : ""}`}>
                    {reached ? "?" : ""}
                  </span>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-xs text-zivvo-text-soft">{info?.timestamp ? new Date(info.timestamp).toLocaleString() : "Pending"}</p>
                  {info?.note && <p className="text-xs text-zivvo-text-muted">{info.note}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-5">
            <h2 className="mb-2 text-lg font-bold">Order Details</h2>
            <p className="text-sm text-zivvo-text-muted">
              {order.shippingAddress?.fullName}, {order.shippingAddress?.phone}, {order.shippingAddress?.addressLine1}, {order.shippingAddress?.addressLine2}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>

            <div className="mt-4 space-y-3">
              {(order.items || []).map((item, idx) => (
                <div key={`${item.product?._id || idx}`} className="flex items-center gap-3 rounded-lg border border-zivvo-dark-raised p-2">
                  <img src={item.image || item.product?.images?.[0] || "https://picsum.photos/60"} alt={item.name} className="h-12 w-12 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-zivvo-text-soft">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">Rs {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>Rs {Number(order.subtotal || 0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-Rs {Number(order.discount || 0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>Rs {Number(order.shipping || 0).toLocaleString()}</span></div>
              <div className="mt-2 flex justify-between text-lg font-bold"><span>Total</span><span>Rs {Number(order.total || 0).toLocaleString()}</span></div>
            </div>

            <p className="mt-3 text-sm">Payment: <span className="uppercase">{order.paymentMethod}</span> • <span className="uppercase">{order.paymentStatus}</span></p>
          </div>

          {canCancel && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
              <h3 className="text-sm font-bold text-red-200">Cancel Order</h3>
              <button onClick={() => setShowCancel(true)} className="mt-3 rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white">Cancel Order</button>
            </div>
          )}
        </section>
      </div>

      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-5">
            <h3 className="mb-3 text-lg font-bold">Cancel Order</h3>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm">
              <option>Changed my mind</option>
              <option>Found better price elsewhere</option>
              <option>Ordered by mistake</option>
              <option>Delivery taking too long</option>
              <option>Other</option>
            </select>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setShowCancel(false)} className="flex-1 rounded-md border border-zivvo-dark-raised py-2 text-sm">Close</button>
              <button onClick={doCancel} className="flex-1 rounded-md bg-red-500 py-2 text-sm font-semibold text-white">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
