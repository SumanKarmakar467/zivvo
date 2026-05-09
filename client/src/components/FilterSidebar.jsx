import { useMemo } from "react";
import { useGetCategoriesQuery } from "../store/api/productsApi";

export default function FilterSidebar({ filters, onChange, brands = [], onClose }) {
  const { data: categories = [] } = useGetCategoriesQuery();

  const selectedBrands = useMemo(() => {
    if (!filters.brand) return [];
    return String(filters.brand)
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
  }, [filters.brand]);

  const setPrice = (key, value) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  const toggleBrand = (brand) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];

    onChange({ ...filters, brand: next.length ? next.join(",") : undefined });
  };

  return (
    <aside className="bg-zivvo-surface rounded-xl p-4 sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto border border-zinc-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-zivvo-text-base">Filters</h3>
        <button type="button" onClick={() => onChange({})} className="text-xs font-semibold text-[#ef9f27]">Clear All</button>
      </div>

      <section className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zivvo-text-muted">Categories</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = filters.category === cat.slug;
            return (
              <button
                type="button"
                key={cat._id}
                onClick={() => onChange({ ...filters, category: active ? undefined : cat.slug })}
                className={`rounded-full px-3 py-1 text-xs font-medium ${active ? "bg-[#ef9f27] text-black" : "bg-zinc-800 text-zivvo-text-base"}`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zivvo-text-muted">Price Range</p>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Min Rs" value={filters.minPrice || ""} onChange={(e) => setPrice("minPrice", e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zivvo-text-base" />
          <input type="number" placeholder="Max Rs" value={filters.maxPrice || ""} onChange={(e) => setPrice("maxPrice", e.target.value)} className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zivvo-text-base" />
        </div>
        <input
          type="range"
          min="0"
          max="200000"
          step="500"
          value={filters.maxPrice || 200000}
          onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
          className="mt-3 w-full accent-[#ef9f27]"
        />
      </section>

      <section className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zivvo-text-muted">Brand</p>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm text-zivvo-text-base">
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="accent-[#ef9f27]" />
              {brand}
            </label>
          ))}
        </div>
      </section>

      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zivvo-text-muted">Rating</p>
        {[4, 3, 2, 1].map((r) => (
          <label key={r} className="mb-2 flex items-center gap-2 text-sm text-zivvo-text-base">
            <input
              type="radio"
              name="rating"
              checked={Number(filters.rating) === r}
              onChange={() => onChange({ ...filters, rating: r })}
              className="accent-[#ef9f27]"
            />
            {r}? & above
          </label>
        ))}
      </section>

      {onClose && (
        <button type="button" onClick={onClose} className="mt-4 w-full rounded-md bg-zinc-800 py-2 text-sm text-zivvo-text-base md:hidden">
          Close Filters
        </button>
      )}
    </aside>
  );
}
