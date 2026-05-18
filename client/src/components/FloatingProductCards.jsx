const products = [
  { emoji: "👜", name: "Artisan Leather Bag", price: "₹2,499", badge: "HOT", badgeClass: "float-card-badge-hot" },
  { emoji: "💎", name: "Silver Pendant Set", price: "₹1,199", badge: "NEW", badgeClass: "float-card-badge-new" },
  { emoji: "🕯️", name: "Luxury Soy Candle", price: "₹649", badge: "SALE", badgeClass: "float-card-badge-sale" },
  { emoji: "🎨", name: "Handwoven Kantha", price: "₹3,299", badge: "HOT", badgeClass: "float-card-badge-hot" }
];

export function FloatingProductCards() {
  return (
    <div className="floating-product-row">
      {products.map((product) => (
        <article key={product.name} className="float-card">
          <span className="float-card-emoji">{product.emoji}</span>
          <h3 className="float-card-name">{product.name}</h3>
          <p className="float-card-price">{product.price}</p>
          <span className={`float-card-badge ${product.badgeClass}`}>{product.badge}</span>
        </article>
      ))}
    </div>
  );
}

export default FloatingProductCards;
