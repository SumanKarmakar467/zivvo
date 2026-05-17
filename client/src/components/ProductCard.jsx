import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectIsWishlisted, toggleWishlist } from "../store/wishlistSlice";

const fallbackImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80";
const formatRupees = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlisted = useSelector(selectIsWishlisted(product._id));
  const category = product.cat || product.category?.name || (typeof product.category === "string" ? product.category : "Zivvo");
  const image = product.image || product.images?.[0] || fallbackImage;
  const price = product.price || 0;
  const oldPrice = product.oldPrice || product.mrp;
  const sale = product.sale || (oldPrice && Number(oldPrice) > Number(price) ? `-${Math.round(((Number(oldPrice) - Number(price)) / Number(oldPrice)) * 100)}%` : "");
  const rating = Number(product.rating ?? product.averageRating ?? 4.8).toFixed(1);

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-black/8 bg-brand-card dark:border-night-border dark:bg-night-card"
      whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.22 }}
    >
      <Link to={product.slug ? `/product/${product.slug}` : "/search"} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-muted dark:bg-night-muted">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition group-hover:opacity-100">
            <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-brand-ink shadow-lg">Quick View</span>
          </div>

          {(sale || product.isNew) && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white">
              {sale || "NEW"}
            </span>
          )}
        </div>

        <div className="p-4 pb-16">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="rounded-full bg-accent-light px-2.5 py-1 text-xs font-bold text-accent">{category}</span>
            <span className="text-xs text-amber-400">★★★★★</span>
          </div>
          <h3 className="line-clamp-2 text-[15px] font-semibold text-brand-ink dark:text-white">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-lg font-bold text-accent">{formatRupees(price)}</p>
            <p className="text-xs font-semibold text-brand-inkFaint">★ {rating}</p>
          </div>
          {oldPrice && <p className="text-xs text-brand-inkFaint line-through">{formatRupees(oldPrice)}</p>}
        </div>
      </Link>

      <motion.button
        type="button"
        onClick={() => dispatch(toggleWishlist(product))}
        whileTap={{ scale: 0.85 }}
        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-lg shadow-sm transition ${
          wishlisted ? "bg-accent text-white" : "bg-white/90 text-brand-ink hover:bg-accent hover:text-white"
        }`}
        aria-label="Toggle wishlist"
      >
        {wishlisted ? "♥" : "♡"}
      </motion.button>

      <button
        type="button"
        className="absolute bottom-4 left-4 right-4 translate-y-2 rounded-xl bg-accent py-2 text-sm font-semibold text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"
      >
        Add to Cart
      </button>
    </motion.div>
  );
}
