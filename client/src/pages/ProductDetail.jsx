import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import PageTransition from "../components/common/PageTransition";
import ProductCard from "../components/ProductCard";
import { formatPrice } from "../utils/formatPrice";
import { addToCart } from "../store/slices/cartSlice";
import { useCreateReviewMutation, useGetProductBySlugQuery, useGetReviewsQuery } from "../services/productApi";
import { notifyError, notifySuccess } from "../components/common/Toast";

const starRow = [1, 2, 3, 4, 5];

const renderStars = (rating, size = "text-sm") => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div className={`flex items-center gap-0.5 ${size}`}>
      {starRow.map((star) => {
        if (star <= full) return <span key={star} className="text-zivvo-amber-brand">?</span>;
        if (star === full + 1 && hasHalf) return <span key={star} className="text-zivvo-amber-brand">?</span>;
        return <span key={star} className="text-zivvo-text-soft">?</span>;
      })}
    </div>
  );
};

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data, isLoading } = useGetProductBySlugQuery(slug);
  const product = data?.product;
  const relatedProducts = data?.relatedProducts || [];

  const { data: reviewData } = useGetReviewsQuery(
    { product: product?._id, page: 1, limit: 10, sort: "recent" },
    { skip: !product?._id }
  );

  const [createReview, { isLoading: creatingReview }] = useCreateReviewMutation();

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryText, setDeliveryText] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", body: "" });

  const avgRating = Number(product?.rating || 0);
  const reviewCount = Number(product?.numReviews || 0);
  const stock = Number(product?.stock || 0);

  const ratingBreakdown = reviewData?.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const specsEntries = useMemo(() => Object.entries(product?.specs || {}), [product]);

  const handleAddToCart = () => {
    if (!product || stock <= 0) return;
    dispatch(addToCart({ productId: product._id, quantity: qty, productData: product }));
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

  const submitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      notifyError("Please login to write a review");
      return;
    }

    if (!reviewForm.title.trim() || !reviewForm.body.trim()) {
      notifyError("Please add both title and review body");
      return;
    }

    try {
      await createReview({
        product: product._id,
        rating: reviewForm.rating,
        title: reviewForm.title.trim(),
        body: reviewForm.body.trim()
      }).unwrap();

      notifySuccess("Review submitted successfully");
      setShowReviewModal(false);
      setReviewForm({ rating: 5, title: "", body: "" });
    } catch (error) {
      notifyError(error?.data?.message || "Failed to submit review");
    }
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
              {renderStars(avgRating)}
              <button
                type="button"
                className="text-sm text-zivvo-text-muted hover:text-zivvo-amber-brand"
                onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })}
              >
                ({reviewCount} reviews)
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-zivvo-amber-brand">?{formatPrice(product.price)}</span>
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
              <button type="button" onClick={handleAddToCart} className="w-full rounded-lg border border-zivvo-amber-brand py-3 text-sm font-semibold text-zivvo-amber-brand">
                Add to Cart
              </button>
              <button type="button" onClick={handleBuyNow} className="w-full rounded-lg bg-zivvo-amber-brand py-3 text-sm font-semibold text-black">
                Buy Now
              </button>
            </div>

            <button type="button" className="mt-4 inline-flex items-center gap-2 text-sm text-zivvo-text-muted hover:text-zivvo-amber-brand" onClick={() => setWishlist((prev) => !prev)}>
              <span className={wishlist ? "text-red-400" : "text-zivvo-text-muted"}>?</span>
              <span>{wishlist ? "Wishlisted" : "Add to Wishlist"}</span>
            </button>

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
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold">Ratings &amp; Reviews</h3>
            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="rounded-lg border border-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-zivvo-amber-brand"
            >
              Write a Review
            </button>
          </div>

          <div className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4 md:p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-5xl font-bold text-zivvo-text-base">{avgRating.toFixed(1)}</p>
                {renderStars(avgRating, "text-lg")}
                <p className="mt-1 text-sm text-zivvo-text-soft">Based on {reviewData?.total || 0} reviews</p>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingBreakdown[star] || 0;
                  const total = reviewData?.total || 0;
                  const percentage = total ? Math.round((count / total) * 100) : 0;

                  return (
                    <div key={`bar-${star}`} className="flex items-center gap-2 text-sm">
                      <span className="w-8 text-zivvo-text-muted">{star}?</span>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-zivvo-dark-raised">
                        <div className="h-full rounded-full bg-zivvo-amber-brand" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="w-12 text-right text-zivvo-text-soft">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {(reviewData?.reviews || []).map((review) => (
              <article key={review._id} className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zivvo-dark-raised text-sm font-bold text-zivvo-amber-brand">
                      {(review.user?.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zivvo-text-base">{review.user?.name || "User"}</p>
                      <p className="text-xs text-zivvo-text-soft">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {review.verified && <span className="rounded-full bg-green-600/20 px-2 py-1 text-xs font-semibold text-green-400">Verified</span>}
                </div>
                <div className="mt-3">{renderStars(review.rating)}</div>
                <h4 className="mt-2 text-sm font-semibold text-zivvo-text-base">{review.title}</h4>
                <p className="mt-1 text-sm leading-6 text-zivvo-text-muted">{review.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h3 className="mb-4 text-xl font-bold">You may also like</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {relatedProducts.map((item) => (
              <div key={item._id} className="w-[220px] shrink-0">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold">Write a Review</h4>
              <button type="button" onClick={() => setShowReviewModal(false)} className="text-zivvo-text-soft hover:text-zivvo-text-base">?</button>
            </div>

            <form className="space-y-4" onSubmit={submitReview}>
              <div>
                <p className="mb-2 text-sm text-zivvo-text-muted">Your Rating</p>
                <div className="flex gap-1 text-2xl">
                  {starRow.map((star) => (
                    <button
                      key={`pick-${star}`}
                      type="button"
                      className={star <= reviewForm.rating ? "text-zivvo-amber-brand" : "text-zivvo-text-soft"}
                      onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                    >
                      ?
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-zivvo-text-muted">Title</label>
                <input
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm outline-none focus:border-zivvo-amber-brand"
                  placeholder="Review title"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-zivvo-text-muted">Review</label>
                <textarea
                  value={reviewForm.body}
                  onChange={(e) => setReviewForm((prev) => ({ ...prev, body: e.target.value }))}
                  rows={4}
                  className="w-full rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm outline-none focus:border-zivvo-amber-brand"
                  placeholder="Tell us what you liked or disliked"
                />
              </div>

              <button
                disabled={creatingReview}
                className="w-full rounded-lg bg-zivvo-amber-brand py-2.5 text-sm font-semibold text-black disabled:opacity-70"
              >
                {creatingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </PageTransition>
  );
}
