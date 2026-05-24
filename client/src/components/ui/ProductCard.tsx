import { motion, useReducedMotion } from "framer-motion";
import type React from "react";
import { useRef } from "react";
import toast from "react-hot-toast";
import type { Product } from "@/types";

const formatRupees = (value?: number) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const badgeConfig: Record<string, { label: string; className: string }> = {
  hot: { label: "HOT", className: "z-card-badge z-card-badge-hot" },
  new: { label: "NEW", className: "z-card-badge z-card-badge-new" },
  sale: { label: "SALE", className: "z-card-badge z-card-badge-sale" },
  popular: { label: "POPULAR", className: "z-card-badge z-card-badge-hot" }
};

interface ProductCardProps {
  product?: Product;
  id?: string;
  name?: string;
  brand?: string;
  price?: number;
  mrp?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  emoji?: string;
  image?: string;
  badge?: string;
  isNew?: boolean;
  isHot?: boolean;
  isSale?: boolean;
  isWishlisted?: boolean;
  onWishlistToggle?: (productId: string) => void;
  onAddToCart?: (productId: string, variant?: string) => void;
  href?: string;
  showQuickAdd?: boolean;
  className?: string;
}

function HeartIcon({ active }: { active?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function StarRow({ rating = 0, reviewCount = 0 }: { rating?: number; reviewCount?: number }) {
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
  product,
  id,
  name,
  brand,
  price,
  mrp,
  discount,
  rating,
  reviewCount,
  emoji = "Z",
  image,
  badge,
  isNew,
  isHot,
  isSale,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  href = "#",
  showQuickAdd = true,
  className = ""
}: ProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const productId = product?._id || id || "";
  const productName = product?.name || name || "";
  const productBrand = product?.brand || brand || "Zivvo";
  const productPrice = product?.price ?? price ?? 0;
  const productMrp = product?.mrp ?? mrp;
  const productDiscount = product?.discount ?? discount;
  const productRating = product?.averageRating ?? rating ?? 0;
  const productReviewCount = product?.totalReviews ?? product?.reviewCount ?? product?.numReviews ?? reviewCount ?? 0;
  const productImage = product?.images?.[0] || image;
  const productBadge = product?.badge || badge;
  const productStock = product?.stock ?? 1;
  const computedDiscount = productDiscount || (productMrp && productMrp > productPrice ? Math.round(((productMrp - productPrice) / productMrp) * 100) : 0);
  const badgeKey = productBadge || (isHot ? "hot" : isNew ? "new" : isSale || computedDiscount ? "sale" : "");
  const badgeInfo = badgeConfig[String(badgeKey).toLowerCase()];

  const addToCart = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    if (!productId || productStock <= 0) return;
    onAddToCart?.(productId, undefined);
    toast.success("Added to cart!");
  };

  const toggleWishlist = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    if (!productId) return;
    onWishlistToggle?.(productId);
    toast.success(isWishlisted ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <motion.div ref={ref} whileTap={reduceMotion ? undefined : { scale: 0.97 }} className={`z-product-card group ${className}`} data-href={href}>
      <div className="z-product-card-media">
        {productImage ? <img src={productImage} alt={productName} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" /> : <span className="z-product-card-emoji">{emoji}</span>}
        {badgeInfo && <span className={badgeInfo.className}>{badgeInfo.label}</span>}
        <motion.button type="button" whileTap={reduceMotion ? undefined : { scale: [1, 1.3, 1] }} onClick={toggleWishlist} className={`z-product-heart ${isWishlisted ? "is-active" : ""}`} aria-label="Toggle wishlist">
          <HeartIcon active={isWishlisted} />
        </motion.button>
        {productStock <= 0 ? <span className="z-quick-add">Out of Stock</span> : showQuickAdd && <button type="button" onClick={addToCart} className="z-quick-add">Add to Cart</button>}
      </div>
      <div className="p-3.5">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-[1px] text-[var(--muted)]">{productBrand}</p>
        <h3 className="z-product-name">{productName}</h3>
        <StarRow rating={productRating} reviewCount={productReviewCount} />
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-base font-bold text-[var(--violet2)]">{formatRupees(productPrice)}</span>
          {productMrp && productMrp > productPrice && <span className="text-xs text-[var(--muted)] line-through">{formatRupees(productMrp)}</span>}
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
