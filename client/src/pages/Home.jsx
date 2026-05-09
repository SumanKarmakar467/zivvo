import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { useGetFeaturedProductsQuery, useGetProductsQuery } from "../store/api/productsApi";

const categories = [
  { name: "Electronics", icon: "💻", slug: "electronics" },
  { name: "Mobiles", icon: "📱", slug: "mobiles" },
  { name: "Fashion", icon: "👗", slug: "fashion" },
  { name: "Beauty", icon: "💄", slug: "beauty" },
  { name: "Home & Kitchen", icon: "🏠", slug: "home-kitchen" },
  { name: "Sports", icon: "⚽", slug: "sports" },
  { name: "Books", icon: "📚", slug: "books" },
  { name: "Toys", icon: "🎮", slug: "toys" }
];

const categoryDummyImages = {
  electronics: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80&auto=format&fit=crop",
  mobiles: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80&auto=format&fit=crop",
  fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80&auto=format&fit=crop",
  beauty: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80&auto=format&fit=crop",
  "home-kitchen": "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200&q=80&auto=format&fit=crop",
  sports: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80&auto=format&fit=crop",
  books: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80&auto=format&fit=crop",
  toys: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80&auto=format&fit=crop"
};

function useCountdownToMidnight() {
  const [left, setLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

function CountCard({ label, target }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const id = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(id);
      }
      setCount(current);
    }, 24);
    return () => clearInterval(id);
  }, [target]);
  return (
    <div>
      <p className="text-xl font-black text-[#ef9f27]">{count.toLocaleString()}+</p>
      <p className="text-xs text-zinc-300">{label}</p>
    </div>
  );
}

