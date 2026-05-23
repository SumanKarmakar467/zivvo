import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "@/utils/api";
import type { Product } from "@/types";
import ProductFormModal from "./ProductFormModal";

interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

interface SellerOrder {
  _id: string;
  user?: { name?: string };
  items: { name: string; price: number; quantity: number }[];
  total?: number;
  totalAmount?: number;
  orderStatus?: string;
  createdAt: string;
}

interface DashboardData {
  totalRevenue: number;
  ordersToday: number;
  totalProducts: number;
  averageRating: number;
  revenueByDay: RevenuePoint[];
  recentOrders: SellerOrder[];
  lowStockProducts: Product[];
}

const emptyData: DashboardData = {
  totalRevenue: 0,
  ordersToday: 0,
  totalProducts: 0,
  averageRating: 0,
  revenueByDay: [],
  recentOrders: [],
  lowStockProducts: []
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--cream)]">
      <div className="grid min-h-screen lg:grid-cols-[220px_1fr]">
        <aside className="border-r border-[var(--border)] bg-[var(--bg2)] p-5">
          <Link to="/seller/dashboard" className="z-nav-logo text-xl">ZIVVO</Link>
          <p className="mt-1 text-xs text-[var(--muted)]">Seller Hub</p>
          <nav className="mt-8 grid gap-2 text-sm">
            {[
              ["Dashboard", "/seller/dashboard"],
              ["Products", "/seller/products"],
              ["Orders", "/seller/orders"],
              ["Analytics", "/seller/dashboard#chart"],
              ["Settings", "/seller/verification"]
            ].map(([label, to]) => (
              <Link key={to} to={to} className="rounded-lg px-3 py-2 text-[var(--muted)] transition hover:bg-[#7C5CFC] hover:text-white">{label}</Link>
            ))}
          </nav>
          <Link to="/" className="mt-10 block text-sm text-[#A78BFA]">Back to Shop</Link>
        </aside>
        <section className="p-4 md:p-6">{children}</section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
      <p className="text-xs uppercase text-[var(--muted)]">{label}</p>
      <p className="mt-3 font-serif text-3xl font-bold">{value}</p>
      <p className="mt-3 text-xs text-emerald-400">up from last period</p>
    </div>
  );
}

export default function SellerDashboard() {
  const [data, setData] = useState<DashboardData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState<"revenue" | "orders">("revenue");
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setData(await api.get<DashboardData>("/seller/dashboard"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const noRevenue = useMemo(() => data.revenueByDay.every((point) => point.revenue === 0), [data.revenueByDay]);

  if (loading) {
    return (
      <Shell>
        <div className="grid gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-[14px] bg-white/5" />)}</div>
        <div className="mt-5 h-80 animate-pulse rounded-[14px] bg-white/5" />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Revenue" value={`₹${data.totalRevenue.toLocaleString("en-IN")}`} />
        <StatCard label="Orders Today" value={String(data.ordersToday)} />
        <StatCard label="Products Live" value={String(data.totalProducts)} />
        <StatCard label="Average Rating" value={`${data.averageRating.toFixed(1)} ★`} />
      </div>

      <section id="chart" className="mt-5 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl">Revenue - Last 30 Days</h1>
          <div className="rounded-full border border-[var(--border)] p-1 text-sm">
            <button type="button" onClick={() => setChart("revenue")} className={`rounded-full px-3 py-1 ${chart === "revenue" ? "bg-[#7C5CFC] text-white" : "text-[var(--muted)]"}`}>Revenue</button>
            <button type="button" onClick={() => setChart("orders")} className={`rounded-full px-3 py-1 ${chart === "orders" ? "bg-[#7C5CFC] text-white" : "text-[var(--muted)]"}`}>Orders</button>
          </div>
        </div>
        {noRevenue ? (
          <div className="grid h-72 place-items-center text-sm text-[var(--muted)]">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            {chart === "revenue" ? (
              <LineChart data={data.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,92,252,0.1)" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} tick={{ fill: "#7B83A8", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(value) => `₹${(Number(value) / 1000).toFixed(0)}k`} tick={{ fill: "#7B83A8", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]} contentStyle={{ background: "#0C0F1A", border: "0.5px solid rgba(124,92,252,0.3)", borderRadius: "10px", color: "#E8EAFF" }} />
                <Line type="monotone" dataKey="revenue" stroke="#7C5CFC" strokeWidth={2} dot={{ fill: "#7C5CFC", strokeWidth: 0, r: 3 }} activeDot={{ r: 5, fill: "#A78BFA" }} />
              </LineChart>
            ) : (
              <BarChart data={data.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,92,252,0.1)" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} tick={{ fill: "#7B83A8", fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#7B83A8", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0C0F1A", border: "0.5px solid rgba(124,92,252,0.3)", borderRadius: "10px", color: "#E8EAFF" }} />
                <Bar dataKey="orders" fill="#22D3EE" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
          <h2 className="mb-4 font-serif text-xl">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-[var(--muted)]"><tr><th className="p-2">Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>{data.recentOrders.map((order) => <tr key={order._id} className="border-t border-[var(--border)]"><td className="p-2">#{order._id.slice(-6)}</td><td>{order.user?.name || "Customer"}</td><td>{order.items.length}</td><td>₹{Number(order.total || order.totalAmount || 0).toLocaleString("en-IN")}</td><td>{order.orderStatus}</td><td>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td></tr>)}</tbody>
            </table>
          </div>
          <Link to="/seller/orders" className="mt-4 inline-block text-sm text-[#A78BFA]">View all orders</Link>
        </section>
        <section className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-5">
          <h2 className="mb-4 font-serif text-xl text-amber-300">Low Stock</h2>
          <div className="space-y-3">{data.lowStockProducts.map((product) => <div key={product._id} className="flex items-center gap-3"><img src={product.images[0]} alt={product.name} className="h-9 w-9 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm">{product.name}</p><p className={product.stock <= 2 ? "text-xs text-rose-400" : "text-xs text-amber-300"}>{product.stock} left</p></div><button type="button" onClick={() => setRestockProduct(product)} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs">Restock</button></div>)}</div>
          <Link to="/seller/products" className="mt-4 inline-block text-sm text-[#A78BFA]">View all products</Link>
        </section>
      </div>
      {restockProduct && <ProductFormModal product={restockProduct} onClose={() => setRestockProduct(null)} onSaved={() => { setRestockProduct(null); void load(); }} />}
    </Shell>
  );
}
