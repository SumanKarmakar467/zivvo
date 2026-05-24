import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Slider from "@radix-ui/react-slider";

const formatRupees = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const ratingOptions = [
  { label: "4★ & above", value: "4" },
  { label: "3★ & above", value: "3" }
];

const discountOptions = [
  { label: "10% off+", value: "10" },
  { label: "25% off+", value: "25" },
  { label: "50% off+", value: "50" }
];

function FilterContent({ filters, availableFilters, onFiltersChange, onClear }) {
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const priceRange = availableFilters.priceRange || { min: 0, max: 0 };
  const sliderMax = Math.max(Number(priceRange.max || 0), 1000);
  const currentMin = Number(filters.minPrice || priceRange.min || 0);
  const currentMax = Number(filters.maxPrice || sliderMax);
  const brands = showMoreBrands ? availableFilters.brands || [] : (availableFilters.brands || []).slice(0, 5);
  const categories = availableFilters.categories || [];

  const toggleListValue = (key, value) => {
    const set = new Set(filters[key] || []);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    onFiltersChange({ [key]: Array.from(set) });
  };

  return (
    <aside className="h-full overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-4 text-[var(--cream)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.22em]">Filters</h2>
        <button type="button" onClick={onClear} className="min-h-11 text-xs font-bold text-[var(--cyan)]">
          Clear all filters
        </button>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Category</h3>
          <div className="space-y-2">
            {categories.length === 0 && <p className="text-sm text-[var(--muted)]">All categories</p>}
            {categories.map((category) => (
              <label key={category.slug} className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-2 text-sm hover:bg-white/5">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={(filters.category || []).includes(category.slug)}
                    onChange={() => toggleListValue("category", category.slug)}
                    className="h-4 w-4 accent-[#7C5CFC]"
                  />
                  {category.name}
                </span>
                <span className="text-xs text-[var(--muted)]">{category.count || 0}</span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Price Range</h3>
          <Slider.Root
            value={[currentMin, currentMax]}
            min={Number(priceRange.min || 0)}
            max={sliderMax}
            step={100}
            minStepsBetweenThumbs={1}
            onValueCommit={([minPrice, maxPrice]) => onFiltersChange({ minPrice, maxPrice })}
            className="relative flex h-8 touch-none select-none items-center"
          >
            <Slider.Track className="relative h-1 grow rounded-full bg-white/10">
              <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE]" />
            </Slider.Track>
            <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-white bg-[#7C5CFC] shadow-lg outline-none" />
            <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-white bg-[#22D3EE] shadow-lg outline-none" />
          </Slider.Root>
          <div className="mt-2 flex items-center justify-between text-sm text-[var(--muted)]">
            <span>{formatRupees(currentMin)}</span>
            <span>{formatRupees(currentMax)}</span>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Brand</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand.name} className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-2 text-sm hover:bg-white/5">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={(filters.brand || []).includes(brand.name)}
                    onChange={() => toggleListValue("brand", brand.name)}
                    className="h-4 w-4 accent-[#7C5CFC]"
                  />
                  {brand.name}
                </span>
                <span className="text-xs text-[var(--muted)]">{brand.count}</span>
              </label>
            ))}
          </div>
          {(availableFilters.brands || []).length > 5 && (
            <button type="button" onClick={() => setShowMoreBrands((value) => !value)} className="mt-2 min-h-11 text-sm font-semibold text-[var(--cyan)]">
              {showMoreBrands ? "Show less" : `+ Show more (${availableFilters.brands.length - 5})`}
            </button>
          )}
        </section>

        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Rating</h3>
          <div className="flex flex-wrap gap-2">
            {ratingOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onFiltersChange({ rating: filters.rating === option.value ? "" : option.value })}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${filters.rating === option.value ? "border-[#7C5CFC] bg-[#7C5CFC]/20 text-[var(--cream)]" : "border-[var(--border)] text-[var(--muted)]"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Discount</h3>
          <div className="flex flex-wrap gap-2">
            {discountOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onFiltersChange({ discount: filters.discount === option.value ? "" : option.value })}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${filters.discount === option.value ? "border-[#22D3EE] bg-[#22D3EE]/15 text-[var(--cream)]" : "border-[var(--border)] text-[var(--muted)]"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <label className="flex min-h-11 cursor-pointer items-center justify-between rounded-xl border border-[var(--border)] px-3 text-sm">
          <span>In Stock only</span>
          <input
            type="checkbox"
            checked={Boolean(filters.inStock)}
            onChange={(event) => onFiltersChange({ inStock: event.target.checked })}
            className="h-4 w-4 accent-[#7C5CFC]"
          />
        </label>
      </div>
    </aside>
  );
}

export function FilterSidebar({ filters, availableFilters, onFiltersChange, onClear }) {
  const [open, setOpen] = useState(false);
  const filterCount = useMemo(
    () =>
      (filters.category?.length || 0) +
      (filters.brand?.length || 0) +
      ["minPrice", "maxPrice", "rating", "discount"].filter((key) => filters[key]).length +
      (filters.inStock ? 1 : 0),
    [filters]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-4 flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg2)] px-4 text-sm font-bold text-[var(--cream)] md:hidden"
      >
        Filters {filterCount > 0 ? `(${filterCount})` : ""}
      </button>
      <div className="hidden md:block">
        <FilterContent filters={filters} availableFilters={availableFilters} onFiltersChange={onFiltersChange} onClear={onClear} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[80] md:hidden">
            <motion.button
              type="button"
              aria-label="Close filters"
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="absolute bottom-0 left-0 top-0 w-[86vw] max-w-sm"
            >
              <FilterContent filters={filters} availableFilters={availableFilters} onFiltersChange={onFiltersChange} onClear={onClear} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FilterSidebar;
