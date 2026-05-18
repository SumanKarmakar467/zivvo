import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ProductCard from "../components/ProductCard";
import ProductGallery from "../components/product/ProductGallery";
import VariantSelector from "../components/product/VariantSelector";
import SkeletonGrid from "../components/SkeletonGrid";
import { addToCart } from "../store/slices/cartSlice";
import useWishlistStore from "../store/useWishlistStore";
import { getUsableImages, productImageFallback } from "../utils/imageFallbacks";
import { notifySuccess } from "../components/common/Toast";

const API_URL = import.meta.env.VITE_API_URL;
const formatRupees = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const StarRow = ({ value = 0 }) => {
  const rating = Math.round(Number(value || 0));
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} viewBox="0 0 20 20" className={`h-4 w-4 ${star <= rating ? "text-[#A78BFA]" : "text-white/15"}`} fill="currentColor">
          <path d="m10 1.6 2.55 5.17 5.7.83-4.12 4.02.97 5.67L10 14.6l-5.1 2.69.97-5.67L1.75 7.6l5.7-.83L10 1.6Z" />
        </svg>
      ))}
    </span>
  );
};

const ProductDetailSkeleton = () => (
  <main className="min-h-screen bg-[var(--bg)] px-4 py-6 md:px-6">
    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[55fr_45fr]">
      <div className="z-skeleton aspect-square rounded-2xl" />
      <div className="space-y-4">
        <div className="z-skeleton h-4 w-40 rounded-full" />
        <div className="z-skeleton h-10 w-3/4 rounded-full" />
        <div className="z-skeleton h-5 w-52 rounded-full" />
        <div className="z-skeleton h-16 w-72 rounded-2xl" />
        <div className="z-skeleton h-28 w-full rounded-2xl" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="z-skeleton h-12 rounded-xl" />
          <div className="z-skeleton h-12 rounded-xl" />
        </div>
      </div>
    </div>
  </main>
);

