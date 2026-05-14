import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";
import VerifiedBadge from "./VerifiedBadge";
import { getUsableImage, productImageFallback } from "../utils/imageFallbacks";

const categoryFallbacks = {
  electronics: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80&auto=format&fit=crop",
  mobiles: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80&auto=format&fit=crop",
  fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=80&auto=format&fit=crop",
  beauty: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80&auto=format&fit=crop",
  "home-kitchen": "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=900&q=80&auto=format&fit=crop",
  sports: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80&auto=format&fit=crop",
  books: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&q=80&auto=format&fit=crop",
  toys: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&q=80&auto=format&fit=crop"
};

const genericFallback = productImageFallback;

export default function ProductCard({ product }) {
  const showDiscount = Number(product.mrp) > Number(product.price);
  const categorySlug = product?.category?.slug || product?.categorySlug || "";
  const fallbackImage = categoryFallbacks[categorySlug] || genericFallback;
  const primaryImage = getUsableImage(product?.images?.[0], fallbackImage);
  const secondaryImage = getUsableImage(product?.images?.[1], fallbackImage);
  const hasSecondaryImage = secondaryImage !== fallbackImage;

  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-xl border border-zinc-800 bg-zivvo-surface shadow-sm hover:shadow-amber"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={primaryImage}
            alt={product.name}
            onError={(e) => { e.currentTarget.src = fallbackImage; }}
            className={`h-full w-full object-cover transition duration-500 ${hasSecondaryImage ? "group-hover:-translate-x-full" : ""}`}
          />
          {hasSecondaryImage && (
            <img
              src={secondaryImage}
              alt={product.name}
              onError={(e) => { e.currentTarget.src = fallbackImage; }}
              className="absolute inset-0 h-full w-full translate-x-full object-cover transition duration-500 group-hover:translate-x-0"
            />
          )}

          {showDiscount && <span className="absolute left-2 top-2 rounded-full bg-[#ef9f27] px-2 py-1 text-xs font-bold text-black">{product.discount}% OFF</span>}

          <WishlistButton product={product} className="absolute right-2 top-2 rounded-full bg-black/40 p-2" />
        </div>

        <div className="p-3">
          <p className="text-[11px] uppercase tracking-wide text-zivvo-text-soft">{product.brand || "Zivvo"}</p>
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold text-zivvo-text-base">{product.name}</h3>
          {product?.seller?.isVerified && (
            <div className="mt-1">
              <VerifiedBadge size="sm" />
            </div>
          )}
          <div className="mt-1 text-xs text-zivvo-text-muted">★ {Number(product.averageRating ?? product.rating ?? 0).toFixed(1)} ({product.reviewCount ?? product.numReviews ?? 0})</div>
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
