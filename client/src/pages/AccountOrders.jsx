import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/common/PageTransition";
import { useCancelOrderMutation, useGetMyOrdersQuery } from "../services/orderApi";
import { notifyError, notifySuccess } from "../components/common/Toast";

const tabs = [
  { key: "", label: "All" },
  { key: "active", label: "Active" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" }
];

const statusClass = {
  placed: "bg-amber-500/20 text-amber-300",
  confirmed: "bg-amber-500/20 text-amber-300",
  processing: "bg-amber-500/20 text-amber-300",
  shipped: "bg-blue-500/20 text-blue-300",
  out_for_delivery: "bg-blue-500/20 text-blue-300",
  delivered: "bg-green-500/20 text-green-300",
  cancelled: "bg-red-500/20 text-red-300"
};

export default function AccountOrders() {
  const [tab, setTab] = useState("");
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("Changed my mind");
  const [cancelOrder] = useCancelOrderMutation();

  const queryStatus = tab === "active" ? "placed" : tab;
  const { data, isLoading, refetch } = useGetMyOrdersQuery({ page, limit: 10, status: queryStatus });

  const orders = useMemo(() => {
    const list = data?.orders || [];
    if (tab !== "active") return list;
    return list.filter((o) => ["placed", "confirmed", "processing", "shipped", "out_for_delivery"].includes(o.orderStatus));
  }, [data, tab]);

  const doCancel = async () => {
    if (!cancelTarget) return;
    try {
      await cancelOrder({ id: cancelTarget, reason: cancelReason }).unwrap();
      notifySuccess("Order cancelled successfully");
      setCancelTarget(null);
      refetch();
    } catch (err) {
      notifyError(err?.data?.message || "Unable to cancel order");
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <h1 className="mb-5 text-2xl font-bold">My Orders</h1>

        <div className="mb-5 flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => {
                setTab(t.key);
                setPage(1);
              }}
              className={`rounded-full px-4 py-2 text-sm ${tab === t.key ? "bg-zivvo-amber-brand text-black" : "bg-zivvo-dark-raised text-zivvo-text-muted"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4">
                <div className="h-4 w-40 animate-pulse rounded bg-zinc-800" />
                <div className="mt-3 flex gap-2">
                  <div className="h-14 w-14 animate-pulse rounded-md bg-zinc-800" />
                  <div className="h-14 w-14 animate-pulse rounded-md bg-zinc-800" />
                </div>
                <div className="mt-3 h-4 w-3/5 animate-pulse rounded bg-zinc-800" />
                <div className="mt-4 h-9 w-28 animate-pulse rounded-md bg-zinc-800" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const firstItem = order.items?.[0];
              const moreCount = Math.max((order.items?.length || 0) - 1, 0);
              const cancellable = ["placed", "confirmed"].includes(order.orderStatus);

              return (
                <motion.article key={order._id} layout className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-zivvo-text-soft">Order ID: {order._id}</p>
                      <p className="text-xs text-zivvo-text-soft">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass[order.orderStatus] || "bg-zivvo-dark-raised"}`}>
                      {order.orderStatus.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {(order.items || []).slice(0, 3).map((item, idx) => (
                      <img key={`${order._id}-${idx}`} src={item.image || item.product?.images?.[0] || "https://picsum.photos/80"} alt={item.name} loading="lazy" className="h-14 w-14 rounded-md object-cover" />
                    ))}
                    {(order.items || []).length > 3 && <span className="flex h-14 w-14 items-center justify-center rounded-md bg-zivvo-dark-raised text-xs">+{(order.items || []).length - 3} more</span>}
                  </div>

                  <p className="mt-3 text-sm font-semibold">{firstItem?.name || "Order item"}{moreCount ? ` and ${moreCount} more items` : ""}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-bold text-zivvo-amber-brand">Rs {Number(order.total || 0).toLocaleString()}</span>
                    <span className="rounded-full bg-zivvo-dark-raised px-2 py-1 text-xs uppercase">{order.paymentMethod}</span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link to={`/orders/${order._id}`} className="rounded-md border border-zivvo-amber-brand px-3 py-2 text-xs text-zivvo-amber-brand">
                      Track Order
                    </Link>
                    {cancellable && (
                      <button onClick={() => setCancelTarget(order._id)} className="rounded-md border border-red-500/60 px-3 py-2 text-xs text-red-300">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-md border border-zivvo-dark-raised px-3 py-1 text-sm disabled:opacity-40">Prev</button>
          <span className="text-sm text-zivvo-text-muted">Page {page} / {Math.max(data?.pages || 1, 1)}</span>
          <button disabled={page >= (data?.pages || 1)} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-zivvo-dark-raised px-3 py-1 text-sm disabled:opacity-40">Load More</button>
        </div>
      </div>

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-5">
            <h3 className="mb-3 text-lg font-bold">Cancel Order</h3>
            <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="w-full rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm">
              <option>Changed my mind</option>
              <option>Found better price elsewhere</option>
              <option>Ordered by mistake</option>
              <option>Delivery taking too long</option>
              <option>Other</option>
            </select>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setCancelTarget(null)} className="flex-1 rounded-md border border-zivvo-dark-raised py-2 text-sm">Close</button>
              <button onClick={doCancel} className="flex-1 rounded-md bg-red-500/90 py-2 text-sm font-semibold text-white">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
