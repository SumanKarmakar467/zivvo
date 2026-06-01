import type { Address, CartItem, Coupon } from "@/types";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: RazorpayFailureResponse) => void) => void;
    };
  }
}

interface RazorpayFailureResponse {
  error?: { description?: string };
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutParams {
  orderData: {
    items?: CartItem[];
    address?: Address;
    addressId?: string;
    coupon?: Coupon;
    subtotal?: number;
    discount?: number;
    deliveryCharge?: number;
    totalAmount?: number;
    paymentMethod?: string;
  };
  userInfo: { name: string; email: string; phone: string };
  onSuccess: (orderId: string) => void;
  onFailure: (message: string) => void;
}

export async function initiateRazorpayPayment({ orderData, userInfo, onSuccess, onFailure }: RazorpayCheckoutParams): Promise<void> {
  try {
    if (!window.Razorpay) {
      const loaded = await new Promise<boolean>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
      if (!loaded) throw new Error("Could not load Razorpay checkout");
    }

    const token = localStorage.getItem("zivvo-token");
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not initiate payment");

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "Zivvo",
      description: `Order #${data.orderId}`,
      order_id: data.razorpayOrderId,
      prefill: {
        name: userInfo?.name || "",
        email: userInfo?.email || "",
        contact: userInfo?.phone || ""
      },
      notes: { orderId: data.orderId },
      theme: { color: "#7C5CFC" },
      handler: async (paymentResponse: RazorpaySuccessResponse) => {
        try {
          const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/orders/verify`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
              orderId: data.orderId,
              addressId: orderData.addressId
            })
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(verifyData.message || "Payment verification failed");
          }
          onSuccess?.(verifyData.orderId);
        } catch (error) {
          onFailure?.(error instanceof Error ? error.message : "Payment verification error. Contact support.");
        }
      },
      modal: {
        ondismiss: () => onFailure?.("Payment cancelled by user.")
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", (response) => {
      onFailure?.(response.error?.description || "Payment failed. Please try again.");
    });
    razorpay.open();
  } catch (error) {
    onFailure?.(error instanceof Error ? error.message : "Could not initiate payment. Please try again.");
  }
}
