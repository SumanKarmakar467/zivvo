const getPages = (currentPage, totalPages) => {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = new Set([1, totalPages, currentPage]);
  if (currentPage > 2) pages.add(currentPage - 1);
  if (currentPage < totalPages - 1) pages.add(currentPage + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((page, index) => {
    if (index === 0) return [page];
    return page - sorted[index - 1] > 1 ? [`ellipsis-${page}`, page] : [page];
  });
};

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => goToPage(currentPage - 1)}
        className="rounded-lg border border-violet-500/40 bg-[#05060F] px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-violet-900/50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <span className="px-3 text-sm text-cyan-200 sm:hidden">Page {currentPage} of {totalPages}</span>

      <div className="hidden items-center gap-2 sm:flex">
        {getPages(currentPage, totalPages).map((page) =>
          typeof page === "string" ? (
            <span key={page} className="px-2 text-cyan-300/70">...</span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition ${
                page === currentPage
                  ? "border-violet-600 bg-violet-600 text-white"
                  : "border-violet-500/40 bg-[#05060F] text-cyan-100 hover:bg-violet-900/50"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="rounded-lg border border-violet-500/40 bg-[#05060F] px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-violet-900/50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
