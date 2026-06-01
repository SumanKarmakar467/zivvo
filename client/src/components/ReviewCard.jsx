import StarRating from "./StarRating";
import { avatarImageFallback, productImageFallback } from "../utils/imageFallbacks";

export default function ReviewCard({ review, onHelpful }) {
  const displayName = review?.userName || review?.buyer?.name || "User";
  const comment = review?.comment || review?.body || "";
  return (
    <article className="rounded-lg border border-violet-500/30 bg-[#0B0D1A] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {review?.buyer?.avatar ? (
            <img
              src={review.buyer.avatar || avatarImageFallback}
              alt={displayName}
              onError={(e) => { e.currentTarget.src = avatarImageFallback; }}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="grid h-10 w-10 place-items-center rounded-full bg-violet-600 text-sm font-bold text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-cyan-200/60">{new Date(review.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
          </div>
        </div>
        {review?.verifiedPurchase && <span className="rounded-full bg-green-600/20 px-2 py-1 text-xs text-green-300">Verified purchase</span>}
      </div>

      <div className="mt-3">
        <StarRating value={review.rating} size={16} />
      </div>
      {review?.title && <h4 className="mt-2 text-sm font-semibold">{review.title}</h4>}
      <p className="mt-1 text-sm text-zivvo-text-muted">{comment}</p>

      {Array.isArray(review.images) && review.images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {review.images.slice(0, 3).map((image) => (
            <img key={image} src={image} alt="review" onError={(e) => { e.currentTarget.src = productImageFallback; }} className="h-20 w-full rounded-md object-cover" />
          ))}
        </div>
      )}

      {review?.sellerResponse?.text && (
        <div className="mt-3 rounded-lg bg-zinc-900 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zivvo-text-soft">Seller response</p>
          <p className="mt-1 text-sm text-zivvo-text-muted">{review.sellerResponse.text}</p>
        </div>
      )}

      {onHelpful && (
        <button type="button" onClick={onHelpful} className="mt-3 rounded-md border border-zinc-700 px-3 py-1 text-xs text-zivvo-text-muted hover:text-zivvo-text-base">
          Helpful? ({review.helpfulVotes || 0})
        </button>
      )}
    </article>
  );
}
