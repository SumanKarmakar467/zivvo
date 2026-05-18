import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import PageTransition from "../components/PageTransition";
import HeroSection from "../components/HeroSection";
import PromoStrip from "../components/PromoStrip";
import CategoryRow from "../components/CategoryRow";
import ProductCard from "../components/ProductCard";
import SellerBanner from "../components/SellerBanner";
import { searchDemoProducts } from "../data/demoProducts";

const sectionTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1]
};

const grid = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.03
    }
  }
};

const gridItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

function AnimatedSection({ children, className = "" }) {
  const { ref, inView } = useInView({ threshold: 0.12, triggerOnce: true });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={sectionTransition}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const { products } = searchDemoProducts({
      q: query,
      category: activeCategory === "All" ? "" : activeCategory,
      limit: activeCategory === "All" && !query.trim() ? 16 : 20
    });
    return products;
  }, [activeCategory, query]);

  return (
    <PageTransition>
      <main className="min-h-screen bg-brand-bg pb-12 text-brand-ink dark:bg-night-bg dark:text-white">
        <HeroSection />
        <PromoStrip />

        <AnimatedSection className="mx-auto max-w-6xl px-6 py-12">
          <CategoryRow active={activeCategory} onSelect={setActiveCategory} />
        </AnimatedSection>

        <AnimatedSection className="mx-auto max-w-6xl px-6 py-4">
          <div className="mb-6 overflow-hidden rounded-3xl border border-black/8 bg-white/80 p-5 shadow-xl shadow-black/5 backdrop-blur dark:border-night-border dark:bg-night-card/85">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-accent">Search products</p>
                <h2 className="mt-2 font-display text-3xl font-black text-brand-ink dark:text-white">
                  {activeCategory === "All" ? "Trending Products" : `${activeCategory} Products`}
                </h2>
                <p className="mt-2 text-sm text-brand-inkMid dark:text-zivvo-text-muted">
                  Showing {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} for your current selection.
                </p>
              </div>

              <label className="relative w-full lg:max-w-md">
                <span className="sr-only">Search any product</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search camera, laptop, fashion..."
                  className="w-full rounded-2xl border border-black/10 bg-brand-bg px-5 py-4 pr-12 text-sm font-semibold text-brand-ink outline-none transition placeholder:text-brand-inkFaint focus:border-accent focus:ring-4 focus:ring-accent/15 dark:border-night-border dark:bg-night-muted dark:text-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-inkFaint" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </span>
              </label>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${query}`}
                variants={grid}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: 12 }}
                className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
              >
                {filteredProducts.map((product) => (
                  <motion.div key={product._id} variants={gridItem} layout>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="rounded-3xl border border-dashed border-accent/40 bg-accent-muted p-10 text-center"
              >
                <h3 className="font-display text-2xl font-black text-brand-ink dark:text-white">No products found</h3>
                <p className="mt-2 text-sm text-brand-inkMid dark:text-zivvo-text-muted">Try another search term or choose All categories.</p>
                <button type="button" onClick={() => { setQuery(""); setActiveCategory("All"); }} className="mt-5 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white">
                  Reset filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatedSection>

        <AnimatedSection>
          <SellerBanner />
        </AnimatedSection>
      </main>
    </PageTransition>
  );
}
