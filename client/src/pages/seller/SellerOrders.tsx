import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "@/utils/api";
import CloudinaryImage from "../../components/CloudinaryImage";

interface SellerOrder {
  _id: string;
  user?: { name?: string };
  shippingAddress?: { city?: string };
  items: { image?: string; name: string }[];
  total?: number;
  totalAmount?: number;
  orderStatus: string;
  createdAt: string;
}

interface OrdersResponse {
  orders: SellerOrder[];
  totalPages: number;
}

function ShipOrderModal({ order, onClose, onShipped }: { order: SellerOrder; onClose: () => void; onShipped: () => void }) {
  const [courier, setCourier] = useState("Delhivery");
  const [trackingId, setTrackingId] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const tomorrow = useMemo(() => {
    const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return date.toISOString().slice(0, 10);
  }, []);

  const submit = async () => {
    if (!trackingId || !estimatedDelivery) {
      toast.error("Tracking ID and delivery date are required");
      return;
    }
    await api.patch<SellerOrder>(`/seller/orders/${order._id}/ship`, { courier, trackingId, estimatedDelivery });
    toast.success("Order marked as shipped");
    onShipped();
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
        <h2 className="font-serif text-2xl">Ship Order #ZIVVO-{order._id.slice(-6)}</h2>
        <div className="mt-4 grid gap-3">
          <select value={courier} onChange={(e) => setCourier(e.target.value)} className="rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-3"><option>Blue Dart</option><option>Delhivery</option><option>Ekart</option><option>DTDC</option><option>India Post</option><option>Other</option></select>
          <input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="Tracking ID*" className="rounded-lg border border-[var(--border)] bg-transparent p-3" />
          <input type="date" min={tomorrow} value={estimatedDelivery} onChange={(e) => setEstimatedDelivery(e.target.value)} className="rounded-lg border border-[var(--border)] bg-transparent p-3" />
        </div>
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-full border border-[var(--border)] px-4 py-2">Cancel</button><button type="button" onClick={() => void submit()} className="rounded-full bg-[#7C5CFC] px-4 py-2 font-semibold text-white">Confirm Shipment</button></div>
      </div>
    </div>
  );
}

export default function SellerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [status, setStatus] = useState("");
  const [shipOrder, setShipOrder] = useState<SellerOrder | null>(null);

  const load = async () => {
    const params = new URLSearchParams({ page: "1", limit: "20" });
    if (status) params.set("status", status);
    const data = await api.get<OrdersResponse>(`/seller/orders?${params.toString()}`);
    setOrders(data.orders);
  };

  useEffect(() => {
    void load();
  }, [status]);

  return (
    <main className="min-h-screen bg-[var(--bg)] p-4 text-[var(--cream)] md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl">Seller Orders</h1>
        <div className="flex flex-wrap gap-2">
          {[["", "All"], ["confirmed", "New"], ["processing", "Processing"], ["shipped", "Shipped"], ["delivered", "Delivered"]].map(([value, label]) => <button key={value} type="button" onClick={() => setStatus(value)} className={`rounded-full px-4 py-2 text-sm ${status === value ? "bg-[#7C5CFC] text-white" : "border border-[var(--border)] text-[var(--muted)]"}`}>{label}</button>)}
          <input type="date" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
          <input type="date" className="rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="grid gap-4">
        {orders.map((order) => (
          <article key={order._id} className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-4">
            <header className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-semibold">#{order._id.slice(-8)}</p><p className="text-xs text-[var(--muted)]">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p></div><span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs">{order.orderStatus}</span><p className="font-semibold">₹{Number(order.total || order.totalAmount || 0).toLocaleString("en-IN")}</p></header>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex -space-x-2">{order.items.slice(0, 4).map((item, index) => <CloudinaryImage key={index} src={item.image || "https://placehold.co/40"} alt={item.name} width={80} height={80} crop="thumb" className="h-8 w-8 rounded-full border border-[var(--bg2)] object-cover" />)}</div>
              <span className="text-sm text-[var(--muted)]">{order.items.length} items</span>
              <span className="text-sm text-[var(--muted)]">{order.user?.name || "Customer"} - {order.shippingAddress?.city || "India"}</span>
            </div>
            <footer className="mt-4 flex gap-2">{["confirmed", "processing"].includes(order.orderStatus) && <button type="button" onClick={() => setShipOrder(order)} className="rounded-full bg-[#7C5CFC] px-4 py-2 text-sm font-semibold text-white">Mark as Shipped</button>}<button type="button" onClick={() => navigate(`/orders/${order._id}`)} className="rounded-full border border-[var(--border)] px-4 py-2 text-sm">View Details</button></footer>
          </article>
        ))}
      </div>
      {shipOrder && <ShipOrderModal order={shipOrder} onClose={() => setShipOrder(null)} onShipped={() => { setShipOrder(null); void load(); }} />}
    </main>
  );
}
