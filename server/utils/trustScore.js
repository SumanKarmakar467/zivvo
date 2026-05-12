import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ReturnRequest from "../models/ReturnRequest.js";
import User from "../models/User.js";

export async function recalcTrustScore(sellerId) {
  const [orders, returns, products] = await Promise.all([
    Order.find({ "items.seller": sellerId }).select("orderStatus").lean(),
    ReturnRequest.find({ seller: sellerId }).select("status").lean(),
    Product.find({ seller: sellerId, isActive: true }).select("averageRating").lean()
  ]);

  const totalOrders = orders.length;
  if (totalOrders === 0) {
    await User.findByIdAndUpdate(sellerId, { trustScore: 0 });
    return 0;
  }

  const delivered = orders.filter((order) => order.orderStatus === "delivered").length;
  const fulfillmentRate = delivered / totalOrders;
  const fulfillmentScore = fulfillmentRate * 40;

  const avgRating = products.length
    ? products.reduce((sum, product) => sum + Number(product.averageRating || 0), 0) / products.length
    : 0;
  const ratingScore = (avgRating / 5) * 35;

  const activeReturns = returns.filter((ret) => ret.status !== "rejected").length;
  const returnRate = activeReturns / totalOrders;
  const returnScore = Math.max(0, 1 - returnRate * 5) * 25;

  const total = Math.max(0, Math.min(100, Math.round(fulfillmentScore + ratingScore + returnScore)));
  await User.findByIdAndUpdate(sellerId, { trustScore: total });
  return total;
}

export function recalcTrustScoreAsync(sellerId) {
  setImmediate(async () => {
    try {
      await recalcTrustScore(sellerId);
    } catch (_err) {
      // Intentionally swallow to avoid blocking API response path.
    }
  });
}

