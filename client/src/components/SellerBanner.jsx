import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function SellerBanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.15, triggerOnce: true });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55 }}
      className="mx-auto mt-14 max-w-7xl px-4 md:px-6"
    >
      <div className="relative overflow-hidden rounded-3xl bg-bg-muted p-6 dark:bg-dark-card md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-8 md:p-10">
        <span className="pointer-events-none absolute -right-8 -top-16 font-display text-[220px] leading-none text-ink opacity-5 dark:text-white">◆</span>
        <div className="relative">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-accent">For sellers</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-ink dark:text-white md:text-4xl">Grow your store with Zivvo</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted dark:text-zivvo-text-muted">
            Reach buyers across India with trusted payments, smooth storefront tools, and commerce workflows built for repeat selling.
          </p>
        </div>
        <div className="relative mt-6 flex flex-wrap gap-3 md:mt-0">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link to="/seller" className="inline-flex rounded-full bg-accent px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-dark">
              Start Selling
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link to="/seller/verification" className="inline-flex rounded-full border border-ink/15 px-5 py-3 text-sm font-extrabold text-ink transition hover:border-accent hover:text-accent dark:border-white/15 dark:text-white">
              Verify Store
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
