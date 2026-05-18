import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { selectWishlistCount } from "../store/wishlistSlice";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { label: "Shop", to: "/search" },
  { label: "Collections", to: "/category/fashion" },
  { label: "Sellers", to: "/seller" },
  { label: "About", to: "/#about" }
];

function IconButton({ children, label, to }) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="relative grid h-10 w-10 place-items-center rounded-full border border-[rgba(124,92,252,0.26)] text-[var(--cream)] transition hover:border-[var(--cyan)] hover:text-[var(--cyan)]"
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const cartCount = useSelector((state) => state.cart.itemCount || 0);
  const wishlistCount = useSelector(selectWishlistCount);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        navRef.current?.classList.add("scrolled");
      } else {
        navRef.current?.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className="z-navbar sticky top-0 z-50 w-full"
    >
      <div className="flex h-[72px] w-full items-center justify-between px-[clamp(18px,5vw,72px)]">
        <Link to="/" className="z-logo text-2xl">
          ZIVVO
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--cream)]"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(124,92,252,0.28)] text-[var(--cream)] transition hover:border-[var(--cyan)]"
          >
            {theme === "dark" ? "☾" : "☀"}
          </button>
          <IconButton to="/wishlist" label="Wishlist">
            ♡
            {wishlistCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-[var(--rose)] px-1.5 text-[10px] font-bold text-white">{wishlistCount}</span>}
          </IconButton>
          <Link
            to="/cart"
            className="relative rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE] px-5 py-2.5 text-sm font-bold text-white shadow-[0_16px_34px_rgba(124,92,252,0.24)] transition hover:scale-[1.03]"
          >
            Start Shopping
            {cartCount > 0 && <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-[#5B21B6]">{cartCount}</span>}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(124,92,252,0.28)] text-[var(--cream)] md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid gap-2 border-t border-[rgba(124,92,252,0.18)] px-5 py-4 md:hidden"
            style={{ background: "var(--nav-bg-strong)" }}
          >
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-[var(--muted)]">
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center gap-3">
              <button type="button" onClick={toggleTheme} className="rounded-full border border-[rgba(124,92,252,0.28)] px-4 py-2 text-sm text-[var(--cream)]">
                {theme === "dark" ? "Dark" : "Light"}
              </button>
              <Link to="/cart" onClick={() => setOpen(false)} className="rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE] px-4 py-2 text-sm font-bold text-white">
                Start Shopping
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