export default function Home() {
  const { data: featuredData, isLoading } = useGetFeaturedProductsQuery();
  const { data: productsData } = useGetProductsQuery({ limit: 24 });
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const timer = useCountdownToMidnight();

  const featured = useMemo(() => (Array.isArray(featuredData) ? featuredData : featuredData?.products || []), [featuredData]);
  const allProducts = useMemo(() => (Array.isArray(productsData) ? productsData : productsData?.products || []), [productsData]);

  const flashSaleProducts = useMemo(() => allProducts.filter((p) => Number(p.discount || 0) >= 20), [allProducts]);
  const dealProduct = useMemo(() => [...allProducts].sort((a, b) => (b.discount || 0) - (a.discount || 0))[0], [allProducts]);

  const categoryCounts = useMemo(() => {
    const map = {};
    allProducts.forEach((p) => {
      const name = p.category?.name || p.category || "";
      map[name] = (map[name] || 0) + 1;
    });
    return map;
  }, [allProducts]);

  const onSubscribe = () => {
    if (!email.trim()) return;
    localStorage.setItem("zivvo-newsletter", email.trim());
    setSubscribed(true);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-[#19120b] pb-28 pt-24 text-[#efe0d3] md:pb-10">
        <section className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="rounded-3xl border border-zinc-800 bg-[linear-gradient(135deg,#19120b,#1f1a14,#2a1a08)] p-8 md:p-12">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block rounded-full bg-[#ef9f27] px-3 py-1 text-xs font-bold text-black">ZIVVO EXCLUSIVE</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="mt-4 max-w-2xl text-4xl font-black md:text-6xl">India's Smartest Marketplace</motion.h1>
            <p className="mt-3 max-w-xl text-zinc-300">Curated luxury with AI-powered selection and lightning delivery.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-[#ef9f27] px-6 py-3 font-semibold text-black shadow-[0_0_0_0_rgba(239,159,39,.7)] animate-[pulse_2.3s_infinite]">Explore Now</button>
              <button className="rounded-full border border-zinc-500 px-6 py-3 font-semibold">View Deals</button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[{ label: "Products", n: 2000000 }, { label: "Customers", n: 1000000 }, { label: "Sellers", n: 100000 }].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }} className="rounded-xl border border-zinc-700 bg-black/20 p-4">
                  <CountCard label={s.label} target={s.n} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 max-w-7xl px-4 md:px-6">
          <motion.div drag="x" dragConstraints={{ left: -400, right: 0 }} className="cursor-grab overflow-hidden active:cursor-grabbing">
            <div className="flex w-max gap-3">
              {categories.map((c) => (
                <Link key={c.slug} to={`/category/${c.slug}`} className="group rounded-2xl border border-zinc-700 bg-[#1f1a14] p-4 text-center transition hover:scale-105 hover:border-[#ef9f27]">
                  <div className="text-2xl">{c.icon}</div>
                  <div className="mt-1 text-xs">{c.name}</div>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-2xl font-bold">Top Picks For You</h2><Link to="/search" className="text-[#ef9f27]">View All</Link></div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {isLoading ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />) : featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>

        {flashSaleProducts.length > 0 && (
          <section className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
            <div className="mb-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-[#ef9f27] to-[#c97a0d] px-5 py-3 text-black"><h3 className="font-bold">Flash Sale</h3><p className="font-semibold">{String(timer.h).padStart(2, "0")}:{String(timer.m).padStart(2, "0")}:{String(timer.s).padStart(2, "0")}</p></div>
            <Swiper spaceBetween={14} slidesPerView={1.3} breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }}>
              {flashSaleProducts.map((p) => (
                <SwiperSlide key={p._id}><div className="relative"><span className="absolute left-2 top-2 z-10 rounded-full bg-[#ef9f27] px-2 py-1 text-xs font-bold text-black">{p.discount || 0}% OFF</span><ProductCard product={p} /></div></SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}

        <section className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
          <h2 className="mb-4 text-2xl font-bold">Shop by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => {
              const productImage = allProducts[i]?.images?.[0];
              const bg = productImage && String(productImage).trim() ? productImage : categoryDummyImages[c.slug];

              return (
                <Link key={c.slug} to={`/category/${c.slug}`} className="group relative h-44 overflow-hidden rounded-2xl border border-zinc-700">
                  <motion.img
                    src={bg}
                    alt={c.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    animate={{ scale: [1, 1.03, 1], x: [0, -6, 0] }}
                    transition={{ duration: 8, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between"><div><p className="font-semibold">{c.name}</p><p className="text-xs text-zinc-300">{categoryCounts[c.name] || 0} products</p></div><span className="text-xl">→</span></div>
                </Link>
              );
            })}
          </div>
        </section>

        {dealProduct && (
          <section className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
            <div className="grid gap-5 rounded-3xl border border-zinc-800 bg-[#1f1a14] p-5 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl"><img src={dealProduct.images?.[0]} alt={dealProduct.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" /></div>
              <div>
                <span className="inline-block rounded-full bg-[#ef9f27] px-3 py-1 text-xs font-bold text-black">DEAL OF THE DAY</span>
                <h3 className="mt-3 text-3xl font-black">{dealProduct.name}</h3>
                <p className="mt-2 text-zinc-300">{dealProduct.description}</p>
                <p className="mt-3 text-2xl font-bold text-[#ef9f27]">Save {dealProduct.discount || 0}%</p>
                <p className="mt-1 text-zinc-300">Ends in {String(timer.h).padStart(2, "0")}:{String(timer.m).padStart(2, "0")}:{String(timer.s).padStart(2, "0")}</p>
                <button className="mt-5 rounded-lg bg-[#ef9f27] px-6 py-3 font-semibold text-black">Add to Cart</button>
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto mt-12 max-w-7xl px-4 md:px-6">
          <div className="rounded-3xl bg-gradient-to-r from-[#ef9f27] to-[#c97a0d] p-6 text-black md:p-8">
            <h3 className="text-2xl font-black">Get Exclusive Deals in Your Inbox</h3>
            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full rounded-lg bg-white px-4 py-3 text-zinc-900" />
              <button onClick={onSubscribe} className="rounded-lg bg-black px-6 py-3 font-semibold text-white">Subscribe</button>
            </div>
            {subscribed && <p className="mt-3 font-semibold">Subscribed successfully. Welcome to Zivvo deals club!</p>}
          </div>
        </section>

        <footer className="mx-auto mt-12 max-w-7xl border-t border-zinc-800 px-4 pb-6 pt-8 md:px-6">
          <div className="grid gap-6 md:grid-cols-4">
            <div><h4 className="font-semibold text-[#ef9f27]">About Zivvo</h4><p className="mt-2 text-sm text-zinc-400">India's smartest shopping destination.</p></div>
            <div><h4 className="font-semibold text-[#ef9f27]">Customer Service</h4><p className="mt-2 text-sm text-zinc-400">Help Center<br />Returns<br />Shipping</p></div>
            <div><h4 className="font-semibold text-[#ef9f27]">My Account</h4><p className="mt-2 text-sm text-zinc-400">Profile<br />Orders<br />Wishlist</p></div>
            <div><h4 className="font-semibold text-[#ef9f27]">Connect With Us</h4><p className="mt-2 text-sm text-zinc-400">Instagram · X · YouTube</p></div>
          </div>
          <div className="mt-6 border-t border-zinc-800 pt-4 text-sm text-zinc-400">Made with heart in India</div>
          <div className="mt-2 text-xs text-zinc-500">Powered by Razorpay | Cloudinary</div>
        </footer>
      </main>
    </PageTransition>
  );
}
