import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import { getProductById, products } from "../data/cosmicCatalog";
import { useCartContext } from "../context/CartContext";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProductById(slug);
  const [activeImage, setActiveImage] = useState(product.gallery[0]);
  const [finish, setFinish] = useState("Titanium");
  const [storage, setStorage] = useState("128GB");
  const [liked, setLiked] = useState(false);
  const { addItem, setItems } = useCartContext();
  const related = useMemo(() => products.filter((item) => item.id !== product.id).slice(0, 4), [product.id]);

  const addToCart = () => addItem(product, { size: `${finish} | ${storage}` });
  const buyNow = () => {
    setItems([{ ...product, size: `${finish} | ${storage}`, quantity: 1 }]);
    navigate("/cart");
  };

  return (
    <main>
      <section className="cosmic-container grid gap-8 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:py-12">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-on-surface-variant hover:text-neon-cyan">
              <ArrowLeft className="h-5 w-5" /> Back
            </button>
            <span className="rounded-full border border-stellar-gold/40 bg-stellar-gold/10 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-stellar-gold">
              Exclusive
            </span>
          </div>

          <div className="glass-card overflow-hidden rounded-[2rem]">
            <img src={activeImage} alt={product.title} className="h-[420px] w-full object-cover md:h-[620px]" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {product.gallery.map((image) => (
              <button
                key={image}
                onClick={() => setActiveImage(image)}
                className={`glass-card aspect-[4/3] overflow-hidden rounded-2xl p-1 ${activeImage === image ? "border-neon-cyan shadow-cyan" : ""}`}
              >
                <img src={image} alt="" className="h-full w-full rounded-xl object-cover" />
              </button>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass-card rounded-[2rem] p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-label-caps font-bold uppercase tracking-[0.16em] text-neon-cyan">{product.brand}</p>
                <h1 className="cosmic-title mt-3 text-4xl md:text-6xl">{product.title}</h1>
              </div>
              <button onClick={() => setLiked((value) => !value)} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-primary" aria-label="Toggle wishlist">
                <Heart className={`h-6 w-6 ${liked ? "fill-electric-violet text-electric-violet" : ""}`} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 text-stellar-gold">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-bold">{product.rating}</span>
              </div>
              <span className="text-on-surface-variant">({product.reviews.toLocaleString()} reviews)</span>
              <span className="h-4 w-px bg-white/10" />
              <span className="text-label-caps font-bold uppercase tracking-[0.12em] text-neon-cyan">Only {product.stock} left</span>
            </div>

            <div className="mt-6 flex flex-wrap items-end gap-4">
              <p className="cosmic-title text-5xl text-on-surface md:text-6xl">${product.price}</p>
              <p className="pb-2 text-xl text-outline line-through">${product.originalPrice}</p>
              <span className="mb-2 rounded-lg bg-electric-violet/35 px-3 py-2 text-sm font-black text-primary">SAVE ${product.originalPrice - product.price}</span>
            </div>

            <p className="mt-6 text-body-lg text-on-surface-variant">{product.description}</p>

            <OptionGroup title="Select Finish" options={["Titanium", "Graphite", "Silver"]} value={finish} onChange={setFinish} />
            <OptionGroup title="Storage Capacity" options={["128GB", "256GB", "512GB"]} value={storage} onChange={setStorage} boxed />

            <div className="mt-8">
              <h2 className="cosmic-title text-2xl">Technical Specifications</h2>
              <dl className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-cosmic-black/35">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-[0.85fr_1.15fr] gap-4 p-4">
                    <dt className="text-on-surface-variant">{key}</dt>
                    <dd className="font-bold text-on-surface">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-8 hidden grid-cols-2 gap-3 lg:grid">
              <button onClick={buyNow} className="btn-ghost px-6">Buy Now</button>
              <button onClick={addToCart} className="btn-primary px-6">
                <ShoppingBag className="h-5 w-5" /> Add to Cart
              </button>
            </div>
          </div>
        </aside>
      </section>

      <section className="cosmic-container grid gap-6 py-stack-lg lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <h2 className="cosmic-title text-3xl">Member Reviews</h2>
          <p className="mt-3 text-on-surface-variant">Verified buyers highlight finish, delivery speed, and the premium in-hand feel.</p>
        </div>
        <div className="glass-card rounded-2xl border-electric-violet/70 p-6">
          <div className="flex text-stellar-gold">
            {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-5 w-5 fill-current" />)}
          </div>
          <p className="mt-4 text-body-lg italic">The finish is out of this world. It feels incredibly light yet solid, and delivery was lightning fast.</p>
          <div className="mt-5 flex items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-gradient-to-r from-electric-violet to-neon-cyan" />
            <div>
              <p className="font-bold">Marcus V.</p>
              <p className="text-sm text-neon-cyan">Verified member</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cosmic-container py-stack-lg">
        <h2 className="cosmic-title mb-5 text-3xl">You May Also Like</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <Link key={item.id} to={`/product/${item.id}`} className="glass-card rounded-2xl p-3">
              <img src={item.image} alt={item.title} className="aspect-square w-full rounded-xl object-cover" />
              <h3 className="cosmic-title mt-4 text-xl">{item.title}</h3>
              <p className="mt-2 font-black text-stellar-gold">${item.price}.00</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-20 z-40 grid grid-cols-2 gap-3 border-t border-white/10 bg-cosmic-black/90 p-4 backdrop-blur-2xl lg:hidden">
        <button onClick={buyNow} className="btn-ghost">Buy Now</button>
        <button onClick={addToCart} className="btn-primary">Add to Cart</button>
      </div>
    </main>
  );
}

function OptionGroup({ title, options, value, onChange, boxed = false }) {
  return (
    <div className="mt-7">
      <h2 className="mb-3 text-label-caps font-bold uppercase tracking-[0.16em] text-outline">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={
              boxed
                ? `min-w-24 rounded-xl border px-5 py-4 font-bold ${value === option ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan" : "border-white/10 bg-white/5"}`
                : `h-12 w-12 rounded-full border-2 ${value === option ? "border-neon-cyan shadow-cyan" : "border-white/20"} ${option === "Titanium" ? "bg-[#344241]" : option === "Graphite" ? "bg-[#625e58]" : "bg-[#929292]"}`
            }
            aria-label={option}
          >
            {boxed ? option : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
