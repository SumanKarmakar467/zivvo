import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 pb-24 pt-10 dark:border-zinc-800 dark:bg-zinc-950 md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-4 md:px-6">
        <div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100">Zivvo <span className="text-[#ef9f27]">.</span></h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Curated commerce, faster checkout, trusted delivery.</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Shop</p>
          <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/orders">Orders</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Account</p>
          <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Link to="/profile">Profile</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">Cart</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Contact</p>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">support@zivvo.shop</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">+91 90000 00000</p>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-500">© {new Date().getFullYear()} Zivvo. All rights reserved.</p>
    </footer>
  );
}
