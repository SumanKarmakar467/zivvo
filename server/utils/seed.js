import "dotenv/config";
import crypto from "crypto";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import slugify from "slugify";

const createSeedPassword = () => {
  if (process.env.SEED_ADMIN_PASSWORD) {
    return { password: process.env.SEED_ADMIN_PASSWORD, generated: false };
  }

  return { password: `${crypto.randomBytes(18).toString("base64url")}A1!`, generated: true };
};

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Product.deleteMany({}), Coupon.deleteMany({})]);

  const seedPassword = createSeedPassword();
  const passwordHash = await User.hashPassword(seedPassword.password);
  const [admin, seller1, seller2] = await User.create([
    { name: "Admin", email: "admin@zivvo.com", passwordHash, role: "admin", isVerified: true },
    { name: "Seller One", email: "seller1@zivvo.com", passwordHash, role: "seller", isVerified: true },
    { name: "Seller Two", email: "seller2@zivvo.com", passwordHash, role: "seller", isVerified: true }
  ]);

  const categoryNames = ["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports", "Books", "Toys", "Grocery"];
  const categories = await Category.insertMany(categoryNames.map((name) => ({ name, slug: slugify(name, { lower: true }) })));

  const products = Array.from({ length: 20 }).map((_, i) => ({
    name: `Zivvo Product ${i + 1}`,
    slug: `zivvo-product-${i + 1}`,
    description: `High-quality product ${i + 1} for Indian customers with strong value proposition and reliable performance.`,
    brand: ["Zivvo", "Nova", "Axon", "UrbanCraft"][i % 4],
    category: categories[i % categories.length]._id,
    seller: i % 2 === 0 ? seller1._id : seller2._id,
    images: [{ url: `https://picsum.photos/seed/zivvo-${i + 1}/600/600`, public_id: `zivvo-${i + 1}` }],
    price: 499 + i * 250,
    discountPrice: 399 + i * 200,
    stock: 10 + i,
    specifications: [{ key: "Warranty", value: "1 Year" }, { key: "Country", value: "India" }],
    ratings: { average: 3.5 + (i % 2), count: 10 + i },
    isApproved: true,
    isFeatured: i < 8,
    isZivvoAssured: i % 3 === 0,
    sold: 50 + i * 4
  }));
  await Product.insertMany(products);

  await Coupon.insertMany([
    { code: "ZIVVO10", discountType: "percent", discountValue: 10, minOrderValue: 500, maxDiscount: 300, validFrom: new Date(), validTill: new Date(Date.now() + 30 * 86400000), usageLimit: 1000 },
    { code: "FIRST50", discountType: "flat", discountValue: 50, minOrderValue: 300, validFrom: new Date(), validTill: new Date(Date.now() + 30 * 86400000), usageLimit: 500 },
    { code: "SAVE200", discountType: "flat", discountValue: 200, minOrderValue: 1500, validFrom: new Date(), validTill: new Date(Date.now() + 30 * 86400000), usageLimit: 400 },
    { code: "FLASH30", discountType: "percent", discountValue: 30, minOrderValue: 2000, maxDiscount: 600, validFrom: new Date(), validTill: new Date(Date.now() + 10 * 86400000), usageLimit: 200 },
    { code: "NEWUSER", discountType: "percent", discountValue: 15, minOrderValue: 800, maxDiscount: 500, validFrom: new Date(), validTill: new Date(Date.now() + 45 * 86400000), usageLimit: 1000 }
  ]);

  console.log("Seed completed");
  if (seedPassword.generated) {
    console.log(`Generated demo password: ${seedPassword.password}`);
  } else {
    console.log("Demo password: value from SEED_ADMIN_PASSWORD");
  }
  console.log(`Admin: ${admin.email}`);
  console.log(`Seller: ${seller1.email}`);
  console.log(`Seller2: ${seller2.email}`);
  await mongoose.connection.close();
};

seed();
