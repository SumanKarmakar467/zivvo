import nodemailer from "nodemailer";

const APP_URL = process.env.CLIENT_URL || "http://localhost:5173";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const baseEmailLayout = ({ title, content }) => `
  <div style="margin:0;padding:24px;background:#19120b;color:#efe0d3;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#1f1a14;border:1px solid #3a2d1d;border-radius:10px;overflow:hidden;">
      <tr>
        <td style="padding:18px 20px;background:#17110b;border-bottom:1px solid #3a2d1d;">
          <div style="font-size:24px;font-weight:700;color:#ef9f27;letter-spacing:0.4px;">Zivvo</div>
          <div style="font-size:12px;color:#bca892;margin-top:4px;">Premium E-Commerce Experience</div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px;">
          <h2 style="margin:0 0 14px 0;font-size:22px;line-height:1.3;color:#efe0d3;">${title}</h2>
          ${content}
        </td>
      </tr>
      <tr>
        <td style="padding:14px 20px;border-top:1px solid #3a2d1d;color:#bca892;font-size:12px;">
          <div>Thank you for choosing Zivvo.</div>
          <div style="margin-top:4px;">© ${new Date().getFullYear()} Zivvo. All rights reserved.</div>
        </td>
      </tr>
    </table>
  </div>
`;

const currency = (n) => `Rs ${Number(n || 0).toLocaleString("en-IN")}`;
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "TBD");

