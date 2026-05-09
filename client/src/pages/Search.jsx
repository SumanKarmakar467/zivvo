import { useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "../services/productApi";
import ProductCard from "../components/product/ProductCard";
import ProductCardSkeleton from "../components/product/ProductCardSkeleton";
import PageTransition from "../components/common/PageTransition";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const { data, isLoading } = useGetProductsQuery(`search=${encodeURIComponent(q)}`);
  const list = data?.products || [];
  return <PageTransition><h1 className="mb-4 text-xl font-bold">Search results for "{q}"</h1><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(isLoading ? Array.from({ length: 8 }) : list).map((p, i) => isLoading ? <ProductCardSkeleton key={i} /> : <ProductCard key={p._id} product={p} />)}</div></PageTransition>;
}
