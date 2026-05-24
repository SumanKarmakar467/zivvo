import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { Tilt } from "react-tilt";
import CountUp from "react-countup";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const chips = ["All", "Electronics", "Clothing", "Jewelry", "Accessories", "Home"];
const foodCategories = new Set(["groceries"]);
const floatingProducts = [
  { name: "Gold Chrono Watch", tag: "Watch", image: "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp" },
  { name: "Street Runner", tag: "Sneaker", image: "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp" },
  { name: "Studio Headphone", tag: "Audio", image: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp" }
];

const categoryAliases = {
  Electronics: ["smartphones", "laptops", "mobile-accessories", "tablets"],
  Clothing: ["mens-shirts", "mens-shoes", "womens-dresses", "womens-shoes", "tops"],
  Jewelry: ["womens-jewellery"],
  Accessories: ["mens-watches", "womens-watches", "sunglasses", "mobile-accessories"],
  Home: ["furniture", "home-decoration", "kitchen-accessories"]
};

export default function LandingPage() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const sectionRef = useRef(null);
  const sentinelRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorPosition = useRef({ x: 0, y: 0 });
  const cursorTarget = useRef({ x: 0, y: 0 });
  const [activeChip, setActiveChip] = useState("All");
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  useGSAP(() => {
    const words = titleRef.current?.querySelectorAll("[data-word]");
    gsap.fromTo(words, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.75, ease: "power3.out" });
    gsap.fromTo(subtitleRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, delay: 0.6, duration: 0.65, ease: "power2.out" });
    gsap.fromTo(sectionRef.current, { y: 40, opacity: 0 }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 78%" }
    });
    return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }, []);

  useEffect(() => {
    const onMove = (event) => {
      cursorTarget.current = { x: event.clientX, y: event.clientY };
    };
    const animate = () => {
      cursorPosition.current.x += (cursorTarget.current.x - cursorPosition.current.x) * 0.16;
      cursorPosition.current.y += (cursorTarget.current.y - cursorPosition.current.y) * 0.16;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPosition.current.x - 12}px, ${cursorPosition.current.y - 12}px, 0)`;
      }
      requestAnimationFrame(animate);
    };
    const onOver = (event) => {
      if (event.target.closest("a,button,input,label,.tilt-hover")) cursorRef.current?.classList.add("is-active");
    };
    const onOut = (event) => {
      if (event.target.closest("a,button,input,label,.tilt-hover")) cursorRef.current?.classList.remove("is-active");
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    const frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setShowStats(true);
    }, { threshold: 0.4 });
    const target = document.getElementById("trust-bar");
    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const loadProducts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`https://dummyjson.com/products?limit=20&skip=${skip}`);
      const nextProducts = (data.products || [])
        .filter((product) => !foodCategories.has(product.category))
        .map(normalizeProduct);
      setProducts((current) => uniqueById([...current, ...nextProducts]));
      setSkip((value) => value + 20);
      setHasMore(skip + 20 < data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadProducts();
    }, { rootMargin: "420px" });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [skip, loading, hasMore]);

  const filteredProducts = useMemo(() => {
    if (activeChip === "All") return products;
    const allowed = categoryAliases[activeChip] || [];
    return products.filter((product) => allowed.includes(product.category));
  }, [activeChip, products]);

  return (
    <main className="relative overflow-hidden bg-[#0A0A0A] text-[#F5F0E8] selection:bg-[#C9A84C]/30">
      <div ref={cursorRef} className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-6 w-6 rounded-full border border-[#C9A84C] mix-blend-difference transition-[width,height,background] duration-200 md:block" />

      <section id="home" className="relative grid min-h-[calc(100vh-64px)] place-items-center px-4 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(127,119,221,0.20),transparent_32%),radial-gradient(circle_at_80%_35%,rgba(201,168,76,0.16),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.32em] text-[#C9A84C]">Zivvo curated commerce</p>
            <h1 ref={titleRef} className="max-w-4xl text-5xl font-black leading-none md:text-7xl">
              {"Find What Defines You".split(" ").map((word) => (
                <span key={word} className="mr-3 inline-block overflow-hidden md:mr-5">
                  <span data-word className="inline-block opacity-0">{word}</span>
                </span>
              ))}
            </h1>
            <p ref={subtitleRef} className="mt-6 max-w-2xl text-lg leading-8 text-[#888780] opacity-0">
              Shop expressive products with fast search, visual discovery, animated carts, and a premium black-gold interface built for modern buyers.
            </p>
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.9 } } }} className="mt-8 flex flex-wrap gap-3">
              {["Start Shopping", "Explore Categories"].map((label, index) => (
                <motion.a
                  key={label}
                  href={index === 0 ? "#products" : "#categories"}
                  variants={{ hidden: { y: 26, opacity: 0 }, show: { y: 0, opacity: 1 } }}
                  className={index === 0 ? "rounded-full bg-[#C9A84C] px-6 py-3 font-black text-black" : "rounded-full border border-white/10 px-6 py-3 font-black text-[#F5F0E8]"}
                >
                  {label}
                </motion.a>
              ))}
            </motion.div>
          </div>

          <div className="relative min-h-[470px]">
            {floatingProducts.map((product, index) => (
              <Tilt key={product.name} options={{ max: 18, scale: 1.04, speed: 450 }} className={`tilt-hover absolute ${index === 0 ? "left-0 top-8" : index === 1 ? "right-0 top-28" : "left-20 bottom-4"} w-56`}>
                <article className="float-loop overflow-hidden rounded-lg border border-white/10 bg-[#141414] shadow-2xl shadow-black/40" style={{ animationDelay: `${index * -1.2}s` }}>
                  <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-[#7F77DD]">{product.tag}</p>
                    <h2 className="mt-1 font-black">{product.name}</h2>
                  </div>
                </article>
              </Tilt>
            ))}
          </div>
        </div>
      </section>

      <section id="trust-bar" className="border-y border-white/5 bg-[#141414]/70 px-4 py-8">
        <div className="mx-auto grid max-w-7xl gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
          <Stat active={showStats} end={50} suffix="K+" label="Customers" />
          <Stat active={showStats} end={2} suffix="K+" label="Products" />
          <Stat active={showStats} end={4.9} suffix="★" label="Rating" decimals={1} />
          <div className="rounded-lg border border-white/5 p-5"><p className="text-3xl font-black text-[#C9A84C]">Free</p><p className="mt-1 text-[#888780]">Shipping</p></div>
        </div>
      </section>

      <section ref={sectionRef} id="categories" className="px-4 py-16 opacity-0">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C9A84C]">Categories</p>
              <h2 className="mt-2 text-4xl font-black md:text-5xl">Browse the edit</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveChip(chip)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition ${activeChip === chip ? "border-[#C9A84C] bg-[#C9A84C] text-black" : "border-white/10 text-[#F5F0E8] hover:border-[#C9A84C]"}`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <motion.div id="products" layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
          <div ref={sentinelRef} className="grid min-h-24 place-items-center text-[#888780]">
            {loading ? "Loading more products..." : hasMore ? "Scroll for more" : "You reached the end"}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <a href="#products" className="group inline-block text-4xl font-black md:text-6xl">
            Start Shopping Today
            <span className="mx-auto mt-3 block h-1 w-0 bg-[#C9A84C] transition-all duration-500 group-hover:w-full" />
          </a>
          <motion.form initial={{ x: -36, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-lg border border-white/10 bg-[#141414] p-2 sm:flex-row">
            <input type="email" placeholder="you@example.com" className="min-h-12 flex-1 bg-transparent px-4 text-[#F5F0E8] outline-none placeholder:text-[#888780]" />
            <button type="button" className="rounded-md bg-[#C9A84C] px-5 py-3 font-black text-black">Join newsletter</button>
          </motion.form>
        </div>
      </section>

      <style>{`
        .float-loop { animation: zivvoFloat 4.8s ease-in-out infinite alternate; }
        @keyframes zivvoFloat { from { transform: translateY(0); } to { transform: translateY(-22px); } }
        .is-active { width: 44px !important; height: 44px !important; background: rgba(201,168,76,0.18); }
      `}</style>
    </main>
  );
}

function ProductCard({ product, index }) {
  const [loaded, setLoaded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const addToCart = () => {
    confetti({ particleCount: 42, spread: 60, origin: { y: 0.75 } });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.05, duration: 0.45 }}
    >
      <Tilt options={{ max: 12, scale: 1.02, speed: 420 }} className="tilt-hover h-full">
        <div className="h-full overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A]">
            <div className="absolute inset-0 animate-pulse bg-[#1f1f1f]" />
            <img
              src={product.thumbnail}
              alt={product.title}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              className={`relative h-full w-full object-cover transition duration-500 ${loaded ? "scale-100 blur-0" : "scale-105 blur-xl"}`}
            />
            <motion.button
              whileTap={{ scale: 0.78 }}
              type="button"
              onClick={() => setWishlisted((value) => !value)}
              className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur"
              aria-label="Toggle wishlist"
            >
              <motion.span animate={{ scale: wishlisted ? [1, 1.25, 1] : 1 }}>
                <Heart className="h-5 w-5" fill={wishlisted ? "#C9A84C" : "none"} stroke={wishlisted ? "#C9A84C" : "currentColor"} />
              </motion.span>
            </motion.button>
          </div>
          <div className="p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[#888780]">{product.category}</p>
            <h3 className="mt-1 line-clamp-2 font-black text-[#F5F0E8]">{product.title}</h3>
            <div className="mt-4 flex items-center justify-between">
              <p className="font-black text-[#C9A84C]">${product.price}</p>
              <motion.button whileTap={{ scale: 0.82 }} type="button" onClick={addToCart} className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-3 py-2 text-sm font-black text-black">
                <ShoppingBag className="h-4 w-4" /> Add
              </motion.button>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}

function Stat({ active, end, suffix, label, decimals = 0 }) {
  return (
    <div className="rounded-lg border border-white/5 p-5">
      <p className="text-3xl font-black text-[#C9A84C]">{active ? <CountUp end={end} decimals={decimals} duration={1.5} suffix={suffix} /> : `0${suffix}`}</p>
      <p className="mt-1 text-[#888780]">{label}</p>
    </div>
  );
}

const normalizeProduct = (product) => ({
  id: product.id,
  title: product.title,
  thumbnail: product.thumbnail,
  price: product.price,
  category: product.category
});

const uniqueById = (items) => [...new Map(items.map((item) => [item.id, item])).values()];
