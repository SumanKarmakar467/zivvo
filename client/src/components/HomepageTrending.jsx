import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useGetProductsQuery } from "../store/api/productsApi";

export default function HomepageTrending() {
  const { data, isLoading, isError, refetch } = useGetProductsQuery({ limit: 8, sort: "popular" });
  const products = data?.products || [];

  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
      <h2 className="mb-4 text-2xl font-bold text-zivvo-text-base">Trending now 🔥</h2>

      {isLoading && (
        <div className="flex gap-4 overflow-x-auto pb-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`trending-skeleton-${index}`} className="w-[220px] shrink-0">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          <p>Could not load trending products.</p>
          <button type="button" onClick={refetch} className="mt-2 rounded-md bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-200">
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <div className="flex snap-x gap-4 overflow-x-auto pb-3">
          {products.map((product) => (
            <div key={product._id} className="w-[220px] shrink-0 snap-start md:w-[250px]">
              <ProductCard product={product} />
            </div>
          ))}
          <div className="w-5 shrink-0 md:hidden" />
        </div>
      )}
    </section>
  );
}

