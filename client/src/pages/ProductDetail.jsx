import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../services/productApi";
import PageTransition from "../components/common/PageTransition";
import { formatPrice } from "../utils/formatPrice";

export default function ProductDetail() {
  const { id } = useParams();
  const { data: p, isLoading } = useGetProductByIdQuery(id);
  if (isLoading) return <PageTransition><div className="p-4">Loading...</div></PageTransition>;
  if (!p) return <PageTransition><div className="p-4">Product not found.</div></PageTransition>;

  return <PageTransition><div className="grid gap-6 md:grid-cols-2"><img src={p.images?.[0]?.url || "https://picsum.photos/600"} className="w-full rounded-xl" /><div><p className="text-sm text-shoppop-text-muted">{p.brand}</p><h1 className="text-2xl font-bold">{p.name}</h1><p className="mt-2 text-3xl font-extrabold text-shoppop-amber-300">{formatPrice(p.discountPrice || p.price)}</p><div className="mt-4 flex gap-3"><button className="rounded-md bg-shoppop-amber-400 px-4 py-2 font-medium text-black">Add to Cart</button><button className="rounded-md border border-white/20 bg-shoppop-surface px-4 py-2 font-medium">Buy Now</button></div><p className="mt-4 text-shoppop-text-secondary">{p.description}</p></div></div></PageTransition>;
}