const sendMail = async ({ to, subject, html }) => {
  if (!to) return;
  await transporter.sendMail({
    from: `Zivvo <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

export const sendOrderConfirmation = async (user, order) => {
  const orderId = String(order?._id || "").slice(-8);
  const orderLink = `${APP_URL}/orders/${order?._id}`;
  const itemsHtml = (order?.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #3a2d1d;width:56px;">
          <img src="${item.image || "https://placehold.co/50x50"}" alt="${item.name || "Item"}" style="width:50px;height:50px;border-radius:6px;object-fit:cover;" />
        </td>
        <td style="padding:8px;border-bottom:1px solid #3a2d1d;color:#efe0d3;">${item.name || "Item"}</td>
        <td style="padding:8px;border-bottom:1px solid #3a2d1d;text-align:center;color:#bca892;">x${item.quantity || 1}</td>
        <td style="padding:8px;border-bottom:1px solid #3a2d1d;text-align:right;color:#efe0d3;">${currency((item.price || 0) * (item.quantity || 1))}</td>
      </tr>`
    )
    .join("");

  const address = order?.shippingAddress || {};

  const html = baseEmailLayout({
    title: `Hi ${user?.name || "there"}, your order has been placed!`,
    content: `
      <p style="margin:0 0 10px 0;color:#bca892;">Order ID: <strong style="color:#efe0d3;">#${orderId}</strong></p>
      <p style="margin:0 0 18px 0;color:#bca892;">Estimated delivery: <strong style="color:#efe0d3;">${fmtDate(order?.estimatedDelivery)}</strong></p>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #3a2d1d;border-radius:8px;overflow:hidden;">
        ${itemsHtml}
      </table>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:16px;border:1px solid #3a2d1d;border-radius:8px;">
        <tr><td style="padding:8px;color:#bca892;">Subtotal</td><td style="padding:8px;text-align:right;color:#efe0d3;">${currency(order?.subtotal)}</td></tr>
        <tr><td style="padding:8px;color:#bca892;">Shipping</td><td style="padding:8px;text-align:right;color:#efe0d3;">${currency(order?.shipping)}</td></tr>
        <tr><td style="padding:8px;color:#bca892;">Discount</td><td style="padding:8px;text-align:right;color:#efe0d3;">-${currency((order?.couponDiscount || 0) + (order?.discount || 0))}</td></tr>
        <tr><td style="padding:10px;font-weight:700;color:#ef9f27;border-top:1px solid #3a2d1d;">Total</td><td style="padding:10px;text-align:right;font-weight:700;color:#ef9f27;border-top:1px solid #3a2d1d;">${currency(order?.total)}</td></tr>
      </table>

      <div style="margin-top:16px;padding:12px;border:1px solid #3a2d1d;border-radius:8px;color:#bca892;">
        <div style="font-weight:700;color:#efe0d3;margin-bottom:6px;">Shipping Address</div>
        <div>${address.fullName || ""}</div>
        <div>${address.addressLine1 || ""} ${address.addressLine2 || ""}</div>
        <div>${address.city || ""}, ${address.state || ""} - ${address.pincode || ""}</div>
        <div>${address.country || ""}</div>
      </div>

      <div style="margin-top:20px;">
        <a href="${orderLink}" style="display:inline-block;background:#ef9f27;color:#19120b;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;">Track Your Order</a>
      </div>
    `
  });

  await sendMail({
    to: user?.email,
    subject: `Order Confirmed! 🎉 Your Zivvo Order #${orderId}`,
    html
  });
};

export const sendOrderStatusUpdate = async (user, order, newStatus) => {
  const statusMap = {
    shipped: "Your order is on its way! 🚚",
    delivered: "Your order has been delivered! 📦",
    cancelled: "Your order has been cancelled"
  };
  const hero = statusMap[newStatus] || `Your order status is now ${newStatus}.`;
  const statusLabel = String(newStatus || "updated").replaceAll("_", " ");
  const orderId = String(order?._id || "").slice(-8);
  const orderLink = `${APP_URL}/orders/${order?._id}`;
  const refundNote =
    newStatus === "cancelled" && ["paid", "refunded"].includes(order?.paymentStatus)
      ? `<p style="margin:10px 0 0;color:#bca892;">Refund note: Since this order was paid, refund processing has been initiated as applicable.</p>`
      : "";
  const tracking =
    newStatus === "shipped" && order?.trackingNumber
      ? `<p style="margin:10px 0 0;color:#bca892;">Tracking Number: <strong style="color:#efe0d3;">${order.trackingNumber}</strong></p>`
      : "";

  const html = baseEmailLayout({
    title: hero,
    content: `
      <p style="margin:0;color:#bca892;">Order ID: <strong style="color:#efe0d3;">#${orderId}</strong></p>
      ${tracking}
      ${refundNote}
      <div style="margin-top:20px;">
        <a href="${orderLink}" style="display:inline-block;background:#ef9f27;color:#19120b;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;">View Order</a>
      </div>
    `
  });

  await sendMail({
    to: user?.email,
    subject: `Update on your Zivvo Order #${orderId} — ${statusLabel}`,
    html
  });
};

export const sendWelcomeEmail = async (user) => {
  const html = baseEmailLayout({
    title: `Welcome to Zivvo, ${user?.name || "Shopper"}!`,
    content: `
      <p style="margin:0 0 14px 0;color:#bca892;">Your account is ready. Start exploring a premium e-commerce experience.</p>
      <div style="margin:14px 0 18px;">
        <a href="${APP_URL}" style="display:inline-block;background:#ef9f27;color:#19120b;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;">Start Shopping</a>
      </div>
      <ul style="margin:0;padding-left:20px;color:#efe0d3;">
        <li style="margin-bottom:8px;">Curated products you can trust</li>
        <li style="margin-bottom:8px;">Fast and reliable delivery</li>
        <li>Secure payments and protected checkout</li>
      </ul>
    `
  });

  await sendMail({
    to: user?.email,
    subject: "Welcome to Zivvo - Premium E-Commerce Experience!",
    html
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetLink = `${APP_URL}/reset-password/${resetToken}`;
  const html = baseEmailLayout({
    title: "Password Reset Request",
    content: `
      <p style="margin:0 0 14px 0;color:#bca892;">You requested a password reset.</p>
      <div style="margin:14px 0;">
        <a href="${resetLink}" style="display:inline-block;background:#ef9f27;color:#19120b;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;">Reset Password</a>
      </div>
      <p style="margin:0 0 10px 0;color:#bca892;">This link expires in 1 hour.</p>
      <p style="margin:0;color:#bca892;">If you didn't request this, you can safely ignore this email.</p>
    `
  });

  await sendMail({
    to: user?.email,
    subject: "Reset your Zivvo password",
    html
  });
};
