import { useState } from "react";
import api from "../api/axios";
import OrderTracker from "../components/OrderTracker";

const demoOrders = [
  {
    id: "ZV10291",
    productName: "Gold Chrono Watch",
    productImage: "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp",
    productPrice: 129.99,
    size: "One Size",
    quantity: 1,
    placedAt: "2026-05-20T10:20:00.000Z",
    status: "out_for_delivery",
    trackingStep: 3,
    estimatedDelivery: "2026-05-25T18:30:00.000Z",
    paymentId: "pay_ZV10291"
  },
  {
    id: "ZV10244",
    productName: "Nike Air Jordan 1 Red And Black",
    productImage: "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp",
    productPrice: 149.99,
    size: "9",
    quantity: 1,
    placedAt: "2026-05-16T09:15:00.000Z",
    status: "delivered",
    trackingStep: 4,
    estimatedDelivery: "2026-05-21T12:00:00.000Z",
    paymentId: "pay_ZV10244"
  },
  {
    id: "ZV10170",
    productName: "Apple AirPods Max Silver",
    productImage: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp",
    productPrice: 549.99,
    size: "One Size",
    quantity: 1,
    placedAt: "2026-05-10T14:45:00.000Z",
    status: "cancelled",
    trackingStep: 1,
    estimatedDelivery: "2026-05-15T18:00:00.000Z",
    paymentId: "pay_ZV10170"
  }
];

export default function Profile() {
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(demoOrders[0]);

  const upload = async (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const form = new FormData();
    form.append("avatar", file);
    try {
      const { data } = await api.post("/upload/avatar", form);
      setAvatar(data.url);
    } catch {
      setAvatar(URL.createObjectURL(file));
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--cream)] md:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[360px_1fr]">
        <section className="zivvo-card rounded-lg p-6">
          <img src={preview || avatar || "https://api.dicebear.com/8.x/initials/svg?seed=Zivvo"} alt="Avatar preview" className="h-28 w-28 rounded-full border border-[var(--border)] object-cover" />
          <label className="mt-4 inline-flex cursor-pointer rounded-md bg-[#C9A84C] px-4 py-3 font-bold text-black">Upload avatar<input type="file" accept="image/*" className="hidden" onChange={(event) => upload(event.target.files?.[0])} /></label>
          <div className="mt-6 grid gap-3">
            <input className="input" defaultValue="Zivvo Shopper" />
            <input className="input" defaultValue="shopper@zivvo.dev" />
            <button className="rounded-md border border-[var(--border)] px-4 py-3 font-bold">Save profile</button>
          </div>
        </section>
        <section className="space-y-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C9A84C]">My Orders</p>
            <h1 className="mt-2 text-4xl font-black text-[#F5F0E8]">Order tracking</h1>
          </div>
          <OrderTracker order={selectedOrder} allOrders={demoOrders} onOrderSelect={setSelectedOrder} />
        </section>
      </div>
    </main>
  );
}
