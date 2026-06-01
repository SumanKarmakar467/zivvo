import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { notifySuccess } from "../components/common/Toast";

const statusClass = {
  payment_pending: "bg-yellow-500/15 text-yellow-300",
  payment_confirmed: "bg-blue-500/15 text-blue-300",
  placed: "bg-yellow-500/15 text-yellow-300",
  confirmed: "bg-blue-500/15 text-blue-300",
  processing: "bg-violet-500/15 text-violet-200",
  shipped: "bg-cyan-500/15 text-cyan-200",
  out_for_delivery: "bg-cyan-500/15 text-cyan-200",
  delivered: "bg-green-500/15 text-green-300",
  cancelled: "bg-red-500/15 text-red-300"
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data.orders || []);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const copyOrderId = async (event, orderId) => {
    event.stopPropagation();
    await navigator.clipboard.writeText(orderId);
    notifySuccess("Order ID copied");
  };

  return (
    <main className="min-h-screen bg-[#05060F] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black">My Orders</h1>
        <p className="mt-1 text-sm text-cyan-200/70">Track recent purchases and delivery status.</p>

        {loading ? (
          <div className="mt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-lg border border-violet-500/20 bg-violet-950/20" />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => {
              const status = order.status || order.orderStatus || "payment_pending";
              const itemCount = (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 1), 0);
              return (
                <motion.article
                  key={order._id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="cursor-pointer rounded-lg border border-violet-500/25 bg-white/[0.03] p-4 transition hover:border-cyan-300/60 hover:bg-cyan-300/[0.04]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <button type="button" onClick={(event) => copyOrderId(event, order._id)} className="text-left text-sm text-cyan-200/80 hover:text-cyan-100">
                        Order #{String(order._id).slice(-8).toUpperCase()}
                      </button>
                      <p className="mt-1 text-xs text-cyan-200/50">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                    </div>
                    <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${statusClass[status] || "bg-violet-500/15 text-violet-200"}`}>
                      {status.replaceAll("_", " ")}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-cyan-100/80 sm:grid-cols-3">
                    <span>Total: <strong className="text-white">₹{Number(order.total || order.totalAmount || 0).toLocaleString("en-IN")}</strong></span>
                    <span>{itemCount} item{itemCount === 1 ? "" : "s"}</span>
                    <span>{order.paymentMethod || "razorpay"}</span>
                  </div>
                </motion.article>
              );
            })}
            {!orders.length && <div className="rounded-lg border border-dashed border-violet-500/30 p-10 text-center text-cyan-200/70">No orders yet.</div>}
          </div>
        )}
      </div>
    </main>
  );
}
