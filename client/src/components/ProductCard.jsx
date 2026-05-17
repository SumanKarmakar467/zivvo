import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";
import VerifiedBadge from "./VerifiedBadge";
import { getUsableImage } from "../utils/imageFallbacks";
import { formatPrice } from "../utils/formatPrice";

const dummyImages = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
  "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400"
];

const fallbackByCategory = {
  electronics: dummyImages[0],
  laptop: dummyImages[1],
  laptops: dummyImages[1],
  watch: dummyImages[2],
  watches: dummyImages[2],
  fashion: dummyImages[3],
  sneakers: dummyImages[3],
  bags: dummyImages[4],
  camera: dummyImages[5],
  cameras: dummyImages[5]
};

export default function ProductCard({ product }) {
  const categoryName = product?.category?.name || (typeof product?.category === "string" ? product.category : "Zivvo");
  const categorySlug = product?.category?.slug || product?.categorySlug || String(categoryName).toLowerCase();
  const fallbackImage = fallbackByCategory[categorySlug] || dummyImages[0];
  const primaryImage = getUsableImage(product?.images?.[0], fallbackImage);
  const showDiscount = Number(product.mrp) > Number(product.price) || Number(product.discount || 0) > 0;
  const rating = Number(product.averageRating ?? product.rating ?? 4.7).toFixed(1);

  return (
    <motion.article
      whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.22 }}
      className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-bg-card shadow-sm transition-colors dark:border-white/10 dark:bg-dark-card"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-bg-muted dark:bg-dark-muted">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />

          {showDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-white shadow-sm">
              {Number(product.discount || 0) || Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)}% OFF
            </span>
          )}

          <WishlistButton
            product={product}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-lg backdrop-blur transition hover:bg-accent"
          />

          <div className="absolute inset-x-4 bottom-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="block rounded-full bg-white/95 px-4 py-2 text-center text-sm font-bold text-ink shadow-lg dark:bg-dark-bg/95 dark:text-white">
              Quick View
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="rounded-full bg-accent-light px-2.5 py-1 text-[11px] font-bold uppercase text-accent-dark">
              {categoryName}
            </span>
            <span className="text-xs font-bold text-ink-muted dark:text-zivvo-text-muted">★ {rating}</span>
          </div>
          <h3 className="line-clamp-2 min-h-[42px] text-sm font-bold text-ink dark:text-zivvo-text-base">{product.name}</h3>
          {product?.seller?.isVerified && (
            <div className="mt-2">
              <VerifiedBadge size="sm" />
            </div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-extrabold text-ink dark:text-white">{formatPrice(product.price)}</span>
            {showDiscount && <span className="text-ink-faint line-through dark:text-zivvo-text-soft">{formatPrice(product.mrp)}</span>}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
