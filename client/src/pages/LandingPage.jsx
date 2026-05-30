import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Sparkles, Star, Zap } from "lucide-react";
import { categories, products } from "../data/cosmicCatalog";
import { useCartContext } from "../context/CartContext";

export default function LandingPage() {
  const { addItem } = useCartContext();
  const heroProduct = products[0];
  const trending = products.slice(0, 4);
  const justDropped = products.slice(4);

  return (
    <main>
      <section className="cosmic-container grid min-h-[calc(100vh-5rem)] items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2 text-label-caps font-bold uppercase tracking-[0.14em] text-neon-cyan">
            <Sparkles className="h-4 w-4" />
            Future-Premium Marketplace
          </div>
          <h1 className="cosmic-title text-5xl leading-[0.98] sm:text-6xl lg:text-7xl xl:text-[88px]">
            Shop the Future. <span className="gradient-text block">Own the Moment.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-on-surface-variant">
            ZIVVO brings premium electronics, fashion, beauty, sports, and lifestyle gear into a glassmorphic shopping experience built for modern screens.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/category/electronics" className="btn-primary px-8">
              Shop Now <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#collections" className="btn-ghost px-8">
              Explore Categories
            </a>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ["24K+", "Curated orders"],
              ["4.9", "Member rating"],
              ["120+", "Elite sellers"]
            ].map(([value, label]) => (
              <div key={label} className="glass-card rounded-xl p-4">
                <p className="cosmic-title text-2xl text-stellar-gold">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-on-surface-variant">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="glass-card rounded-[2rem] p-4 shadow-violet lg:p-6">
            <div className="overflow-hidden rounded-[1.5rem] bg-surface-container-lowest">
              <img src={heroProduct.image} alt={heroProduct.title} className="h-[360px] w-full object-cover sm:h-[460px] lg:h-[560px]" />
            </div>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-label-caps font-bold uppercase tracking-[0.14em] text-neon-cyan">{heroProduct.brand}</p>
                <h2 className="cosmic-title mt-1 text-2xl">{heroProduct.title}</h2>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-on-surface-variant">Starting at</p>
                <p className="text-3xl font-black text-stellar-gold">${heroProduct.price}</p>
              </div>
            </div>
          </div>
          <div className="glass-card absolute -bottom-6 left-4 hidden rounded-2xl p-4 shadow-cyan md:block">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-neon-cyan" />
              <div>
                <p className="font-bold">Hyper Sale Live</p>
                <p className="text-sm text-on-surface-variant">Up to 60% on elite gear</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="collections" className="cosmic-container py-stack-lg">
        <div className="mb-stack-md flex items-end justify-between gap-4">
          <div>
            <p className="text-label-caps font-bold uppercase tracking-[0.14em] text-neon-cyan">Collections</p>
            <h2 className="cosmic-title mt-2 text-headline-lg">Browse by signal</h2>
          </div>
          <Link to="/category/electronics" className="hidden text-sm font-bold uppercase tracking-[0.12em] text-neon-cyan md:inline-flex">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link key={category.slug} to={`/category/${category.slug}`} className="group glass-card rounded-2xl p-3">
              <div className="aspect-square overflow-hidden rounded-full border border-white/10">
                <img src={category.image} alt={category.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <p className="mt-4 text-label-caps font-bold uppercase tracking-[0.14em] text-on-surface-variant">{category.eyebrow}</p>
              <h3 className="cosmic-title text-xl">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="cosmic-container py-stack-lg">
        <div className="mb-stack-md flex items-center justify-between">
          <h2 className="cosmic-title text-headline-lg">Trending Now</h2>
          <Link to="/category/electronics" className="text-sm font-bold uppercase tracking-[0.12em] text-neon-cyan">
            View Gear
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((product) => (
            <ProductTile key={product.id} product={product} onAdd={() => addItem(product, { size: product.variant })} />
          ))}
        </div>
      </section>

      <section className="cosmic-container py-stack-lg">
        <div className="glass-card rounded-[2rem] p-6 text-center shadow-violet md:p-10">
          <span className="inline-flex rounded-full bg-electric-violet px-4 py-2 text-label-caps font-bold uppercase text-white">Limited Time</span>
          <h2 className="cosmic-title mt-5 text-4xl md:text-5xl">Hyper Sale</h2>
          <p className="mx-auto mt-3 max-w-2xl text-on-surface-variant">Up to 60% off across futuristic gear, selected accessories, and premium everyday tech.</p>
          <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-3 text-neon-cyan">
            {["02 HRS", "45 MIN", "06 SEC"].map((time) => (
              <div key={time} className="rounded-xl bg-white/5 px-3 py-4 font-black">{time}</div>
            ))}
          </div>
          <Link to="/category/electronics" className="btn-primary mx-auto mt-8 w-full max-w-sm px-8">
            Claim Discount
          </Link>
        </div>
      </section>

      <section className="cosmic-container py-stack-lg">
        <div className="mb-stack-md flex items-center justify-between">
          <h2 className="cosmic-title text-headline-lg">Just Dropped</h2>
          <Link to="/search" className="text-sm font-bold uppercase tracking-[0.12em] text-neon-cyan">View All</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {justDropped.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group glass-card grid overflow-hidden rounded-2xl md:grid-cols-[220px_1fr]">
              <img src={product.image} alt={product.title} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 md:h-full" />
              <div className="p-6">
                <span className="rounded-full border border-stellar-gold/40 px-3 py-1 text-xs font-bold text-stellar-gold">{product.tag}</span>
                <h3 className="cosmic-title mt-5 text-2xl">{product.title}</h3>
                <p className="mt-3 text-on-surface-variant">{product.description}</p>
                <p className="mt-6 text-2xl font-black text-stellar-gold">${product.price}.00</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductTile({ product, onAdd }) {
  return (
    <article className="group glass-card flex h-full flex-col rounded-2xl p-3">
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden rounded-xl bg-surface-container-lowest">
        <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        <span className="absolute right-3 top-3 rounded-full border border-stellar-gold/40 bg-cosmic-black/55 px-3 py-1 text-[10px] font-black text-stellar-gold backdrop-blur">
          {product.tag}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-2">
        <h3 className="mt-2 truncate font-bold">{product.title}</h3>
        <div className="mt-2 flex items-center gap-1 text-sm text-outline">
          <Star className="h-4 w-4 fill-stellar-gold text-stellar-gold" />
          {product.rating}
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="font-black text-stellar-gold">${product.price}</p>
          <button type="button" onClick={onAdd} className="grid h-10 w-10 place-items-center rounded-lg bg-neon-cyan/20 text-neon-cyan transition hover:bg-neon-cyan hover:text-cosmic-black" aria-label={`Add ${product.title} to cart`}>
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
