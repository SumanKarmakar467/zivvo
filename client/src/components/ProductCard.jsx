import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useCartContext } from "../context/CartContext";
import StarRating from "./StarRating";
import { productImageFallback } from "../utils/imageFallbacks";
import CloudinaryImage from "./CloudinaryImage";

export default function ProductCard({ product, index = 0, matchedText = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCartContext();
  const productId = product._id || product.id;
  const productName = product.name || product.title || "Product";
  const productImage = product.thumbnail || product.images?.[0] || product.image || productImageFallback;
  const productCategory = typeof product.category === "object" ? product.category?.name : product.category;
  const productRating = Number(product.averageRating ?? product.rating ?? 0);
  const totalReviews = Number(product.totalReviews ?? product.reviewCount ?? product.numReviews ?? 0);
  const productUrl = `/product/${product.slug || productId}`;

  const add = async (event) => {
    event.preventDefault();
    await addItem(product);
    confetti({ particleCount: 28, spread: 48, origin: { y: 0.75 } });
  };

  const title = matchedText ? highlight(productName, matchedText) : productName;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
      className="tilt-card zivvo-card group overflow-hidden rounded-lg"
    >
      <Link to={productUrl} className="block min-h-0">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg3)]">
          <CloudinaryImage
            src={productImage}
            alt={productName}
            width={400}
            height={400}
            crop="fill"
            fallback={productImageFallback}
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover ${loaded ? "blur-up is-loaded" : "blur-up"}`}
          />
          <button
            type="button"
            aria-label="Toggle wishlist"
            onClick={(event) => {
              event.preventDefault();
              setWishlistAnimation(event.currentTarget);
              setWishlisted((value) => !value);
            }}
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur"
          >
            <Heart className="h-5 w-5" fill={wishlisted ? "#C9A84C" : "none"} stroke={wishlisted ? "#C9A84C" : "currentColor"} />
          </button>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">{productCategory || "Zivvo"}</p>
              <h3 className="mt-1 line-clamp-2 text-sm font-bold text-[var(--cream)] sm:text-base">{title}</h3>
              <div className="mt-2 flex items-center gap-2 text-xs text-cyan-200/80">
                <StarRating rating={productRating} value={productRating} size="sm" />
                <span>({totalReviews})</span>
              </div>
            </div>
            <p className="shrink-0 text-sm font-bold text-[var(--gold,#C9A84C)] sm:text-base">Rs {Number(product.price || 0).toLocaleString("en-IN")}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">{productRating.toFixed(1)} stars</span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              type="button"
              onClick={add}
              className="magnetic-target inline-flex min-h-11 items-center gap-2 rounded-full bg-[#C9A84C] px-3 py-1.5 text-xs font-bold text-black sm:px-4 sm:py-2 sm:text-sm"
            >
              <ShoppingBag className="h-4 w-4" /> Add
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

const highlight = (text, match) => {
  const term = match.trim();
  if (!term) return text;
  const parts = String(text).split(new RegExp(`(${escapeRegExp(term)})`, "ig"));
  return parts.map((part, index) => part.toLowerCase() === term.toLowerCase()
    ? <mark key={`${part}-${index}`} className="bg-[#C9A84C]/30 text-[var(--cream)]">{part}</mark>
    : part);
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const setWishlistAnimation = (node) => {
  node.animate([{ transform: "scale(1)" }, { transform: "scale(1.22)" }, { transform: "scale(1)" }], { duration: 260, easing: "ease-out" });
};
