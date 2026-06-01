import "dotenv/config";
import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Coupon from "../models/Coupon.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

const imageFor = (name) => `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#141016"/>
  <circle cx="650" cy="150" r="120" fill="#7C5CFC" opacity=".22"/>
  <circle cx="120" cy="690" r="140" fill="#22D3EE" opacity=".18"/>
  <rect x="110" y="170" width="580" height="460" rx="36" fill="#211827" stroke="#7C5CFC" stroke-width="8"/>
  <text x="400" y="365" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" font-weight="700" fill="#F8F5EF">Zivvo</text>
  <text x="400" y="435" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#22D3EE">${String(name).replace(/[<>&"']/g, "")}</text>
</svg>
`)}`;

const products = [
  ["Handcrafted Blue Pottery Vase", "Home Decor", "Rajesh Pottery Works", 4199, 6500],
  ["Silk Chanderi Kurta", "Clothing", "Kavya Silk House", 2899, 3999],
  ["Ayurvedic Skin Care Kit", "Beauty & Health", "Pure Roots", 899, 1400],
  ["Handwoven Kantha Quilt", "Home & Bedding", "Bengal Craft Co.", 3299, 4800],
  ["Rudraksha Mala Set", "Spiritual & Wellness", "Himalayan Crafts", 1299, 1800],
  ["Brass Diya Collection", "Home Decor", "Rajesh Pottery Works", 749, 999],
  ["Artisan Leather Messenger Bag", "Bags & Accessories", "Kolkata Leather Co.", 4899, 7500],
  ["Silver Oxidised Jhumkas", "Jewellery", "Jaipur Silver House", 1199, 1800],
  ["Luxury Soy Wax Candle Set", "Home Decor", "Aroma Roots", 649, 999],
  ["Madhubani Art Painting Peacock", "Art & Collectibles", "Mithila Art Studio", 3499, 5000],
  ["Pashmina Shawl", "Clothing", "Kashmir Looms", 4500, 6200],
  ["Wooden Elephant Sculpture", "Home Decor", "Saharanpur Woodcraft", 1899, 2800],
  ["Herbal Hair Oil Kit", "Beauty & Health", "Pure Roots", 799, 1200],
  ["Block Print Bedsheet", "Home & Bedding", "Jaipur Prints", 1599, 2300],
  ["Copper Water Bottle", "Home & Kitchen", "Tamra Living", 999, 1499],
  ["Ikat Silk Dupatta", "Clothing", "Kavya Silk House", 2299, 3400],
  ["Dhokra Tribal Necklace", "Jewellery", "Bastar Metalworks", 2799, 3900],
  ["Organic Kashmiri Saffron 5g", "Gourmet", "Valley Harvest", 1499, 2200],
  ["Hand-knotted Woolen Rug", "Home Decor", "Kashmir Looms", 8999, 12500],
  ["Terracotta Wall Panel Set", "Art & Collectibles", "Bengal Craft Co.", 3199, 4600]
];

const createSeedPassword = () => {
  if (process.env.SEED_ADMIN_PASSWORD) {
    return { password: process.env.SEED_ADMIN_PASSWORD, generated: false };
  }

  return { password: `${crypto.randomBytes(18).toString("base64url")}A1!`, generated: true };
};

async function seed() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGO_URI or MONGODB_URI is not set.");
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    Coupon.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({})
  ]);
  console.log("Cleared existing data");

  const seedPassword = createSeedPassword();
  const passwordHash = await bcrypt.hash(seedPassword.password, 10);
  const buyer = await User.create({
    name: "Priya Rao",
    email: "buyer@zivvo.com",
    passwordHash,
    phone: "9876543210",
    role: "user",
    isVerified: true,
    addresses: [{
      fullName: "Priya Rao",
      phone: "9876543210",
      addressLine1: "12B, Sunshine Apartments",
      addressLine2: "Koramangala 4th Block",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560034",
      country: "India",
      isDefault: true
    }]
  });

  const [seller1, seller2, admin] = await User.insertMany([
    { name: "Rajesh Pottery Works", email: "seller@zivvo.com", passwordHash, phone: "9765432109", role: "seller", isVerified: true, trustScore: 92 },
    { name: "Kavya Silk House", email: "seller2@zivvo.com", passwordHash, phone: "9654321098", role: "seller", isVerified: true, trustScore: 96 },
    { name: "Zivvo Admin", email: "admin@zivvo.com", passwordHash, phone: "9000000000", role: "admin", isVerified: true }
  ]);
  console.log("Users created");

  const categoryNames = [...new Set(products.map(([, category]) => category))];
  const categories = await Category.insertMany(categoryNames.map((name) => ({ name, image: imageFor(name), isActive: true })));
  const categoryMap = new Map(categories.map((category) => [category.name, category._id]));

  const insertedProducts = await Product.insertMany(products.map(([name, category, brand, price, mrp], index) => ({
    name,
    description: `${name} from ${brand}, curated for Zivvo's demo marketplace with authentic Indian craft and modern ecommerce data.`,
    price,
    mrp,
    images: [imageFor(name)],
    category: categoryMap.get(category),
    brand,
    seller: index % 2 === 0 ? seller1._id : seller2._id,
    stock: 25 + index * 3,
    sold: 90 + index * 17,
    rating: Number((4.5 + (index % 5) * 0.1).toFixed(1)),
    numReviews: 40 + index * 9,
    averageRating: Number((4.5 + (index % 5) * 0.1).toFixed(1)),
    reviewCount: 40 + index * 9,
    specs: { Origin: "India", Care: "Handle with care" },
    tags: [category.toLowerCase(), brand.toLowerCase(), "demo"],
    isFeatured: index < 8,
    isActive: true
  })));
  console.log(`${insertedProducts.length} products created`);

  await Coupon.insertMany([
    { code: "ZIVVO10", type: "percent", value: 10, maxDiscount: 250, minOrderValue: 499, scope: "platform", usageLimit: 1000, perUserLimit: 2, isActive: true },
    { code: "FIRST100", type: "flat", value: 100, minOrderValue: 999, scope: "platform", usageLimit: 500, perUserLimit: 1, isActive: true }
  ]);

  const order = await Order.create({
    user: buyer._id,
    items: [{
      product: insertedProducts[0]._id,
      name: insertedProducts[0].name,
      image: insertedProducts[0].images[0],
      price: insertedProducts[0].price,
      quantity: 1,
      seller: insertedProducts[0].seller
    }],
    shippingAddress: buyer.addresses[0],
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    razorpayOrderId: "order_demo_12345",
    razorpayPaymentId: "pay_demo_67890",
    orderStatus: "delivered",
    subtotal: insertedProducts[0].price,
    shipping: 0,
    total: insertedProducts[0].price,
    totalAmount: insertedProducts[0].price,
    courierName: "Blue Dart",
    awbNumber: "BD123456789IN",
    trackingNumber: "BD123456789IN",
    estimatedDelivery: new Date(Date.now() + 2 * 86400000),
    statusHistory: [
      { status: "placed", note: "Order placed", timestamp: new Date(Date.now() - 7 * 86400000) },
      { status: "confirmed", note: "Payment confirmed", timestamp: new Date(Date.now() - 7 * 86400000 + 300000) },
      { status: "processing", note: "Seller is packing", timestamp: new Date(Date.now() - 6 * 86400000) },
      { status: "shipped", note: "Shipped via Blue Dart", timestamp: new Date(Date.now() - 5 * 86400000) },
      { status: "out_for_delivery", note: "Out for delivery today", timestamp: new Date(Date.now() - 2 * 86400000) },
      { status: "delivered", note: "Delivered successfully", timestamp: new Date(Date.now() - 1 * 86400000) }
    ]
  });

  await Review.insertMany([
    { product: insertedProducts[0]._id, buyer: buyer._id, order: order._id, rating: 5, title: "Absolutely stunning!", body: "The vase is even more beautiful in person.", verifiedPurchase: true, helpfulVotes: 24 },
    { product: insertedProducts[1]._id, buyer: buyer._id, order: order._id, rating: 5, title: "Beautiful quality silk", body: "The fabric drape is perfect.", verifiedPurchase: true, helpfulVotes: 31 },
    { product: insertedProducts[2]._id, buyer: buyer._id, order: order._id, rating: 4, title: "Lovely natural kit", body: "Clean packaging and gentle products.", verifiedPurchase: true, helpfulVotes: 12 }
  ]);

  console.log("\n=== SEED COMPLETE ===");
  if (seedPassword.generated) {
    console.log(`Generated demo password: ${seedPassword.password}`);
  } else {
    console.log("Demo password: value from SEED_ADMIN_PASSWORD");
  }
  console.log("Buyer:   buyer@zivvo.com");
  console.log("Seller:  seller@zivvo.com");
  console.log("Seller2: seller2@zivvo.com");
  console.log(`Admin:   ${admin.email}`);
  console.log("====================\n");

  await mongoose.disconnect();
}

seed().then(() => process.exit(0)).catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
