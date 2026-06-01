import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layers3, SlidersHorizontal, Star } from "lucide-react";
import {
  getBrandsByCategoryAndSubcategory,
  getCategoryBySlug,
  getProductsByCategory,
  getProductsByCategorySubcategoryAndBrand,
  getSubcategoriesByCategory
} from "../data/cosmicCatalog";
import { useCartContext } from "../context/CartContext";

export default function CategoryPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const category = getCategoryBySlug(slug);
  const { addItem } = useCartContext();
  const selectedType = searchParams.get("type") || "";
  const selectedBrand = searchParams.get("brand") || "";
  const productTypes = getSubcategoriesByCategory(category.slug);
  const brands = selectedType ? getBrandsByCategoryAndSubcategory(category.slug, selectedType) : [];
  const visibleProducts = selectedType || selectedBrand
    ? getProductsByCategorySubcategoryAndBrand(category.slug, selectedType, selectedBrand)
    : getProductsByCategory(category.slug);
  const heroChips = productTypes.slice(0, 7);

  return (
    <main className="cosmic-container py-10 lg:py-14">
      <section className="glass-card grid min-h-[340px] overflow-hidden rounded-[2rem] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="p-6 md:p-10 lg:p-12">
          <p className="text-label-caps font-bold uppercase tracking-[0.16em] text-neon-cyan">{category.eyebrow}</p>
          <h1 className="cosmic-title mt-4 max-w-2xl text-5xl leading-tight md:text-6xl lg:text-7xl">
            {selectedBrand ? `${selectedBrand} ${selectedType}` : selectedType || (category.name === "Electronics" ? "Electronics & Gadgets" : category.name)}
          </h1>
          <p className="mt-5 max-w-xl text-body-lg text-on-surface-variant">
            Choose a product type first, then pick a company to browse focused products with premium images and quick actions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {heroChips.map((chip) => (
              <Link key={chip} to={`/category/${category.slug}?type=${encodeURIComponent(chip)}`} className={`rounded-full border px-4 py-2 text-sm font-semibold ${selectedType === chip ? "border-neon-cyan bg-neon-cyan/15 text-neon-cyan" : "border-white/10 bg-white/5 text-on-surface"}`}>
                {chip}
              </Link>
            ))}
          </div>
        </div>
        <div className="min-h-[280px] overflow-hidden">
          <img src={category.image} alt={category.name} className="h-full min-h-[280px] w-full object-cover opacity-80" />
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-label-caps font-bold uppercase tracking-[0.14em] text-neon-cyan">Shop Path</p>
            <h2 className="cosmic-title mt-1 text-3xl">{selectedType ? `Choose a ${selectedType} company` : "Choose product type"}</h2>
          </div>
          {(selectedType || selectedBrand) && (
            <Link to={`/category/${category.slug}`} className="text-sm font-bold uppercase tracking-[0.12em] text-neon-cyan">
              Reset
            </Link>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {!selectedType && productTypes.map((productType) => (
            <Link
              key={productType}
              to={`/category/${category.slug}?type=${encodeURIComponent(productType)}`}
              className="glass-card flex min-h-24 items-center justify-between rounded-2xl p-4 transition hover:-translate-y-1 hover:shadow-cyan"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-outline">{category.name}</p>
                <h3 className="cosmic-title mt-1 text-xl">{productType}</h3>
              </div>
              <Layers3 className="h-5 w-5 text-neon-cyan" />
            </Link>
          ))}
          {selectedType && brands.map((brand) => (
            <Link
              key={brand}
              to={`/category/${category.slug}?type=${encodeURIComponent(selectedType)}&brand=${encodeURIComponent(brand)}`}
              className={`glass-card flex min-h-24 items-center justify-between rounded-2xl p-4 transition hover:-translate-y-1 hover:shadow-cyan ${selectedBrand === brand ? "border-neon-cyan bg-neon-cyan/10" : ""}`}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-outline">{selectedType}</p>
                <h3 className="cosmic-title mt-1 text-xl">{brand}</h3>
              </div>
              <Layers3 className="h-5 w-5 text-neon-cyan" />
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="glass-card sticky top-28 rounded-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="cosmic-title text-2xl">Refine Gear</h2>
              <SlidersHorizontal className="h-5 w-5 text-neon-cyan" />
            </div>
            <FilterGroup title="Price Range">
              <input type="range" min="0" max="5000" defaultValue="2400" className="w-full accent-neon-cyan" />
              <div className="mt-2 flex justify-between text-xs text-outline">
                <span>$0</span>
                <span>$5000+</span>
              </div>
            </FilterGroup>
            <FilterGroup title={selectedType ? "Companies" : "Product Types"}>
              <div className="flex flex-wrap gap-2">
                {(selectedType ? brands : productTypes).slice(0, 8).map((item) => (
                  <Link key={item} to={selectedType ? `/category/${category.slug}?type=${encodeURIComponent(selectedType)}&brand=${encodeURIComponent(item)}` : `/category/${category.slug}?type=${encodeURIComponent(item)}`} className={`rounded-full border px-4 py-2 text-sm ${(selectedBrand === item || selectedType === item) ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan" : "border-white/10 bg-white/5"}`}>
                    {item}
                  </Link>
                ))}
                {selectedType && brands.length === 0 && (
                  <span className="text-sm text-on-surface-variant">Choose a product type to see companies.</span>
                )}
                {!selectedType && (
                  <span className="basis-full text-xs uppercase tracking-[0.12em] text-outline">Select a type before company</span>
                )}
              </div>
            </FilterGroup>
            <FilterGroup title="Availability">
              <label className="flex items-center justify-between gap-4 text-on-surface">
                In Stock Only
                <span className="flex h-7 w-12 items-center rounded-full bg-electric-violet p-1">
                  <span className="ml-auto h-5 w-5 rounded-full bg-white" />
                </span>
              </label>
            </FilterGroup>
            <button className="btn-primary mt-6 w-full">Apply Filters</button>
          </div>
        </aside>

        <section>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="cosmic-title text-3xl">Available Gear</h2>
              <p className="mt-1 text-on-surface-variant">{visibleProducts.length} {selectedBrand || selectedType || category.name.toLowerCase()} related items</p>
            </div>
            <button className="inline-flex items-center gap-2 text-label-caps font-bold uppercase tracking-[0.14em] text-neon-cyan lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filter
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <article key={product.id} className="group glass-card flex min-h-[420px] flex-col rounded-2xl p-3">
                <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-surface-container-lowest">
                  <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  <span className="absolute left-3 top-3 rounded-full border border-stellar-gold/50 bg-cosmic-black/60 px-3 py-1 text-[10px] font-black text-stellar-gold">
                    {product.tag}
                  </span>
                </Link>
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="cosmic-title mt-2 text-xl">{product.title}</h3>
                  <div className="mt-2 flex items-center gap-1 text-sm text-outline">
                    <Star className="h-4 w-4 fill-stellar-gold text-stellar-gold" />
                    {product.rating}
                  </div>
                  <p className="mt-3 text-xl font-black text-stellar-gold">${product.price}.00</p>
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                    <button onClick={() => addItem(product, { size: product.variant })} className="btn-primary min-h-11 rounded-xl text-xs">
                      Add to Bag
                    </button>
                    <Link to={`/product/${product.id}`} className="btn-ghost min-h-11 rounded-xl text-xs">
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div className="border-t border-white/10 py-6 first:border-t-0 first:pt-0">
      <h3 className="mb-4 text-label-caps font-bold uppercase tracking-[0.16em] text-neon-cyan">{title}</h3>
      {children}
    </div>
  );
}
