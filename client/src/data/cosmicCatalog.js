export const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    eyebrow: "Premium Tech",
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Fashion",
    slug: "fashion",
    eyebrow: "Future Fit",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Beauty",
    slug: "beauty",
    eyebrow: "Skin Tech",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Home",
    slug: "home",
    eyebrow: "Living Lab",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Sports",
    slug: "sports",
    eyebrow: "Motion Gear",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80"
  }
];

const featuredProducts = [
  {
    id: "iphone-15-pro",
    title: "iPhone 15 Pro",
    brand: "Apple",
    category: "electronics",
    tag: "NEW",
    price: 999,
    originalPrice: 1099,
    rating: 4.9,
    reviews: 1200,
    stock: 5,
    variant: "Natural Titanium | 256GB",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1695048133141-fb6c37f0f75d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1603891128711-11b4b03bb138?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Aerospace titanium, pro-grade cameras, and a display tuned for cinematic clarity in a compact flagship body.",
    specs: {
      Chip: "A17 Pro Bionic",
      Camera: "48MP Main | Ultra Wide",
      Display: "6.1in Super Retina XDR",
      Material: "Aerospace Titanium"
    }
  },
  {
    id: "sony-wh-1000xm5",
    title: "Sony WH-1000XM5",
    brand: "Sony",
    category: "electronics",
    tag: "POPULAR",
    price: 349,
    originalPrice: 399,
    rating: 4.8,
    reviews: 860,
    stock: 18,
    variant: "Black | Noise Cancelling",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Flagship wireless headphones with adaptive noise cancelling, plush comfort, and high-resolution sound.",
    specs: {
      Driver: "30mm carbon fiber",
      Battery: "30 hours",
      Audio: "LDAC | DSEE Extreme",
      Material: "Soft-fit leather"
    }
  },
  {
    id: "macbook-air-m3",
    title: "MacBook Air M3",
    brand: "Apple",
    category: "electronics",
    tag: "POPULAR",
    price: 1099,
    originalPrice: 1199,
    rating: 4.9,
    reviews: 740,
    stock: 11,
    variant: "Midnight | 13 inch",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Silent, thin, and powerful enough for work, study, and creative workflows with all-day battery life.",
    specs: {
      Chip: "Apple M3",
      Memory: "16GB unified",
      Storage: "512GB SSD",
      Weight: "1.24 kg"
    }
  },
  {
    id: "ipad-pro-12",
    title: "iPad Pro 12.9",
    brand: "Apple",
    category: "electronics",
    tag: "LTD",
    price: 1099,
    originalPrice: 1199,
    rating: 4.7,
    reviews: 520,
    stock: 8,
    variant: "Space Black | Wi-Fi",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "A studio-grade tablet with pro display color, smooth pencil response, and laptop-class performance.",
    specs: {
      Chip: "M2",
      Display: "12.9in Liquid Retina XDR",
      Storage: "256GB",
      Input: "Pencil ready"
    }
  },
  {
    id: "nebula-runners",
    title: "Nebula Runners",
    brand: "Zivvo Lab",
    category: "sports",
    tag: "NEW",
    price: 185,
    originalPrice: 229,
    rating: 5,
    reviews: 210,
    stock: 22,
    variant: "Crimson | Performance sole",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Lightweight running shoes with sculpted cushioning and a neon-accented profile.",
    specs: {
      Upper: "Engineered mesh",
      Sole: "Reactive foam",
      Drop: "8mm",
      Weight: "238g"
    }
  },
  {
    id: "vision-glass",
    title: "Vision Glass",
    brand: "Zivvo Optics",
    category: "fashion",
    tag: "EXCLUSIVE",
    price: 899,
    originalPrice: 999,
    rating: 4.7,
    reviews: 350,
    stock: 6,
    variant: "Graphite | Smart display",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Minimal smart eyewear with premium lenses, audio cues, and discreet notification support.",
    specs: {
      Lens: "Polarized smart lens",
      Frame: "Titanium alloy",
      Battery: "18 hours",
      Weight: "42g"
    }
  }
];

const categoryBlueprints = {
  electronics: {
    brands: ["Apple", "Sony", "Samsung", "Bose", "Nothing", "Asus", "Dell", "Canon"],
    nouns: ["Phone", "Headphones", "Laptop", "Tablet", "Camera", "Speaker", "Monitor", "Console"],
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  fashion: {
    brands: ["Zivvo Atelier", "Astra", "Noir Mode", "Vanta", "Eclipse", "Orbit"],
    nouns: ["Jacket", "Sneaker", "Glasses", "Watch", "Backpack", "Overshirt", "Boot", "Pendant"],
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  beauty: {
    brands: ["Luma", "Auralis", "SkinLab", "Prism", "Velvet", "Ozone"],
    nouns: ["Serum", "Moisturizer", "Perfume", "Palette", "Cleanser", "Mask", "Cream", "Mist"],
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  home: {
    brands: ["Habitat X", "Lumen", "NestLab", "AeroHome", "MonoHaus", "Casa Noir"],
    nouns: ["Lamp", "Chair", "Vase", "Desk", "Diffuser", "Shelf", "Console", "Mirror"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  sports: {
    brands: ["Pulse", "Kinetic", "Vector", "Strive", "AeroFit", "RunLab"],
    nouns: ["Runner", "Bike", "Dumbbell", "Yoga Mat", "Jacket", "Bottle", "Trainer", "Tracker"],
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"
    ]
  }
};

const makeProduct = (category, index) => {
  const blueprint = categoryBlueprints[category];
  const brand = blueprint.brands[index % blueprint.brands.length];
  const noun = blueprint.nouns[index % blueprint.nouns.length];
  const series = ["Nova", "Aura", "Pulse", "Orbit", "Zenith", "Vanta"][index % 6];
  const price = 49 + ((index * 37) % 1150);
  return {
    id: `${category}-${series.toLowerCase()}-${noun.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`,
    title: `${series} ${noun} ${index + 1}`,
    brand,
    category,
    tag: ["NEW", "POPULAR", "LTD", "ELITE"][index % 4],
    price,
    originalPrice: price + 80 + (index % 7) * 20,
    rating: Number((4.3 + (index % 7) * 0.1).toFixed(1)),
    reviews: 120 + index * 17,
    stock: 4 + (index % 26),
    variant: `${brand} | ${series} Edition`,
    image: blueprint.images[index % blueprint.images.length],
    gallery: [
      blueprint.images[index % blueprint.images.length],
      blueprint.images[(index + 1) % blueprint.images.length],
      blueprint.images[(index + 2) % blueprint.images.length]
    ],
    description: `A Cosmic Noir ${category} essential with premium materials, clean performance, and ZIVVO's future-luxury finish.`,
    specs: {
      Series: `${series} ${noun}`,
      Brand: brand,
      Finish: "Cosmic Noir",
      Warranty: "12 months"
    }
  };
};

const generatedProducts = Object.keys(categoryBlueprints).flatMap((category) =>
  Array.from({ length: 56 }, (_, index) => makeProduct(category, index))
);

export const products = [
  ...featuredProducts,
  ...generatedProducts.filter((item) => !featuredProducts.some((product) => product.id === item.id))
];

export const cartDefaults = [products[0], products[1]].map((product, index) => ({
  ...product,
  size: product.variant,
  quantity: index + 1
}));

export const getProductById = (id) => products.find((product) => product.id === id) || products[0];

export const getCategoryBySlug = (slug = "electronics") =>
  categories.find((category) => category.slug === slug) || categories[0];

export const getProductsByCategory = (slug = "electronics") =>
  products.filter((product) => product.category === slug).slice(0, 60);
