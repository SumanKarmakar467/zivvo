import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const hasSecondaryImage = Boolean(product.images?.[1]);
  const showDiscount = Number(product.mrp) > Number(product.price);

  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-xl border border-zinc-800 bg-zivvo-surface shadow-sm hover:shadow-amber"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img src={product.images?.[0]} alt={product.name} className={`h-full w-full object-cover transition duration-500 ${hasSecondaryImage ? "group-hover:-translate-x-full" : ""}`} />
          {hasSecondaryImage && (
            <img src={product.images[1]} alt={product.name} className="absolute inset-0 h-full w-full translate-x-full object-cover transition duration-500 group-hover:translate-x-0" />
          )}

          {showDiscount && <span className="absolute left-2 top-2 rounded-full bg-[#ef9f27] px-2 py-1 text-xs font-bold text-black">{product.discount}% OFF</span>}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setWishlisted((prev) => !prev);
            }}
            className="absolute right-2 top-2 rounded-full bg-black/40 p-2"
          >
            <span className={wishlisted ? "text-red-500" : "text-white"}>?</span>
          </button>
        </div>

        <div className="p-3">
          <p className="text-[11px] uppercase tracking-wide text-zivvo-text-soft">{product.brand || "Zivvo"}</p>
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold text-zivvo-text-base">{product.name}</h3>
          <div className="mt-1 text-xs text-zivvo-text-muted">? {Number(product.rating || 0).toFixed(1)} ({product.numReviews || 0})</div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="font-bold text-zivvo-text-base">Rs {Number(product.price).toLocaleString()}</span>
            {showDiscount && <span className="text-zivvo-text-soft line-through">Rs {Number(product.mrp).toLocaleString()}</span>}
            {showDiscount && <span className="text-[#ef9f27]">{product.discount}% off</span>}
          </div>
        </div>
      </Link>

      <div className="translate-y-3 px-3 pb-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <button type="button" className="w-full rounded-md bg-[#ef9f27] py-2 text-sm font-semibold text-black">Add to Cart</button>
      </div>
    </motion.article>
  );
}
