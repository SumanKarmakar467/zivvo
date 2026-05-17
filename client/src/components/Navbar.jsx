import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { logout as logoutAction } from "../store/slices/authSlice";
import { toggleDarkMode } from "../store/slices/uiSlice";
import { useLogoutApiMutation } from "../services/authApi";
import { selectWishlistCount } from "../features/wishlist/wishlistSlice";
import NotificationBell from "./NotificationBell";

function Icon({ children, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutApiMutation();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);

  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const darkMode = useSelector((s) => s.ui.darkMode);
  const wishlistCount = useSelector(selectWishlistCount);
  const cartCount = useSelector((s) => s.cart.itemCount || 0);

  useEffect(() => {
    if (!cartCount) return;
    setCartPulse(true);
    const t = setTimeout(() => setCartPulse(false), 450);
    return () => clearTimeout(t);
  }, [cartCount]);

  const submitSearch = () => {
    const q = search.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  const accountLinks = useMemo(() => {
    const links = [
      { label: "Profile", to: "/account" },
      { label: "Orders", to: "/account/orders" },
      { label: "Addresses", to: "/account/addresses" }
    ];
    if (user?.role === "seller" || user?.role === "admin") links.push({ label: "Seller Dashboard", to: "/seller" }, { label: "Verification", to: "/seller/verification" });
    if (user?.role === "admin") links.push({ label: "Admin Panel", to: "/admin" });
    return links;
  }, [user]);

  const handleLogout = async () => {
    try { await logoutApi().unwrap(); } catch {}
    dispatch(logoutAction());
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-md transition-colors dark:border-white/10 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
          <button className="rounded-md border border-ink/10 p-2 text-ink transition hover:border-accent hover:text-accent dark:border-white/10 dark:text-zivvo-text-base md:hidden"><Icon className="h-4 w-4"><path d="M4 6h16M4 12h16M4 18h16" /></Icon></button>
          <Link to="/" className="font-display text-2xl font-extrabold tracking-tight text-ink transition hover:text-accent dark:text-zivvo-text-base">Ziv<span className="text-accent">vo</span></Link>

          <div className="mx-auto hidden w-full max-w-xl items-center rounded-full border border-ink/10 bg-bg-muted/80 px-3 py-2 transition focus-within:ring-2 focus-within:ring-accent dark:border-white/10 dark:bg-dark-muted md:flex">
            <button onClick={submitSearch} className="text-ink-muted transition hover:text-accent dark:text-zivvo-text-muted"><Icon className="h-4 w-4"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon></button>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Search for products"
              className="w-full bg-transparent px-2 text-sm text-ink outline-none placeholder:text-ink-faint dark:text-zivvo-text-base"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch(toggleDarkMode())}
              aria-label="Toggle dark mode"
              className="relative flex h-9 w-[68px] items-center rounded-full border border-ink/10 bg-bg-muted p-1 text-xs font-bold text-ink transition dark:border-white/10 dark:bg-dark-muted dark:text-zivvo-text-base"
            >
              <span className="z-10 flex flex-1 justify-center">☀</span>
              <span className="z-10 flex flex-1 justify-center">☾</span>
              <motion.span
                layoutId="theme-toggle-thumb"
                className="absolute top-1 h-7 w-7 rounded-full bg-accent shadow-sm"
                animate={{ x: darkMode ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
              />
            </button>
            {isAuthenticated && <NotificationBell />}
            <NavLink to="/wishlist" className="relative rounded-full border border-ink/10 p-2 text-ink transition hover:border-accent hover:text-accent dark:border-white/10 dark:text-zivvo-text-base"><Icon className="h-4 w-4"><path d="m12 21-1.4-1.2C5.6 15.4 2 12.1 2 8A5 5 0 0 1 7 3c2 0 3.2.9 5 2.8C13.8 3.9 15 3 17 3a5 5 0 0 1 5 5c0 4.1-3.6 7.4-8.6 11.8L12 21Z" /></Icon>{wishlistCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">{wishlistCount}</span>}</NavLink>
            <NavLink to="/cart" className="relative rounded-full border border-ink/10 p-2 text-ink transition hover:border-accent hover:text-accent dark:border-white/10 dark:text-zivvo-text-base"><Icon className="h-4 w-4"><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h3l2.5 12h11L21 6H7" /></Icon>{cartCount > 0 && <span className={`absolute -right-1 -top-1 rounded-full bg-accent px-1.5 text-[10px] font-bold text-white ${cartPulse ? "animate-bounce" : ""}`}>{cartCount}</span>}</NavLink>

            <div className="relative">
              <button onClick={() => setOpen((o) => !o)} className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-bg-muted text-sm font-bold text-ink transition hover:border-accent dark:border-white/10 dark:bg-dark-muted dark:text-zivvo-text-base">
                {user?.avatar ? <img src={user.avatar} alt="avatar" className="h-9 w-9 rounded-full object-cover" /> : (user?.name?.[0] || "U").toUpperCase()}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-ink/10 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-dark-card">
                  {isAuthenticated ? (
                    <>
                      {accountLinks.map((l) => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm transition hover:bg-accent-light hover:text-accent-dark dark:hover:bg-dark-muted dark:hover:text-accent">{l.label}</Link>)}
                      <button onClick={handleLogout} className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/30">Logout</button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2 text-sm transition hover:bg-accent-light hover:text-accent-dark dark:hover:bg-dark-muted">Login</Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink/10 bg-white/90 px-5 py-2 backdrop-blur md:hidden dark:border-white/10 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-md items-center justify-between text-ink dark:text-zivvo-text-base">
          <NavLink to="/" className="p-2 transition hover:text-accent"><Icon className="h-5 w-5"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></Icon></NavLink>
          <button onClick={() => navigate(`/search${search ? `?q=${encodeURIComponent(search)}` : ""}`)} className="p-2 transition hover:text-accent"><Icon className="h-5 w-5"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon></button>
          <NavLink to="/cart" className="relative p-2 transition hover:text-accent"><Icon className="h-5 w-5"><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h3l2.5 12h11L21 6H7" /></Icon>{cartCount > 0 && <span className="absolute -right-1 top-0 rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">{cartCount}</span>}</NavLink>
          <NavLink to="/account" className="p-2 transition hover:text-accent"><Icon className="h-5 w-5"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.8-3.5 5-5 8-5s6.2 1.5 8 5" /></Icon></NavLink>
        </div>
      </nav>
    </>
  );
}
