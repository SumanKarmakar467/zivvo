import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SkeletonGrid from "../components/SkeletonGrid";
import FilterSidebar from "../components/search/FilterSidebar";
import SearchBar from "../components/search/SearchBar";
import SortDropdown from "../components/search/SortDropdown";
import useSearchStore from "../store/useSearchStore";

const DEFAULT_LIMIT = 20;

const parseList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const popularChips = ["Fashion", "Shoes", "Electronics", "Kitchen", "Beauty", "Sports"];

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    query,
    results,
    filters,
    availableFilters,
    sort,
    page,
    total,
    totalPages,
    isLoading,
    setQuery,
    setFilters,
    setSort,
    setPage,
    clearFilters,
    fetchResults
  } = useSearchStore();

  const paramsState = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      query: params.q || "",
      filters: {
        category: parseList(params.category),
        brand: parseList(params.brand),
        minPrice: params.minPrice || "",
        maxPrice: params.maxPrice || "",
        rating: params.rating || params.minRating || "",
        discount: params.discount || "",
        inStock: params.inStock === "true"
      },
      sort: params.sort || "relevance",
      page: Number(params.page || 1),
      limit: Number(params.limit || DEFAULT_LIMIT)
    };
  }, [searchParams]);

  useEffect(() => {
    setQuery(paramsState.query);
    setFilters(paramsState.filters);
    setSort(paramsState.sort);
    setPage(paramsState.page);
    fetchResults(paramsState);
  }, [fetchResults, paramsState, setFilters, setPage, setQuery, setSort]);

  const updateParams = (next = {}) => {
    const mergedFilters = { ...filters, ...(next.filters || {}) };
    const nextSort = next.sort ?? sort;
    const nextPage = next.page ?? 1;
    const params = new URLSearchParams();
    if (next.query ?? query) params.set("q", next.query ?? query);
    if (mergedFilters.category?.length) params.set("category", mergedFilters.category.join(","));
    if (mergedFilters.brand?.length) params.set("brand", mergedFilters.brand.join(","));
    ["minPrice", "maxPrice", "rating", "discount"].forEach((key) => {
      if (mergedFilters[key]) params.set(key, mergedFilters[key]);
    });
    if (mergedFilters.inStock) params.set("inStock", "true");
    if (nextSort && nextSort !== "relevance") params.set("sort", nextSort);
    params.set("page", String(nextPage));
    setSearchParams(params, { replace: true });
  };

  const onFiltersChange = (nextFilters) => updateParams({ filters: nextFilters, page: 1 });
  const onClear = () => {
    clearFilters();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", "1");
    setSearchParams(params, { replace: true });
  };

  const from = total === 0 ? 0 : (page - 1) * DEFAULT_LIMIT + 1;
  const to = Math.min(page * DEFAULT_LIMIT, total);

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-6 text-[var(--cream)] md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
          <SearchBar />
        </div>

        <div className="grid gap-5 md:grid-cols-[18rem_1fr]">
          <FilterSidebar filters={filters} availableFilters={availableFilters} onFiltersChange={onFiltersChange} onClear={onClear} />

          <section>
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] px-4 py-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="font-head text-2xl font-black">
                  {query ? `Showing ${total.toLocaleString("en-IN")} results for "${query}"` : "Search Zivvo products"}
                </h1>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {total ? `Showing ${from}-${to} of ${total.toLocaleString("en-IN")} products` : "Use keywords, filters, or popular categories to discover products."}
                </p>
              </div>
              <SortDropdown value={sort} onChange={(value) => updateParams({ sort: value, page: 1 })} />
            </div>

            {isLoading ? (
              <SkeletonGrid count={12} />
            ) : results.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-10 text-center shadow-sm">
                <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-[rgba(124,92,252,0.12)] text-5xl">⌕</div>
                <h2 className="mt-5 font-head text-3xl font-black">Try different keywords</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                  We could not find products for this search. Try broader words, remove filters, or explore a popular category.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {popularChips.map((chip) => (
                    <Link
                      key={chip}
                      to={`/search?q=${encodeURIComponent(chip)}&page=1`}
                      className="min-h-11 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--cream)] hover:border-[var(--cyan)]"
                    >
                      {chip}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {results.map((product) => <ProductCard key={product._id} product={product} />)}
                </div>
                {totalPages > 1 && (
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateParams({ page: Math.max(page - 1, 1) })}
                      disabled={page <= 1}
                      className="min-h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-bold disabled:opacity-40"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }).slice(0, 8).map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button
                          type="button"
                          key={pageNum}
                          onClick={() => updateParams({ page: pageNum })}
                          className={`min-h-11 min-w-11 rounded-xl px-3 text-sm font-bold ${pageNum === page ? "bg-[#7C5CFC] text-white" : "border border-[var(--border)] text-[var(--cream)]"}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => updateParams({ page: Math.min(page + 1, totalPages) })}
                      disabled={page >= totalPages}
                      className="min-h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-bold disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
