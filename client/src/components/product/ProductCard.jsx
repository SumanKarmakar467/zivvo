import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ShopPopScoreBadge from "./ShopPopScoreBadge";
import { formatPrice } from "../../utils/formatPrice";

export default function ProductCard({ product }) {
  return (
    <motion.div whileHover={{ y: -5 }} className="rounded-2xl border border-white/10 bg-shoppop-surface p-3 shadow-card">
      <Link to={`/product/${product._id}`}>
        <img src={product?.images?.[0]?.url || "https://picsum.photos/420"} alt={product.name} loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-shoppop-text-primary">{product.name}</h3>
        <p className="mt-1 text-lg font-extrabold text-shoppop-amber-300">{formatPrice(product.discountPrice || product.price || 0)}</p>
        <div className="mt-2 flex gap-2"><ShopPopScoreBadge score={product.shoppopScore} />{product.isShopPopAssured ? <span className="rounded-full bg-teal-100 px-2 py-1 text-xs text-teal-800">ShopPop Assured</span> : null}</div>
      </Link>
    </motion.div>
  );
}
