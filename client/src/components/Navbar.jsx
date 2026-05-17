import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../store/uiSlice";
import { selectWishlistCount } from "../store/wishlistSlice";

function Icon({ children, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );
}

function DarkModeToggle() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.ui.darkMode);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleDarkMode())}
      aria-label="Toggle dark mode"
      className="flex h-6 w-11 items-center rounded-full bg-gray-200 p-1 transition dark:bg-accent"
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 520, damping: 32 }}
        className={`flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] shadow ${darkMode ? "ml-5" : "ml-0"}`}
      >
        {darkMode ? "☾" : "☀"}
      </motion.span>
    </button>
  );
}

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/search" },
  { label: "Deals", to: "/search?sort=deals" },
  { label: "New In", to: "/search?sort=new" },
  { label: "Sellers", to: "/seller" }
];

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const cartCount = useSelector((state) => state.cart.itemCount || 0);
  const wishlistCount = useSelector(selectWishlistCount);

  return (
    <header className="sticky top-0 z-50 border-b border-black/8 bg-white/80 backdrop-blur-md transition-all duration-300 dark:border-night-border dark:bg-night-bg/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="font-display text-2xl font-black text-accent">
          Zivvo
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className="text-sm font-semibold text-brand-inkMid transition-colors hover:text-accent dark:text-brand-inkFaint">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <DarkModeToggle />
          <button type="button" onClick={() => navigate("/search")} className="rounded-full border border-black/10 p-2 text-brand-ink transition hover:bg-accent hover:text-white dark:border-night-border dark:text-brand-inkFaint">
            <Icon className="h-4 w-4"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
          </button>
          <Link to="/wishlist" className="relative rounded-full border border-black/10 p-2 text-brand-ink transition hover:bg-accent hover:text-white dark:border-night-border dark:text-brand-inkFaint">
            <Icon className="h-4 w-4"><path d="m12 21-1.4-1.2C5.6 15.4 2 12.1 2 8A5 5 0 0 1 7 3c2 0 3.2.9 5 2.8C13.8 3.9 15 3 17 3a5 5 0 0 1 5 5c0 4.1-3.6 7.4-8.6 11.8L12 21Z" /></Icon>
            {wishlistCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="relative flex items-center gap-2 rounded-2xl bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-dark">
            <Icon className="h-4 w-4"><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h3l2.5 12h11L21 6H7" /></Icon>
            Cart
            {cartCount > 0 && <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-xs font-black text-accent">{cartCount}</span>}
          </Link>
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full border border-black/10 p-2 text-brand-ink dark:border-night-border dark:text-white md:hidden">
          <Icon className="h-5 w-5"><path d="M4 6h16M4 12h16M4 18h16" /></Icon>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="border-t border-black/8 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-night-border dark:bg-night-bg/95 md:hidden"
          >
            <div className="flex items-center justify-between pb-3">
              <DarkModeToggle />
              <div className="flex gap-2">
                <Link to="/wishlist" onClick={() => setOpen(false)} className="rounded-full border border-black/10 p-2 dark:border-night-border">
                  <Icon className="h-4 w-4"><path d="m12 21-1.4-1.2C5.6 15.4 2 12.1 2 8A5 5 0 0 1 7 3c2 0 3.2.9 5 2.8C13.8 3.9 15 3 17 3a5 5 0 0 1 5 5c0 4.1-3.6 7.4-8.6 11.8L12 21Z" /></Icon>
                </Link>
                <Link to="/cart" onClick={() => setOpen(false)} className="rounded-2xl bg-accent px-4 py-2 text-sm font-bold text-white">Cart {cartCount || ""}</Link>
              </div>
            </div>
            <div className="grid gap-2">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm font-semibold text-brand-inkMid transition hover:bg-accent-light hover:text-accent dark:text-brand-inkFaint dark:hover:bg-night-muted">
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
