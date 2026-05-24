import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { X } from "lucide-react";
import { fetchDummyProduct } from "../services/dummyProducts";
import { useCartContext } from "../context/CartContext";

export default function ProductDetailPage() {
  const { slug, id } = useParams();
  const productId = id || slug;
  const [product, setProduct] = useState(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [size, setSize] = useState("N/A");
  const { addItem } = useCartContext();

  useEffect(() => { fetchDummyProduct(productId).then(setProduct); }, [productId]);
  const sizes = useMemo(() => getSizes(product), [product]);

  if (!product) return <main className="grid min-h-screen place-items-center bg-[var(--bg)] text-[var(--cream)]">Loading product...</main>;
  const images = product.images.length > 1 ? product.images : [product.thumbnail, `${product.thumbnail}?v=1`, `${product.thumbnail}?v=2`, `${product.thumbnail}?v=3`];

  const add = async () => {
    await addItem(product, { size });
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--cream)] md:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section>
          <button type="button" onClick={() => setLightbox(true)} className="group block min-h-0 w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg2)]">
            <AnimatePresence mode="wait">
              <motion.img key={active} src={images[active]} alt={product.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[520px] w-full object-contain transition group-hover:scale-110" />
            </AnimatePresence>
          </button>
          <div className="mt-4 flex gap-3 overflow-x-auto">
            {images.map((image, index) => <button key={image} type="button" onClick={() => setActive(index)} className={`h-20 w-24 shrink-0 overflow-hidden rounded-md border ${active === index ? "border-[#C9A84C]" : "border-[var(--border)]"}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}
          </div>
        </section>
        <section className="zivvo-card rounded-lg p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-[#C9A84C]">{product.brand}</p>
          <h1 className="mt-3 text-4xl font-black">{product.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <p className="text-3xl font-black text-[#C9A84C]">${product.price}</p>
            <p>{"★".repeat(Math.round(product.rating))}<span className="ml-2 text-[var(--muted)]">{product.rating.toFixed(1)}</span></p>
          </div>
          <p className="mt-5 leading-8 text-[var(--muted)]">{product.description}</p>
          <dl className="mt-6 grid gap-3 text-sm">
            <Info label="How it's made" value={product.material} />
            <Info label="Where it's made" value={product.country} />
            <Info label="Expiry / warranty" value={product.warranty} />
            <Info label="For" value={product.gender} />
          </dl>
          <div className="mt-6">
            <p className="mb-3 font-bold">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((item) => <button key={item} type="button" onClick={() => setSize(item)} className={`h-11 min-w-12 rounded-md border px-3 font-bold ${size === item ? "border-[#C9A84C] bg-[#C9A84C] text-black" : "border-[var(--border)]"}`}>{item}</button>)}
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.94 }} type="button" onClick={add} className="mt-8 w-full rounded-md bg-[#C9A84C] px-5 py-4 text-lg font-black text-black">Add to Cart</motion.button>
        </section>
      </div>
      <AnimatePresence>
        {lightbox && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] grid place-items-center bg-black/90 p-4" onClick={() => setLightbox(false)}>
          <button className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white"><X /></button>
          <img src={images[active]} alt={product.title} className="max-h-[90vh] max-w-[94vw] object-contain" />
        </motion.div>}
      </AnimatePresence>
    </main>
  );
}

function Info({ label, value }) {
  return <div className="rounded-md border border-[var(--border)] p-3"><dt className="text-[var(--muted)]">{label}</dt><dd className="mt-1 font-semibold">{value}</dd></div>;
}

const getSizes = (product) => {
  const category = String(product?.category || "").toLowerCase();
  if (category.includes("shoe")) return ["7", "8", "9", "10", "11"];
  if (category.includes("shirt") || category.includes("dress") || category.includes("tops")) return ["S", "M", "L", "XL"];
  return ["N/A"];
};
