import { motion } from "framer-motion";
import toast from "react-hot-toast";

const formatRupees = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const badgeConfig = {
  hot: { label: "HOT", className: "z-card-badge z-card-badge-hot" },
  new: { label: "NEW", className: "z-card-badge z-card-badge-new" },
  sale: { label: "SALE", className: "z-card-badge z-card-badge-sale" }
};

function HeartIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function StarRow({ rating = 0, reviewCount = 0 }) {
  const rounded = Math.round(Number(rating || 0));
  return (
    <div className="mt-2 flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} viewBox="0 0 20 20" className={`h-3 w-3 ${index < rounded ? "text-amber-500" : "text-[var(--muted)]/35"}`} fill="currentColor">
          <path d="m10 1.6 2.55 5.17 5.7.83-4.12 4.02.97 5.67L10 14.6l-5.1 2.69.97-5.67L1.75 7.6l5.7-.83L10 1.6Z" />
        </svg>
      ))}
      <span className="ml-1 text-[11px] text-[var(--muted)]">({Number(reviewCount || 0).toLocaleString("en-IN")})</span>
    </div>
  );
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  mrp,
  discount,
  rating,
  reviewCount,
  emoji = "🛍️",
  image,
  badge,
  isNew,
  isHot,
  isSale,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  href = "#"
}) {
  const computedDiscount = discount || (mrp && Number(mrp) > Number(price) ? Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100) : 0);
  const badgeKey = badge || (isHot ? "hot" : isNew ? "new" : isSale || computedDiscount ? "sale" : "");
  const badgeInfo = badgeConfig[String(badgeKey).toLowerCase()];

  const addToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onAddToCart?.(id);
    toast.success("Added to cart! 🛒");
  };

  const toggleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onWishlistToggle?.(id);
    toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist ❤️");
  };

  return (
    <motion.div whileTap={{ scale: 0.97 }} className="z-product-card group" data-href={href}>
      <div className="z-product-card-media">
        {image ? <img src={image} alt={name} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" /> : <span className="z-product-card-emoji">{emoji}</span>}
        {badgeInfo && <span className={badgeInfo.className}>{badgeInfo.label}</span>}
        <motion.button type="button" whileTap={{ scale: [1, 1.3, 1] }} onClick={toggleWishlist} className={`z-product-heart ${isWishlisted ? "is-active" : ""}`} aria-label="Toggle wishlist">
          <HeartIcon active={isWishlisted} />
        </motion.button>
        <button type="button" onClick={addToCart} className="z-quick-add">Add to Cart</button>
      </div>
      <div className="p-3.5">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-[1px] text-[var(--muted)]">{brand || "Zivvo"}</p>
        <h3 className="z-product-name">{name}</h3>
        <StarRow rating={rating} reviewCount={reviewCount} />
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-base font-bold text-[var(--violet2)]">{formatRupees(price)}</span>
          {mrp && Number(mrp) > Number(price) && <span className="text-xs text-[var(--muted)] line-through">{formatRupees(mrp)}</span>}
          {computedDiscount > 0 && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">{computedDiscount}% off</span>}
        </div>
      </div>
    </motion.div>
  );
}

export function SkeletonProductCard() {
  return (
    <div className="z-product-card">
      <div className="skeleton-base aspect-square rounded-none" />
      <div className="p-3.5">
        <div className="skeleton-base mb-1.5 h-2.5 w-[40%]" />
        <div className="skeleton-base mb-1 h-[13px] w-[85%]" />
        <div className="skeleton-base mb-2 h-[13px] w-[60%]" />
        <div className="skeleton-base mb-2 h-2.5 w-[50%]" />
        <div className="skeleton-base h-4 w-[45%]" />
      </div>
    </div>
  );
}

export default ProductCard;
