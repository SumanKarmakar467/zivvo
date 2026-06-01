import express from "express";
import Product from "../models/Product.js";

const router = express.Router();
const SITE_URL = process.env.CLIENT_URL || "https://zivvo-six.vercel.app";

const urlEntry = (path, lastmod) => {
  const loc = `${SITE_URL}${path}`;
  const lastmodTag = lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : "";
  return `<url><loc>${loc}</loc>${lastmodTag}</url>`;
};

router.get("/", async (_req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, status: { $ne: "deleted" } })
      .select("_id updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    const urls = [
      urlEntry("/"),
      urlEntry("/products"),
      urlEntry("/login"),
      urlEntry("/register"),
      ...products.map((product) => urlEntry(`/products/${product._id}`, product.updatedAt))
    ];

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=86400");
    return res.send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`);
  } catch (error) {
    return next(error);
  }
});

export default router;
