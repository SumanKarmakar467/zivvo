import PageTransition from "../components/common/PageTransition";

export default function SellerDashboard() {
  const cards = [{ t: "Total Revenue", v: "₹2,45,890" }, { t: "Orders Today", v: "47" }, { t: "Active Listings", v: "128" }, { t: "Avg Rating", v: "4.7★" }];
  return <PageTransition><div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map((c) => <div key={c.t} className="rounded-2xl border border-white/10 bg-shoppop-surface p-4"><p className="text-sm text-shoppop-text-muted">{c.t}</p><p className="mt-1 text-2xl font-extrabold">{c.v}</p></div>)}</div><div className="rounded-2xl border border-white/10 bg-shoppop-surface p-6">Revenue chart placeholder</div></div></PageTransition>;
}
