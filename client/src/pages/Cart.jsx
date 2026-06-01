import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShieldCheck, Ticket, Trash2 } from "lucide-react";
import { cartDefaults } from "../data/cosmicCatalog";
import { useCartContext } from "../context/CartContext";
import CloudinaryImage from "../components/CloudinaryImage";
import ErrorBoundary from "../components/ErrorBoundary";

export default function Cart() {
  const { items, setItems, totals, updateQty, removeItem } = useCartContext();
  const [coupon, setCoupon] = useState("ZIVVO10");

  useEffect(() => {
    if (!items.length) setItems(cartDefaults);
  }, [items.length, setItems]);

  const discount = useMemo(() => (coupon.toUpperCase() === "ZIVVO10" ? totals.subtotal * 0.1 : 0), [coupon, totals.subtotal]);
  const total = Math.max(0, totals.subtotal - discount + totals.delivery);

  return (
    <main className="cosmic-container py-10 lg:py-14">
      <div className="mb-10">
        <p className="text-label-caps font-bold uppercase tracking-[0.18em] text-neon-cyan">Shopping Bag</p>
        <h1 className="cosmic-title mt-4 text-5xl md:text-6xl">Your Cart ({items.length} items)</h1>
      </div>

      {items.length ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <ErrorBoundary level="section" fallbackMessage="Cart failed to load. Your items are saved.">
            <section className="flex-1 space-y-4 overflow-y-auto overscroll-contain pb-2">
              {items.map((item) => (
                <CartRow key={`${item.id}-${item.size}`} item={item} updateQty={updateQty} removeItem={removeItem} />
              ))}
            </section>
          </ErrorBoundary>

          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div className="glass-card sticky bottom-0 rounded-[2rem] border-t border-violet-800/40 bg-[#05060F] p-4 md:p-8">
              <h2 className="cosmic-title text-3xl">Order Summary</h2>
              <div className="mt-6 space-y-4 text-on-surface-variant">
                <Line label="Subtotal" value={totals.subtotal} />
                <Line label={`Discount (${coupon || "none"})`} value={-discount} accent />
                <Line label="Delivery" value={totals.delivery} free={totals.delivery === 0} />
                <div className="flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="font-bold text-on-surface">Total Amount</span>
                  <span className="text-3xl font-black text-stellar-gold">${total.toFixed(2)}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn-primary mt-8 w-full px-6 sm:w-auto lg:w-full">
                Proceed to Checkout
              </Link>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-outline">
                <ShieldCheck className="h-4 w-4" /> Secure checkout by ZIVVO
              </div>
            </div>

            <div className="glass-card flex items-center justify-between rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <Ticket className="h-6 w-6 text-neon-cyan" />
                <input value={coupon} onChange={(event) => setCoupon(event.target.value)} className="w-32 bg-transparent font-bold uppercase outline-none placeholder:text-outline" placeholder="Coupon" />
              </div>
              <button onClick={() => setCoupon("")} className="text-sm font-black uppercase tracking-[0.12em] text-electric-violet">
                Remove
              </button>
            </div>
          </aside>
        </div>
      ) : (
        <div className="glass-card rounded-[2rem] px-6 py-20 text-center">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-neon-cyan/10 text-neon-cyan shadow-cyan">
            <ShoppingBagIcon />
          </div>
          <h2 className="cosmic-title mt-6 text-4xl">Your Bag is Empty</h2>
          <p className="mx-auto mt-3 max-w-md text-on-surface-variant">Add future-premium items to your bag and they will appear here.</p>
          <Link to="/category/electronics" className="btn-primary mx-auto mt-8 w-full max-w-xs">Start Shopping</Link>
        </div>
      )}
    </main>
  );
}

function CartRow({ item, updateQty, removeItem }) {
  return (
    <article className="glass-card grid gap-4 rounded-2xl p-4 transition hover:scale-[1.005] sm:grid-cols-[132px_1fr_auto] sm:items-center">
      <CloudinaryImage src={item.image || item.thumbnail} alt={item.title} width={80} height={80} crop="thumb" className="h-36 w-full rounded-xl object-cover md:h-32 md:w-32" />
      <div className="min-w-0">
        <h2 className="cosmic-title text-2xl">{item.title}</h2>
        <p className="mt-1 text-on-surface-variant">{item.size || item.variant}</p>
        <p className="mt-4 text-xl font-black text-stellar-gold">${Number(item.price).toFixed(2)}</p>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <button onClick={() => removeItem(item.id, item.size)} className="grid h-11 w-11 place-items-center text-outline-variant transition hover:text-error" aria-label={`Remove ${item.title}`}>
          <Trash2 className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 rounded-full bg-white/5 px-2 py-1">
          <button className="grid h-11 w-11 place-items-center text-neon-cyan" onClick={() => updateQty(item.id, item.size, item.quantity - 1)} aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center font-black">{item.quantity}</span>
          <button className="grid h-11 w-11 place-items-center text-neon-cyan" onClick={() => updateQty(item.id, item.size, item.quantity + 1)} aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function Line({ label, value, accent = false, free = false }) {
  return (
    <div className={`flex justify-between ${accent ? "text-neon-cyan" : ""}`}>
      <span>{label}</span>
      <span className="text-on-surface">{free ? "FREE" : `$${value.toFixed(2)}`}</span>
    </div>
  );
}

function ShoppingBagIcon() {
  return (
    <svg aria-hidden="true" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
      <path d="m9 13 6 4M15 13l-6 4" />
    </svg>
  );
}
