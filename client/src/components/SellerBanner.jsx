import { Link } from "react-router-dom";

export default function SellerBanner() {
  return (
    <section className="mx-auto my-12 max-w-6xl px-6">
      <div className="relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-3xl border border-black/8 bg-brand-muted p-8 dark:border-night-border dark:bg-night-muted md:flex-row md:items-center md:p-12">
        <span className="pointer-events-none absolute right-48 top-1/2 -translate-y-1/2 text-[10rem] leading-none text-accent/5">◆</span>
        <div className="relative max-w-xl">
          <h2 className="font-display text-3xl font-black text-brand-ink dark:text-white">Become a Seller on Zivvo</h2>
          <p className="mt-3 text-sm leading-6 text-brand-inkMid dark:text-brand-inkFaint">
            Launch your storefront, manage orders, and grow with buyers who come to Zivvo for trusted everyday shopping.
          </p>
        </div>
        <div className="relative flex flex-wrap gap-3">
          <Link to="/seller" className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-dark">
            Start Selling
          </Link>
          <Link to="/seller/verification" className="rounded-xl border border-black/10 px-6 py-3 text-sm font-bold text-brand-ink transition hover:border-accent hover:text-accent dark:border-night-border dark:text-white">
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
