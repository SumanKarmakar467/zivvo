import { Link } from "react-router-dom";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Home", to: "/" },
      { label: "Search", to: "/search" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Cart", to: "/cart" }
    ]
  },
  {
    title: "Sellers",
    links: [
      { label: "Dashboard", to: "/seller" },
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
      { label: "Addresses", to: "/account/addresses" },
      { label: "Support", to: "/notifications" }
    ]
  }
];

const socials = ["Instagram", "Twitter", "Facebook", "YouTube"];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-bg-muted pb-24 pt-12 text-ink dark:border-white/10 dark:bg-dark-card dark:text-zivvo-text-base md:pb-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-4 md:px-6">
        <div>
          <Link to="/" className="font-display text-2xl font-extrabold text-ink dark:text-white">
            Ziv<span className="text-accent">vo</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-ink-muted dark:text-zivvo-text-muted">
            Premium everyday commerce for modern Indian shoppers, independent sellers, and faster repeat buying.
          </p>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <p className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-ink dark:text-white">{column.title}</p>
            <div className="mt-4 space-y-2 text-sm text-ink-muted dark:text-zivvo-text-muted">
              {column.links.map((link) => (
                <Link key={link.to} to={link.to} className="block transition hover:text-accent">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-4 border-t border-ink/10 px-4 pt-6 text-sm text-ink-muted dark:border-white/10 dark:text-zivvo-text-muted md:flex-row md:items-center md:justify-between md:px-6">
        <p>Copyright {new Date().getFullYear()} Zivvo. All rights reserved.</p>
        <div className="flex flex-wrap gap-2">
          {socials.map((social) => (
            <a
              key={social}
              href="/"
              aria-label={social}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-xs font-extrabold transition hover:border-accent hover:bg-accent hover:text-white dark:border-white/10"
            >
              {social[0]}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
