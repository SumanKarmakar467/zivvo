import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import confetti from "canvas-confetti";
import api from "../api/axios";

const steps = ["Order Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];

export default function Profile() {
  const [avatar, setAvatar] = useState("");
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState(3);
  const lineRef = useRef(null);

  useEffect(() => {
    gsap.to(lineRef.current, { width: `${(status / (steps.length - 1)) * 100}%`, duration: 0.8, ease: "power3.out" });
    if (status === 4) confetti({ particleCount: 100, spread: 90 });
  }, [status]);

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
          <div className="grid gap-4 md:grid-cols-4">
            {["Total Orders", "Delivered", "Cancelled", "Wishlist items"].map((label, index) => <div key={label} className="zivvo-card rounded-lg p-5"><p className="text-3xl font-black text-[#C9A84C]">{[12, 9, 1, 7][index]}</p><p className="text-sm text-[var(--muted)]">{label}</p></div>)}
          </div>
          <div className="zivvo-card rounded-lg p-6">
            <h2 className="text-2xl font-black">Order Tracking</h2>
            <div className="relative mt-8">
              <div className="absolute left-0 right-0 top-5 h-1 bg-[var(--bg3)]" />
              <div ref={lineRef} className="absolute left-0 top-5 h-1 bg-[#C9A84C]" />
              <div className="relative flex justify-between">
                {steps.map((step, index) => <button key={step} type="button" onClick={() => setStatus(index)} className="grid max-w-24 justify-items-center gap-2 text-center text-xs"><span className={`grid h-11 w-11 place-items-center rounded-full border ${index === status ? "pulse-dot border-[#C9A84C] bg-[#C9A84C] text-black" : index < status ? "border-[#C9A84C] bg-[#C9A84C]/20" : "border-[var(--border)] bg-[var(--bg2)]"}`}>{index + 1}</span>{step}</button>)}
              </div>
            </div>
            <p className="mt-6 text-[var(--muted)]">ETA: {new Date(Date.now() + (5 - status) * 86400000).toLocaleDateString()}</p>
          </div>
          <div className="zivvo-card rounded-lg p-6">
            <h2 className="text-2xl font-black">Order History</h2>
            {[1, 2, 3].map((item) => <div key={item} className="mt-4 flex items-center justify-between rounded-md border border-[var(--border)] p-3"><div><p className="font-bold">Zivvo curated product #{item}</p><p className="text-sm text-[var(--muted)]">May {20 + item}, 2026</p></div><span className="rounded-full bg-[#C9A84C]/15 px-3 py-1 text-sm">Shipped</span><p className="font-bold">${49 + item * 12}</p></div>)}
          </div>
        </section>
      </div>
    </main>
  );
}
