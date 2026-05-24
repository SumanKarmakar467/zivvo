const FOOD_CATEGORIES = new Set(["groceries"]);

export const normalizeProduct = (product) => ({
  id: product.id,
  _id: String(product.id),
  title: product.title,
  name: product.title,
  brand: product.brand || "Zivvo Select",
  category: product.category,
  price: Number(product.price || 0),
  rating: Number(product.rating || 0),
  description: product.description,
  thumbnail: product.thumbnail,
  image: product.thumbnail,
  images: product.images?.length ? product.images : [product.thumbnail].filter(Boolean),
  gender: inferGender(product),
  warranty: product.warrantyInformation || "12 months service warranty",
  country: product.meta?.country || "India",
  material: inferMaterial(product)
});

export const isFoodProduct = (product) => FOOD_CATEGORIES.has(String(product.category || "").toLowerCase());

export const fetchDummyProducts = async ({ limit = 30, skip = 0 } = {}) => {
  const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error("Unable to load products");
  const data = await response.json();
  return {
    ...data,
    products: (data.products || []).filter((product) => !isFoodProduct(product)).map(normalizeProduct)
  };
};

export const fetchDummyProduct = async (id) => {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  if (!response.ok) throw new Error("Product not found");
  return normalizeProduct(await response.json());
};

export const searchProducts = (products, query = "") => {
  const term = query.trim().toLowerCase();
  if (!term) return products;
  return products.filter((product) =>
    [product.title, product.brand, product.category, product.description].some((value) =>
      String(value || "").toLowerCase().includes(term)
    )
  );
};

export const inferGender = (product) => {
  const haystack = `${product.title} ${product.category}`.toLowerCase();
  if (haystack.includes("mens") || haystack.includes("men-")) return "Male";
  if (haystack.includes("womens") || haystack.includes("women-")) return "Female";
  return "Unisex";
};

export const inferMaterial = (product) => {
  const category = String(product.category || "").toLowerCase();
  if (category.includes("beauty") || category.includes("fragrance")) return "Blended and packed in small verified batches.";
  if (category.includes("furniture")) return "Built from engineered wood, metal fixtures, and durable surface finishes.";
  if (category.includes("clothing") || category.includes("shirt") || category.includes("dress")) return "Cut from breathable fabric with reinforced seams and hand-finished details.";
  return "Manufactured through quality-checked assembly with durable everyday materials.";
};
