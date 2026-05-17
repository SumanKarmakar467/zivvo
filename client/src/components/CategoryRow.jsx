import { useState } from "react";
import { motion } from "framer-motion";

const defaultCategories = [
  { icon: "📱", label: "Electronics" },
  { icon: "👕", label: "Fashion" },
  { icon: "🛋️", label: "Home & Living" },
  { icon: "💄", label: "Beauty" },
  { icon: "📚", label: "Books" },
  { icon: "🏋️", label: "Sports" },
  { icon: "🧸", label: "Toys & Kids" },
  { icon: "🍳", label: "Kitchen" },
  { icon: "🌿", label: "Garden" }
];

export default function CategoryRow({ categories = defaultCategories }) {
  const [active, setActive] = useState(categories[0]?.label || "");

  return (
    <section>
      <h2 className="font-display text-2xl font-black text-brand-ink dark:text-white">Shop by Category</h2>
      <div className="scrollbar-none mt-5 flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => {
          const isActive = active === category.label;

          return (
            <motion.button
              key={category.label}
              type="button"
              onClick={() => setActive(category.label)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={`relative min-w-[110px] cursor-pointer rounded-2xl border-2 p-3 text-center transition ${
                isActive
                  ? "border-accent bg-accent text-white"
                  : "border-transparent bg-brand-muted text-brand-ink dark:bg-night-muted dark:text-white"
              }`}
            >
              {isActive && <motion.span layoutId="activeCatBorder" className="absolute inset-0 rounded-2xl border-2 border-accent" />}
              <span className={`relative mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${isActive ? "bg-white/20" : "bg-brand-card dark:bg-night-card"}`}>
                {category.icon}
              </span>
              <span className="relative block text-xs font-bold">{category.label}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
