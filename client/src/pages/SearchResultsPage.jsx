import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FilterSidebar from "../components/FilterSidebar";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { fetchSearchResults, selectSearchResults } from "../features/search/searchSlice";
import { getDemoFacets, searchDemoProducts } from "../data/demoProducts";

const DEFAULT_LIMIT = 20;

const mergeProducts = (primary, supplemental, targetCount = 16) => {
  const seen = new Set();
  return [...primary, ...supplemental]
    .filter((product) => {
      const key = product._id || product.slug || product.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, targetCount);
};

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
        if (res.ok) {
          const demoFacets = getDemoFacets();
          setFacets({
            categories: [...data.categories, ...demoFacets.categories].filter(
              (category, index, all) => all.findIndex((item) => item.slug === category.slug) === index
            ),
            brands: Array.from(new Set([...(data.brands || []), ...demoFacets.brands])).sort((a, b) => a.localeCompare(b))
          });
        } else {
          setFacets(getDemoFacets());
        }
      } catch {
        setFacets(getDemoFacets());
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
  const demoSearch = useMemo(
    () => searchDemoProducts({ ...normalizedParams, limit: 16 }),
    [normalizedParams]
  );
  const shouldBoostResults = (normalizedParams.q || normalizedParams.category) && results.length < 12;
  const displayResults = shouldBoostResults ? mergeProducts(results, demoSearch.products) : results;
  const displayTotal = shouldBoostResults ? Math.max(total, displayResults.length) : total;
  const displayFrom = displayTotal === 0 ? 0 : shouldBoostResults ? 1 : from;
  const displayTo = shouldBoostResults ? displayResults.length : to;

  return (
    <main className="min-h-screen bg-brand-bg px-4 py-6 text-brand-ink dark:bg-night-bg dark:text-white md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 rounded-2xl border border-black/10 bg-white p-3 shadow-sm dark:border-night-border dark:bg-night-card">
          <SearchBar />
        </div>

        <div className="grid gap-5 md:grid-cols-[18rem_1fr]">
          <FilterSidebar searchParams={searchParams} facets={facets} onParamChange={setParam} onClear={clearFilters} />

          <section>
            <p className="mb-4 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-brand-inkMid shadow-sm dark:border-night-border dark:bg-night-card dark:text-zivvo-text-muted">
              Showing {displayFrom}-{displayTo} of {displayTotal} results
              {shouldBoostResults && <span className="ml-2 font-semibold text-[#e8730a]">Related product suggestions</span>}
            </p>

            {(status === "loading" || facetsLoading) ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, idx) => <ProductCardSkeleton key={idx} />)}
              </div>
            ) : displayResults.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-white p-10 text-center shadow-sm dark:border-night-border dark:bg-night-card">
                <h2 className="text-lg font-semibold">No products found</h2>
                <p className="mt-2 text-sm text-brand-inkMid dark:text-zivvo-text-muted">Try broadening your filters or search term.</p>
                <Link to="/" className="mt-4 inline-block text-sm font-semibold text-[#ef9f27]">Back to home</Link>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {displayResults.map((product) => <ProductCard key={product._id} product={product} />)}
                </div>
                {!shouldBoostResults && <div className="mt-6 flex flex-wrap items-center gap-2">
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
                </div>}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
