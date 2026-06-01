import { Link, NavLink, useLocation } from "react-router-dom";
import { Heart, Home, LogIn, Menu, PackageSearch, Search, ShoppingBag, User } from "lucide-react";
import { useCartContext } from "../context/CartContext";

const desktopLinks = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/category/electronics" },
  { label: "Search", to: "/search" },
  { label: "Orders", to: "/account/orders" },
  { label: "Profile", to: "/profile" }
];

const mobileLinks = [
  { label: "Home", to: "/", icon: Home },
  { label: "Search", to: "/search", icon: Search },
  { label: "Cart", to: "/cart", icon: ShoppingBag },
  { label: "Orders", to: "/account/orders", icon: PackageSearch },
  { label: "Profile", to: "/profile", icon: User }
];

export default function Navbar() {
  const { count } = useCartContext();
  const location = useLocation();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-glass-surface/70 backdrop-blur-3xl shadow-lg shadow-neon-cyan/10">
        <div className="cosmic-container flex h-20 items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <button type="button" className="grid h-11 w-11 place-items-center rounded-xl text-primary hover:bg-white/5 lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="cosmic-title gradient-text text-4xl tracking-wide md:text-5xl" aria-label="Zivvo home">
              ZIVVO
            </Link>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {desktopLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-[0.12em] transition ${
                    isActive ? "bg-white/10 text-neon-cyan shadow-cyan" : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="hidden h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-primary transition hover:text-neon-cyan md:grid" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </Link>
            <Link to="/login" className="hidden h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-bold uppercase tracking-[0.12em] text-on-surface-variant transition hover:text-neon-cyan md:inline-flex" aria-label="Login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
            <Link to="/cart" className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-neon-cyan transition hover:shadow-cyan" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-electric-violet px-1 text-[10px] font-black text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex h-20 items-center justify-around rounded-t-xl border-t border-white/10 bg-glass-surface/85 px-2 pb-1 shadow-[0_-8px_30px_rgba(6,182,212,0.12)] backdrop-blur-2xl lg:hidden">
        {mobileLinks.map((link) => {
          const Icon = link.icon;
          const active = link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
          return (
            <Link key={link.to} to={link.to} className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-bold transition ${active ? "text-neon-cyan" : "text-outline-variant"}`}>
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
              {link.label === "Cart" && count > 0 && (
                <span className="absolute right-[26%] top-1 grid h-4 min-w-4 place-items-center rounded-full bg-electric-violet px-1 text-[9px] text-white">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