export function ProductDetailPage() {
  const { slug, id } = useParams();
  const identifier = slug || id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [deliveryText, setDeliveryText] = useState("");
  const [offersOpen, setOffersOpen] = useState(true);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const wishlisted = useWishlistStore((state) => product?._id ? state.isWishlisted(product._id) : false);
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  useEffect(() => {
    let cancelled = false;
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${identifier}`, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Product not found");
        if (cancelled) return;
        setProduct(data.product);
        setSelectedVariant((data.product.variants || []).find((variant) => variant.isActive !== false) || null);

        setSimilarLoading(true);
        try {
          const similarRes = await fetch(`${API_URL}/products/${data.product._id}/similar`, { credentials: "include" });
          const similarData = await similarRes.json();
          if (!cancelled && similarRes.ok) setSimilar(similarData.products || data.relatedProducts || []);
        } catch {
          if (!cancelled) setSimilar(data.relatedProducts || []);
        }
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setSimilarLoading(false);
        }
      }
    };
    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [identifier]);

  const images = useMemo(() => getUsableImages(product?.images, productImageFallback), [product?.images]);
  const specsEntries = useMemo(() => Object.entries(product?.specs || {}), [product?.specs]);
  const basePrice = Number(product?.price || 0);
  const finalPrice = product?.hasVariants ? basePrice + Number(selectedVariant?.priceDelta || 0) : basePrice;
  const mrp = Number(product?.mrp || 0);
  const discount = mrp > finalPrice ? Math.round(((mrp - finalPrice) / mrp) * 100) : Number(product?.discount || 0);
  const stock = Number(product?.hasVariants ? selectedVariant?.stock || 0 : product?.stock || 0);
  const reviewCount = Number(product?.reviewCount || product?.numReviews || product?.reviews?.length || 0);
  const avgRating = Number(product?.averageRating || product?.rating || 0).toFixed(1);

  const checkDelivery = () => {
    const value = pincode.trim();
    if (!/^\d{6}$/.test(value)) {
      setPincodeError("Enter a valid 6 digit pincode");
      setDeliveryText("");
      return;
    }
    setPincodeError("");
    if (stock <= 0) {
      setDeliveryText("Out of stock in your area");
      return;
    }
    const date = new Date();
    date.setDate(date.getDate() + (value.startsWith("7") ? 2 : 4));
    setDeliveryText(`Delivery by ${date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}`);
  };

  const handleAddToCart = async () => {
    if (!product || stock <= 0 || (product.hasVariants && !selectedVariant)) return;
    await dispatch(addToCart({
      productId: product._id,
      quantity: qty,
      productData: product,
      variantSku: selectedVariant?.sku || "",
      variantAttributes: selectedVariant?.attributes || {},
      priceOverride: finalPrice
    }));
    notifySuccess("Added to cart");
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/checkout");
  };

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <main className="min-h-screen bg-[var(--bg)] px-4 py-16 text-center text-[var(--cream)]">
        <h1 className="font-head text-4xl font-black">Product not found</h1>
        <Link to="/search" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#7C5CFC] px-5 text-sm font-bold text-white">Continue shopping</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-6 text-[var(--cream)] md:px-6">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)] md:text-sm">
          <Link to="/" className="hover:text-[var(--cyan)]">Home</Link>
          <span>/</span>
          <Link to={`/category/${product.category?.slug || "all"}`} className="hover:text-[var(--cyan)]">{product.category?.name || "Category"}</Link>
          <span>/</span>
          <span className="max-w-[48vw] truncate text-[var(--cream)]">{product.name}</span>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[55fr_45fr]">
          <ProductGallery
            images={images}
            productName={product.name}
            badge={discount >= 25 ? "HOT" : "Sponsored"}
            wishlisted={wishlisted}
            onToggleWishlist={() => toggleWishlist(product._id)}
          />

          <section className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">{product.brand || "Zivvo"}</p>
              <h1 className="mt-2 font-head text-2xl font-bold leading-tight md:text-3xl">{product.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#7C5CFC]/15 px-3 py-1 text-sm font-bold text-[#A78BFA]">
                  {avgRating} <StarRow value={avgRating} />
                </span>
                <button type="button" onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })} className="min-h-11 text-sm font-semibold text-[var(--cyan)]">
                  ({reviewCount.toLocaleString("en-IN")} ratings)
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-4">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-[28px] font-black text-[#7C5CFC]">{formatRupees(finalPrice)}</span>
                {mrp > finalPrice && <span className="pb-1 text-base text-[var(--muted)] line-through">{formatRupees(mrp)}</span>}
                {discount > 0 && <span className="mb-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-300">{discount}% off</span>}
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">Inclusive of all taxes</p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-4">
              <button type="button" onClick={() => setOffersOpen((value) => !value)} className="flex min-h-11 w-full items-center justify-between text-left font-bold">
                Offers & coupons
                <span>{offersOpen ? "−" : "+"}</span>
              </button>
              {offersOpen && (
                <div className="mt-3 grid gap-3 text-sm text-[var(--muted)]">
                  <p>Bank offer: 10% instant discount on select credit cards.</p>
                  <p>Coupon ZIVVO10: Save up to ₹200 on prepaid orders.</p>
                  <p>No cost EMI available on orders above ₹3,000.</p>
                </div>
              )}
            </div>

            <VariantSelector product={product} selectedVariant={selectedVariant} onSelect={setSelectedVariant} />

            <div className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex w-fit items-center overflow-hidden rounded-xl border border-[var(--border)]">
                <button type="button" className="min-h-11 px-4 text-xl" onClick={() => setQty((value) => Math.max(1, value - 1))}>−</button>
                <span className="min-w-12 text-center font-bold">{qty}</span>
                <button type="button" className="min-h-11 px-4 text-xl" onClick={() => setQty((value) => Math.min(stock || 1, value + 1))}>+</button>
              </div>
              <span className={`text-sm font-bold ${stock > 0 ? "text-emerald-300" : "text-[#F43F5E]"}`}>{stock > 0 ? `${stock} in stock` : "Out of stock"}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={handleAddToCart} disabled={stock <= 0 || (product.hasVariants && !selectedVariant)} className="h-12 rounded-xl border border-[#7C5CFC] text-sm font-black text-[#A78BFA] transition hover:bg-[#7C5CFC] hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
                Add to Cart
              </button>
              <button type="button" onClick={handleBuyNow} disabled={stock <= 0 || (product.hasVariants && !selectedVariant)} className="h-12 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#22D3EE] text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50">
                Buy Now
              </button>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-4">
              <p className="text-sm font-bold">Check delivery</p>
              <div className="mt-3 flex gap-2">
                <input value={pincode} onChange={(event) => setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter pincode" className={`min-h-11 flex-1 rounded-xl border bg-transparent px-3 text-sm outline-none ${pincodeError ? "border-[#F43F5E]" : "border-[var(--border)] focus:border-[#7C5CFC]"}`} />
                <button type="button" onClick={checkDelivery} className="min-h-11 rounded-xl bg-[#7C5CFC] px-4 text-sm font-bold text-white">Check</button>
              </div>
              {pincodeError && <p className="mt-2 text-sm text-[#F43F5E]">{pincodeError}</p>}
              {deliveryText && <p className="mt-2 text-sm font-semibold text-emerald-300">{deliveryText}</p>}
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-4 text-sm">
              <span className="text-[var(--muted)]">Sold by </span>
              <Link to={`/seller/${product.seller?._id}`} className="font-bold text-[var(--cream)] hover:text-[var(--cyan)]">{product.seller?.name || "Trusted Seller"}</Link>
              {product.seller?.isVerified && <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-black text-emerald-300">Verified</span>}
            </div>
          </section>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-5">
            <h2 className="font-head text-2xl font-black">Product Description</h2>
            <div className={`mt-4 overflow-hidden text-sm leading-7 text-[var(--muted)] ${descriptionOpen ? "" : "max-h-[200px]"}`}>
              {(product.description || "").split("\n").filter(Boolean).map((paragraph, index) => <p key={index} className="mb-3">{paragraph}</p>)}
            </div>
            {(product.description || "").length > 360 && (
              <button type="button" onClick={() => setDescriptionOpen((value) => !value)} className="mt-3 min-h-11 text-sm font-bold text-[var(--cyan)]">
                {descriptionOpen ? "Show less" : "Read more"}
              </button>
            )}
          </article>

          <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg2)]">
            <h2 className="p-5 font-head text-2xl font-black">Specifications</h2>
            {specsEntries.length ? specsEntries.map(([key, value], index) => (
              <div key={key} className={`grid grid-cols-[0.8fr_1fr] gap-3 px-5 py-3 text-sm ${index % 2 === 0 ? "bg-white/[0.03]" : ""}`}>
                <p className="text-[var(--muted)]">{key}</p>
                <p className="font-semibold text-[var(--cream)]">{value}</p>
              </div>
            )) : <p className="px-5 pb-5 text-sm text-[var(--muted)]">No specifications available.</p>}
          </article>
        </section>

        <section id="reviews" className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-5">
          <h2 className="font-head text-2xl font-black">Customer Reviews</h2>
          <div className="mt-5 grid gap-4">
            {(product.reviews || []).length ? product.reviews.map((review) => (
              <article key={review._id} className="rounded-xl border border-[var(--border)] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StarRow value={review.rating} />
                  <span className="font-bold">{review.title || "Customer review"}</span>
                  {review.verifiedPurchase && <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-black text-emerald-300">Verified Purchase</span>}
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{review.body || "No review text provided."}</p>
                <p className="mt-3 text-xs text-[var(--muted)]">By {review.buyer?.name || "Zivvo customer"}</p>
              </article>
            )) : <p className="text-sm text-[var(--muted)]">No reviews yet. Be the first to review this product after purchase.</p>}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-head text-2xl font-black">You may also like</h2>
            <Link to={`/category/${product.category?.slug || "all"}`} className="text-sm font-bold text-[var(--cyan)]">View category</Link>
          </div>
          {similarLoading ? (
            <SkeletonGrid count={4} />
          ) : similar.length ? (
            <div className="flex snap-x gap-4 overflow-x-auto pb-4">
              {similar.map((item) => (
                <div key={item._id} className="min-w-[240px] snap-start md:min-w-[280px]">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-5 text-sm text-[var(--muted)]">No similar products found right now.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default ProductDetailPage;
