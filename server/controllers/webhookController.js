import crypto from "crypto";
import ReturnRequest from "../models/ReturnRequest.js";

export const razorpayWebhook = async (req, res) => {
  try {
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "");
    shasum.update(req.body);
    const digest = shasum.digest("hex");
    if (digest !== req.headers["x-razorpay-signature"]) {
      return res.status(400).send("Invalid signature");
    }

    const payload = JSON.parse(req.body.toString("utf8"));
    if (payload.event === "refund.processed") {
      const refundId = payload.payload?.refund?.entity?.id;
      if (refundId) {
        await ReturnRequest.findOneAndUpdate(
          { razorpayRefundId: refundId },
          {
            status: "refunded",
            $push: { statusHistory: { status: "refunded", note: "Razorpay confirmed refund" } }
          }
        );
      }
    }

    return res.json({ received: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

