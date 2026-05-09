export default function SortBar({ sort, onSortChange, total, view, onViewChange }) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zivvo-surface p-3 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-zivvo-text-muted">Showing {total} results</p>

      <div className="flex items-center gap-3">
        <div className="flex overflow-hidden rounded-md border border-zinc-700">
          <button type="button" onClick={() => onViewChange("grid")} className={`px-3 py-1 text-sm ${view === "grid" ? "bg-[#ef9f27] text-black" : "bg-zinc-900 text-zivvo-text-base"}`}>Grid</button>
          <button type="button" onClick={() => onViewChange("list")} className={`px-3 py-1 text-sm ${view === "list" ? "bg-[#ef9f27] text-black" : "bg-zinc-900 text-zivvo-text-base"}`}>List</button>
        </div>

        <select value={sort || ""} onChange={(e) => onSortChange(e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zivvo-text-base">
          <option value="">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="rating">Avg. Rating</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
    </div>
  );
}
