import { useState } from "react";
import PageTransition from "../components/common/PageTransition";

const mockItems = [
  { id: 1, name: "Premium Headphones", brand: "Nova", price: 3999, original: 5499, qty: 1, image: "https://picsum.photos/seed/cart1/160/160" },
  { id: 2, name: "Smart Watch Pro", brand: "UrbanCraft", price: 2999, original: 4499, qty: 2, image: "https://picsum.photos/seed/cart2/160/160" }
];

export default function Cart() {
  const [items, setItems] = useState(mockItems);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const original = items.reduce((sum, i) => sum + i.original * i.qty, 0);
  const discount = original - subtotal;
  if (!items.length) return <PageTransition><div className="py-20 text-center"><h2 className="text-2xl font-bold">Your cart is empty</h2></div></PageTransition>;

  return <PageTransition><div className="grid gap-6 lg:grid-cols-[2fr,1fr]"> <div className="space-y-4">{items.map((item) => <div key={item.id} className="rounded-2xl border border-white/10 bg-shoppop-surface p-4"><div className="flex gap-4"><img src={item.image} className="h-24 w-24 rounded-xl object-cover" /><div className="flex-1"><h3 className="font-semibold">{item.name}</h3><p className="text-sm text-shoppop-text-muted">{item.brand}</p><p className="mt-2 font-bold">₹{item.price} <span className="ml-2 text-sm text-shoppop-text-muted line-through">₹{item.original}</span></p><div className="mt-3 flex items-center gap-2"><button className="rounded border px-2" onClick={() => setItems((s) => s.map((x) => x.id === item.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}>-</button><span>{item.qty}</span><button className="rounded border px-2" onClick={() => setItems((s) => s.map((x) => x.id === item.id ? { ...x, qty: x.qty + 1 } : x))}>+</button><button className="ml-auto text-red-300" onClick={() => setItems((s) => s.filter((x) => x.id !== item.id))}>Remove</button></div></div></div></div>)}</div>
  <aside className="h-fit rounded-2xl border border-white/10 bg-shoppop-surface p-4 lg:sticky lg:top-24"><h3 className="font-bold">Price Details</h3><div className="mt-3 space-y-2 text-sm"><div className="flex justify-between"><span>Price ({items.length} items)</span><span>₹{original}</span></div><div className="flex justify-between text-green-400"><span>Discount</span><span>-₹{discount}</span></div><div className="flex justify-between"><span>Delivery</span><span className="text-green-400">Free</span></div></div><div className="my-3 border-t border-white/10" /><div className="flex justify-between text-lg font-bold"><span>Total</span><span>₹{subtotal}</span></div><button className="mt-4 w-full rounded-xl bg-amber-gradient px-4 py-2 font-semibold text-black">Proceed to Checkout</button></aside></div></PageTransition>;
}
