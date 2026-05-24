import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lenis from "lenis";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { revealOnScroll, splitWordsReveal } from "../animations/gsap";
import { fadeUp, stagger } from "../animations/variants";

const heroCards = [
  ["Beauty", "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"],
  ["Fragrance", "https://cdn.dummyjson.com/product-images/fragrances/dior-j'adore/thumbnail.webp"],
  ["Fashion", "https://cdn.dummyjson.com/product-images/mens-shirts/man-plaid-shirt/thumbnail.webp"],
  ["Tech", "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/thumbnail.webp"]
];

export default function LandingPage() {
  const titleRef = useRef(null);

  useEffect(() => {
    const animation = splitWordsReveal(titleRef.current);
    revealOnScroll(".scroll-reveal");
    const lenis = new Lenis({ smoothWheel: true, lerp: 0.08 });
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      animation?.kill();
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="overflow-hidden bg-[var(--bg)] text-[var(--cream)]">
      <section className="relative flex min-h-[calc(100vh-64px)] items-center px-4 py-16 md:px-8">
        <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
        <FloatingCards />
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.35em] text-[#C9A84C]">Recruiter-ready MERN commerce</p>
          <h1 ref={titleRef} className="max-w-5xl text-5xl font-black leading-none md:text-8xl">Zivvo makes premium shopping feel fast, visual, and alive</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">A full-stack e-commerce app with Firebase auth, DummyJSON catalog discovery, image search, Razorpay checkout, Cloudinary avatars, and animated order tracking.</p>
          <motion.div variants={stagger} initial="hidden" animate="visible" className="mt-8 flex flex-wrap gap-3">
            <motion.div variants={fadeUp}><Link to="/home" className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-6 py-3 font-bold text-black">Shop feed <ArrowRight className="h-4 w-4" /></Link></motion.div>
            <motion.div variants={fadeUp}><Link to="/search" className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-6 py-3 font-bold">Search visually</Link></motion.div>
          </motion.div>
        </div>
      </section>

      <section className="scroll-reveal mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="text-3xl font-black md:text-5xl">Featured Categories</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {heroCards.map(([label, image]) => (
            <Link key={label} to={`/search?q=${label}`} className="zivvo-card overflow-hidden rounded-lg">
              <img src={image} alt={label} className="h-48 w-full object-cover" />
              <div className="p-4 text-lg font-bold">{label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="scroll-reveal py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-3xl font-black md:text-5xl">Trending Products</h2>
        </div>
        <div className="mt-8 flex gap-4 overflow-x-auto px-4 pb-4 md:px-8">
          {heroCards.concat(heroCards).map(([label, image], index) => (
            <Link key={`${label}-${index}`} to="/home" className="zivvo-card min-w-72 overflow-hidden rounded-lg">
              <img src={image} alt="" className="h-44 w-full object-cover" />
              <div className="p-4"><p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Trending</p><p className="mt-1 font-bold">{label} Drop</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="scroll-reveal mx-auto grid max-w-7xl gap-4 px-4 py-16 md:grid-cols-3 md:px-8">
        {[[ShieldCheck, "JWT + Firebase Auth"], [Truck, "Animated Tracking"], [Sparkles, "Image Search Ready"]].map(([Icon, text]) => (
          <div key={text} className="zivvo-card rounded-lg p-6"><Icon className="h-8 w-8 text-[#C9A84C]" /><p className="mt-4 text-xl font-bold">{text}</p></div>
        ))}
      </section>

      <section className="scroll-reveal mx-auto max-w-5xl px-4 py-20 text-center md:px-8">
        <h2 className="text-4xl font-black md:text-6xl">Join the next Zivvo drop</h2>
        <form className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg2)] p-2 sm:flex-row">
          <input type="email" placeholder="you@example.com" className="min-h-12 flex-1 bg-transparent px-4 outline-none" />
          <button type="button" className="rounded-md bg-[#C9A84C] px-5 py-3 font-bold text-black">Notify me</button>
        </form>
      </section>
    </main>
  );
}

function FloatingCards() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden [perspective:1000px] lg:block">
      {heroCards.map(([label, image], index) => (
        <div
          key={label}
          className="absolute w-44 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg2)] shadow-2xl"
          style={{
            left: `${58 + (index % 2) * 22}%`,
            top: `${14 + index * 17}%`,
            transform: `rotateY(${-18 + index * 8}deg) rotateX(${6 - index * 2}deg) translateZ(${index * 18}px)`,
            animation: `cardFloat ${5 + index}s ease-in-out ${index * -0.7}s infinite alternate`
          }}
        >
          <img src={image} alt="" className="h-32 w-full object-cover" />
          <p className="p-3 text-sm font-bold">{label}</p>
        </div>
      ))}
      <style>{`@keyframes cardFloat { from { translate: 0 0; } to { translate: 0 -18px; } }`}</style>
    </div>
  );
}
