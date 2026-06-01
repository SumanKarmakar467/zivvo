export const calculateZivvoScore = (product, reviews = []) => {
  const avgRating = product?.ratings?.average || 0;
  const totalReviews = reviews.length;
  const verifiedReviews = reviews.filter((r) => r.isVerifiedPurchase).length;
  const returnRate = Math.min((product?.returns || 0) / Math.max(product?.sold || 1, 1), 1);
  const sellerRating = product?.sellerRating || 4.2;
  const score = (avgRating / 5) * 40 + (totalReviews ? (verifiedReviews / totalReviews) * 20 : 0) + (1 - returnRate) * 20 + (sellerRating / 5) * 20;
  return Math.max(0, Math.min(100, Math.round(score)));
};
