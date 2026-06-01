import crypto from "crypto";
import Order from "../models/Order.js";

const readRawBody = (body) => (Buffer.isBuffer(body) ? body : Buffer.from(JSON.stringify(body || {})));

const updateOrderFromPayment = async ({ razorpayOrderId, status, paymentStatus, note, paymentId }) => {
  if (!razorpayOrderId) return null;

  const update = {
    status,
    paymentStatus,
    $push: {
      statusHistory: {
        status,
        timestamp: new Date(),
        note
      }
    }
  };

  if (paymentId) update.razorpayPaymentId = paymentId;
  if (status === "payment_confirmed") update.orderStatus = "confirmed";
  if (status === "cancelled") update.orderStatus = "cancelled";

  return Order.findOneAndUpdate({ razorpayOrderId }, update, { new: true });
};

export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return res.status(500).json({ message: "Razorpay webhook secret is not configured" });

  const signature = req.headers["x-razorpay-signature"];
  const rawBody = readRawBody(req.body);
  const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).send("Invalid signature");
  }

  const payload = JSON.parse(rawBody.toString("utf8"));
  const payment = payload.payload?.payment?.entity;
  const refund = payload.payload?.refund?.entity;

  if (payload.event === "payment.captured") {
    await updateOrderFromPayment({
      razorpayOrderId: payment?.order_id,
      paymentId: payment?.id,
      status: "payment_confirmed",
      paymentStatus: "paid",
      note: "Razorpay payment captured"
    });
  }

  if (payload.event === "payment.failed") {
    await updateOrderFromPayment({
      razorpayOrderId: payment?.order_id,
      paymentId: payment?.id,
      status: "cancelled",
      paymentStatus: "failed",
      note: "Razorpay payment failed"
    });
  }

  if (payload.event === "refund.created") {
    await Order.findOneAndUpdate(
      { razorpayPaymentId: refund?.payment_id },
      {
        paymentStatus: "refunded",
        $push: {
          statusHistory: {
            status: "cancelled",
            timestamp: new Date(),
            note: "Razorpay refund created"
          }
        }
      }
    );
  }

  return res.json({ received: true });
};
