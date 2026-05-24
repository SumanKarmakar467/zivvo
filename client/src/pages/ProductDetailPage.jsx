import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import confetti from "canvas-confetti";
import { ArrowLeft, Heart, ShoppingBag, Star, X, Zap } from "lucide-react";
import { useCartContext } from "../context/CartContext";

const countryByBrand = {
  Apple: "United States",
  Samsung: "South Korea",
  Huawei: "China",
  "Dior": "France",
  "Dolce & Gabbana": "Italy",
  Gucci: "Italy",
  Annibale Colombo: "Italy",
  "Calvin Klein": "United States",
  Rolex: "Switzerland",
  "Chanel": "France"
};

export default function ProductDetailPage() {
  const { slug, id } = useParams();
  const productId = id || slug;
  const navigate = useNavigate();
  const reviewsRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem, setItems } = useCartContext();

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const productResponse = await fetch(`https://dummyjson.com/products/${productId}`);
        if (!productResponse.ok) throw new Error("Product not found");
        const productData = await productResponse.json();

        let reviewData = productData.reviews || [];
        try {
          const reviewResponse = await fetch(`https://dummyjson.com/products/${productId}/reviews`);
          if (reviewResponse.ok) {
            const json = await reviewResponse.json();
            reviewData = json.reviews || json.comments || reviewData;
          }
        } catch {
          reviewData = productData.reviews || [];
        }

        if (!cancelled) {
          setProduct(normalizeProduct(productData));
          setReviews(normalizeReviews(reviewData));
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError.message || "Unable to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const images = useMemo(() => {
    if (!product) return [];
    const source = product.images?.length ? product.images : [product.thumbnail];
    return source.slice(0, 5);
  }, [product]);

  const sizeOptions = useMemo(() => getSizeOptions(product?.category), [product?.category]);
  const gender = useMemo(() => getGender(product?.category), [product?.category]);
  const details = useMemo(() => getDetails(product), [product]);

  useEffect(() => {
    if (sizeOptions.length && !selectedSize) {
      const firstAvailable = sizeOptions.find((size) => !size.disabled) || sizeOptions[0];
      setSelectedSize(firstAvailable.value);
    }
  }, [sizeOptions, selectedSize]);

  const gallerySwipe = useSwipeable({
    onSwipedLeft: () => setActiveImage((index) => Math.min(index + 1, images.length - 1)),
    onSwipedRight: () => setActiveImage((index) => Math.max(index - 1, 0)),
    trackMouse: false
  });

  const addToCart = async (event) => {
    if (!product) return;
    await addItem(product, { size: selectedSize || "One Size" });
    fireButtonConfetti(event.currentTarget);
  };

  const buyNow = () => {
    if (!product) return;
    const item = { ...product, size: selectedSize || "One Size", quantity: 1, addedAt: new Date().toISOString() };
    setItems([item]);
    navigate("/checkout", { state: { item } });
  };

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-[#0A0A0A] text-[#F5F0E8]">Loading product...</main>;
  }

  if (error || !product) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0A0A0A] px-4 text-[#F5F0E8]">
        <div className="rounded-lg border border-white/10 bg-[#141414] p-8 text-center">
          <h1 className="text-2xl font-semibold">Product unavailable</h1>
          <p className="mt-2 text-[#888780]">{error || "Try another product."}</p>
        </div>
      </main>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#0A0A0A] px-4 py-6 text-[#F5F0E8] md:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <Topbar
          category={product.category}
          wishlisted={wishlisted}
          onBack={() => navigate(-1)}
          onWishlist={() => setWishlisted((value) => !value)}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
          <section>
            <div {...gallerySwipe} className="group overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
              <button type="button" onClick={() => setLightboxOpen(true)} className="block min-h-0 w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={images[activeImage]}
                    src={images[activeImage]}
                    alt={product.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-[360px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.05] md:h-[560px]"
                  />
                </AnimatePresence>
              </button>
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-20 w-24 shrink-0 overflow-hidden rounded-md border bg-[#141414] transition ${activeImage === index ? "border-[#C9A84C]" : "border-white/10 hover:border-[#C9A84C]/60"}`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-[#141414] p-5 md:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#C9A84C]">{product.brand}</p>
            <h1 className="mt-3 text-4xl font-medium leading-tight md:text-5xl">{product.title}</h1>

            <button
              type="button"
              onClick={() => reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="mt-4 inline-flex items-center gap-2 text-sm text-[#888780]"
            >
              <Stars rating={product.rating} />
              <span>{product.rating.toFixed(1)} rating</span>
              <span>({reviews.length} reviews)</span>
            </button>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <p className="text-4xl font-black text-[#C9A84C]">${product.price.toFixed(2)}</p>
              <p className="text-lg text-[#888780] line-through">${product.originalPrice.toFixed(2)}</p>
              <span className="rounded-full bg-[#C9A84C]/15 px-3 py-1 text-sm font-bold text-[#C9A84C]">
                Save {product.discountPercentage.toFixed(0)}%
              </span>
            </div>

            <p className="mt-5 leading-8 text-[#888780]">{product.description}</p>

            <div className="mt-7">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#888780]">Size</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    disabled={size.disabled}
                    onClick={() => setSelectedSize(size.value)}
                    className={`min-h-11 min-w-14 rounded-md border px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:text-[#888780] disabled:line-through ${selectedSize === size.value ? "border-[#C9A84C] bg-[#C9A84C] text-black" : "border-white/10 text-[#F5F0E8] hover:border-[#C9A84C]/70"} ${size.disabled ? "bg-transparent opacity-50" : ""}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#888780]">For</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Male", "Female", "Unisex"].map((tag) => (
                  <span key={tag} className={`rounded-full border px-4 py-2 text-sm font-bold ${tag === gender ? "border-[#C9A84C] bg-[#C9A84C]/15 text-[#C9A84C]" : "border-white/10 text-[#888780]"}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <dl className="mt-7 grid gap-3 sm:grid-cols-2">
              {details.map((detail) => (
                <div key={detail.label} className="rounded-lg border border-white/10 bg-[#0A0A0A] p-4">
                  <dt className="text-xs uppercase tracking-[0.2em] text-[#888780]">{detail.label}</dt>
                  <dd className="mt-2 font-semibold leading-6 text-[#F5F0E8]">{detail.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <motion.button
                type="button"
                onClick={addToCart}
                whileTap={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 360, damping: 12 }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#C9A84C] px-5 py-4 font-black text-black"
              >
                <ShoppingBag className="h-5 w-5" /> Add to Cart
              </motion.button>
              <button type="button" onClick={buyNow} className="inline-flex items-center justify-center gap-2 rounded-md border border-[#C9A84C] px-5 py-4 font-black text-[#C9A84C]">
                <Zap className="h-5 w-5" /> Buy Now
              </button>
            </div>
          </section>
        </div>

        <ReviewsSection refNode={reviewsRef} reviews={reviews} />
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-black/75 p-4 backdrop-blur-md"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.22 }} className="relative">
              <button type="button" className="absolute -right-2 -top-14 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#141414] text-[#F5F0E8]" aria-label="Close lightbox">
                <X className="h-5 w-5" />
              </button>
              <img src={images[activeImage]} alt={product.title} className="max-h-[86vh] max-w-[94vw] rounded-lg object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

function Topbar({ category, wishlisted, onBack, onWishlist }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#141414] px-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onBack} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-[#F5F0E8]" aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <p className="truncate text-sm text-[#888780]">
          Home <span className="mx-2 text-white/25">/</span> Products <span className="mx-2 text-white/25">/</span>
          <span className="font-semibold capitalize text-[#C9A84C]">{category?.replace(/-/g, " ")}</span>
        </p>
      </div>

      <motion.button
        type="button"
        onClick={onWishlist}
        whileTap={{ scale: 0.82 }}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-[#F5F0E8]"
        aria-label="Toggle wishlist"
      >
        <motion.span animate={{ scale: wishlisted ? [1, 1.28, 1] : 1 }}>
          <Heart className="h-5 w-5" fill={wishlisted ? "#C9A84C" : "none"} stroke={wishlisted ? "#C9A84C" : "currentColor"} />
        </motion.span>
      </motion.button>
    </div>
  );
}

function ReviewsSection({ refNode, reviews }) {
  return (
    <section ref={refNode} className="mt-12 scroll-mt-24">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#C9A84C]">Reviews</p>
          <h2 className="mt-2 text-3xl font-medium">What buyers say</h2>
        </div>
        <p className="text-sm text-[#888780]">{reviews.length} total</p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid gap-4 md:grid-cols-2"
      >
        {reviews.map((review) => (
          <motion.article
            key={`${review.name}-${review.comment}`}
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            className="rounded-lg border border-white/10 bg-[#141414] p-5"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#C9A84C] text-sm font-black text-black">{initials(review.name)}</span>
              <div>
                <h3 className="font-bold">{review.name}</h3>
                <Stars rating={review.rating} compact />
              </div>
            </div>
            <p className="mt-4 leading-7 text-[#888780]">{review.comment}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

function Stars({ rating, compact = false }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[#C9A84C]">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} fill={index < Math.round(rating) ? "#C9A84C" : "none"} />
      ))}
    </span>
  );
}

const normalizeProduct = (product) => {
  const discount = Number(product.discountPercentage || 12);
  const price = Number(product.price || 0);
  return {
    id: product.id,
    _id: String(product.id),
    title: product.title,
    name: product.title,
    brand: product.brand || "Zivvo Select",
    category: product.category || "accessories",
    price,
    originalPrice: discount ? price / (1 - discount / 100) : price * 1.14,
    discountPercentage: discount,
    rating: Number(product.rating || 0),
    description: product.description || "",
    thumbnail: product.thumbnail,
    image: product.thumbnail,
    images: product.images || [product.thumbnail].filter(Boolean),
    warrantyInformation: product.warrantyInformation || "12 months warranty",
    returnPolicy: product.returnPolicy || "7-day replacement policy",
    meta: product.meta || {}
  };
};

const normalizeReviews = (reviews) => {
  const rows = Array.isArray(reviews) ? reviews : [];
  if (!rows.length) {
    return [
      { name: "Aarav Mehta", rating: 5, comment: "Premium finish, fast delivery, and the product looked exactly like the photos." },
      { name: "Nisha Rao", rating: 4, comment: "Clean packaging and solid quality. I would happily shop this category again." }
    ];
  }

  return rows.map((review) => ({
    name: review.reviewerName || review.user?.username || review.name || "Zivvo Buyer",
    rating: Number(review.rating || 5),
    comment: review.comment || review.body || "Great product experience."
  }));
};

const getSizeOptions = (category = "") => {
  const normalized = category.toLowerCase();
  if (normalized.includes("shoe")) {
    return ["6", "7", "8", "9", "10"].map((size) => ({ value: size, label: size, disabled: size === "10" }));
  }
  if (["mens-shirts", "womens-dresses", "tops"].some((item) => normalized.includes(item))) {
    return ["S", "M", "L", "XL"].map((size) => ({ value: size, label: size, disabled: size === "XL" }));
  }
  return [{ value: "One Size", label: "One Size", disabled: false }];
};

const getGender = (category = "") => {
  const normalized = category.toLowerCase();
  if (normalized.startsWith("mens-")) return "Male";
  if (normalized.startsWith("womens-")) return "Female";
  return "Unisex";
};

const getDetails = (product) => {
  if (!product) return [];
  return [
    { label: "Material", value: parseMaterial(product) },
    { label: "Made in", value: `${product.brand}, ${countryByBrand[product.brand] || "India"}` },
    { label: "Warranty", value: product.warrantyInformation },
    { label: "Return policy", value: product.returnPolicy }
  ];
};

const parseMaterial = (product) => {
  if (product.meta?.material) return product.meta.material;
  const category = product.category.toLowerCase();
  if (category.includes("fragrance")) return "Glass bottle with blended aromatic compounds";
  if (category.includes("beauty")) return "Dermatology-tested cosmetic formulation";
  if (category.includes("furniture")) return "Engineered wood, metal hardware, and finished surface";
  if (category.includes("shirt") || category.includes("dress") || category.includes("tops")) return "Soft breathable textile with reinforced stitching";
  if (category.includes("shoe")) return "Synthetic upper, cushioned sole, and grip outsole";
  if (category.includes("watch")) return "Stainless hardware with precision movement";
  return product.description.split(".")[0] || "Quality-checked everyday materials";
};

const initials = (name) =>
  String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "ZB";

const fireButtonConfetti = (button) => {
  const rect = button.getBoundingClientRect();
  confetti({
    particleCount: 70,
    spread: 62,
    origin: {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight
    }
  });
};
