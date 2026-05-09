import PageTransition from "../components/common/PageTransition";

export default function AdminPanel() {
  return <PageTransition><div className="grid gap-6 lg:grid-cols-[240px,1fr]"><aside className="rounded-2xl border border-white/10 bg-shoppop-surface p-4">{["Dashboard","Products","Orders","Users","Categories","Coupons","Reports","Settings"].map((n,i)=><div key={n} className={`rounded px-3 py-2 ${i===0?"bg-shoppop-amber-400 text-black":"text-shoppop-text-secondary"}`}>{n}</div>)}</aside><section className="rounded-2xl border border-white/10 bg-shoppop-surface p-6">Admin analytics and approvals</section></div></PageTransition>;
}
