import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const id = product?._id || product?.id;
  const title = product?.title || product?.name || "Untitled Product";
  const image = product?.images?.[0] || product?.image || "https://via.placeholder.com/600x600?text=Zivvo";
  const price = product?.discountPrice || product?.price || 0;
  const originalPrice = product?.price || 0;
  const rating = Number(product?.ratingAverage || product?.rating || 0).toFixed(1);

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <Link to={`/product/${id || ""}`} className="relative block overflow-hidden">
        <img src={image} alt={title} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
        <button type="button" className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-zinc-700 shadow dark:bg-zinc-900/90 dark:text-zinc-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="m12 21-1.4-1.2C5.6 15.4 2 12.1 2 8A5 5 0 0 1 7 3c2 0 3.2.9 5 2.8C13.8 3.9 15 3 17 3a5 5 0 0 1 5 5c0 4.1-3.6 7.4-8.6 11.8L12 21Z" /></svg>
        </button>
      </Link>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <div className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-300">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#ef9f27] text-[#ef9f27]"><path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3 6.2 20.4l1.1-6.5L2.6 9.3l6.5-.9L12 2.5Z" /></svg>
          <span>{rating}</span>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Rs {Number(price).toLocaleString()}</p>
          {originalPrice > price && <p className="text-xs text-zinc-500 line-through">Rs {Number(originalPrice).toLocaleString()}</p>}
        </div>
      </div>
    </article>
  );
}
