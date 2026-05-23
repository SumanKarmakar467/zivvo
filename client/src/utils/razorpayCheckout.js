export async function initiateRazorpayPayment({ orderData, userInfo, onSuccess, onFailure }) {
  try {
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
      handler: async (paymentResponse) => {
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
          onFailure?.(error.message || "Payment verification error. Contact support.");
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
    onFailure?.(error.message || "Could not initiate payment. Please try again.");
  }
}
