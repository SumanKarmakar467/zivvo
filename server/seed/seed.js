import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Coupon from "../models/Coupon.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Number((Math.random() * (max - min) + min).toFixed(1));
const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

const makeImage = (name) => `https://via.placeholder.com/500x500?text=${encodeURIComponent(name)}`;

const productSeed = [
  { name: "boAt Rockerz 450 Headphones", category: "Electronics", brand: "boAt", price: 1599, mrp: 2999 },
  { name: "Mi Smart TV 43 inch 4K", category: "Electronics", brand: "Xiaomi", price: 25999, mrp: 34999 },
  { name: "realme Watch 3", category: "Electronics", brand: "realme", price: 3499, mrp: 4999 },
  { name: "JBL Flip Essential Speaker", category: "Electronics", brand: "JBL", price: 6999, mrp: 9999 },
  { name: "Redmi Note 13 5G", category: "Mobiles", brand: "Redmi", price: 17999, mrp: 21999 },
  { name: "Samsung Galaxy A54", category: "Mobiles", brand: "Samsung", price: 32999, mrp: 38999 },
  { name: "iPhone 15 128GB", category: "Mobiles", brand: "Apple", price: 72999, mrp: 79900 },
  { name: "OnePlus 12R", category: "Mobiles", brand: "OnePlus", price: 38999, mrp: 42999 },
  { name: "Allen Solly Slim Fit Shirt", category: "Fashion", brand: "Allen Solly", price: 1299, mrp: 2199 },
  { name: "Peter England Formal Shirt", category: "Fashion", brand: "Peter England", price: 1399, mrp: 2499 },
  { name: "Levi's 511 Blue Jeans", category: "Fashion", brand: "Levi's", price: 2499, mrp: 3999 },
  { name: "Lakme Matte Lipstick", category: "Beauty", brand: "Lakme", price: 449, mrp: 699 },
  { name: "Mamaearth Ubtan Face Wash", category: "Beauty", brand: "Mamaearth", price: 269, mrp: 399 },
  { name: "Prestige 5L Pressure Cooker", category: "Home & Kitchen", brand: "Prestige", price: 2099, mrp: 3199 },
  { name: "Philips Mixer Grinder 750W", category: "Home & Kitchen", brand: "Philips", price: 3499, mrp: 4995 },
  { name: "Milton Steel Water Bottle 1L", category: "Home & Kitchen", brand: "Milton", price: 549, mrp: 899 },
  { name: "Yonex Badminton Racket GR303", category: "Sports", brand: "Yonex", price: 1199, mrp: 1799 },
  { name: "Nivia Storm Football Size 5", category: "Sports", brand: "Nivia", price: 699, mrp: 1099 },
  { name: "Wings of Fire by APJ Abdul Kalam", category: "Books", brand: "Universities Press", price: 299, mrp: 499 },
  { name: "LEGO Classic Creative Bricks Set", category: "Toys", brand: "LEGO", price: 1499, mrp: 2399 }
];

const categorySeed = [
  { name: "Electronics", icon: "💻" },
  { name: "Mobiles", icon: "📱" },
  { name: "Fashion", icon: "👗" },
  { name: "Beauty", icon: "💄" },
  { name: "Home & Kitchen", icon: "🏠" },
  { name: "Sports", icon: "⚽" },
  { name: "Books", icon: "📚" },
  { name: "Toys", icon: "🎮" }
];

const runSeed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set in environment variables.");
    }

    await mongoose.connect(process.env.MONGO_URI);
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
    console.log("Cleared collections: User, Product, Category, Coupon, Cart, Order, Review");

    const insertedCategories = await Category.insertMany(
      categorySeed.map((c) => ({
        ...c,
        image: makeImage(c.name),
        isActive: true
      }))
    );
    console.log(`Inserted categories: ${insertedCategories.length}`);

    const hashAdmin = await bcrypt.hash("Admin@123", 10);
    const hashSeller = await bcrypt.hash("Seller@123", 10);
    const hashUser = await bcrypt.hash("User@123", 10);

    const insertedUsers = await User.insertMany([
      {
        name: "Zivvo Admin",
        email: "admin@zivvo.in",
        passwordHash: hashAdmin,
        role: "admin",
        isVerified: true,
        isActive: true
      },
      {
        name: "TechBazaar Store",
        email: "seller1@zivvo.in",
        passwordHash: hashSeller,
        role: "seller",
        isVerified: true,
        isActive: true
      },
      {
        name: "FashionHub India",
        email: "seller2@zivvo.in",
        passwordHash: hashSeller,
        role: "seller",
        isVerified: true,
        isActive: true
      },
      {
        name: "Rahul Sharma",
        email: "user@zivvo.in",
        passwordHash: hashUser,
        role: "user",
        isVerified: true,
        isActive: true
      }
    ]);
    console.log(`Inserted users: ${insertedUsers.length}`);

    const seller1 = insertedUsers.find((u) => u.email === "seller1@zivvo.in");
    const seller2 = insertedUsers.find((u) => u.email === "seller2@zivvo.in");
    const categoryMap = new Map(insertedCategories.map((c) => [c.name, c]));

    const insertedProducts = await Product.insertMany(
      productSeed.map((p, idx) => ({
        name: p.name,
        description: `${p.name} is crafted for everyday Indian use with reliable quality and trusted performance. It offers excellent value for money and fits seamlessly into modern lifestyles.`,
        price: p.price,
        mrp: p.mrp,
        images: [makeImage(p.name)],
        category: categoryMap.get(p.category)._id,
        brand: p.brand,
        seller: idx % 2 === 0 ? seller1._id : seller2._id,
        stock: randomInt(10, 200),
        sold: randomInt(0, 500),
        rating: randomFloat(3.5, 4.9),
        numReviews: randomInt(5, 200),
        specs: {
          Warranty: "1 Year",
          Country: "India"
        },
        tags: [p.category.toLowerCase(), p.brand.toLowerCase(), "zivvo-pick"],
        isFeatured: idx < 8,
        isActive: true
      }))
    );
    console.log(`Inserted products: ${insertedProducts.length}`);

    const insertedCoupons = await Coupon.insertMany([
      {
        code: "ZIVVO10",
        type: "percent",
        value: 10,
        maxDiscount: 200,
        minOrder: 299,
        usageLimit: 1000,
        isActive: true,
        expiresAt: oneYearFromNow
      },
      {
        code: "ZIVVO50",
        type: "flat",
        value: 50,
        minOrder: 499,
        usageLimit: 500,
        isActive: true,
        expiresAt: oneYearFromNow
      },
      {
        code: "FIRST100",
        type: "flat",
        value: 100,
        minOrder: 999,
        usageLimit: 100,
        isActive: true,
        expiresAt: oneYearFromNow
      },
      {
        code: "SALE20",
        type: "percent",
        value: 20,
        maxDiscount: 500,
        minOrder: 799,
        usageLimit: 200,
        isActive: true,
        expiresAt: oneYearFromNow
      },
      {
        code: "FREESHIP",
        type: "freeship",
        value: 40,
        minOrder: 0,
        usageLimit: 999,
        isActive: true,
        expiresAt: oneYearFromNow
      }
    ]);
    console.log(`Inserted coupons: ${insertedCoupons.length}`);

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

runSeed();

