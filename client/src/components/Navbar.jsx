import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, ShoppingBag, Sun, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCartContext } from "../context/CartContext";

const links = [
  { label: "Home", to: "/" },
  { label: "Search", to: "/search" },
  { label: "Profile", to: "/profile" },
  { label: "Cart", to: "/cart" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { count } = useCartContext();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-[#0A0A0A]/80 transition ${scrolled ? "border-b border-white/5 backdrop-blur-md" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="min-h-0 text-xl font-black tracking-widest text-[#C9A84C]">ZIVVO</Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className="group relative min-h-0 py-2 text-sm font-bold text-[#F5F0E8]">
              {link.label}
              {link.label === "Cart" && count > 0 && <CartBadge count={count} />}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-[#C9A84C] transition group-hover:scale-x-100 group-[.active]:scale-x-100" />
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-3 text-sm font-bold text-[#F5F0E8]"
            aria-label="Toggle dark or light mode"
          >
            <span className={`grid h-6 w-6 place-items-center rounded-full transition ${theme === "dark" ? "translate-x-0 bg-[#C9A84C] text-black" : "translate-x-6 bg-[#7F77DD] text-white"}`}>
              {theme === "dark" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            </span>
            <span className="w-9 text-left">{theme === "dark" ? "Dark" : "Light"}</span>
          </button>
        </div>

        <button type="button" onClick={() => setOpen(true)} className="relative grid h-11 w-11 place-items-center text-[#F5F0E8] md:hidden" aria-label="Open menu">
          <Menu />
          {count > 0 && <CartBadge count={count} compact />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.aside initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md md:hidden">
            <motion.nav initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ type: "spring", damping: 24 }} className="flex min-h-screen flex-col bg-[#0A0A0A] p-5">
              <button type="button" onClick={() => setOpen(false)} className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-white/10 text-[#F5F0E8]" aria-label="Close menu">
                <X />
              </button>
              <div className="mt-12 grid gap-3">
                {links.map((link) => (
                  <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-lg border border-white/10 bg-[#141414] px-5 py-5 text-2xl font-black text-[#F5F0E8]">
                    {link.label}
                    {link.label === "Cart" && count > 0 && <span className="text-base text-[#C9A84C]">{count}</span>}
                  </NavLink>
                ))}
              </div>
              <button type="button" onClick={toggleTheme} className="mt-auto inline-flex items-center justify-between rounded-full border border-white/10 bg-[#141414] px-5 py-4 font-black text-[#F5F0E8]">
                Theme <span className="text-[#C9A84C]">{theme === "dark" ? "Dark" : "Light"}</span>
              </button>
            </motion.nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}

function CartBadge({ count, compact = false }) {
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className={`${compact ? "absolute right-0 top-0" : "ml-2 inline-grid"} min-h-5 min-w-5 place-items-center rounded-full bg-[#C9A84C] px-1 text-[10px] font-black text-black`}
    >
      {count}
    </motion.span>
  );
}
