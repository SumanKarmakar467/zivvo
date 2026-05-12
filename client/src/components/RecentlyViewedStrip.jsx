import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useGetRecentlyViewedProductsQuery } from "../services/productApi";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

export default function RecentlyViewedStrip() {
  const { getIds, clear } = useRecentlyViewed();
  const [refreshKey, setRefreshKey] = useState(0);
  const ids = useMemo(() => getIds(), [refreshKey]);
  const idsQuery = useMemo(() => ids.join(","), [ids]);

  const { data = [], isLoading, isError, refetch } = useGetRecentlyViewedProductsQuery(idsQuery, {
    skip: ids.length < 2
  });

  const handleClear = () => {
    clear();
    setRefreshKey((prev) => prev + 1);
  };

  if (ids.length < 2) return null;

  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-zivvo-text-base">Recently viewed</h3>
        <button type="button" onClick={handleClear} className="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zivvo-text-muted hover:text-zivvo-text-base">
          Clear history ×
        </button>
      </div>

      {isLoading && (
        <div className="flex gap-4 overflow-x-auto pb-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`recent-skeleton-${index}`} className="w-[200px] shrink-0">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          <p>Could not load recently viewed products.</p>
          <button type="button" onClick={refetch} className="mt-2 rounded-md bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-200">
            Retry
          </button>
        </div>
      )}

      {!isLoading && !isError && data.length >= 2 && (
        <div className="flex snap-x gap-4 overflow-x-auto pb-3">
          {data.map((product) => (
            <div key={product._id} className="w-[200px] shrink-0 snap-start md:w-[230px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

