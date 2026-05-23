import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FloatingProductCards from "../components/FloatingProductCards";
import Marquee from "../components/Marquee";
import { SearchSkeletonRows } from "../components/SkeletonGrid";
import ScrollReveal from "../components/ui/ScrollReveal";
import useCountUp from "../hooks/useCountUp";
import { fadeIn, scaleIn, slideInLeft, slideInRight, staggerContainer, staggerItem } from "../utils/motionVariants";

const features = [
  ["⚡", "Lightning Fast Search", "Find products, collections, sellers, and deals with responsive discovery built for everyday shopping.", "01"],
  ["🛡️", "Verified Sellers", "Every seller profile is designed around trust, ratings, and clear storefront signals.", "02"],
  ["📱", "Seamless Experience", "A fluid mobile-first interface keeps browsing, wishlist, cart, and checkout close at hand.", "03"],
  ["💳", "Secure Payments", "Checkout feels calm and protected with clear totals, trusted payment flows, and order confidence.", "04"],
  ["📦", "Live Order Tracking", "Customers can follow order progress without digging through confusing pages.", "05"],
  ["🌟", "Earn & Redeem", "Rewards, wishlist moments, and personalized picks make repeat shopping feel worthwhile.", "06"]
];

const showcase = [
  ["Handcrafted Blue Pottery Vase", "₹4,199", "HOT", "🏺", "Jaipur glaze, museum-blue finish"],
  ["Silk Chanderi Kurta", "₹2,899", "NEW", "👘", "Soft sheen with festive tailoring"],
  ["Ayurvedic Skin Kit", "₹899", "SALE", "🌿", "Daily ritual set for fresh skin"],
  ["Rudraksha Mala Set", "₹1,299", "POPULAR", "📿", "Natural beads with brass details"],
  ["Brass Diya Collection", "₹749", "NEW", "🪔", "Warm festival glow in a gift box"]
];

const testimonials = [
  ["PR", "Priya Rao", "Bengaluru", "Zivvo feels premium without making shopping slow. The seller details and product pages gave me instant confidence."],
  ["AM", "Arjun Mehta", "Mumbai", "The experience is polished, fast, and very easy to browse. I found gifts in minutes instead of jumping between apps."],
  ["SD", "Sneha Das", "Kolkata", "The marketplace feels curated. I love that the products have a boutique energy but checkout still feels familiar."]
];

