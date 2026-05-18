const marqueeItems = [
  "Free shipping over Rs. 999",
  "30-day easy returns",
  "Verified sellers only",
  "Razorpay secured checkout",
  "Real-time order tracking",
  "24/7 customer support"
];

export function Marquee({ items = marqueeItems }) {
  const loopItems = [...items, ...items];

  return (
    <section className="w-full overflow-hidden border-y border-[rgba(124,92,252,0.15)] bg-[color-mix(in_srgb,var(--bg2)_64%,transparent)] py-4">
      <div className="z-marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {loopItems.map((item, index) => (
          <span key={`${item}-${index}`} className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--muted)]">
            <span className="mr-8 text-[var(--cyan)]">✦</span>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

export default Marquee;
