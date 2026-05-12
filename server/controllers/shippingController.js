import Product from "../models/Product.js";
import { estimateShipping } from "../utils/shippingCost.js";

export const estimateShippingCost = async (req, res, next) => {
  try {
    const { sellerPincode, buyerPincode, items = [] } = req.body;
    const productIds = items.map((item) => item.productId).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } }).select("weight").lean();
    const map = new Map(products.map((product) => [String(product._id), Number(product.weight || 500)]));

    const totalWeight = items.reduce((sum, item) => {
      const weight = map.get(String(item.productId)) ?? 500;
      return sum + weight * Number(item.qty || 0);
    }, 0);

    const estimate = estimateShipping(sellerPincode, buyerPincode, totalWeight);
    res.json(estimate);
  } catch (err) {
    next(err);
  }
};

