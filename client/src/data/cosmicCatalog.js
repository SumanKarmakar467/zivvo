export const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    eyebrow: "Premium Tech",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Phones",
    slug: "phones",
    eyebrow: "Smart Picks",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Laptop",
    slug: "laptop",
    eyebrow: "Work Ready",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Clothes",
    slug: "clothes",
    eyebrow: "Fresh Fits",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Grocery",
    slug: "grocery",
    eyebrow: "Daily Needs",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Gym",
    slug: "gym",
    eyebrow: "Train Strong",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Shoes",
    slug: "shoes",
    eyebrow: "Step Fresh",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Vehicle Parts",
    slug: "vehicle-parts",
    eyebrow: "Auto Gear",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Home Decoration",
    slug: "home-decoration",
    eyebrow: "Room Glow",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Study",
    slug: "study",
    eyebrow: "Learn Better",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
  }
];

const featuredProducts = [
  {
    id: "samsung-galaxy-s24-ultra",
    title: "Galaxy S24 Ultra",
    brand: "Samsung",
    category: "phones",
    productType: "Smartphones",
    tag: "NEW",
    price: 1199,
    originalPrice: 1299,
    rating: 4.9,
    reviews: 1200,
    stock: 5,
    variant: "Titanium Gray | 256GB",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "A flagship phone with a sharp display, pro camera system, and all-day performance.",
    specs: {
      Chip: "Snapdragon 8 Gen 3",
      Camera: "200MP Main | Ultra Wide",
      Display: "6.8in Dynamic AMOLED",
      Battery: "5000mAh"
    }
  },
  {
    id: "sony-wh-1000xm5",
    title: "Sony WH-1000XM5",
    brand: "Sony",
    category: "electronics",
    productType: "Headphones",
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
    category: "laptop",
    productType: "Ultrabooks",
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
    productType: "Tablets",
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
    category: "shoes",
    productType: "Running Shoes",
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
    category: "clothes",
    productType: "Accessories",
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
    brands: ["Sony", "Samsung", "Bose", "Nothing", "Asus", "Dell", "Canon", "JBL"],
    subcategories: [
      { name: "Camera", brands: ["Canon", "Sony", "Nikon", "Fujifilm"] },
      { name: "Speaker", brands: ["JBL", "Sony", "Bose", "Boat"] },
      { name: "Headphones", brands: ["Sony", "Bose", "JBL", "Boat"] },
      { name: "TV", brands: ["Samsung", "Sony", "LG", "TCL"] },
      { name: "Refrigerator", brands: ["Samsung", "LG", "Whirlpool", "Godrej"] },
      { name: "AC", brands: ["Daikin", "LG", "Voltas", "Blue Star"] },
      { name: "Cooler", brands: ["Symphony", "Bajaj", "Havells", "Crompton"] },
      { name: "Tablet", brands: ["Samsung", "Apple", "Lenovo", "Xiaomi"] }
    ],
    nouns: ["Headphones", "Tablet", "Camera", "Speaker", "Monitor", "Console", "Smartwatch", "Drone"],
    images: [
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  phones: {
    brands: ["Realme", "Redmi", "Samsung", "Iphone", "Vivo", "Oppo"],
    subcategories: [
      { name: "Smartphones", brands: ["Realme", "Redmi", "Samsung", "Iphone", "Vivo", "Oppo"] },
      { name: "Gaming Phones", brands: ["Asus", "Redmi", "Realme", "Iqoo"] },
      { name: "Camera Phones", brands: ["Samsung", "Iphone", "Vivo", "Oppo"] },
      { name: "Budget Phones", brands: ["Realme", "Redmi", "Samsung", "Vivo"] },
      { name: "Fold Phones", brands: ["Samsung", "Oppo", "Vivo", "Motorola"] }
    ],
    nouns: ["5G Phone", "Camera Phone", "Gaming Phone", "Pro Phone", "Ultra Phone", "Fold Phone"],
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  laptop: {
    brands: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer"],
    subcategories: [
      { name: "Ultrabooks", brands: ["Apple", "Dell", "HP", "Lenovo"] },
      { name: "Gaming Laptops", brands: ["Asus", "Acer", "Lenovo", "HP"] },
      { name: "Student Laptops", brands: ["Dell", "HP", "Lenovo", "Acer"] },
      { name: "Creator Laptops", brands: ["Apple", "Asus", "Dell", "Lenovo"] },
      { name: "Business Laptops", brands: ["Lenovo", "Dell", "HP", "Apple"] }
    ],
    nouns: ["Ultrabook", "Gaming Laptop", "Creator Laptop", "Business Laptop", "Student Laptop", "Workstation"],
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  clothes: {
    brands: ["Zivvo Atelier", "Astra", "Noir Mode", "Vanta", "Eclipse", "Orbit"],
    subcategories: [
      { name: "T-Shirts", brands: ["Astra", "Vanta", "Eclipse", "Orbit"] },
      { name: "Jackets", brands: ["Zivvo Atelier", "Noir Mode", "Vanta", "Eclipse"] },
      { name: "Jeans", brands: ["Astra", "Noir Mode", "Orbit", "Vanta"] },
      { name: "Shirts", brands: ["Zivvo Atelier", "Astra", "Noir Mode", "Orbit"] },
      { name: "Accessories", brands: ["Zivvo Atelier", "Eclipse", "Orbit", "Vanta"] }
    ],
    nouns: ["Jacket", "Sneaker", "Glasses", "Watch", "Backpack", "Overshirt", "Boot", "Pendant"],
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  grocery: {
    brands: ["Farm Fresh", "Daily Basket", "Nature Drop", "Green Leaf", "Pure Grain", "Urban Pantry"],
    subcategories: [
      { name: "Fruits", brands: ["Farm Fresh", "Nature Drop", "Green Leaf"] },
      { name: "Vegetables", brands: ["Farm Fresh", "Daily Basket", "Green Leaf"] },
      { name: "Rice", brands: ["Pure Grain", "Urban Pantry", "Daily Basket"] },
      { name: "Oil", brands: ["Urban Pantry", "Nature Drop", "Daily Basket"] },
      { name: "Snacks", brands: ["Urban Pantry", "Daily Basket", "Pure Grain"] },
      { name: "Breakfast", brands: ["Daily Basket", "Pure Grain", "Nature Drop"] }
    ],
    nouns: ["Fruit Box", "Vegetable Pack", "Rice Bag", "Oil Combo", "Snack Kit", "Breakfast Pack"],
    images: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  gym: {
    brands: ["Pulse", "Kinetic", "Vector", "Strive", "AeroFit", "RunLab"],
    subcategories: [
      { name: "Dumbbells", brands: ["Pulse", "Kinetic", "Vector", "AeroFit"] },
      { name: "Yoga Mats", brands: ["Strive", "AeroFit", "RunLab", "Pulse"] },
      { name: "Shakers", brands: ["AeroFit", "RunLab", "Kinetic", "Vector"] },
      { name: "Resistance Bands", brands: ["Vector", "Pulse", "Strive", "Kinetic"] },
      { name: "Trackers", brands: ["RunLab", "Pulse", "AeroFit", "Vector"] }
    ],
    nouns: ["Dumbbell", "Yoga Mat", "Gym Gloves", "Protein Shaker", "Resistance Band", "Trainer", "Tracker", "Bench"],
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  shoes: {
    brands: ["Nike", "Adidas", "Puma", "Skechers", "Campus", "Bata"],
    subcategories: [
      { name: "Running Shoes", brands: ["Nike", "Adidas", "Puma", "Campus"] },
      { name: "Sneakers", brands: ["Nike", "Adidas", "Puma", "Skechers"] },
      { name: "Walking Shoes", brands: ["Skechers", "Bata", "Campus", "Puma"] },
      { name: "Training Shoes", brands: ["Nike", "Adidas", "Puma", "Skechers"] },
      { name: "Formal Shoes", brands: ["Bata", "Hush Puppies", "Red Tape", "Metro"] }
    ],
    nouns: ["Runner", "Sneaker", "Training Shoe", "Walking Shoe", "Court Shoe", "Street Shoe"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  "vehicle-parts": {
    brands: ["Bosch", "Michelin", "Castrol", "Minda", "Autofy", "Riders Hub"],
    subcategories: [
      { name: "Tyres", brands: ["Michelin", "MRF", "CEAT", "Apollo"] },
      { name: "Brake Kits", brands: ["Bosch", "Minda", "Autofy", "Riders Hub"] },
      { name: "Engine Oil", brands: ["Castrol", "Servo", "Mobil", "Shell"] },
      { name: "Headlamps", brands: ["Minda", "Bosch", "Autofy", "Hella"] },
      { name: "Seat Covers", brands: ["Autofy", "Riders Hub", "Elegant", "Autoform"] }
    ],
    nouns: ["Tyre Set", "Brake Kit", "Engine Oil", "Headlamp", "Seat Cover", "Tool Kit"],
    images: [
      "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  "home-decoration": {
    brands: ["Lumen", "Casa Noir", "NestLab", "Habitat X", "MonoHaus", "Decorly"],
    subcategories: [
      { name: "Lamps", brands: ["Lumen", "Casa Noir", "Decorly", "MonoHaus"] },
      { name: "Wall Art", brands: ["Decorly", "Habitat X", "Casa Noir", "NestLab"] },
      { name: "Vases", brands: ["Casa Noir", "MonoHaus", "NestLab", "Decorly"] },
      { name: "Mirrors", brands: ["Habitat X", "Casa Noir", "MonoHaus", "Decorly"] },
      { name: "Planters", brands: ["NestLab", "Habitat X", "Decorly", "Lumen"] }
    ],
    nouns: ["Lamp", "Wall Art", "Vase", "Mirror", "Planter", "Shelf"],
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1602872030490-4a484a7b3ba6?auto=format&fit=crop&w=1000&q=80"
    ]
  },
  study: {
    brands: ["Classmate", "Camlin", "Faber-Castell", "StudyPro", "Papergrid", "DeskLab"],
    subcategories: [
      { name: "Notebooks", brands: ["Classmate", "Papergrid", "StudyPro", "Camlin"] },
      { name: "Pens", brands: ["Camlin", "Faber-Castell", "Classmate", "Papergrid"] },
      { name: "Desk Organizers", brands: ["DeskLab", "StudyPro", "Papergrid", "Classmate"] },
      { name: "Backpacks", brands: ["StudyPro", "DeskLab", "Classmate", "Papergrid"] },
      { name: "Study Lamps", brands: ["DeskLab", "StudyPro", "Faber-Castell", "Camlin"] }
    ],
    nouns: ["Notebook Set", "Pen Kit", "Desk Organizer", "Backpack", "Study Lamp", "Planner"],
    images: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80"
    ]
  }
};

const makeProduct = (category, index) => {
  const blueprint = categoryBlueprints[category];
  const subcategory = blueprint.subcategories?.[index % blueprint.subcategories.length];
  const brandPool = subcategory?.brands || blueprint.brands;
  const brand = brandPool[index % brandPool.length];
  const noun = subcategory?.name || blueprint.nouns[index % blueprint.nouns.length];
  const series = ["Nova", "Aura", "Pulse", "Orbit", "Zenith", "Vanta"][index % 6];
  const price = 49 + ((index * 37) % 1150);
  const baseImage = getUniqueProductImage({ category, brand, noun, index, angle: "hero" });
  return {
    id: `${category}-${series.toLowerCase()}-${noun.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`,
    title: `${series} ${noun} ${index + 1}`,
    brand,
    category,
    productType: noun,
    tag: ["NEW", "POPULAR", "LTD", "ELITE"][index % 4],
    price,
    originalPrice: price + 80 + (index % 7) * 20,
    rating: Number((4.3 + (index % 7) * 0.1).toFixed(1)),
    reviews: 120 + index * 17,
    stock: 4 + (index % 26),
    variant: `${brand} | ${series} Edition`,
    image: baseImage,
    gallery: [
      baseImage,
      getUniqueProductImage({ category, brand, noun, index, angle: "front" }),
      getUniqueProductImage({ category, brand, noun, index, angle: "side" }),
      getUniqueProductImage({ category, brand, noun, index, angle: "detail" })
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

const productSearchTerms = {
  electronics: "premium electronics product",
  phones: "smartphone product photography",
  laptop: "laptop product photography",
  clothes: "fashion clothing product",
  grocery: "grocery product basket",
  gym: "gym fitness equipment product",
  shoes: "running shoes product photography",
  "vehicle-parts": "vehicle parts product",
  "home-decoration": "home decor product",
  study: "study stationery product"
};

const getUniqueProductImage = ({ category, brand, noun, index, angle }) => {
  const query = encodeURIComponent(`${brand} ${noun} ${productSearchTerms[category] || "ecommerce product"} ${angle}`);
  return `https://source.unsplash.com/900x1100/?${query}&sig=${encodeURIComponent(`${category}-${brand}-${noun}-${index}-${angle}`)}`;
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

export const getBrandsByCategory = (slug = "electronics") =>
  categoryBlueprints[slug]?.brands || [];

export const getProductsByCategoryAndBrand = (slug = "electronics", brand = "") =>
  products.filter((product) => product.category === slug && product.brand.toLowerCase() === brand.toLowerCase()).slice(0, 24);

export const getSubcategoriesByCategory = (slug = "electronics") =>
  categoryBlueprints[slug]?.subcategories?.map((subcategory) => subcategory.name) || [];

export const getBrandsByCategoryAndSubcategory = (slug = "electronics", productType = "") => {
  const blueprint = categoryBlueprints[slug];
  const subcategory = blueprint?.subcategories?.find((item) => item.name.toLowerCase() === productType.toLowerCase());
  return subcategory?.brands || blueprint?.brands || [];
};

export const getProductsByCategorySubcategoryAndBrand = (slug = "electronics", productType = "", brand = "") =>
  products
    .filter((product) => {
      const sameCategory = product.category === slug;
      const sameType = productType ? product.productType?.toLowerCase() === productType.toLowerCase() : true;
      const sameBrand = brand ? product.brand.toLowerCase() === brand.toLowerCase() : true;
      return sameCategory && sameType && sameBrand;
    })
    .slice(0, 24);
