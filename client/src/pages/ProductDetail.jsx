import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PageTransition from "../components/common/PageTransition";
import { formatPrice } from "../utils/formatPrice";
import { addToCart } from "../store/slices/cartSlice";
import { useGetProductBySlugQuery, useGetReviewEligibilityQuery } from "../services/productApi";
import { notifySuccess } from "../components/common/Toast";
import StarRating from "../components/StarRating";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import WishlistButton from "../components/WishlistButton";
import VariantSelector from "../components/VariantSelector";
import RecommendationsSection from "../components/RecommendationsSection";
import RecentlyViewedStrip from "../components/RecentlyViewedStrip";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data, isLoading } = useGetProductBySlugQuery(slug);
  const product = data?.product;

  const { data: eligibility } = useGetReviewEligibilityQuery(product?._id, {
    skip: !product?._id || !isAuthenticated
  });

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [pincode, setPincode] = useState("");
  const [deliveryText, setDeliveryText] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const { addProduct } = useRecentlyViewed();

  const avgRating = Number(product?.averageRating ?? product?.rating ?? 0);
  const reviewCount = Number(product?.reviewCount ?? product?.numReviews ?? 0);
  const stock = Number(product?.hasVariants ? (selectedVariant?.stock || 0) : (product?.stock || 0));
  const specsEntries = useMemo(() => Object.entries(product?.specs || {}), [product]);

  useEffect(() => {
    if (product?._id) {
      addProduct(product._id);
    }
  }, [product?._id, addProduct]);

  const handleAddToCart = () => {
    if (!product || stock <= 0) return;
    if (product.hasVariants && !selectedVariant) return;
    const finalPrice = product.hasVariants ? Number(product.price + Number(selectedVariant?.priceDelta || 0)) : Number(product.price);
    dispatch(addToCart({
      productId: product._id,
      quantity: qty,
      productData: product,
      variantSku: selectedVariant?.sku || "",
      variantAttributes: selectedVariant?.attributes || {},
      priceOverride: finalPrice
    }));
    notifySuccess("Added to cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const checkPincode = () => {
    if (!pincode.trim()) {
      setDeliveryText("Please enter a pincode");
      return;
    }
    if (pincode.trim().startsWith("7")) {
      setDeliveryText("Delivered by Tomorrow");
      return;
    }
    setDeliveryText("Delivered in 3-5 days");
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl p-6 text-zivvo-text-muted">Loading product...</div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-7xl p-6 text-zivvo-text-muted">Product not found.</div>
      </PageTransition>
    );
  }

  const images = product.images?.length ? product.images : ["https://picsum.photos/600/750"];

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <nav className="mb-5 flex items-center gap-2 text-xs text-zivvo-text-soft md:text-sm">
          <Link to="/" className="hover:text-zivvo-text-base">Home</Link>
          <span>&gt;</span>
          <Link to={`/category/${product.category?.slug || "all"}`} className="hover:text-zivvo-text-base">{product.category?.name || "Category"}</Link>
          <span>&gt;</span>
          <span className="truncate text-zivvo-text-muted">{product.name}</span>
        </nav>

        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="group overflow-hidden rounded-xl bg-zivvo-dark-raised">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="h-full w-full object-contain transition-transform duration-500 md:group-hover:scale-110"
                />
              </div>
            </div>

            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {images.slice(0, 5).map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-20 w-16 shrink-0 overflow-hidden rounded-lg border ${
                    activeImage === index ? "border-zivvo-amber-brand" : "border-zivvo-dark-raised"
                  }`}
                >
                  <img src={img} alt={`${product.name}-${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            <div className="mt-2 flex justify-center gap-1.5 md:hidden">
              {images.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  type="button"
                  className={`h-1.5 w-5 rounded-full ${activeImage === index ? "bg-zivvo-amber-brand" : "bg-zivvo-dark-raised"}`}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zivvo-amber-brand">{product.brand || "Zivvo"}</p>
            <h2 className="mt-2 text-2xl font-bold text-zivvo-text-base md:text-3xl">{product.name}</h2>

            <div className="mt-3 flex items-center gap-2">
              <StarRating value={avgRating} size={16} />
              <button
                type="button"
                className="text-sm text-zivvo-text-muted hover:text-zivvo-amber-brand"
                onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })}
              >
                ({reviewCount} reviews)
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-zivvo-amber-brand">₹{Number(product.hasVariants ? (product.price + Number(selectedVariant?.priceDelta || 0)) : product.price).toLocaleString("en-IN")}</span>
              {Number(product.mrp) > Number(product.price) && (
                <>
                  <span className="text-lg text-zivvo-text-soft line-through">?{formatPrice(product.mrp)}</span>
                  <span className="rounded-full bg-green-600/20 px-2 py-1 text-xs font-semibold text-green-400">
                    {product.discount}% off
                  </span>
                </>
              )}
            </div>

            <div className="mt-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stock > 0 ? "bg-green-600/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {product.hasVariants && (
              <VariantSelector
                attributeOptions={product.attributeOptions || {}}
                variants={product.variants || []}
                onSelect={setSelectedVariant}
                basePrice={Number(product.price || 0)}
              />
            )}

            <div className="mt-5 rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4">
              <p className="text-sm font-medium text-zivvo-text-muted">Check delivery by pincode</p>
              <div className="mt-2 flex gap-2">
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter pincode"
                  className="w-full rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm text-zivvo-text-base outline-none focus:border-zivvo-amber-brand"
                />
                <button type="button" onClick={checkPincode} className="rounded-md bg-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-black">
                  Check
                </button>
              </div>
              {deliveryText && <p className="mt-2 text-sm text-zivvo-text-muted">{deliveryText}</p>}
            </div>

            <div className="mt-5 flex w-fit items-center rounded-lg border border-zivvo-dark-raised bg-zivvo-dark-surface">
              <button type="button" className="px-4 py-2 text-lg" onClick={() => setQty((prev) => Math.max(1, prev - 1))}>-</button>
              <span className="min-w-12 text-center text-sm font-semibold">{qty}</span>
              <button type="button" className="px-4 py-2 text-lg" onClick={() => setQty((prev) => Math.min(stock || 1, prev + 1))}>+</button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button type="button" disabled={product.hasVariants && !selectedVariant} onClick={handleAddToCart} className="w-full rounded-lg border border-zivvo-amber-brand py-3 text-sm font-semibold text-zivvo-amber-brand disabled:opacity-50">
                Add to Cart
              </button>
              <button type="button" disabled={product.hasVariants && !selectedVariant} onClick={handleBuyNow} className="w-full rounded-lg bg-zivvo-amber-brand py-3 text-sm font-semibold text-black disabled:opacity-50">
                Buy Now
              </button>
            </div>

            <WishlistButton
              product={product}
              className="mt-4 inline-flex items-center gap-2 text-sm text-zivvo-text-muted hover:text-zivvo-amber-brand"
              iconClassName="text-base"
              showLabel
            />

            <p className="mt-4 text-sm text-zivvo-text-muted">?? Sold by: <span className="text-zivvo-text-base">{product.seller?.name || "Trusted Seller"}</span></p>
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4 md:p-6">
          <div className="mb-5 flex gap-2">
            <button
              type="button"
              className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "description" ? "bg-zivvo-amber-brand text-black" : "bg-zivvo-dark-raised text-zivvo-text-muted"}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              type="button"
              className={`rounded-md px-4 py-2 text-sm font-semibold ${activeTab === "specs" ? "bg-zivvo-amber-brand text-black" : "bg-zivvo-dark-raised text-zivvo-text-muted"}`}
              onClick={() => setActiveTab("specs")}
            >
              Specifications
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="space-y-3 text-sm leading-7 text-zivvo-text-muted">
              {(product.description || "")
                .split("\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={`desc-${index}`}>{paragraph}</p>
                ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-zivvo-dark-raised">
              {specsEntries.length === 0 ? (
                <p className="p-4 text-sm text-zivvo-text-soft">No specifications available.</p>
              ) : (
                specsEntries.map(([key, value], index) => (
                  <div key={key} className={`grid grid-cols-2 gap-3 p-3 text-sm ${index !== specsEntries.length - 1 ? "border-b border-zivvo-dark-raised" : ""}`}>
                    <p className="text-zivvo-text-soft">{key}</p>
                    <p className="text-zivvo-text-base">{value}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        <section id="reviews" className="mt-10">
          <h3 className="mb-5 text-xl font-bold">Ratings &amp; Reviews</h3>
          {isAuthenticated && (
            <ReviewForm
              productId={product._id}
              eligibility={eligibility}
              onSubmitted={() => notifySuccess("Review added")}
            />
          )}
          <ReviewList productId={product._id} />
        </section>

        <RecommendationsSection
          productId={product._id}
          category={product.category?._id}
          sellerId={product.seller?._id}
        />

        <RecentlyViewedStrip />

      </div>

    </PageTransition>
  );
}
