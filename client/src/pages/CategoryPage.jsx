import { Link, useParams } from "react-router-dom";
import { SlidersHorizontal, Star } from "lucide-react";
import { categories, getCategoryBySlug, products } from "../data/cosmicCatalog";
import { useCartContext } from "../context/CartContext";

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);
  const { addItem } = useCartContext();
  const visibleProducts = products.filter((product) => product.category === category.slug || category.slug === "electronics");

  return (
    <main className="cosmic-container py-10 lg:py-14">
      <section className="glass-card grid min-h-[340px] overflow-hidden rounded-[2rem] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="p-6 md:p-10 lg:p-12">
          <p className="text-label-caps font-bold uppercase tracking-[0.16em] text-neon-cyan">{category.eyebrow}</p>
          <h1 className="cosmic-title mt-4 max-w-2xl text-5xl leading-tight md:text-6xl lg:text-7xl">
            {category.name === "Electronics" ? "Electronics & Gadgets" : category.name}
          </h1>
          <p className="mt-5 max-w-xl text-body-lg text-on-surface-variant">
            Curated next-generation hardware, everyday luxury, and high-signal products for the digital elite.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["iPhone 15 Pro", "Sony XM5", "MacBook Air", "Vision Glass"].map((chip) => (
              <button key={chip} type="button" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-on-surface">
                {chip}
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-[280px] overflow-hidden">
          <img src={category.image} alt={category.name} className="h-full min-h-[280px] w-full object-cover opacity-80" />
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
            <FilterGroup title="Brands">
              <div className="flex flex-wrap gap-2">
                {["Apple", "Sony", "Samsung", "Bose"].map((brand, index) => (
                  <button key={brand} className={`rounded-full border px-4 py-2 text-sm ${index === 0 ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan" : "border-white/10 bg-white/5"}`}>
                    {brand}
                  </button>
                ))}
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
              <p className="mt-1 text-on-surface-variant">{visibleProducts.length * 6} items</p>
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
