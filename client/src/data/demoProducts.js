const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const palette = [
  ["#1f1a14", "#ef7d00", "#fff4e8"],
  ["#101828", "#22c55e", "#e0f2fe"],
  ["#21142f", "#f97316", "#fdf2f8"],
  ["#10201a", "#38bdf8", "#ecfeff"],
  ["#2b1d12", "#facc15", "#fff7ed"],
  ["#18181b", "#a78bfa", "#f5f3ff"]
];

const imageFor = (query, index) => {
  const [bg, accent, ink] = palette[index % palette.length];
  const label = String(query)
    .replace(/\s+product$/i, "")
    .replace(/[<>&"']/g, "")
    .trim();
  const words = label.split(/\s+/);
  const lineOne = words.slice(0, 3).join(" ");
  const lineTwo = words.slice(3, 6).join(" ");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="#080604"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" fill="url(#g)"/>
  <rect x="56" y="58" width="488" height="294" rx="34" fill="${ink}" opacity="0.1" stroke="${accent}" stroke-width="6"/>
  <circle cx="300" cy="188" r="78" fill="${accent}" opacity="0.95"/>
  <rect x="222" y="202" width="156" height="74" rx="22" fill="${ink}" opacity="0.96"/>
  <path d="M246 202c12-45 96-45 108 0" fill="none" stroke="${ink}" stroke-width="18" stroke-linecap="round"/>
  <text x="300" y="84" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="800" fill="${accent}" letter-spacing="5">ZIVVO</text>
  <text x="300" y="382" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="${ink}">${lineOne}</text>
  <text x="300" y="416" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="${accent}">${lineTwo}</text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const catalog = {
  Electronics: [
    ["DSLR Camera Kit 24MP", "Canon", 28999, 47999, "camera photography"],
    ['Ultra Slim Laptop 14"', "Lenovo", 52499, 62999, "laptop computer"],
    ["Smart Watch Series 8", "Noise", 18999, 24999, "smart watch"],
    ["Wireless ANC Headphones", "boAt", 2499, 4999, "headphones audio"],
    ["Bluetooth Party Speaker", "JBL", 6999, 9999, "speaker"],
    ["4K Action Camera", "GoPro", 15999, 21999, "action camera"],
    ["Mechanical RGB Keyboard", "Redragon", 3299, 4999, "keyboard"],
    ["Ergonomic Wireless Mouse", "Logitech", 1299, 1999, "mouse"],
    ["Tablet Pro 10.5 inch", "Samsung", 24999, 31999, "tablet"],
    ["65W Fast Charger", "Anker", 1699, 2499, "charger"],
    ["Portable Power Bank 20000mAh", "Ambrane", 1499, 2299, "power bank"],
    ["USB-C Hub 8-in-1", "Portronics", 2199, 3499, "usb hub"],
    ["Wi-Fi 6 Router", "TP-Link", 3999, 5999, "router"],
    ["Full HD Webcam", "Logitech", 2799, 4299, "webcam"],
    ["Gaming Monitor 27 inch", "Acer", 17999, 23999, "monitor"],
    ["True Wireless Earbuds", "OnePlus", 3499, 5499, "earbuds"]
  ],
  Fashion: [
    ["Campus Running Shoes", "Campus", 1799, 2999, "running shoes sneakers footwear"],
    ["Puma Smash Sneakers", "Puma", 2999, 4999, "sneakers shoes footwear"],
    ["Bata Comfort Sandals", "Bata", 899, 1499, "sandals shoes footwear"],
    ["Nike Court Vision Shoes", "Nike", 4299, 6299, "shoes sneakers footwear"],
    ["Adidas Lite Racer Shoes", "Adidas", 3499, 5999, "shoes sneakers footwear"],
    ["Woodland Trekking Boots", "Woodland", 4999, 6999, "boots shoes footwear"],
    ["Leather Tote Bag", "Zivvo", 3499, 4999, "bag handbag fashion"],
    ["Men's Jogger Set", "Urban Loom", 1799, 2499, "jogger apparel"],
    ["Classic Cotton Shirt", "Zivvo Basics", 899, 1499, "shirt apparel"],
    ["Oxford Button Down Shirt", "Urban Loom", 1299, 1999, "shirt apparel"],
    ["Linen Summer Shirt", "Coastline", 1599, 2299, "shirt apparel"],
    ["Levi's 511 Blue Jeans", "Levi's", 2499, 3999, "jeans denim"],
    ["Printed Casual T-Shirt", "Roadster", 699, 999, "tshirt apparel"],
    ["Women's Denim Jacket", "Only", 2199, 3499, "jacket apparel"],
    ["Analog Leather Watch", "Fastrack", 1899, 2999, "watch fashion"],
    ["Aviator Sunglasses", "Ray-Ban", 3299, 5299, "sunglasses fashion"]
  ],
  Home: [
    ["Indoor Plant Set of 3", "Ugaoo", 1299, 1999, "plants home decor"],
    ["Cotton Bedsheet King Size", "Home Centre", 1499, 2499, "bedsheet home"],
    ["Memory Foam Pillow Pair", "Wakefit", 1199, 1899, "pillow home"],
    ["Wooden Wall Shelf", "DeckUp", 999, 1599, "shelf home decor"],
    ["LED Table Lamp", "Wipro", 1299, 2199, "lamp home"],
    ["Aroma Diffuser", "Dr Trust", 899, 1499, "diffuser home"],
    ["Bath Towel Set", "Spaces", 1099, 1799, "towel home"],
    ["Door Mat Combo", "Saral", 499, 799, "doormat home"],
    ["Storage Organizer Bins", "Solimo", 799, 1199, "storage home"],
    ["Wall Clock Minimal", "Ajanta", 699, 999, "clock home"],
    ["Curtain Set Blackout", "Story@Home", 1999, 2999, "curtains home"],
    ["Sofa Cushion Covers", "Fabindia", 899, 1399, "cushion home"]
  ],
  Beauty: [
    ["Velvet Matte Lipstick Trio", "Lakme", 699, 999, "lipstick makeup beauty"],
    ["Ubtan Face Wash", "Mamaearth", 269, 399, "face wash skincare"],
    ["Vitamin C Face Serum", "Minimalist", 699, 999, "serum skincare"],
    ["Kajal Eye Pencil", "Maybelline", 249, 399, "kajal makeup"],
    ["Hydrating Moisturizer", "Cetaphil", 599, 799, "moisturizer skincare"],
    ["Sunscreen SPF 50", "Aqualogica", 449, 699, "sunscreen skincare"],
    ["Hair Serum Smooth", "L'Oreal", 549, 799, "hair serum beauty"],
    ["Nail Paint Set", "Colorbar", 399, 599, "nail paint makeup"],
    ["Compact Powder", "Sugar", 499, 799, "compact makeup"],
    ["Beard Grooming Kit", "Bombay Shaving", 999, 1499, "grooming beauty"],
    ["Body Mist Floral", "Plum", 599, 899, "fragrance beauty"],
    ["Makeup Brush Set", "PAC", 899, 1399, "brush makeup"]
  ],
  Books: [
    ["Weekend Reading Bundle", "Penguin", 999, 1499, "books fiction"],
    ["Wings of Fire", "Universities Press", 299, 499, "book biography"],
    ["Atomic Habits", "Random House", 499, 799, "book self help"],
    ["Ikigai", "Hutchinson", 349, 599, "book self help"],
    ["Rich Dad Poor Dad", "Plata", 399, 699, "book finance"],
    ["The Psychology of Money", "Harriman", 449, 699, "book finance"],
    ["Harry Potter Box Set", "Bloomsbury", 2499, 3999, "books fantasy"],
    ["Indian Polity", "McGraw Hill", 799, 1099, "book exam"],
    ["Children's Story Collection", "Scholastic", 599, 899, "books kids"],
    ["Cookbook Indian Meals", "Roli", 699, 999, "book cooking"],
    ["Notebook Hardcover Pack", "Classmate", 349, 549, "notebook stationery"],
    ["Manga Starter Set", "Viz", 1299, 1899, "books manga"]
  ],
  Sports: [
    ["Yoga Mat Premium 6mm", "Boldfit", 899, 1399, "yoga mat sports"],
    ["Yonex Badminton Racket", "Yonex", 1199, 1799, "badminton racket"],
    ["Nivia Storm Football", "Nivia", 699, 1099, "football sports"],
    ["Cricket Bat Kashmir Willow", "SG", 1899, 2999, "cricket bat"],
    ["Skipping Rope Speed", "Strauss", 299, 499, "skipping rope"],
    ["Dumbbell Pair 5kg", "Kore", 1499, 2299, "dumbbell fitness"],
    ["Resistance Band Set", "Fitkit", 599, 999, "resistance bands"],
    ["Tennis Ball Pack", "Cosco", 349, 599, "tennis ball"],
    ["Cycling Helmet", "Firefox", 1299, 1999, "cycling helmet"],
    ["Gym Gloves", "Nivia", 499, 799, "gym gloves"],
    ["Basketball Size 7", "Spalding", 999, 1599, "basketball"],
    ["Sports Water Bottle", "Cello", 399, 699, "sports bottle"]
  ],
  Toys: [
    ["Creative Blocks Play Set", "LEGO", 1199, 1999, "blocks toys"],
    ["Remote Control Car", "Maisto", 1499, 2499, "rc car toy"],
    ["Plush Teddy Bear", "Hamleys", 799, 1299, "teddy toy"],
    ["Magnetic Building Tiles", "Toyshine", 1399, 2199, "building toy"],
    ["Wooden Puzzle Board", "Skillmatics", 499, 799, "puzzle toy"],
    ["Doll House Mini Set", "Barbie", 1999, 2999, "doll toy"],
    ["Science Experiment Kit", "Smartivity", 899, 1499, "science toy"],
    ["Kids Art Kit", "Faber-Castell", 699, 1099, "art toy"],
    ["Board Game Family Pack", "Funskool", 999, 1599, "board game"],
    ["Die Cast Car Set", "Hot Wheels", 799, 1299, "car toy"],
    ["Musical Keyboard Toy", "Casio", 1299, 1999, "music toy"],
    ["Stacking Ring Set", "Fisher-Price", 449, 699, "baby toy"]
  ],
  Kitchen: [
    ["Pour-Over Coffee Kit", "Hario", 2299, 3499, "coffee kitchen"],
    ["Prestige Pressure Cooker 5L", "Prestige", 2099, 3199, "pressure cooker kitchen"],
    ["Philips Mixer Grinder 750W", "Philips", 3499, 4995, "mixer grinder"],
    ["Milton Steel Bottle 1L", "Milton", 549, 899, "bottle kitchen"],
    ["Non-Stick Fry Pan", "Hawkins", 899, 1399, "pan kitchen"],
    ["Knife Set Stainless Steel", "Pigeon", 799, 1199, "knife kitchen"],
    ["Air Fryer 4L", "Inalsa", 4999, 7499, "air fryer"],
    ["Glass Storage Jars", "Borosil", 999, 1499, "storage jars"],
    ["Electric Kettle 1.8L", "Bajaj", 899, 1299, "kettle kitchen"],
    ["Dinner Set 18 Pieces", "Cello", 1899, 2999, "dinner set"],
    ["Chopping Board Set", "Solimo", 499, 799, "chopping board"],
    ["Lunch Box Steel", "Milton", 699, 999, "lunch box"]
  ],
  Garden: [
    ["Balcony Garden Starter Kit", "Ugaoo", 1499, 2299, "garden plants"],
    ["Ceramic Planter Set", "TrustBasket", 899, 1399, "planter garden"],
    ["Garden Tool Kit", "Falcon", 999, 1599, "garden tools"],
    ["Organic Potting Mix", "IFFCO", 399, 599, "soil garden"],
    ["Flower Seeds Combo", "Kraft Seeds", 299, 499, "seeds garden"],
    ["Watering Can 5L", "Kisan Kraft", 449, 699, "watering can garden"],
    ["Hanging Planter Pair", "Green Girgit", 799, 1199, "hanging planter"],
    ["Solar Garden Lights", "Homehop", 1299, 1999, "garden lights"],
    ["Plant Stand Metal", "DeckUp", 1599, 2499, "plant stand"],
    ["Cocopeat Block Pack", "TrustBasket", 349, 549, "cocopeat garden"],
    ["Pruning Shears", "Falcon", 599, 899, "pruning garden"],
    ["Compost Bin 15L", "Daily Dump", 1299, 1899, "compost garden"]
  ]
};

export const demoProducts = Object.entries(catalog).flatMap(([category, items]) =>
  items.map(([name, brand, price, oldPrice, tags], index) => ({
    _id: `demo-${slugify(category)}-${index + 1}`,
    slug: `demo-${slugify(name)}`,
    name,
    cat: category,
    category: { name: category, slug: slugify(category) },
    brand,
    price,
    oldPrice,
    mrp: oldPrice,
    rating: Number((4.4 + (index % 6) * 0.1).toFixed(1)),
    averageRating: Number((4.4 + (index % 6) * 0.1).toFixed(1)),
    image: imageFor(`${name} product`, index + category.length),
    images: [imageFor(`${name} product`, index + category.length)],
    tags: tags.split(" "),
    isNew: index % 7 === 0
  }))
);

const queryAliases = {
  shoe: ["shoe", "shoes", "sneaker", "sneakers", "sandals", "boots", "footwear"],
  shoes: ["shoe", "shoes", "sneaker", "sneakers", "sandals", "boots", "footwear"],
  fashion: ["fashion", "shirt", "jeans", "jogger", "shoes", "bag", "watch", "sunglasses"],
  mobile: ["phone", "mobile", "smartphone"],
  home: ["home", "decor", "bedsheet", "pillow", "lamp"],
  kitchen: ["kitchen", "coffee", "cooker", "mixer", "bottle", "pan"],
  sport: ["sports", "sport", "fitness", "football", "cricket", "yoga"],
  sports: ["sports", "sport", "fitness", "football", "cricket", "yoga"]
};

export const getDemoFacets = () => ({
  categories: Object.keys(catalog).map((name) => ({ name, slug: slugify(name) })),
  brands: Array.from(new Set(demoProducts.map((product) => product.brand))).sort((a, b) => a.localeCompare(b))
});

export const searchDemoProducts = ({
  q = "",
  category = "",
  brand = "",
  minPrice = "",
  maxPrice = "",
  minRating = "",
  sort = "newest",
  page = 1,
  limit = 20
} = {}) => {
  const text = String(q).trim().toLowerCase();
  const terms = new Set(text ? text.split(/\s+/).filter(Boolean) : []);
  terms.forEach((term) => (queryAliases[term] || []).forEach((alias) => terms.add(alias)));

  const categoryKey = String(category).trim().toLowerCase();
  const brandKey = String(brand).trim().toLowerCase();
  const min = minPrice === "" ? null : Number(minPrice);
  const max = maxPrice === "" ? null : Number(maxPrice);
  const rating = minRating === "" ? null : Number(minRating);

  let products = demoProducts.filter((product) => {
    const haystack = `${product.name} ${product.cat} ${product.brand} ${product.tags.join(" ")}`.toLowerCase();
    const matchesText = !terms.size || Array.from(terms).some((term) => haystack.includes(term));
    const matchesCategory = !categoryKey || product.category.slug === categoryKey || product.cat.toLowerCase() === categoryKey;
    const matchesBrand = !brandKey || product.brand.toLowerCase() === brandKey;
    const matchesMin = min === null || product.price >= min;
    const matchesMax = max === null || product.price <= max;
    const matchesRating = rating === null || product.rating >= rating;
    return matchesText && matchesCategory && matchesBrand && matchesMin && matchesMax && matchesRating;
  });

  if (sort === "price_asc") products = [...products].sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") products = [...products].sort((a, b) => b.price - a.price);
  else if (sort === "popular" || sort === "rating") products = [...products].sort((a, b) => b.rating - a.rating);

  const safePage = Math.max(Number(page || 1), 1);
  const safeLimit = Math.max(Number(limit || 20), 1);
  const total = products.length;
  const start = (safePage - 1) * safeLimit;

  return {
    products: products.slice(start, start + safeLimit),
    total,
    page: safePage,
    pages: Math.ceil(total / safeLimit)
  };
};
