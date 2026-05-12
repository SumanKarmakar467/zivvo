import { useState } from "react";
import { notifyError, notifySuccess } from "./common/Toast";
import ReviewCard from "./ReviewCard";
import { useGetReviewsQuery, useMarkReviewHelpfulMutation } from "../services/productApi";

export default function ReviewList({ productId }) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("most_recent");
  const { data, isLoading } = useGetReviewsQuery({ product: productId, page, limit: 10, sort }, { skip: !productId });
  const [markHelpful] = useMarkReviewHelpfulMutation();

  const total = data?.total || 0;
  const breakdown = data?.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  const handleHelpful = async (reviewId) => {
    try {
      await markHelpful(reviewId).unwrap();
      notifySuccess("Thanks for your feedback");
    } catch (error) {
      notifyError(error?.data?.message || "Could not mark as helpful");
    }
  };

  return (
    <div>
      <div className="mb-4 rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold">Customer reviews</h4>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-2 py-1 text-sm">
            <option value="most_recent">Most recent</option>
            <option value="most_helpful">Most helpful</option>
          </select>
        </div>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = breakdown[star] || 0;
            const percent = total ? Math.round((count / total) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-8">{star}★</span>
                <div className="h-2 w-full rounded-full bg-zivvo-dark-raised">
                  <div className="h-full rounded-full bg-zivvo-amber-brand" style={{ width: `${percent}%` }} />
                </div>
                <span className="w-12 text-right text-zivvo-text-soft">{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-zivvo-text-soft">Loading reviews...</p>
      ) : (
        <div className="space-y-4">
          {(data?.reviews || []).map((review) => (
            <ReviewCard key={review._id} review={review} onHelpful={() => handleHelpful(review._id)} />
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {Array.from({ length: data?.pages || 0 }).map((_, idx) => {
          const p = idx + 1;
          return (
            <button key={p} type="button" onClick={() => setPage(p)} className={`rounded px-3 py-1 text-sm ${p === page ? "bg-zivvo-amber-brand text-black" : "bg-zinc-800"}`}>
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}
