import { Link } from "react-router-dom";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Electronics", to: "/category/electronics" },
      { label: "Search", to: "/search" },
      { label: "Cart", to: "/cart" }
    ]
  },
  {
    title: "Account",
    links: [
      { label: "Profile", to: "/profile" },
      { label: "Orders", to: "/account/orders" },
      { label: "Wishlist", to: "/wishlist" }
    ]
  },
  {
    title: "Sellers",
    links: [
      { label: "Dashboard", to: "/seller" },
      { label: "Verification", to: "/seller/verification" },
      { label: "Returns", to: "/seller/returns" }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="relative z-[1] border-t border-white/10 bg-cosmic-black py-12 text-on-surface">
      <div className="cosmic-container grid gap-8 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Link to="/" className="cosmic-title gradient-text text-4xl">ZIVVO</Link>
          <p className="mt-4 max-w-sm text-on-surface-variant">
            Cosmic Noir commerce for premium gear, modern shoppers, and future-facing sellers.
          </p>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-label-caps font-bold uppercase tracking-[0.16em] text-neon-cyan">{column.title}</h3>
              <div className="mt-4 grid gap-2">
                {column.links.map((link) => (
                  <Link key={link.to} to={link.to} className="text-sm text-on-surface-variant transition hover:text-on-surface">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cosmic-container mt-10 border-t border-white/10 pt-6 text-sm text-on-surface-variant">
        Copyright {new Date().getFullYear()} Zivvo. All rights reserved.
      </div>
    </footer>
  );
}
