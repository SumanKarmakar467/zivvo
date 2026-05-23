import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import PageTransition from "../components/common/PageTransition";
import {
  fetchCart,
  removeFromCart,
  selectCartItemCount,
  updateCartItem
} from "../store/slices/cartSlice";
import { notifyError, notifySuccess } from "../components/common/Toast";
import CouponInput from "../components/CouponInput";
import api from "../api/axios";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const rowAnim = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: 80 }
};

const cartImageFallback = "https://placehold.co/120x120/1f1a14/efe0d3?text=Zivvo";

export default function Cart() {
  const dispatch = useDispatch();
  const [pulseId, setPulseId] = useState("");

  const { items, subtotal, shipping, couponDiscount, total, loading, appliedCoupon } = useSelector((state) => state.cart);
  const { isAuthenticated, accessToken, loading: authLoading } = useSelector((state) => state.auth);
  const itemCount = useSelector(selectCartItemCount);
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    dispatch(fetchCart());
  }, [authLoading, accessToken, dispatch, isAuthenticated]);

  useEffect(() => {
    const loadEstimate = async () => {
      if (!isAuthenticated || !items.length) return;
      try {
        const addrRes = await api.get("/addresses");
        const defaultAddress = addrRes.data?.defaultAddress;
        if (!defaultAddress) {
          setDeliveryEstimate(null);
          return;
        }
        const firstSellerPincode = items[0]?.product?.seller?.pincode || "700001";
        const estimateRes = await api.post("/shipping/estimate", {
          sellerPincode: firstSellerPincode,
          buyerPincode: defaultAddress.pincode,
          items: items.map((item) => ({ productId: item.product?._id || item.product, qty: item.quantity }))
        });
        setDeliveryEstimate(estimateRes.data);
      } catch {
        setDeliveryEstimate(null);
      }
    };
    loadEstimate();
  }, [isAuthenticated, items]);

  const listPrice = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.product?.mrp || item.price || 0) * Number(item.quantity || 0), 0),
    [items]
  );
  const baseDiscount = Math.max(0, listPrice - subtotal);
  const totalSavings = baseDiscount + couponDiscount + (shipping === 0 && subtotal > 0 ? 40 : 0);

  const onQuantityChange = async (itemId, quantity) => {
    try {
      setPulseId(itemId);
      await dispatch(updateCartItem({ itemId, quantity }));
      setTimeout(() => setPulseId(""), 220);
    } catch (error) {
      notifyError(error?.message || "Failed to update quantity");
    }
  };

  const onRemove = async (itemId) => {
    await dispatch(removeFromCart(itemId));
    notifySuccess("Item removed");
  };

  if (!items.length && !loading) {
    return (
      <PageTransition>
        <div className="mx-auto flex min-h-[65vh] max-w-4xl flex-col items-center justify-center px-4 text-center">
          <div className="mb-4 text-6xl">??</div>
          <h2 className="text-2xl font-bold text-zivvo-text-base">Your cart is empty</h2>
          <Link to="/" className="mt-5 rounded-lg bg-zivvo-amber-brand px-5 py-3 text-sm font-semibold text-black">
            Start Shopping
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <section>
            <h1 className="mb-4 text-2xl font-bold text-zivvo-text-base">My Cart ({itemCount} items)</h1>

            <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-4">
              <AnimatePresence>
                {items.map((item) => {
                  const product = item.product || {};
                  const maxStock = Number(product.stock || 0);
                  const mrp = Number(product.mrp || item.price || 0);
                  const price = Number(item.price || 0);
                  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

                  return (
                    <motion.article key={item._id} variants={rowAnim} initial="hidden" animate="show" exit="exit" className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4">
                      <div className="flex gap-4">
                        <img
                          src={product.images?.[0] || cartImageFallback}
                          alt={product.name || "Product"}
                          onError={(e) => { e.currentTarget.src = cartImageFallback; }}
                          className="h-24 w-24 rounded-lg object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <Link to={`/product/${product.slug || ""}`} className="line-clamp-2 text-sm font-semibold text-zivvo-text-base hover:text-zivvo-amber-brand">
                            {product.name || "Unavailable Product"}
                          </Link>
                          <p className="mt-1 text-xs text-zivvo-text-soft">Seller: {product.seller?.name || "Seller"}</p>
                          {item.variantAttributes && Object.keys(item.variantAttributes).length > 0 && (
                            <p className="mt-1 text-xs text-zivvo-text-soft">
                              {Object.entries(item.variantAttributes).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                            </p>
                          )}

                          <motion.div animate={pulseId === item._id ? { scale: [1, 1.05, 1] } : { scale: 1 }} transition={{ duration: 0.22 }} className="mt-2 flex items-center gap-2">
                            <span className="text-lg font-bold text-zivvo-amber-brand">Rs {price.toLocaleString()}</span>
                            {mrp > price && <span className="text-sm text-zivvo-text-soft line-through">Rs {mrp.toLocaleString()}</span>}
                            {discount > 0 && <span className="rounded-full bg-green-600/20 px-2 py-0.5 text-xs font-semibold text-green-400">{discount}% off</span>}
                          </motion.div>

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onQuantityChange(item._id, Math.max(0, item.quantity - 1))}
                              className="rounded border border-zivvo-dark-raised px-2 py-1 text-sm"
                            >
                              -
                            </button>
                            <input
                              value={item.quantity}
                              onChange={(e) => onQuantityChange(item._id, Math.max(0, Number(e.target.value || 0)))}
                              className="w-14 rounded border border-zivvo-dark-raised bg-zivvo-dark-bg px-2 py-1 text-center text-sm outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => onQuantityChange(item._id, Math.min(item.quantity + 1, maxStock || item.quantity + 1))}
                              className="rounded border border-zivvo-dark-raised px-2 py-1 text-sm"
                            >
                              +
                            </button>
                            <button type="button" onClick={() => onRemove(item._id)} className="ml-3 text-sm text-red-400 hover:text-red-300">
                              Remove
                            </button>
                          </div>

                          {(item.isOutOfStock || item.isDeleted || item.quantity > maxStock) && (
                            <p className="mt-2 text-xs text-red-400">Stock warning: Item is out of stock or quantity exceeds available stock.</p>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </section>

          <aside className="h-fit rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-5 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-zivvo-text-base">Price Details</h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Price ({itemCount} items)</span><span>Rs {listPrice.toLocaleString()}</span></div>
              <div className="flex justify-between text-green-400"><span>Discount</span><span>-Rs {baseDiscount.toLocaleString()}</span></div>
              {couponDiscount > 0 && <div className="flex justify-between text-green-400"><span>Coupon Discount</span><span>-Rs {couponDiscount.toLocaleString()}</span></div>}
              <div className="flex justify-between"><span>Delivery</span><span className={shipping === 0 ? "text-green-400" : ""}>{shipping === 0 ? "FREE" : `Rs ${shipping}`}</span></div>
              <div className="flex justify-between"><span>Delivery charges</span><span>{deliveryEstimate ? `₹${Number(deliveryEstimate.cost).toLocaleString("en-IN")} (${deliveryEstimate.zone})` : "Add an address to see delivery charges"}</span></div>
            </div>

            <div className="my-4 border-t border-zivvo-dark-raised" />

            <div className="flex items-center justify-between text-xl font-bold">
              <span>Total Amount</span>
              <span>Rs {Number(total || 0).toLocaleString()}</span>
            </div>
            <p className="mt-2 text-sm text-green-400">You save Rs {Math.max(0, totalSavings).toLocaleString()} on this order</p>

            <div className="mt-5">
              <CouponInput cartTotal={Number(subtotal || 0)} items={items} />
              {appliedCoupon && (
                <p className="mt-2 text-xs text-green-400">
                  Coupon {appliedCoupon.code}: -₹{Number(appliedCoupon.discount || 0).toLocaleString("en-IN")}
                </p>
              )}
            </div>

            <Link to="/checkout" className="mt-5 block w-full rounded-lg bg-zivvo-amber-brand py-3 text-center text-sm font-semibold text-black">
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
