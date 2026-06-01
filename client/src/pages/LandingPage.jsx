import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, PackageCheck, ShieldCheck, ShoppingBag, Sparkles, Star, Truck, Zap } from "lucide-react";
import { categories, products } from "../data/cosmicCatalog";
import { useCartContext } from "../context/CartContext";

export default function LandingPage() {
  const { addItem } = useCartContext();
  const trending = products.slice(0, 4);
  const justDropped = products.slice(4, 8);
  const heroStats = [
    ["24K+", "Curated orders"],
    ["4.9", "Member rating"],
    ["120+", "Elite sellers"]
  ];
  const experience = [
    { icon: BadgeCheck, title: "Premium catalog", text: "Category-first product discovery with brand-level depth." },
    { icon: ShieldCheck, title: "Secure checkout", text: "Auth, cart, orders, wishlist, and protected seller flows." },
    { icon: Truck, title: "Fast commerce UX", text: "Responsive pages, product galleries, reviews, and live-ready flows." }
  ];

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-aurora" />
        <div className="landing-grid" />
        <div className="landing-hero-visual" aria-hidden="true">
          <div className="hero-showcase hero-showcase-clean">
            <div className="hero-showcase-stage">
              <div className="hero-energy-grid" />
              <div className="hero-scanline" />
              <div className="hero-shoe-orbit hero-shoe-orbit-one" />
              <div className="hero-shoe-orbit hero-shoe-orbit-two" />
              <div className="hero-shoe-shadow" />
              <img
                src="https://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png"
                alt="Premium red running shoe"
                className="hero-shoe"
              />
              <div className="hero-shoe-chip hero-shoe-chip-left">
                <span>Drop Price</span>
                <strong>$89</strong>
              </div>
              <div className="hero-shoe-chip hero-shoe-chip-right">
                <span>Live Sale</span>
                <strong>60% OFF</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="landing-hero-marquee" aria-hidden="true">
          <span>Electronics</span>
          <span>Phones</span>
          <span>Shoes</span>
          <span>Grocery</span>
          <span>Study</span>
          <span>Vehicle Parts</span>
        </div>
        <div className="cosmic-container landing-hero-content">
          <div className="landing-copy">
            <div className="landing-badge">
              <Sparkles className="h-4 w-4" />
              Recruiter-ready full-stack marketplace
            </div>
            <h1 className="cosmic-title landing-title">
              ZIVVO
              <span>Commerce that feels alive.</span>
            </h1>
            <p className="landing-lede">
              A premium Indian ecommerce experience with animated product storytelling, category-to-brand discovery, rich product pages, carts, auth, orders, and seller-ready architecture.
            </p>
            <div className="landing-actions">
              <Link to="/category/electronics" className="btn-primary px-8">
                Enter Store <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#collections" className="btn-ghost px-8">
                Explore Build
              </a>
            </div>
            <div className="landing-proof">
              {heroStats.map(([value, label]) => (
                <div key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cosmic-container py-stack-lg">
        <div className="landing-section-head">
          <div>
            <p className="text-label-caps font-bold uppercase tracking-[0.14em] text-neon-cyan">Why it stands out</p>
            <h2 className="cosmic-title mt-2 text-headline-lg">Built to impress shoppers and reviewers</h2>
          </div>
          <Link to="/search" className="hidden text-sm font-bold uppercase tracking-[0.12em] text-neon-cyan md:inline-flex">
            Search products
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {experience.map(({ icon: Icon, title, text }) => (
            <article key={title} className="landing-feature">
              <Icon className="h-7 w-7 text-neon-cyan" />
              <h3 className="cosmic-title mt-5 text-2xl">{title}</h3>
              <p className="mt-3 text-on-surface-variant">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="collections" className="cosmic-container py-stack-lg">
        <div className="landing-section-head">
          <div>
            <p className="text-label-caps font-bold uppercase tracking-[0.14em] text-neon-cyan">Collections</p>
            <h2 className="cosmic-title mt-2 text-headline-lg">Choose a world, then drill into products</h2>
          </div>
          <Link to="/category/electronics" className="hidden text-sm font-bold uppercase tracking-[0.12em] text-neon-cyan md:inline-flex">
            View all
          </Link>
        </div>
        <div className="landing-collection-grid">
          {categories.map((category, index) => (
            <Link key={category.slug} to={`/category/${category.slug}`} className="landing-collection group" style={{ "--delay": `${index * 80}ms` }}>
              <img src={category.image} alt={category.name} />
              <div>
                <p>{category.eyebrow}</p>
                <h3 className="cosmic-title">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cosmic-container py-stack-lg">
        <div className="landing-drop-banner">
          <div>
            <p className="text-label-caps font-bold uppercase tracking-[0.14em] text-neon-cyan">Live marketplace pulse</p>
            <h2 className="cosmic-title mt-3 text-4xl md:text-5xl">Animated drops, real shopping paths, polished product detail.</h2>
            <p className="mt-4 max-w-2xl text-on-surface-variant">
              The first impression is visual, but the depth is practical: product type filters, brand paths, angle galleries, reviews, checkout, wishlist, and account flows.
            </p>
          </div>
          <div className="landing-drop-stack" aria-hidden="true">
            <span><Zap className="h-5 w-5" /> Live sale</span>
            <span><PackageCheck className="h-5 w-5" /> 566 products</span>
            <span><Star className="h-5 w-5" /> 4.9 rating</span>
          </div>
        </div>
      </section>

      <section className="cosmic-container py-stack-lg">
        <div className="landing-section-head">
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
        <div className="landing-sale">
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
        <div className="landing-section-head">
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
