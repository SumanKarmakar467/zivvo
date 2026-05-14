import { useMemo } from "react";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" }
];

export default function FilterSidebar({ searchParams = new URLSearchParams(), facets = {}, onParamChange = () => {}, onClear = () => {} }) {
  const minRating = Number(searchParams.get("minRating") || 0);

  const selectedCategory = searchParams.get("category") || "";
  const selectedBrand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "newest";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  return (
    <aside className="rounded-xl border border-zinc-800 bg-zivvo-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide">Filters</h2>
        <button type="button" onClick={onClear} className="text-xs font-semibold text-[#ef9f27]">Clear filters</button>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="category-filter" className="mb-1 block text-xs uppercase tracking-wide text-zivvo-text-muted">Category</label>
          <select id="category-filter" value={selectedCategory} onChange={(e) => onParamChange("category", e.target.value)} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm">
            <option value="">All categories</option>
            {(facets.categories || []).map((category) => (
              <option key={category.slug} value={category.slug}>{category.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="brand-filter" className="mb-1 block text-xs uppercase tracking-wide text-zivvo-text-muted">Brand</label>
          <select id="brand-filter" value={selectedBrand} onChange={(e) => onParamChange("brand", e.target.value)} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm">
            <option value="">All brands</option>
            {(facets.brands || []).map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-zivvo-text-muted">Price range</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" min="0" value={minPrice} placeholder="Min" onChange={(e) => onParamChange("minPrice", e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm" />
            <input type="number" min="0" value={maxPrice} placeholder="Max" onChange={(e) => onParamChange("maxPrice", e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm" />
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-zivvo-text-muted">Minimum rating</p>
          <div className="flex gap-1">
            {stars.map((star) => {
              const active = star <= minRating;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => onParamChange("minRating", minRating === star ? "" : String(star))}
                  className={`text-lg ${active ? "text-[#ef9f27]" : "text-zinc-500"}`}
                >
                  ★
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="sort-filter" className="mb-1 block text-xs uppercase tracking-wide text-zivvo-text-muted">Sort</label>
          <select id="sort-filter" value={sort} onChange={(e) => onParamChange("sort", e.target.value)} className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-2 text-sm">
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
