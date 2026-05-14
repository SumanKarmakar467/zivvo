import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import SortBar from "../components/SortBar";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { useGetProductsQuery } from "../store/api/productsApi";

const FILTER_KEYS = ["category", "brand", "minPrice", "maxPrice", "minRating", "sort", "page", "limit"];

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [view, setView] = useState("grid");
  const q = searchParams.get("q") || "";

  const filters = useMemo(() => {
    const obj = {};
    FILTER_KEYS.forEach((key) => {
      const value = searchParams.get(key);
      if (value) obj[key] = value;
    });
    return obj;
  }, [searchParams]);

  const page = Number(filters.page || 1);
  const query = { search: q, ...filters, page, limit: 20 };

  const { data, isLoading } = useGetProductsQuery(query);
  const products = data?.products || [];
  const total = data?.total || 0;
  const pages = data?.pages || 0;
  const brands = data?.brands || [];
  const facets = useMemo(() => ({ categories: [], brands }), [brands]);

  const setParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === undefined || value === "" || value === null) params.delete(key);
    else params.set(key, String(value));
    if (key !== "page") params.set("page", "1");
    navigate(`/search?${params.toString()}`, { replace: true });
  };

  const updateParams = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    if (!next.page) params.set("page", "1");
    navigate(`/search?${params.toString()}`, { replace: true });
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("sort", "newest");
    navigate(`/search?${params.toString()}`, { replace: true });
  };

  return (
    <main className="min-h-screen bg-zivvo-dark-bg px-4 py-6 text-zivvo-text-base md:px-6">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[16rem_1fr]">
        <div className="hidden md:block">
          <FilterSidebar searchParams={searchParams} facets={facets} onParamChange={setParam} onClear={clearFilters} />
        </div>

        <section>
          <SortBar sort={filters.sort || ""} onSortChange={(sort) => updateParams({ ...filters, sort, page: 1 })} total={total} view={view} onViewChange={setView} />

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 12 }).map((_, idx) => <ProductCardSkeleton key={idx} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zivvo-surface p-10 text-center">
              <div className="mx-auto mb-3 text-5xl">:(</div>
              <h2 className="text-lg font-semibold">No products found</h2>
              <p className="mt-1 text-sm text-zivvo-text-muted">Try changing filters or search term.</p>
            </div>
          ) : (
            <>
              <div className={`grid gap-4 ${view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {products.map((product) => <ProductCard key={product._id} product={product} />)}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {Array.from({ length: pages }).map((_, idx) => {
                  const p = idx + 1;
                  const active = p === page;
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => updateParams({ ...filters, page: p })}
                      className={`rounded-md px-3 py-1 text-sm ${active ? "bg-[#ef9f27] text-black" : "bg-zinc-800 text-zivvo-text-base"}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
