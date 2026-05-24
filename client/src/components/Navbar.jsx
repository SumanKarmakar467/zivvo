import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Search, ShoppingBag, Sun, User, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCartContext } from "../context/CartContext";

const links = [
  { label: "Home", to: "/home" },
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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 border-b transition ${scrolled ? "border-[var(--border)] bg-[var(--nav-bg-strong)] shadow-xl shadow-black/20 backdrop-blur-xl" : "border-transparent bg-[var(--nav-bg)] backdrop-blur-md"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="min-h-0 text-xl font-black tracking-[0.28em] text-[var(--cream)]">ZIVVO</Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => <NavItem key={link.to} {...link} count={link.label === "Cart" ? count : 0} />)}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <IconLink to="/search" label="Search"><Search className="h-5 w-5" /></IconLink>
          <IconLink to="/profile" label="Profile"><User className="h-5 w-5" /></IconLink>
          <IconLink to="/cart" label="Cart" count={count}><ShoppingBag className="h-5 w-5" /></IconLink>
          <button type="button" onClick={toggleTheme} className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)]">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center md:hidden" aria-label="Open menu">
          <Menu />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.aside initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur md:hidden">
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 24 }} className="ml-auto flex h-screen w-full max-w-sm flex-col bg-[var(--bg)] p-5">
              <button type="button" onClick={() => setOpen(false)} className="ml-auto grid h-11 w-11 place-items-center rounded-full border border-[var(--border)]" aria-label="Close menu">
                <X />
              </button>
              <nav className="mt-10 grid gap-2">
                {links.map((link) => (
                  <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="rounded-lg border border-[var(--border)] px-4 py-4 text-lg font-bold">
                    {link.label}{link.label === "Cart" && count ? ` (${count})` : ""}
                  </NavLink>
                ))}
              </nav>
              <button type="button" onClick={toggleTheme} className="mt-auto rounded-lg border border-[var(--border)] px-4 py-3 text-left font-bold">
                Toggle {theme === "dark" ? "light" : "dark"} mode
              </button>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavItem({ label, to, count }) {
  return (
    <NavLink to={to} className="group relative min-h-0 py-2 text-sm font-bold text-[var(--cream)]">
      {label}{count ? <span className="ml-1 rounded-full bg-[#C9A84C] px-1.5 text-[10px] text-black">{count}</span> : null}
      <span className="absolute inset-x-0 -bottom-1 h-0.5 origin-left scale-x-0 bg-[#C9A84C] transition group-[.active]:scale-x-100 group-hover:scale-x-100" />
    </NavLink>
  );
}

function IconLink({ to, label, children, count = 0 }) {
  return (
    <Link to={to} aria-label={label} className="relative grid h-11 w-11 place-items-center rounded-full border border-[var(--border)]">
      {children}
      {count > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#C9A84C] px-1 text-[10px] font-black text-black">{count}</motion.span>}
    </Link>
  );
}
