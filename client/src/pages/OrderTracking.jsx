import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";
import { useCancelOrderMutation, useGetOrderByIdQuery } from "../services/orderApi";
import { notifyError, notifySuccess } from "../components/common/Toast";
import OrderTimeline from "../components/OrderTimeline";
import ReturnRequestForm from "../components/ReturnRequestForm";
import ReturnStatusTimeline from "../components/ReturnStatusTimeline";
import api from "../api/axios";
import CloudinaryImage from "../components/CloudinaryImage";
import ErrorBoundary from "../components/ErrorBoundary";

export default function OrderTracking() {
  const { id } = useParams();
  const { data: order, isLoading, isError, error, refetch } = useGetOrderByIdQuery(id);
  const [cancelOrder] = useCancelOrderMutation();
  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState("Changed my mind");
  const [returnRequest, setReturnRequest] = useState(null);

  const loadReturnRequest = async () => {
    try {
      const res = await api.get("/returns/buyer");
      const found = (res.data || []).find((row) => String(row.order?._id || row.order) === String(id) && row.status !== "closed");
      setReturnRequest(found || null);
    } catch {}
  };

  useEffect(() => {
    loadReturnRequest();
  }, [id]);

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

  const copyAwb = async () => {
    const value = order?.trackingNumber || order?.awbNumber;
    if (!value) return;
    await navigator.clipboard.writeText(value);
    notifySuccess("Tracking number copied");
  };

  if (isLoading) {
    return <PageTransition><div className="mx-auto max-w-7xl p-6"><div className="h-8 w-40 animate-pulse rounded bg-zinc-800" /><div className="mt-4 h-72 animate-pulse rounded-xl bg-zinc-800" /></div></PageTransition>;
  }

  if (isError) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-3xl p-6 text-center">
          <p className="text-sm text-red-300">{error?.data?.message || "Failed to load order"}</p>
          <button type="button" onClick={refetch} className="mt-3 rounded-md bg-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-black">Retry</button>
        </div>
      </PageTransition>
    );
  }

  if (!order) return <PageTransition><div className="p-6 text-zivvo-text-muted">Order not found.</div></PageTransition>;

  const currentStatus = order.status || order.orderStatus;
  const trackingNumber = order.trackingNumber || order.awbNumber;
  const canCancel = ["payment_pending", "placed", "confirmed"].includes(currentStatus);

  return (
    <PageTransition>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8 lg:grid-cols-[1.1fr,1fr]">
        <section className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-5">
          <h1 className="text-2xl font-bold">Order Detail</h1>
          <p className="mt-1 text-xs text-zivvo-text-soft">Order ID: {order._id}</p>
          <ErrorBoundary level="section" fallbackMessage="Order tracking failed to load.">
            <div className="mt-6">
              <OrderTimeline statusHistory={order.statusHistory || []} currentStatus={currentStatus} />
            </div>
          </ErrorBoundary>
          <div className="mt-6">
            {returnRequest ? <ReturnStatusTimeline request={returnRequest} /> : <ReturnRequestForm order={order} onSubmitted={loadReturnRequest} />}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-5">
            <h2 className="mb-2 text-lg font-bold">Order Details</h2>
            <p className="text-sm text-zivvo-text-muted">
              {order.shippingAddress?.fullName}, {order.shippingAddress?.phone}, {order.shippingAddress?.addressLine1}, {order.shippingAddress?.addressLine2}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>

            {trackingNumber && (
              <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-sm">
                <p>Courier: <span className="font-semibold">{order.courierName || "N/A"}</span></p>
                <div className="mt-1 flex items-center gap-2">
                  <p>Tracking: <span className="font-semibold">{trackingNumber}</span></p>
                  <button type="button" onClick={copyAwb} className="rounded border border-zinc-600 px-2 py-0.5 text-xs">Copy</button>
                </div>
                {order.estimatedDelivery && <p className="mt-1 text-zivvo-text-soft">Expected by {new Date(order.estimatedDelivery).toLocaleDateString()}</p>}
              </div>
            )}

            <div className="mt-4 space-y-3">
              {(order.items || []).map((item, idx) => (
                <div key={`${item.product?._id || idx}`} className="flex items-center gap-3 rounded-lg border border-zivvo-dark-raised p-2">
                  <CloudinaryImage src={item.image || item.product?.images?.[0] || "https://picsum.photos/60"} alt={item.name} width={80} height={80} crop="thumb" className="h-12 w-12 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-zivvo-text-soft">Qty: {item.quantity}</p>
                    {item.variantAttributes && Object.keys(item.variantAttributes).length > 0 && (
                      <p className="text-xs text-zivvo-text-soft">{Object.entries(item.variantAttributes).map(([k, v]) => `${k}: ${v}`).join(" · ")}</p>
                    )}
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
          <div className="mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-5 sm:mx-auto">
            <h3 className="mb-3 text-lg font-bold">Cancel Order</h3>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-base">
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
