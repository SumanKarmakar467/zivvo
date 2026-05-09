import PageTransition from "../components/common/PageTransition";

export default function Account() {
  return <PageTransition><div className="grid gap-6 lg:grid-cols-[260px,1fr]"><aside className="rounded-2xl border border-white/10 bg-shoppop-surface p-4">{["Profile","My Orders","Addresses","Wishlist","Reviews","Settings"].map((n, i) => <div key={n} className={`rounded px-3 py-2 ${i===0?"bg-shoppop-amber-400 text-black":"text-shoppop-text-secondary"}`}>{n}</div>)}</aside><section className="rounded-2xl border border-white/10 bg-shoppop-surface p-6"><h2 className="text-xl font-bold">Profile</h2><p className="mt-2 text-shoppop-text-muted">Manage your ShopPop profile, addresses, wishlist and orders.</p></section></div></PageTransition>;
}
