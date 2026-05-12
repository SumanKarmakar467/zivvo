import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FilterSidebar from "../components/FilterSidebar";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { fetchSearchResults, selectSearchResults } from "../features/search/searchSlice";

const DEFAULT_LIMIT = 20;

export default function SearchResultsPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [facets, setFacets] = useState({ categories: [], brands: [] });
  const [facetsLoading, setFacetsLoading] = useState(false);
  const { results, total, pages, currentPage, status } = useSelector(selectSearchResults);

  const normalizedParams = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      q: params.q || "",
      category: params.category || "",
      brand: params.brand || "",
      minPrice: params.minPrice || "",
      maxPrice: params.maxPrice || "",
      minRating: params.minRating || "",
      sort: params.sort || "newest",
      page: Number(params.page || 1),
      limit: Number(params.limit || DEFAULT_LIMIT)
    };
  }, [searchParams]);

  useEffect(() => {
    dispatch(fetchSearchResults(normalizedParams));
  }, [dispatch, normalizedParams]);

  useEffect(() => {
    const loadFacets = async () => {
      setFacetsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products/facets`);
        const data = await res.json();
        if (res.ok) setFacets(data);
      } finally {
        setFacetsLoading(false);
      }
    };
    loadFacets();
  }, []);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === null || value === "") next.delete(key);
    else next.set(key, String(value));
    if (key !== "page") next.set("page", "1");
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const q = searchParams.get("q");
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    next.set("sort", "newest");
    setSearchParams(next, { replace: true });
  };

  const from = total === 0 ? 0 : (currentPage - 1) * normalizedParams.limit + 1;
  const to = Math.min(currentPage * normalizedParams.limit, total);

  return (
    <main className="min-h-screen bg-zivvo-dark-bg px-4 py-6 text-zivvo-text-base md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 rounded-xl border border-zinc-800 bg-zivvo-surface p-3">
          <SearchBar />
        </div>

        <div className="grid gap-5 md:grid-cols-[18rem_1fr]">
          <FilterSidebar searchParams={searchParams} facets={facets} onParamChange={setParam} onClear={clearFilters} />

          <section>
            <p className="mb-4 rounded-xl border border-zinc-800 bg-zivvo-surface px-3 py-2 text-sm text-zivvo-text-muted">
              Showing {from}-{to} of {total} results
            </p>

            {(status === "loading" || facetsLoading) ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, idx) => <ProductCardSkeleton key={idx} />)}
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zivvo-surface p-10 text-center">
                <h2 className="text-lg font-semibold">No products found</h2>
                <p className="mt-2 text-sm text-zivvo-text-muted">Try broadening your filters or search term.</p>
                <Link to="/" className="mt-4 inline-block text-sm font-semibold text-[#ef9f27]">Back to home</Link>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((product) => <ProductCard key={product._id} product={product} />)}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => setParam("page", Math.max(currentPage - 1, 1))} disabled={currentPage <= 1} className="rounded-md bg-zinc-800 px-3 py-1 text-sm disabled:opacity-40">Previous</button>
                  {Array.from({ length: pages }).map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        type="button"
                        key={pageNum}
                        onClick={() => setParam("page", pageNum)}
                        className={`rounded-md px-3 py-1 text-sm ${pageNum === currentPage ? "bg-[#ef9f27] text-black" : "bg-zinc-800"}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button type="button" onClick={() => setParam("page", Math.min(currentPage + 1, pages || 1))} disabled={currentPage >= pages} className="rounded-md bg-zinc-800 px-3 py-1 text-sm disabled:opacity-40">Next</button>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
