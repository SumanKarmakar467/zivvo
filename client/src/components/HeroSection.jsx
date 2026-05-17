import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const products = [
  {
    name: "Pro Wireless Headphones",
    price: "\u20B94,299",
    oldPrice: "\u20B97,999",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=520&q=85",
    className: "row-span-2"
  },
  {
    name: "Smart Watch Pro",
    price: "\u20B98,499",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=520&q=85"
  },
  {
    name: "Running Sneakers",
    price: "\u20B92,199",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=520&q=85"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 }
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-black/5 bg-[radial-gradient(circle_at_15%_20%,rgba(232,115,10,0.14),transparent_28%),linear-gradient(135deg,#fffaf4,#f8f5f0)] dark:border-night-border dark:bg-[radial-gradient(circle_at_75%_10%,rgba(245,147,50,0.18),transparent_30%),linear-gradient(135deg,#0e0a06,#171009)]">
      <div className="pointer-events-none absolute right-[8%] top-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <motion.div initial="hidden" animate="show" variants={container}>
          <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-muted px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            New Collection 2026
          </motion.div>

          <motion.h1 variants={item} transition={{ delay: 0.1 }} className="mt-6 max-w-xl font-display text-5xl font-black leading-tight tracking-tight text-brand-ink dark:text-white">
            Shop <em className="not-italic text-accent">Smarter</em>, Live Better
          </motion.h1>

          <motion.p variants={item} transition={{ delay: 0.2 }} className="mt-5 max-w-md text-lg leading-relaxed text-brand-inkMid dark:text-zivvo-text-muted">
            Discover premium everyday products, thoughtful seller picks, and fast checkout designed for modern Indian shopping.
          </motion.p>

          <motion.div variants={item} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap gap-3">
            <motion.div whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(232,115,10,0.35)" }} whileTap={{ scale: 0.97 }}>
              <Link to="/search" className="flex items-center gap-2 rounded-xl bg-[#e8730a] px-7 py-3.5 font-semibold text-white shadow-lg shadow-[#e8730a]/25 transition hover:bg-[#c45c00]">
                Shop Now <span aria-hidden="true">-&gt;</span>
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Link to="/search?sort=deals" className="flex rounded-xl border border-black/10 bg-white/70 px-7 py-3.5 font-semibold text-brand-ink transition hover:border-accent hover:text-accent dark:border-night-border dark:bg-white/5 dark:text-white">
                View Deals
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={item} className="mt-8 grid max-w-md grid-cols-3 gap-5 border-t border-black/10 pt-6 dark:border-night-border">
            {[
              ["50K+", "Products"],
              ["2.8K", "Sellers"],
              ["4.9\u2605", "Rating"]
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-2xl font-black text-brand-ink dark:text-white">{value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-brand-inkFaint dark:text-zivvo-text-soft">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative">
          <motion.div
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-dashed border-accent/40"
          />
          <motion.div
            aria-hidden="true"
            animate={{ y: [0, -16, 0], x: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-20 z-10 rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-sm font-bold text-brand-ink shadow-xl backdrop-blur dark:border-night-border dark:bg-night-card/90 dark:text-white"
          >
            Live deals updating
          </motion.div>
          <div className="grid h-[460px] grid-cols-2 gap-4">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                animate={{ y: index === 0 ? [0, -10, 0] : [0, 8, 0] }}
                transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                whileHover={{ y: -10, rotate: index === 0 ? -1 : 1, boxShadow: "0 24px 70px rgba(0,0,0,0.25)" }}
                className={`relative overflow-hidden rounded-[1.7rem] border border-white/40 bg-gradient-to-br from-brand-card to-brand-muted shadow-2xl shadow-black/10 dark:border-white/10 dark:from-night-card dark:to-night-muted ${product.className || ""}`}
              >
                <img src={product.image} alt={product.name} loading={index === 0 ? "eager" : "lazy"} className="h-full w-full object-cover transition duration-700 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-white/10" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-sm font-extrabold drop-shadow">{product.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span>{product.price}</span>
                    {product.oldPrice && <span className="text-white/60 line-through">{product.oldPrice}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
