import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectWishlistCount } from "../store/wishlistSlice";
import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { label: "Shop", to: "/search" },
  { label: "Collections", to: "/category/fashion" },
  { label: "Sellers", to: "/seller" },
  { label: "About", to: "/#about" }
];

function Icon({ type }) {
  const common = { className: "h-5 w-5", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24" };
  if (type === "search") return <svg {...common}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
  if (type === "heart") return <svg {...common}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" /></svg>;
  if (type === "bag") return <svg {...common}><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8a3 3 0 0 1 6 0" /></svg>;
  if (type === "sun") return <svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>;
  return <svg {...common}><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" /></svg>;
}

function NavIconButton({ children, to, onClick, count, label }) {
  const Comp = to ? Link : "button";
  return (
    <Comp to={to} onClick={onClick} aria-label={label} className="relative grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] text-[var(--cream)] transition hover:border-[var(--violet2)] hover:text-[var(--violet2)]">
      {children}
      {count > 0 && <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-[var(--violet)] px-1 text-[10px] font-bold text-white">{count}</span>}
    </Comp>
  );
}

export function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const wishlistCount = useSelector(selectWishlistCount);
  const cartCount = useSelector((state) => state.cart.itemCount || 0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (to) => (to === "/#about" ? location.hash === "#about" : location.pathname === to || location.pathname.startsWith(`${to}/`));

  return (
    <motion.header
      ref={navRef}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full"
      style={{
        height: 60,
        background: scrolled ? "rgba(5,6,15,0.96)" : "rgba(5,6,15,0.72)",
        backdropFilter: scrolled ? "blur(24px)" : "blur(16px)",
        borderBottom: `0.5px solid ${scrolled ? "rgba(124,92,252,0.28)" : "rgba(124,92,252,0.12)"}`,
        transition: "all 0.35s ease"
      }}
    >
      <div className="flex h-[60px] w-full items-center justify-between px-[clamp(16px,5vw,72px)]">
        <Link to="/" className="z-nav-logo text-[22px]">ZIVVO</Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={`z-nav-link ${isActive(link.to) ? "is-active" : ""}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <NavIconButton label="Search" onClick={() => navigate("/search")}><Icon type="search" /></NavIconButton>
          <NavIconButton label="Wishlist" to="/wishlist" count={wishlistCount}><Icon type="heart" /></NavIconButton>
          <NavIconButton label="Cart" to="/cart" count={cartCount}><Icon type="bag" /></NavIconButton>
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileTap={{ scale: 0.88, rotate: 20 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] text-[var(--cream)]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Icon type="sun" /> : <Icon type="moon" />}
          </motion.button>
          <Link to="/search" className="z-nav-cta">Start Shopping</Link>
        </div>

        <motion.button type="button" className="relative h-11 w-11 md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Open menu">
          <motion.span animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="absolute left-2 right-2 top-3 h-0.5 bg-[var(--cream)]" />
          <motion.span animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} className="absolute left-2 right-2 top-5 h-0.5 bg-[var(--cream)]" />
          <motion.span animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="absolute left-2 right-2 top-7 h-0.5 bg-[var(--cream)]" />
        </motion.button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0, transition: { staggerChildren: 0.06 } }}
            exit={{ opacity: 0, y: -18 }}
            className="border-t border-[var(--border)] bg-[rgba(5,6,15,0.98)] px-5 py-5 md:hidden"
          >
            {navLinks.map((link) => (
              <motion.div key={link.to} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <NavLink to={link.to} onClick={() => setMenuOpen(false)} className="block border-b border-[rgba(124,92,252,0.1)] py-3.5 text-base text-[var(--cream)]">
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
            <div className="mt-5 grid grid-cols-4 gap-2">
              <NavIconButton label="Search" onClick={() => { setMenuOpen(false); navigate("/search"); }}><Icon type="search" /></NavIconButton>
              <NavIconButton label="Wishlist" to="/wishlist" count={wishlistCount}><Icon type="heart" /></NavIconButton>
              <NavIconButton label="Cart" to="/cart" count={cartCount}><Icon type="bag" /></NavIconButton>
              <motion.button type="button" onClick={toggleTheme} whileTap={{ scale: 0.88, rotate: 20 }} className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] text-[var(--cream)]">
                {theme === "dark" ? <Icon type="sun" /> : <Icon type="moon" />}
              </motion.button>
            </div>
            <Link to="/search" onClick={() => setMenuOpen(false)} className="z-nav-cta mt-5 flex w-full justify-center">Start Shopping</Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;
