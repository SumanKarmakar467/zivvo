import { Link, useLocation } from "react-router-dom";
import { HomeIcon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const links = [{ to: "/", icon: HomeIcon }, { to: "/search", icon: MagnifyingGlassIcon }, { to: "/cart", icon: ShoppingCartIcon }, { to: "/account", icon: UserIcon }];
  return <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-shoppop-surface p-2 md:hidden"> <div className="mx-auto flex max-w-md justify-around">{links.map(({ to, icon: Icon }) => <Link key={to} to={to} className={pathname === to ? "text-shoppop-amber-400" : "text-shoppop-text-secondary"}><Icon className="h-6 w-6" /></Link>)}</div></nav>;
}
