import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartContext } from "../context/CartContext";

export default function Cart() {
  const { items, totals, updateQty, removeItem } = useCartContext();
  const [coupon, setCoupon] = useState("");
  const discount = useMemo(() => coupon.toUpperCase() === "ZIVVO10" ? totals.subtotal * 0.1 : 0, [coupon, totals.subtotal]);
  const total = totals.subtotal - discount + totals.delivery;

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--cream)] md:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          <h1 className="text-4xl font-black">Cart</h1>
          {items.map((item) => <CartRow key={`${item.id}-${item.size}`} item={item} updateQty={updateQty} removeItem={removeItem} />)}
          {!items.length && <div className="zivvo-card rounded-lg p-10 text-center text-[var(--muted)]">Your cart is empty.</div>}
        </section>
        <aside className="zivvo-card h-fit rounded-lg p-6">
          <h2 className="text-2xl font-black">Price breakdown</h2>
          <input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder='Coupon "ZIVVO10"' className="input mt-5 w-full" />
          <Line label="Subtotal" value={totals.subtotal} />
          <Line label="Discount" value={-discount} />
          <Line label="Delivery" value={totals.delivery} />
          <div className="mt-4 flex justify-between border-t border-[var(--border)] pt-4 text-xl font-black"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <Link to="/checkout" className="mt-6 block rounded-md bg-[#C9A84C] px-5 py-4 text-center font-black text-black">Checkout</Link>
        </aside>
      </div>
    </main>
  );
}

function CartRow({ item, updateQty, removeItem }) {
  const handlers = useSwipeable({ onSwipedLeft: () => removeItem(item.id, item.size), trackMouse: true });
  return (
    <motion.article {...handlers} layout exit={{ opacity: 0, x: -80 }} className="zivvo-card flex gap-4 rounded-lg p-4">
      <img src={item.thumbnail} alt={item.title} className="h-24 w-24 rounded-md object-cover" />
      <div className="min-w-0 flex-1">
        <h2 className="font-bold">{item.title}</h2>
        <p className="text-sm text-[var(--muted)]">Size: {item.size}</p>
        <div className="mt-3 flex items-center gap-2">
          <button className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)]" onClick={() => updateQty(item.id, item.size, item.quantity - 1)}><Minus className="h-4 w-4" /></button>
          <span className="w-8 text-center font-bold">{item.quantity}</span>
          <button className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)]" onClick={() => updateQty(item.id, item.size, item.quantity + 1)}><Plus className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-black">${(item.price * item.quantity).toFixed(2)}</p>
        <button className="mt-4 text-red-400" onClick={() => removeItem(item.id, item.size)}><Trash2 className="h-5 w-5" /></button>
      </div>
    </motion.article>
  );
}

function Line({ label, value }) {
  return <div className="mt-4 flex justify-between text-[var(--muted)]"><span>{label}</span><span>${value.toFixed(2)}</span></div>;
}
