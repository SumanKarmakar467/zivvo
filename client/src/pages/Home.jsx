import { motion } from "framer-motion";
import { FireIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PageTransition from "../components/common/PageTransition";
import ProductCard from "../components/product/ProductCard";
import ProductCardSkeleton from "../components/product/ProductCardSkeleton";
import { useGetDealsQuery, useGetProductsQuery } from "../services/productApi";

const categories = ["All Categories", "Phones", "Laptops", "Fashion", "Beauty", "Home", "Sports", "Books", "Toys", "Watches"];

export default function Home() {
  const { data: deals = [], isLoading: dealsLoading } = useGetDealsQuery();
  const { data, isLoading } = useGetProductsQuery("limit=12");
  const products = data?.products || [];

  return (
    <PageTransition>
      <section className="rounded-3xl bg-hero-gradient p-8 text-shoppop-text-primary">
        <span className="rounded-full bg-shoppop-amber-400 px-3 py-1 text-xs font-bold text-black">SHOPPOP EXCLUSIVE</span>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-4xl font-extrabold">India's Smartest Marketplace</motion.h1>
        <p className="mt-2 max-w-2xl text-shoppop-text-secondary">Experience curated luxury with AI-powered selection and lightning delivery.</p>
        <div className="mt-5 flex gap-3"><button className="rounded-xl bg-amber-gradient px-5 py-2 font-semibold text-black animate-pulse-amber">Explore Now</button><button className="rounded-xl border border-shoppop-amber-400 px-5 py-2">View Deals</button></div>
      </section>

      <section className="mt-6 flex gap-2 overflow-x-auto no-scrollbar">{categories.map((c, idx) => <button key={c} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${idx === 0 ? "bg-shoppop-amber-400 text-black" : "border border-white/10 bg-shoppop-surface text-shoppop-text-secondary"}`}>{c}</button>)}</section>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2"><FireIcon className="h-5 w-5 text-shoppop-amber-400" /><h2 className="text-xl font-bold">Deals of the Day</h2></div>
        <Swiper spaceBetween={12} slidesPerView={1.2} breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 4 } }}>
          {(dealsLoading ? Array.from({ length: 4 }).map((_, i) => ({ _id: i })) : deals).map((item, i) => (
            <SwiperSlide key={item._id || i}>{dealsLoading ? <ProductCardSkeleton /> : <ProductCard product={item} />}</SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Electronics", "Fashion", "Beauty", "Home"].map((name, i) => <motion.div key={name} whileHover={{ y: -4 }} className="rounded-2xl border border-white/10 bg-shoppop-raised p-5 text-center"><p className="text-2xl">{["📱", "👗", "💄", "🏠"][i]}</p><h3 className="mt-2 font-semibold">{name}</h3><p className="text-xs text-shoppop-text-muted">{(i + 2) * 2300} products</p></motion.div>)}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-xl font-bold">Trending Now</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(isLoading ? Array.from({ length: 8 }) : products).map((p, i) => isLoading ? <ProductCardSkeleton key={i} /> : <ProductCard key={p._id} product={p} />)}</div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-shoppop-surface p-6">
        <div className="flex items-center gap-2"><ShieldCheckIcon className="h-6 w-6 text-shoppop-amber-300" /><h3 className="text-lg font-bold">ShopPop Assured - Quality Guaranteed</h3></div>
        <div className="mt-4 grid gap-2 text-sm text-shoppop-text-secondary sm:grid-cols-2 lg:grid-cols-4"><span>Genuine Products</span><span>Easy Returns</span><span>Fast Delivery</span><span>Secure Payments</span></div>
      </section>
    </PageTransition>
  );
}
