export function FloatingProductCard({ product }) {
  return (
    <article className="z-float-card z-glass min-w-[210px] flex-1 rounded-[14px] border border-[rgba(124,92,252,0.32)] bg-[rgba(12,15,30,0.9)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/8 text-3xl">{product.emoji}</div>
        <span className="rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
          {product.tag}
        </span>
      </div>
      <h3 className="mt-5 text-base font-bold text-[#E8EAFF]">{product.name}</h3>
      <p className="mt-2 text-xl font-black text-[#22D3EE]">{product.price}</p>
    </article>
  );
}

export default FloatingProductCard;
