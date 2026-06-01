import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/axios";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRating";
import { notifyError, notifySuccess } from "./common/Toast";

export default function ReviewsSection({ productId, averageRating = 0, totalReviews = 0 }) {
  // TODO: Replace with memoized selector from store/selectors.js
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ averageRating, totalReviews, ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentUserId = String(user?._id || user?.uid || "");
  const existingReview = useMemo(
    () => reviews.find((review) => String(review.userId || review.buyer?._id) === currentUserId),
    [reviews, currentUserId]
  );

  const loadReviews = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${productId}/reviews`);
      setReviews(data.reviews || []);
      setSummary({
        averageRating: data.averageRating ?? averageRating,
        totalReviews: data.total ?? totalReviews,
        ratingBreakdown: data.ratingBreakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return notifyError("Review comment is required");
    setSubmitting(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment: comment.trim() });
      setComment("");
      setRating(5);
      notifySuccess("Review submitted");
      await loadReviews();
    } catch (error) {
      notifyError(error?.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const total = Number(summary.totalReviews || reviews.length || 0);

  return (
    <section id="reviews" className="mt-10 rounded-lg border border-violet-500/20 bg-white/[0.03] p-4 md:p-6">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div>
          <h3 className="text-xl font-bold">Ratings &amp; Reviews</h3>
          <div className="mt-4 flex items-center gap-3">
            <StarRating rating={Number(summary.averageRating || 0)} size="lg" />
            <div>
              <p className="text-lg font-bold">{Number(summary.averageRating || 0).toFixed(1)} out of 5</p>
              <p className="text-sm text-cyan-200/70">({total} reviews)</p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = Number(summary.ratingBreakdown?.[star] || 0);
              const percent = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs text-cyan-100/80">
                  <span className="w-8">{star} star</span>
                  <div className="h-2 flex-1 rounded-full bg-violet-950/80">
                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-9 text-right">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {isAuthenticated && !existingReview && (
            <form onSubmit={submitReview} className="rounded-lg border border-violet-500/30 bg-[#05060F] p-4">
              <h4 className="font-semibold">Write a Review</h4>
              <div className="mt-3">
                <StarRating rating={rating} interactive onRate={setRating} size="lg" />
              </div>
              <textarea
                value={comment}
                maxLength={500}
                onChange={(event) => setComment(event.target.value)}
                rows={4}
                placeholder="Share your experience"
                className="mt-3 w-full rounded-lg border border-violet-500/30 bg-[#0B0D1A] px-3 py-2 text-sm text-white outline-none placeholder:text-cyan-200/40 focus:border-cyan-300"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-cyan-200/60">
                <span>{comment.length}/500</span>
                <button disabled={submitting} className="rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          )}

          {existingReview && (
            <div className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 p-4">
              <p className="mb-3 text-sm font-semibold text-cyan-100">You reviewed this product</p>
              <ReviewCard review={existingReview} />
            </div>
          )}

          {loading ? (
            <p className="text-sm text-cyan-200/70">Loading reviews...</p>
          ) : (
            reviews.filter((review) => review !== existingReview).map((review) => (
              <ReviewCard key={review._id || `${review.userId}-${review.createdAt}`} review={review} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
