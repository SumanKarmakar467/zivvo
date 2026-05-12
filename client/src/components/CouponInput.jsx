import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { applyCoupon, clearCoupon, removeCoupon, setCoupon } from "../store/slices/cartSlice";
import { notifyError, notifySuccess } from "./common/Toast";

export default function CouponInput({ cartTotal, items = [] }) {
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const appliedCoupon = useSelector((state) => state.cart.appliedCoupon);

  const sellerId = useMemo(() => {
    const first = items.find((item) => item?.product?.seller?._id || item?.product?.seller);
    return first?.product?.seller?._id || first?.product?.seller || "";
  }, [items]);

  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((item) => {
      const category = item?.product?.category?.slug || item?.product?.category;
      if (category) set.add(String(category));
    });
    return Array.from(set);
  }, [items]);

  const onApply = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/coupons/validate", { code: code.trim(), cartTotal, sellerId, categories });
      dispatch(setCoupon({ ...res.data.coupon, discount: res.data.discount, finalTotal: res.data.finalTotal }));
      await dispatch(applyCoupon(code.trim())).unwrap();
      setCode("");
      notifySuccess(`Coupon ${res.data.coupon.code} applied`);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Coupon validation failed";
      setError(message);
      notifyError(message);
    } finally {
      setLoading(false);
    }
  };

  const onClear = async () => {
    dispatch(clearCoupon());
    await dispatch(removeCoupon());
  };

  if (appliedCoupon) {
    return (
      <div className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm text-green-300">
        <div className="flex items-center justify-between gap-2">
          <span>Coupon {appliedCoupon.code}: -₹{Number(appliedCoupon.discount || 0).toLocaleString("en-IN")} ✓</span>
          <button type="button" onClick={onClear} className="text-lg leading-none">×</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="w-full rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm outline-none focus:border-zivvo-amber-brand"
        />
        <button type="button" disabled={loading || !code.trim()} onClick={onApply} className="rounded-md bg-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-black disabled:opacity-60">
          {loading ? "Applying..." : "Apply"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
