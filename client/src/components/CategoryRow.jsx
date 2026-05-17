import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function CategoryRow({ categories = [] }) {
  const [active, setActive] = useState(categories[0]?.slug || "");

  return (
    <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2">
      {categories.map((category) => {
        const isActive = active === category.slug;

        return (
          <motion.div key={category.slug} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="relative shrink-0">
            {isActive && (
              <motion.span
                layoutId="activeCat"
                className="absolute inset-0 rounded-2xl border-2 border-accent"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            <Link
              to={`/category/${category.slug}`}
              onClick={() => setActive(category.slug)}
              className="group relative z-10 flex items-center gap-2 overflow-hidden rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold text-ink transition dark:border-white/10 dark:bg-dark-card dark:text-zivvo-text-base"
            >
              <span className="absolute inset-y-0 left-0 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              <span className="relative text-lg">{category.icon}</span>
              <span className="relative whitespace-nowrap transition group-hover:text-white">{category.name}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
