import { Link } from "react-router-dom";
import { MagnifyingGlassIcon, HeartIcon, ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "../common/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-shoppop-surface/90 backdrop-blur-lg dark:bg-shoppop-surface/90">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:px-6">
        <Link to="/" className="text-2xl font-extrabold text-shoppop-text-primary">Shop<span className="text-shoppop-amber-400">Pop</span></Link>
        <div className="relative hidden flex-1 md:block">
          <input className="w-full rounded-xl border border-white/10 bg-shoppop-high px-10 py-2 text-sm text-shoppop-text-primary focus:outline-none focus:ring-2 focus:ring-shoppop-amber-400" placeholder="Search products" />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-shoppop-text-muted" />
        </div>
        <div className="flex items-center gap-2 text-shoppop-text-primary">
          <Link to="/account"><HeartIcon className="h-5 w-5" /></Link>
          <Link to="/cart"><ShoppingCartIcon className="h-5 w-5" /></Link>
          <Link to="/account"><UserCircleIcon className="h-6 w-6" /></Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
