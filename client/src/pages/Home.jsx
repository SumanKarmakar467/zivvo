import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import PageTransition from "../components/PageTransition";
import HeroSection from "../components/HeroSection";
import PromoStrip from "../components/PromoStrip";
import CategoryRow from "../components/CategoryRow";
import ProductCard from "../components/ProductCard";
import SellerBanner from "../components/SellerBanner";

const products = [
  {
    _id: "dummy-camera",
    name: "DSLR Camera Kit 24MP",
    cat: "Electronics",
    price: 28999,
    oldPrice: 47999,
    rating: 4.9,
    sale: "-40%",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80"
  },
  {
    _id: "dummy-laptop",
    name: 'Ultra Slim Laptop 14"',
    cat: "Electronics",
    price: 52499,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80"
  },
  {
    _id: "dummy-bag",
    name: "Leather Tote Bag",
    cat: "Fashion",
    price: 3499,
    rating: 5.0,
    isNew: true,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80"
  },
  {
    _id: "dummy-jogger",
    name: "Men's Jogger Set",
    cat: "Fashion",
    price: 1799,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80"
  },
  {
    _id: "dummy-plant",
    name: "Indoor Plant Set of 3",
    cat: "Home",
    price: 1299,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&q=80"
  },
  {
    _id: "dummy-watch",
    name: "Smart Watch Series 8",
    cat: "Electronics",
    price: 18999,
    oldPrice: 24999,
    rating: 4.8,
    sale: "-23%",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
  },
  {
    _id: "dummy-coffee",
    name: "Pour-Over Coffee Kit",
    cat: "Kitchen",
    price: 2299,
    rating: 4.9,
    isNew: true,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80"
  },
  {
    _id: "dummy-yoga",
    name: "Yoga Mat Premium 6mm",
    cat: "Sports",
    price: 899,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80"
  },
  {
    _id: "dummy-lipstick",
    name: "Velvet Matte Lipstick Trio",
    cat: "Beauty",
    price: 699,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80"
  },
  {
    _id: "dummy-books",
    name: "Weekend Reading Bundle",
    cat: "Books",
    price: 999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80"
  },
  {
    _id: "dummy-toy",
    name: "Creative Blocks Play Set",
    cat: "Toys",
    price: 1199,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&q=80"
  },
  {
    _id: "dummy-garden",
    name: "Balcony Garden Starter Kit",
    cat: "Garden",
    price: 1499,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"
  }
];

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
    const text = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.cat === activeCategory;
      const matchesSearch = !text || `${product.name} ${product.cat}`.toLowerCase().includes(text);
      return matchesCategory && matchesSearch;
    });
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
