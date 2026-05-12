import { useState } from "react";
import { notifyError, notifySuccess } from "./common/Toast";
import StarRating from "./StarRating";
import { useCreateReviewMutation } from "../services/productApi";

export default function ReviewForm({ productId, eligibility, onSubmitted }) {
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const [form, setForm] = useState({ rating: 5, title: "", body: "", images: [] });

  if (!eligibility?.canReview) return null;

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3);
    setForm((prev) => ({ ...prev, images: files }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.body.trim()) return notifyError("Review body is required");

    const payload = new FormData();
    payload.append("product", productId);
    payload.append("rating", String(form.rating));
    payload.append("title", form.title.trim());
    payload.append("body", form.body.trim());
    form.images.forEach((image) => payload.append("images", image));

    try {
      await createReview(payload).unwrap();
      notifySuccess("Review submitted");
      setForm({ rating: 5, title: "", body: "", images: [] });
      if (onSubmitted) onSubmitted();
    } catch (error) {
      notifyError(error?.data?.message || "Failed to submit review");
    }
  };

  return (
    <form onSubmit={onSubmit} className="mb-5 rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4">
      <h4 className="text-base font-semibold">Write a review</h4>
      <div className="mt-3">
        <StarRating value={form.rating} onChange={(rating) => setForm((prev) => ({ ...prev, rating }))} size={24} />
      </div>
      <input
        value={form.title}
        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        placeholder="Title"
        className="mt-3 w-full rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm"
      />
      <textarea
        value={form.body}
        onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
        placeholder="Share your experience"
        rows={4}
        className="mt-3 w-full rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm"
        required
      />
      <input type="file" multiple accept="image/*" onChange={onFiles} className="mt-3 block text-sm" />
      <button disabled={isLoading} className="mt-3 rounded-md bg-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-black disabled:opacity-70">
        {isLoading ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}
