import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useGetRecommendationsQuery } from "../services/productApi";

export default function RecommendationsSection({ productId, category, sellerId }) {
  const { data, isLoading, isError, refetch } = useGetRecommendationsQuery(
    { productId, category, sellerId, limit: 8 },
    { skip: !productId || !category || !sellerId }
  );

  const products = data?.products || [];

  return (
    <section className="mt-10">
      <h3 className="mb-4 text-xl font-bold text-zivvo-text-base">You might also like</h3>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={`recommendation-skeleton-${index}`} />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          <p>Could not load recommendations.</p>
          <button type="button" onClick={refetch} className="mt-2 rounded-md bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-200">
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      )}
    </section>
  );
}

