import { motion, useInView, animate } from "framer-motion";
import { useMemo, useRef, useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { useGetFeaturedProductsQuery, useGetProductsQuery } from "../services/productApi";

const categories = ["Electronics", "Fashion", "Beauty", "Home", "Sports", "Books", "Toys", "Grocery", "Watches"];

function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.3,
      onUpdate: (latest) => setDisplay(Math.round(latest))
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

export default function Home() {
  const { data: featuredData, isLoading: isFeaturedLoading } = useGetFeaturedProductsQuery();
  const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery("limit=8");

  const featuredProducts = useMemo(() => {
    if (Array.isArray(featuredData)) return featuredData;
    if (Array.isArray(featuredData?.products)) return featuredData.products;
    return [];
  }, [featuredData]);

  const products = useMemo(() => {
    if (Array.isArray(productsData)) return productsData;
    if (Array.isArray(productsData?.products)) return productsData.products;
    return [];
  }, [productsData]);

  const stats = [
    { label: "Active Shoppers", value: 120000 },
    { label: "Products Listed", value: 45000 },
    { label: "Orders Delivered", value: 980000 },
    { label: "Seller Partners", value: 3200 }
  ];

  return (
    <PageTransition>
      <main className="min-h-screen bg-zinc-100 pb-24 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 md:pb-10">
        <section className="mx-auto max-w-7xl px-4 pt-8 md:px-6 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-12"
          >
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#ef9f27]/20 blur-3xl" />
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#ef9f27]">Zivvo Commerce</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight md:text-5xl">Shop smarter with premium picks and fast delivery.</h1>
            <p className="mt-4 max-w-xl text-sm text-zinc-600 dark:text-zinc-400 md:text-base">Discover curated products across top categories with secure checkout and reliable service.</p>
            <button
              type="button"
              className="mt-7 rounded-full bg-[#ef9f27] px-7 py-3 text-sm font-bold text-zinc-950 shadow-[0_0_0_0_rgba(239,159,39,0.7)] animate-[pulse_2.2s_infinite]"
            >
              Start Shopping
            </button>
          </motion.div>
        </section>

        <section className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
          <h2 className="mb-3 text-lg font-bold">Browse Categories</h2>
          <motion.div drag="x" dragConstraints={{ left: -500, right: 0 }} className="cursor-grab overflow-hidden active:cursor-grabbing">
            <div className="flex w-max gap-3">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className="rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:border-[#ef9f27] hover:text-[#ef9f27] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
          <h2 className="mb-4 text-xl font-bold">Featured Products</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isFeaturedLoading
              ? Array.from({ length: 8 }).map((_, idx) => <ProductCardSkeleton key={`feature-skeleton-${idx}`} />)
              : featuredProducts.map((product) => <ProductCard key={product._id || product.id} product={product} />)}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
          <h2 className="mb-4 text-xl font-bold">Popular Right Now</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isProductsLoading
              ? Array.from({ length: 8 }).map((_, idx) => <ProductCardSkeleton key={`product-skeleton-${idx}`} />)
              : products.map((product) => <ProductCard key={product._id || product.id} product={product} />)}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-7xl px-4 pb-12 md:px-6">
          <div className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                <p className="text-2xl font-black text-[#ef9f27]"><CountUp value={stat.value} />+</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
