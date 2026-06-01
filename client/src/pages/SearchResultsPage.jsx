import { useEffect, useMemo, useState } from "react";
import { ImageUp, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import ErrorBoundary from "../components/ErrorBoundary";
import { useDebounce } from "../hooks/useDebounce";
import useClarifai from "../hooks/useClarifai";
import { useGetProductsQuery } from "../store/api/productsApi";

export default function SearchResultsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [imageTerms, setImageTerms] = useState([]);
  const debouncedSearch = useDebounce(searchInput, 400);
  const { loading: imageLoading, concepts, searchImage } = useClarifai();

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, sort]);

  const query = useMemo(() => ({
    search: debouncedSearch || undefined,
    sort,
    page: currentPage,
    limit: 20
  }), [debouncedSearch, sort, currentPage]);

  const { data, isFetching, isLoading } = useGetProductsQuery(query);
  const products = data?.products || [];
  const total = Number(data?.total || 0);
  const totalPages = Number(data?.totalPages || data?.pages || 1);
  const start = total ? (currentPage - 1) * 20 + 1 : 0;
  const end = Math.min(currentPage * 20, total);

  const onImage = async (file) => {
    if (!file) return;
    const nextConcepts = await searchImage(file);
    setImageTerms(nextConcepts);
    setSearchInput(nextConcepts[0]?.name || "");
  };

  return (
    <main className="min-h-screen bg-[#05060F] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-lg border border-violet-500/20 bg-white/[0.03] p-4 shadow-2xl shadow-violet-950/30 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <SearchBar
              value={searchInput}
              onSearch={(value) => {
                setSearchInput(value);
                setImageTerms([]);
              }}
              isLoading={isFetching}
              placeholder="Search watches, shirts, lipstick..."
            />
            <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-[#05060F] px-4 text-sm font-bold text-cyan-100 transition hover:bg-violet-900/40">
              <ImageUp className="h-5 w-5 text-cyan-300" /> {imageLoading ? "Reading image..." : "Search by Image"}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => onImage(event.target.files?.[0])} />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-cyan-300" />
            <button type="button" onClick={() => setSort("newest")} className={`rounded-full border px-3 py-2 text-sm font-bold ${sort === "newest" ? "border-cyan-300 bg-cyan-300/10 text-cyan-100" : "border-violet-500/30 text-cyan-200/80"}`}>
              Newest
            </button>
            <button type="button" onClick={() => setSort("price_asc")} className={`rounded-full border px-3 py-2 text-sm font-bold ${sort === "price_asc" ? "border-cyan-300 bg-cyan-300/10 text-cyan-100" : "border-violet-500/30 text-cyan-200/80"}`}>
              Price Low to High
            </button>
            <button type="button" onClick={() => setSort("price_desc")} className={`rounded-full border px-3 py-2 text-sm font-bold ${sort === "price_desc" ? "border-cyan-300 bg-cyan-300/10 text-cyan-100" : "border-violet-500/30 text-cyan-200/80"}`}>
              Price High to Low
            </button>
          </div>

          {(concepts.length > 0 || imageTerms.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {concepts.map((concept) => (
                <span key={concept.name} className="rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
                  {concept.name} {(concept.value * 100).toFixed(0)}%
                </span>
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-black">Products</h1>
          <p className="text-sm text-cyan-200/70">Showing {start}-{end} of {total} products</p>
        </div>

        {isLoading || isFetching ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 20 }).map((_, index) => <ProductCardSkeleton key={index} />)}
          </div>
        ) : products.length ? (
          <>
            <ErrorBoundary level="section" fallbackMessage="Products failed to load. Please refresh.">
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                {products.map((product, index) => <ProductCard key={product._id || product.id} product={product} index={index} matchedText={debouncedSearch} />)}
              </div>
            </ErrorBoundary>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-violet-500/30 p-10 text-center text-cyan-200/70">
            No matches yet. Try a broader keyword or another image.
          </div>
        )}
      </div>
    </main>
  );
}
