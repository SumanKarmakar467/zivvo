import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Icon({ children, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {children}
    </svg>
  );
}

export default function Navbar({ cartCount = 0, wishlistCount = 0, onSearch }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
          <Link to="/" className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Zivvo <span className="text-[#ef9f27]">.</span>
          </Link>

          <label className="hidden flex-1 items-center gap-2 rounded-full border border-zinc-300 bg-zinc-50 px-3 py-2 md:flex dark:border-zinc-700 dark:bg-zinc-900">
            <Icon className="h-4 w-4 text-zinc-500"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
            <input
              className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
              placeholder="Search products"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </label>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <NavLink to="/wishlist" className="relative rounded-full border border-zinc-300 p-2 text-zinc-700 hover:text-[#ef9f27] dark:border-zinc-700 dark:text-zinc-200">
              <Icon className="h-[18px] w-[18px]"><path d="m12 21-1.4-1.2C5.6 15.4 2 12.1 2 8A5 5 0 0 1 7 3c2 0 3.2.9 5 2.8C13.8 3.9 15 3 17 3a5 5 0 0 1 5 5c0 4.1-3.6 7.4-8.6 11.8L12 21Z" /></Icon>
              {wishlistCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-[#ef9f27] px-1.5 text-[10px] font-bold text-zinc-950">{wishlistCount}</span>}
            </NavLink>
            <NavLink to="/cart" className="relative rounded-full border border-zinc-300 p-2 text-zinc-700 hover:text-[#ef9f27] dark:border-zinc-700 dark:text-zinc-200">
              <Icon className="h-[18px] w-[18px]"><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h3l2.5 12h11L21 6H7" /></Icon>
              {cartCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-[#ef9f27] px-1.5 text-[10px] font-bold text-zinc-950">{cartCount}</span>}
            </NavLink>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 px-5 py-2 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <NavLink to="/" className="p-2 text-zinc-600 dark:text-zinc-300"><Icon className="h-5 w-5"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></Icon></NavLink>
          <NavLink to="/search" className="p-2 text-zinc-600 dark:text-zinc-300"><Icon className="h-5 w-5"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon></NavLink>
          <NavLink to="/wishlist" className="p-2 text-zinc-600 dark:text-zinc-300"><Icon className="h-5 w-5"><path d="m12 21-1.4-1.2C5.6 15.4 2 12.1 2 8A5 5 0 0 1 7 3c2 0 3.2.9 5 2.8C13.8 3.9 15 3 17 3a5 5 0 0 1 5 5c0 4.1-3.6 7.4-8.6 11.8L12 21Z" /></Icon></NavLink>
          <NavLink to="/cart" className="relative p-2 text-zinc-600 dark:text-zinc-300">
            <Icon className="h-5 w-5"><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h3l2.5 12h11L21 6H7" /></Icon>
            {cartCount > 0 && <span className="absolute -right-1 -top-0 rounded-full bg-[#ef9f27] px-1.5 text-[10px] font-bold text-zinc-950">{cartCount}</span>}
          </NavLink>
          <NavLink to="/profile" className="p-2 text-zinc-600 dark:text-zinc-300"><Icon className="h-5 w-5"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.8-3.5 5-5 8-5s6.2 1.5 8 5" /></Icon></NavLink>
        </div>
      </nav>
    </>
  );
}
