import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ThemeToggle from "./ThemeToggle";
import { logout as logoutAction } from "../store/slices/authSlice";
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
      { label: "Orders", to: "/account/orders" }
    ];
    if (user?.role === "seller" || user?.role === "admin") links.push({ label: "Seller Dashboard", to: "/seller" });
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
      <header className="z-50 border-b border-zinc-800 bg-[#1f1a14]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
          <button className="rounded-md border border-zinc-700 p-2 text-zinc-200 md:hidden"><Icon className="h-4 w-4"><path d="M4 6h16M4 12h16M4 18h16" /></Icon></button>
          <Link to="/" className="text-xl font-black tracking-tight text-[#efe0d3]">Ziv<span className="text-[#ef9f27]">vo</span></Link>

          <div className="mx-auto hidden w-full max-w-xl items-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-2 md:flex focus-within:ring-2 focus-within:ring-[#ef9f27]">
            <button onClick={submitSearch} className="text-zinc-400"><Icon className="h-4 w-4"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon></button>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Search for products"
              className="w-full bg-transparent px-2 text-sm text-[#efe0d3] outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated && <NotificationBell />}
            <NavLink to="/wishlist" className="relative rounded-full border border-zinc-700 p-2 text-zinc-200 hover:text-[#ef9f27]"><Icon className="h-4 w-4"><path d="m12 21-1.4-1.2C5.6 15.4 2 12.1 2 8A5 5 0 0 1 7 3c2 0 3.2.9 5 2.8C13.8 3.9 15 3 17 3a5 5 0 0 1 5 5c0 4.1-3.6 7.4-8.6 11.8L12 21Z" /></Icon>{wishlistCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-[#ef9f27] px-1.5 text-[10px] font-bold text-black">{wishlistCount}</span>}</NavLink>
            <NavLink to="/cart" className="relative rounded-full border border-zinc-700 p-2 text-zinc-200 hover:text-[#ef9f27]"><Icon className="h-4 w-4"><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h3l2.5 12h11L21 6H7" /></Icon>{cartCount > 0 && <span className={`absolute -right-1 -top-1 rounded-full bg-[#ef9f27] px-1.5 text-[10px] font-bold text-black ${cartPulse ? "animate-bounce" : ""}`}>{cartCount}</span>}</NavLink>

            <div className="relative">
              <button onClick={() => setOpen((o) => !o)} className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-sm font-bold text-[#efe0d3]">
                {user?.avatar ? <img src={user.avatar} alt="avatar" className="h-9 w-9 rounded-full object-cover" /> : (user?.name?.[0] || "U").toUpperCase()}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg border border-zinc-700 bg-[#1f1a14] p-2 shadow-xl">
                  {isAuthenticated ? (
                    <>
                      {accountLinks.map((l) => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded px-3 py-2 text-sm hover:bg-zinc-800">{l.label}</Link>)}
                      <button onClick={handleLogout} className="mt-1 w-full rounded px-3 py-2 text-left text-sm text-red-300 hover:bg-zinc-800">Logout</button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setOpen(false)} className="block rounded px-3 py-2 text-sm hover:bg-zinc-800">Login</Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-[#1f1a14]/95 px-5 py-2 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between text-zinc-200">
          <NavLink to="/" className="p-2"><Icon className="h-5 w-5"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></Icon></NavLink>
          <button onClick={() => navigate(`/search${search ? `?q=${encodeURIComponent(search)}` : ""}`)} className="p-2"><Icon className="h-5 w-5"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon></button>
          <NavLink to="/cart" className="relative p-2"><Icon className="h-5 w-5"><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M2 3h3l2.5 12h11L21 6H7" /></Icon>{cartCount > 0 && <span className="absolute -right-1 top-0 rounded-full bg-[#ef9f27] px-1.5 text-[10px] font-bold text-black">{cartCount}</span>}</NavLink>
          <NavLink to="/account" className="p-2"><Icon className="h-5 w-5"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.8-3.5 5-5 8-5s6.2 1.5 8 5" /></Icon></NavLink>
        </div>
      </nav>
    </>
  );
}
