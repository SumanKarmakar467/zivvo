import { Link } from "react-router-dom";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Shop", to: "/search" },
      { label: "Deals", to: "/search?sort=deals" },
      { label: "New In", to: "/search?sort=new" },
      { label: "Cart", to: "/cart" }
    ]
  },
  {
    title: "Sellers",
    links: [
      { label: "Start Selling", to: "/seller" },
      { label: "Verification", to: "/seller/verification" },
      { label: "Coupons", to: "/seller/coupons" },
      { label: "Returns", to: "/seller/returns" }
    ]
  },
  {
    title: "Help",
    links: [
      { label: "Account", to: "/account" },
      { label: "Orders", to: "/account/orders" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Notifications", to: "/notifications" }
    ]
  }
];

const socials = ["Ig", "X", "Fb", "Yt"];

export default function Footer() {
  return (
    <footer className="border-t border-black/8 bg-brand-card py-10 dark:border-night-border dark:bg-night-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-4">
        <div>
          <Link to="/" className="font-display text-2xl font-black text-accent">Zivvo</Link>
          <p className="mt-3 text-sm leading-6 text-brand-inkFaint">
            Premium ecommerce for modern shoppers and growing sellers across India.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="font-display text-sm font-black uppercase tracking-widest text-brand-ink dark:text-white">{column.title}</h3>
            <div className="mt-4 grid gap-2">
              {column.links.map((link) => (
                <Link key={link.to} to={link.to} className="text-sm text-brand-inkFaint transition-colors hover:text-accent">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-4 border-t border-black/8 px-6 pt-6 text-sm text-brand-inkFaint dark:border-night-border md:flex-row md:items-center md:justify-between">
        <p>Copyright {new Date().getFullYear()} Zivvo. All rights reserved.</p>
        <div className="flex gap-2">
          {socials.map((social) => (
            <a
              key={social}
              href="/"
              aria-label={social}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-xs font-bold transition-all hover:border-accent hover:bg-accent hover:text-white dark:border-night-border"
            >
              {social}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
