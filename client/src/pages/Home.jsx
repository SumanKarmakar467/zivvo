import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import CategoryRow from "../components/CategoryRow";
import SellerBanner from "../components/SellerBanner";
import RecentlyViewedStrip from "../components/RecentlyViewedStrip";
import HomepageTrending from "../components/HomepageTrending";
import { useGetFeaturedProductsQuery, useGetProductsQuery } from "../store/api/productsApi";

const categories = [
  { name: "Electronics", icon: "🎧", slug: "electronics" },
  { name: "Laptops", icon: "💻", slug: "laptops" },
  { name: "Watches", icon: "⌚", slug: "watches" },
  { name: "Sneakers", icon: "👟", slug: "sneakers" },
  { name: "Bags", icon: "👜", slug: "bags" },
  { name: "Cameras", icon: "📷", slug: "cameras" },
  { name: "Beauty", icon: "✨", slug: "beauty" },
  { name: "Home", icon: "🏠", slug: "home-kitchen" }
];

const heroProducts = [
  {
    name: "Studio Headphones",
    price: "2,499",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    className: "row-span-2"
  },
  {
    name: "Urban Watch",
    price: "3,199",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    className: ""
  },
  {
    name: "Daily Sneakers",
    price: "1,899",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    className: ""
  }
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 }
};

const heroText = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const heroChild = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

function AnimatedSection({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.15, triggerOnce: true });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={sectionVariants}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 pt-10 md:grid-cols-[1.02fr_0.98fr] md:px-6 md:pb-16 md:pt-16">
      <motion.div initial="hidden" animate="show" variants={heroText}>
        <motion.div variants={heroChild} className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-light px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-accent-dark dark:border-accent/30 dark:bg-accent/10 dark:text-accent">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          New Collection 2026
        </motion.div>
        <motion.h1 variants={heroChild} className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight text-ink dark:text-white md:text-5xl">
          Shop Smarter, <span className="text-accent">Live Better</span>
        </motion.h1>
        <motion.p variants={heroChild} className="mt-5 max-w-xl text-base leading-7 text-ink-muted dark:text-zivvo-text-muted">
          Discover thoughtful products from trusted Indian sellers, styled with warm detail and built for everyday checkout speed.
        </motion.p>
        <motion.div variants={heroChild} className="mt-7 flex flex-wrap gap-3">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link to="/search" className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-accent/20 transition hover:-translate-y-0.5 hover:bg-accent-dark">
              Explore Now
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link to="/seller" className="inline-flex rounded-full border border-ink/15 px-6 py-3 text-sm font-extrabold text-ink transition hover:-translate-y-0.5 hover:border-accent hover:text-accent dark:border-white/15 dark:text-white">
              Start Selling
            </Link>
          </motion.div>
        </motion.div>
        <motion.div variants={heroChild} className="mt-9 grid max-w-xl grid-cols-3 gap-4 border-t border-ink/10 pt-5 dark:border-white/10">
          {[
            ["50K+", "Products"],
            ["2.8K", "Sellers"],
            ["4.9★", "Rating"]
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-2xl font-extrabold text-ink dark:text-white">{value}</p>
              <p className="mt-1 text-xs font-semibold text-ink-muted dark:text-zivvo-text-muted">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.6 }} className="grid h-[440px] grid-cols-2 grid-rows-2 gap-4">
        {heroProducts.map((product, index) => (
          <motion.div
            key={product.name}
            whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
            className={`relative overflow-hidden rounded-2xl bg-bg-card shadow-sm dark:bg-dark-card ${product.className}`}
          >
            <img src={product.image} alt={product.name} loading={index === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm font-extrabold">{product.name}</p>
              <p className="mt-1 text-xs">From ₹{product.price}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function PromoStrip() {
  return (
    <div className="overflow-hidden bg-accent py-3 text-white">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap text-sm font-extrabold"
        animate={{ x: [0, -420] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index}>
            Use code <code className="rounded bg-white/20 px-2 py-1 font-mono">ZIVVO30</code> for 30% off · Free shipping above ₹499
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { data: featuredData, isLoading } = useGetFeaturedProductsQuery();
  const { data: productsData } = useGetProductsQuery({ limit: 24 });

  const featured = useMemo(() => (Array.isArray(featuredData) ? featuredData : featuredData?.products || []), [featuredData]);
  const allProducts = useMemo(() => (Array.isArray(productsData) ? productsData : productsData?.products || []), [productsData]);
  const displayProducts = featured.length ? featured : allProducts;

  return (
    <PageTransition>
      <main className="min-h-screen bg-bg-warm pb-28 text-ink dark:bg-dark-bg dark:text-zivvo-text-base md:pb-12">
        <HeroSection />
        <PromoStrip />

        <AnimatedSection className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-accent">Browse</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-ink dark:text-white">Popular Categories</h2>
            </div>
          </div>
          <CategoryRow categories={categories} />
        </AnimatedSection>

        <AnimatedSection className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-accent">Curated</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-ink dark:text-white">Top Picks For You</h2>
            </div>
            <Link to="/search" className="text-sm font-extrabold text-accent transition hover:text-accent-dark">View All</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : displayProducts.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </AnimatedSection>

        <AnimatedSection className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
          <RecentlyViewedStrip />
        </AnimatedSection>

        <AnimatedSection className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
          <HomepageTrending />
        </AnimatedSection>

        <SellerBanner />
      </main>
    </PageTransition>
  );
}
