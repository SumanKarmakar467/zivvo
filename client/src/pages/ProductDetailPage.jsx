import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import { getProductById, products } from "../data/cosmicCatalog";
import { useCartContext } from "../context/CartContext";
import CloudinaryImage from "../components/CloudinaryImage";
import ErrorBoundary from "../components/ErrorBoundary";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProductById(slug);
  const angleImages = useMemo(() => buildAngleImages(product), [product]);
  const [activeImage, setActiveImage] = useState(angleImages[0].image);
  const [finish, setFinish] = useState("Titanium");
  const [storage, setStorage] = useState("128GB");
  const [liked, setLiked] = useState(false);
  const { addItem, setItems } = useCartContext();
  const related = useMemo(() => products.filter((item) => item.id !== product.id).slice(0, 4), [product.id]);
  const feedback = useMemo(() => buildFeedback(product), [product]);

  useEffect(() => {
    setActiveImage(angleImages[0].image);
  }, [angleImages]);

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

          <ErrorBoundary level="section" fallbackMessage="Product images failed to load.">
            <div className="glass-card aspect-square w-full overflow-hidden rounded-[2rem] sm:aspect-auto">
              <CloudinaryImage src={activeImage} alt={product.title} width={800} height={800} crop="fill" eager className="h-full w-full object-contain sm:h-[620px]" />
            </div>
            <div className="mt-3 flex flex-row gap-2 overflow-x-auto pb-2 sm:mt-4 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:pb-0">
              {angleImages.map(({ image, label }) => (
                <button
                  key={`${label}-${image}`}
                  onClick={() => setActiveImage(image)}
                  className={`glass-card aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-2xl p-1 sm:w-auto ${activeImage === image ? "border-neon-cyan shadow-cyan" : ""}`}
                >
                  <CloudinaryImage src={image} alt="" width={600} height={600} crop="fill" className="h-full w-full rounded-xl object-contain" />
                  <span className="absolute bottom-2 left-2 rounded-full bg-cosmic-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-neon-cyan">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </ErrorBoundary>
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
          <p className="mt-3 text-on-surface-variant">Verified buyers highlight camera quality, delivery speed, battery life, build, and the premium in-hand feel.</p>
        </div>
        <ErrorBoundary level="section" fallbackMessage="Reviews failed to load.">
          <div className="grid gap-4">
            {feedback.map((review) => (
              <div key={review.name} className="glass-card rounded-2xl border-electric-violet/70 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex text-stellar-gold">
                    {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-5 w-5 fill-current" />)}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-neon-cyan">{review.badge}</span>
                </div>
                <p className="mt-4 text-body-lg italic">"{review.text}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-r from-electric-violet to-neon-cyan font-black text-white">
                    {review.name.charAt(0)}
                  </span>
                  <div>
                    <p className="font-bold">{review.name}</p>
                    <p className="text-sm text-neon-cyan">Verified buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ErrorBoundary>
      </section>

      <section className="cosmic-container py-stack-lg">
        <div className="mb-5">
          <p className="text-label-caps font-bold uppercase tracking-[0.14em] text-neon-cyan">Angle Gallery</p>
          <h2 className="cosmic-title mt-2 text-3xl">See {product.title} From Every Side</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {angleImages.map(({ image, label }) => (
            <article key={`angle-${label}`} className="glass-card rounded-2xl p-3">
              <img src={image} alt={`${product.title} ${label} angle`} className="aspect-square w-full rounded-xl object-cover" />
              <h3 className="cosmic-title mt-4 text-xl">{label} Angle</h3>
              <p className="mt-2 text-sm text-on-surface-variant">Detailed product view for confident shopping.</p>
            </article>
          ))}
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

function buildAngleImages(product) {
  const labels = ["Front", "Back", "Side", "Detail"];
  const unique = [...new Set([product.image, ...(product.gallery || [])])].slice(0, 4);
  return labels.map((label, index) => ({
    label,
    image: unique[index] || getAngleFallback(product, label)
  }));
}

function getAngleFallback(product, label) {
  const query = encodeURIComponent(`${product.brand} ${product.title} product ${label} angle`);
  return `https://source.unsplash.com/900x1100/?${query}&sig=${encodeURIComponent(`${product.id}-${label}`)}`;
}

function buildFeedback(product) {
  const isPhone = product.category === "phones" || /phone/i.test(product.title);
  const topic = isPhone ? "camera and battery" : "quality and finish";
  return [
    {
      name: "Aarav S.",
      badge: "2 day delivery",
      text: `The ${product.title} looked exactly like the angle photos. The ${topic} feel premium, and packaging was clean.`
    },
    {
      name: "Priya M.",
      badge: "Best value",
      text: `I compared the side and detail shots before buying. It made the product choice much easier.`
    },
    {
      name: "Rohan K.",
      badge: "Verified",
      text: `Smooth checkout, fast updates, and the product arrived in fresh condition. I would buy this brand again.`
    }
  ];
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