const productImage = (emoji, title, accent = "var(--violet)") => {
  const safeTitle = title.replace(/[<>&"']/g, "");
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="680" viewBox="0 0 900 680">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#101326"/><stop offset="1" stop-color="#05060F"/></linearGradient></defs>
  <rect width="900" height="680" rx="44" fill="url(#bg)"/>
  <circle cx="450" cy="292" r="170" fill="${accent}" opacity="0.24"/>
  <text x="450" y="334" text-anchor="middle" font-family="Arial, sans-serif" font-size="150">${emoji}</text>
  <text x="450" y="542" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="800" fill="#E8EAFF">${safeTitle}</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

function StatsBar() {
  const products = useCountUp(50000);
  const customers = useCountUp(12000);
  const sellers = useCountUp(800);
  const stats = [
    [products, "Products", "+"],
    [customers, "Customers", "+"],
    [sellers, "Sellers", "+"],
    [{ count: 49, ref: null }, "Rating", "★"]
  ];

  return (
    <motion.div variants={staggerItem} className="stats-row z-glass relative z-10 mt-2 flex w-full flex-wrap justify-center overflow-hidden rounded-[20px]">
      {stats.map(([stat, label, suffix], index) => (
        <ScrollReveal key={label} variants={scaleIn} delay={index * 0.08} className="min-w-[170px] flex-1 px-6 py-6 text-center">
          <div ref={stat.ref} className="font-head text-3xl font-black text-[var(--cream)]">
            {label === "Rating" ? "4.9" : stat.count.toLocaleString("en-IN")}{suffix}
          </div>
          <p className="mt-1 text-sm uppercase tracking-[0.22em] text-[var(--muted)]">{label}</p>
        </ScrollReveal>
      ))}
    </motion.div>
  );
}

export function LandingPage() {
  return (
    <main className="w-full overflow-hidden bg-[var(--bg)] text-[var(--cream)]">
      <section className="hero-section relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-[clamp(18px,5vw,60px)] pb-[60px] pt-[80px]">
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />
        <div className="hero-orb hero-orb-3" aria-hidden="true" />
        <div className="hero-orb hero-orb-4" aria-hidden="true" />
        <div className="z-grid-overlay absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 flex w-full flex-col items-center text-center">
          <motion.div variants={staggerItem} className="z-glass relative z-10 inline-flex max-w-full items-center gap-3 truncate rounded-full px-4 py-2 text-sm text-[var(--muted)]">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[var(--cyan)] shadow-[0_0_22px_var(--cyan)]" />
            India's Premium Marketplace · Est. 2024
          </motion.div>
          <motion.h1 variants={staggerItem} className="hero-title relative z-10 mt-8 font-head text-[clamp(42px,6vw,72px)] font-black leading-[0.96]">
            Discover Indian Commerce
          </motion.h1>
          <motion.h2 variants={staggerItem} className="hero-title relative z-10 font-head text-[clamp(42px,6vw,72px)] font-black leading-[0.96]">
            Curated <span className="z-gradient-text">Beautifully</span>
          </motion.h2>
          <motion.p variants={staggerItem} className="relative z-10 mt-6 max-w-3xl text-base font-light leading-8 text-[var(--muted)] md:text-xl">
            Zivvo blends verified sellers, fast discovery, secure checkout, and expressive product stories into one luxurious marketplace experience.
          </motion.p>
          <motion.div variants={staggerItem} className="hero-ctas relative z-10 mb-12 mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/search" className="rounded-full bg-gradient-to-r from-[var(--violet)] via-[var(--violet2)] to-[var(--cyan)] px-6 py-3 text-sm font-bold text-white shadow-[0_18px_42px_rgba(124,92,252,0.32)] transition hover:scale-[1.03]">Explore Collections →</Link>
            <Link to="/seller" className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-bold text-[var(--cream)] transition hover:border-[var(--cyan)] hover:text-[var(--cyan)]">Meet Our Sellers</Link>
          </motion.div>
          <motion.div variants={staggerItem}><FloatingProductCards /></motion.div>
          <StatsBar />
        </motion.div>
      </section>

      <Marquee />

      <section className="z-section py-24">
        <ScrollReveal><p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--cyan)]">Marketplace Edge</p></ScrollReveal>
        <ScrollReveal delay={0.08}><h2 className="mt-3 font-head text-4xl font-black md:text-6xl">Built For High-Intent Shopping</h2></ScrollReveal>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="features-grid mt-10 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map(([icon, title, copy, number]) => (
            <motion.article key={title} variants={staggerItem} className="z-feature-card relative min-h-[220px] overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-[var(--cyan)] hover:shadow-[0_12px_36px_rgba(124,92,252,0.15)]">
              <div className="text-4xl">{icon}</div>
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{copy}</p>
              <span className="absolute bottom-3 right-5 font-head text-[52px] font-black text-white opacity-[0.05]">{number}</span>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="z-section py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <ScrollReveal><p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--cyan)]">Insane Finds</p></ScrollReveal>
            <ScrollReveal delay={0.08}><h2 className="mt-3 font-head text-4xl font-black md:text-6xl">Product Showcase</h2></ScrollReveal>
          </div>
          <ScrollReveal variants={scaleIn}><Link to="/search" className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-bold text-[var(--cream)] hover:border-[var(--cyan)]">Shop all</Link></ScrollReveal>
        </div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="prod-grid grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {showcase.map(([title, price, tag, emoji, copy], index) => (
            <motion.div key={title} variants={staggerItem}>
              <Link to={`/search?q=${encodeURIComponent(title)}`} className={`pcard ${index === 0 ? "big md:row-span-2 md:min-h-[640px]" : ""} group relative flex min-h-[310px] overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--bg2)] p-5 transition duration-300 hover:scale-[1.025] hover:shadow-[0_24px_70px_rgba(124,92,252,0.22)]`}>
                <span className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-[color-mix(in_srgb,var(--violet)_24%,transparent)] blur-[20px]" />
                <div className="relative z-10 flex w-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full bg-[var(--violet)] px-3 py-1 text-xs font-black text-white">{tag}</span>
                    <span className="text-2xl font-black text-[var(--cyan)]">{price}</span>
                  </div>
                  <img src={productImage(emoji, title)} alt={title} className="my-6 aspect-[4/3] w-full rounded-[16px] object-cover" />
                  <div><h3 className="font-head text-3xl font-black">{title}</h3><p className="mt-2 text-[var(--muted)]">{copy}</p></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <SearchSkeletonRows />

      <section className="z-section py-20">
        <ScrollReveal><h2 className="font-head text-4xl font-black md:text-6xl">Loved Across India</h2></ScrollReveal>
        <div className="testimonials-grid mt-10 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map(([initials, name, city, quote], index) => (
            <ScrollReveal key={name} variants={scaleIn} delay={index * 0.1}>
              <article className="rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-6 transition hover:-translate-y-1 hover:border-[var(--violet2)]">
                <p className="text-lg text-[var(--violet2)]">★★★★★</p>
                <p className="mt-5 text-lg italic leading-8 text-[var(--cream)]">"{quote}"</p>
                <div className="mt-7 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--violet)] text-sm font-black text-white">{initials}</span><div><p className="font-bold">{name}</p><p className="text-sm text-[var(--muted)]">{city}</p></div></div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="z-section relative py-24 text-center">
        <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(124,92,252,0.12),transparent)]" aria-hidden="true" />
        <div className="relative z-10">
          <ScrollReveal variants={slideInLeft}><h2 className="font-head text-4xl font-black md:text-6xl">Join <span className="z-gradient-text">12,000+</span> Early Shoppers</h2></ScrollReveal>
          <ScrollReveal delay={0.08}><p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">Get first access to curated drops, seller launches, and limited-time marketplace rewards.</p></ScrollReveal>
          <ScrollReveal variants={slideInRight}><form className="z-glass mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-full p-2 sm:flex-row"><input className="min-h-12 flex-1 rounded-full bg-transparent px-5 text-[var(--cream)] outline-none placeholder:text-[var(--muted)]" placeholder="you@example.com" type="email" /><button type="button" className="rounded-full bg-[var(--violet)] px-6 py-3 text-sm font-black text-white">Get Early Access</button></form></ScrollReveal>
        </div>
      </section>

      <footer className="z-section border-t border-[var(--border)] py-12">
        <ScrollReveal variants={fadeIn}>
          <div className="ft-top grid w-full grid-cols-1 gap-8 md:grid-cols-4">
            <div><p className="font-head text-3xl font-black tracking-[4px] z-gradient-text">ZIVVO</p><p className="mt-3 max-w-xs text-sm leading-7 text-[var(--muted)]">A premium marketplace for expressive products, verified sellers, and effortless shopping.</p></div>
            {[["Shop", ["Collections", "New arrivals", "Deals", "Wishlist"]], ["Seller", ["Become a seller", "Seller dashboard", "Verification", "Returns"]], ["Support", ["Help center", "Order tracking", "Shipping", "Contact"]]].map(([heading, links]) => (
              <div key={heading}><h3 className="font-bold text-[var(--cream)]">{heading}</h3><div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">{links.map((item) => <Link key={item} to="/search" className="hover:text-[var(--cyan)]">{item}</Link>)}</div></div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]"><p>© 2026 Zivvo. All rights reserved.</p><div className="flex gap-5"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/search">Marketplace</Link></div></div>
        </ScrollReveal>
      </footer>
    </main>
  );
}

export default LandingPage;
