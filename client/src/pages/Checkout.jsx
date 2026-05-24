import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";
import { fetchCart } from "../store/slices/cartSlice";
import { useCreateRazorpayOrderMutation, useVerifyPaymentMutation } from "../services/paymentApi";
import { notifyError, notifySuccess } from "../components/common/Toast";

const defaultAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: ""
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);

  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(defaultAddress);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);

  const [createOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    const loadAddresses = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/addresses`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses || []);
        if (!selectedAddressId && data.addresses?.length) setSelectedAddressId(data.addresses[0]._id);
      }
    };
    loadAddresses();
  }, [accessToken, isAuthenticated, selectedAddressId]);

  const selectedAddress = useMemo(() => addresses.find((a) => a._id === selectedAddressId), [addresses, selectedAddressId]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const saveAddress = async () => {
    if (!/^\d{10}$/.test(addressForm.phone)) return notifyError("Phone must be 10 digits");
    if (!/^\d{6}$/.test(addressForm.pincode)) return notifyError("Pincode must be 6 digits");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/users/addresses`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(addressForm)
    });
    const data = await res.json();
    if (!res.ok) return notifyError(data?.message || "Failed to save address");
    setAddresses(data.addresses || []);
    setSelectedAddressId(data.address?._id || "");
    setShowAddressForm(false);
    setAddressForm(defaultAddress);
  };

  const placeOrder = async () => {
    if (!selectedAddressId) return notifyError("Please select an address");
    setLoading(true);

    try {
      if (paymentMethod === "cod") {
        const result = await createOrder({ addressId: selectedAddressId, paymentMethod: "cod" }).unwrap();
        notifySuccess("Order placed successfully");
        navigate(`/order-success/${result.orderId}`);
        return;
      }

      const orderData = await createOrder({ addressId: selectedAddressId, paymentMethod: "razorpay" }).unwrap();

      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setLoading(false);
        return notifyError("Razorpay SDK failed to load");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.keyId,
        amount: orderData.amount,
        currency: "INR",
        name: "Zivvo",
        description: "India's Smartest Marketplace",
        order_id: orderData.razorpayOrderId,
        theme: { color: "#ef9f27" },
        handler: async (response) => {
          try {
            const verified = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderData.orderId,
              addressId: selectedAddressId
            }).unwrap();
            notifySuccess("Order placed successfully");
            navigate(`/order-success/${verified.orderId}`);
          } catch (err) {
            notifyError(err?.data?.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            notifyError("Payment was cancelled");
            setLoading(false);
          }
        }
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      notifyError(err?.data?.message || "Order creation failed");
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 flex items-center gap-2 text-sm">
          {["Address", "Payment", "Confirm"].map((label, i) => (
            <div key={label} className={`rounded-full px-3 py-1 ${step >= i + 1 ? "bg-zivvo-amber-brand text-black" : "bg-zivvo-dark-raised text-zivvo-text-soft"}`}>
              {i + 1}. {label}
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <section className="rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-5">
            {step === 1 && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Select Delivery Address</h2>
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <button key={addr._id} onClick={() => setSelectedAddressId(addr._id)} className={`w-full rounded-lg border p-3 text-left ${selectedAddressId === addr._id ? "border-zivvo-amber-brand" : "border-zivvo-dark-raised"}`}>
                      <p className="font-semibold">{addr.fullName} • {addr.phone}</p>
                      <p className="text-sm text-zivvo-text-muted">{addr.addressLine1}, {addr.addressLine2}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </button>
                  ))}
                </div>

                <button onClick={() => setShowAddressForm((v) => !v)} className="mt-4 rounded-lg border border-zivvo-amber-brand px-4 py-2 text-sm text-zivvo-amber-brand">
                  Add New Address
                </button>

                {showAddressForm && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {Object.keys(defaultAddress).map((key) => (
                      <input
                        key={key}
                        placeholder={key.replace(/([A-Z])/g, " $1")}
                        value={addressForm[key]}
                        onChange={(e) => setAddressForm((s) => ({ ...s, [key]: e.target.value }))}
                        className="rounded-md border border-zivvo-dark-raised bg-zivvo-dark-bg px-3 py-2 text-sm"
                      />
                    ))}
                    <button onClick={saveAddress} className="rounded-md bg-zivvo-amber-brand px-4 py-2 text-sm font-semibold text-black">Save Address</button>
                  </div>
                )}

                <button disabled={!selectedAddressId} onClick={() => setStep(2)} className="mt-5 rounded-lg bg-zivvo-amber-brand px-5 py-2 text-sm font-semibold text-black disabled:opacity-50">
                  Deliver Here
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Choose Payment Method</h2>
                <div className="space-y-3">
                  <button onClick={() => setPaymentMethod("razorpay")} className={`w-full rounded-lg border p-3 text-left ${paymentMethod === "razorpay" ? "border-zivvo-amber-brand" : "border-zivvo-dark-raised"}`}>
                    <p className="font-semibold">Pay Online</p>
                    <p className="text-sm text-zivvo-text-muted">UPI • Card • Netbanking</p>
                  </button>
                  <button onClick={() => setPaymentMethod("cod")} className={`w-full rounded-lg border p-3 text-left ${paymentMethod === "cod" ? "border-zivvo-amber-brand" : "border-zivvo-dark-raised"}`}>
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-zivvo-text-muted">Pay Rs {Number(cart.total || 0).toLocaleString()} when your order arrives</p>
                  </button>
                </div>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => setStep(1)} className="rounded-lg border border-zivvo-dark-raised px-4 py-2 text-sm">Back</button>
                  <button onClick={() => setStep(3)} className="rounded-lg bg-zivvo-amber-brand px-5 py-2 text-sm font-semibold text-black">Continue</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="mb-4 text-xl font-bold">Review & Place Order</h2>
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between rounded-lg border border-zivvo-dark-raised p-3 text-sm">
                      <p>{item.product?.name} x {item.quantity}</p>
                      <p>Rs {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                {selectedAddress && (
                  <div className="mt-4 rounded-lg border border-zivvo-dark-raised p-3 text-sm text-zivvo-text-muted">
                    {selectedAddress.fullName}, {selectedAddress.phone}, {selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                  </div>
                )}
                <p className="mt-3 text-sm">Payment Method: <span className="font-semibold uppercase">{paymentMethod}</span></p>

                <motion.button whileTap={{ scale: 0.98 }} disabled={loading} onClick={placeOrder} className="mt-5 w-full rounded-lg bg-zivvo-amber-brand py-3 text-sm font-semibold text-black disabled:opacity-60">
                  {loading ? "Processing..." : "Place Order"}
                </motion.button>
              </div>
            )}
          </section>

          <aside className="h-fit rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-5">
            <h3 className="text-lg font-bold">Order Summary</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>Rs {Number(cart.subtotal || 0).toLocaleString()}</span></div>
              <div className="flex justify-between text-green-400"><span>Coupon Discount</span><span>-Rs {Number(cart.couponDiscount || 0).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{cart.shipping === 0 ? "FREE" : `Rs ${cart.shipping}`}</span></div>
            </div>
            <div className="my-3 border-t border-zivvo-dark-raised" />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>Rs {Number(cart.total || 0).toLocaleString()}</span></div>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}



