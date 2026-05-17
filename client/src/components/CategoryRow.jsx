import { motion } from "framer-motion";

export const defaultCategories = [
  { icon: "\u{1F6D2}", label: "All" },
  { icon: "\u{1F4F1}", label: "Electronics" },
  { icon: "\u{1F455}", label: "Fashion" },
  { icon: "\u{1F6CB}\uFE0F", label: "Home" },
  { icon: "\u{1F484}", label: "Beauty" },
  { icon: "\u{1F4DA}", label: "Books" },
  { icon: "\u{1F3CB}\uFE0F", label: "Sports" },
  { icon: "\u{1F9F8}", label: "Toys" },
  { icon: "\u{1F373}", label: "Kitchen" },
  { icon: "\u{1FAB4}", label: "Garden" }
];

export default function CategoryRow({ categories = defaultCategories, active = "All", onSelect = () => {} }) {
  return (
    <section>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-accent">Categories</p>
          <h2 className="font-display text-3xl font-black text-brand-ink dark:text-white">Shop by Category</h2>
        </div>
        <p className="text-sm text-brand-inkMid dark:text-brand-inkFaint">Tap a category to refresh the product grid.</p>
      </div>

      <div className="scrollbar-none mt-6 flex gap-3 overflow-x-auto pb-3">
        {categories.map((category) => {
          const isActive = active === category.label;

          return (
            <motion.button
              key={category.label}
              type="button"
              onClick={() => onSelect(category.label)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={`relative min-w-[112px] cursor-pointer rounded-2xl border-2 p-3 text-center shadow-sm transition ${
                isActive
                  ? "border-[#e8730a] bg-[#e8730a] text-white shadow-lg shadow-[#e8730a]/20"
                  : "border-transparent bg-brand-muted text-brand-ink hover:border-accent/30 dark:bg-night-muted dark:text-white"
              }`}
            >
              {isActive && <motion.span layoutId="activeCatBorder" className="absolute inset-0 rounded-2xl border-2 border-white/40" />}
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
