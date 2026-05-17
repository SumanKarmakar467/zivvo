export default function PromoStrip() {
  return (
    <div className="bg-[#e8730a] py-4 text-center text-sm font-semibold text-white shadow-lg shadow-[#e8730a]/20">
      MEGA SALE - Use code{" "}
      <code className="rounded border border-dashed border-white/50 bg-white/20 px-2 py-1 font-mono font-bold">ZIVVO30</code>
      {" "}for 30% off · Free shipping above ₹499
    </div>
  );
}
