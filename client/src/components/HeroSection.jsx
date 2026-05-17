import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const products = [
  {
    name: "Pro Wireless Headphones",
    price: "₹4,299",
    oldPrice: "₹7,999",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    className: "row-span-2"
  },
  {
    name: "Smart Watch Pro",
    price: "₹8,499",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
  },
  {
    name: "Running Sneakers",
    price: "₹2,199",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
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
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
      <motion.div initial="hidden" animate="show" variants={container}>
        <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-muted px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          New Collection 2026
        </motion.div>

        <motion.h1 variants={item} transition={{ delay: 0.1 }} className="mt-6 font-display text-5xl font-black leading-tight tracking-tight text-brand-ink dark:text-white">
          Shop <em className="not-italic text-accent">Smarter</em>, Live Better
        </motion.h1>

        <motion.p variants={item} transition={{ delay: 0.2 }} className="mt-5 max-w-md text-lg leading-relaxed text-brand-inkMid dark:text-brand-inkFaint">
          Discover premium everyday products, thoughtful seller picks, and fast checkout designed for modern Indian shopping.
        </motion.p>

        <motion.div variants={item} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap gap-3">
          <motion.div whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(232,115,10,0.35)" }} whileTap={{ scale: 0.97 }}>
            <Link to="/search" className="flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 font-semibold text-white transition hover:bg-accent-dark">
              Shop Now
              <span>→</span>
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link to="/search?sort=deals" className="flex rounded-xl border border-black/10 px-7 py-3.5 font-semibold text-brand-ink transition hover:border-accent hover:text-accent dark:border-night-border dark:text-white">
              View Deals
            </Link>
          </motion.div>
        </motion.div>

        <motion.div variants={item} className="mt-8 grid max-w-md grid-cols-3 gap-5 border-t border-black/10 pt-6 dark:border-night-border">
          {[
            ["50K+", "Products"],
            ["2.8K", "Sellers"],
            ["4.9★", "Rating"]
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-2xl font-black text-brand-ink dark:text-white">{value}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-brand-inkFaint">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="grid h-[430px] grid-cols-2 gap-3.5">
        {products.map((product, index) => (
          <motion.div
            key={product.name}
            whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-card to-brand-muted dark:from-night-card dark:to-night-muted ${product.className || ""}`}
          >
            <img src={product.image} alt={product.name} loading={index === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm font-bold">{product.name}</p>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span>{product.price}</span>
                {product.oldPrice && <span className="text-white/60 line-through">{product.oldPrice}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
