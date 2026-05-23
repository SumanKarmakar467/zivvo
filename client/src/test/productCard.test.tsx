import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/types";

const mockProduct: Product = {
  _id: "prod_001",
  name: "Blue Pottery Vase",
  brand: "Rajesh Pottery",
  seller: "seller_001",
  category: "Home Decor",
  description: "A beautiful handcrafted vase",
  price: 4199,
  mrp: 6500,
  discount: 35,
  stock: 10,
  images: ["https://images.unsplash.com/photo-test"],
  averageRating: 4.8,
  totalReviews: 234,
  totalSales: 891,
  status: "active",
  createdAt: new Date().toISOString(),
  badge: "HOT"
};

const renderCard = (props = {}) =>
  render(
    <BrowserRouter>
      <ProductCard product={mockProduct} {...props} />
    </BrowserRouter>
  );

describe("ProductCard", () => {
  it("renders product name", () => {
    renderCard();
    expect(screen.getByText("Blue Pottery Vase")).toBeInTheDocument();
  });

  it("renders formatted price with rupee symbol", () => {
    renderCard();
    expect(screen.getByText(/₹4,199/)).toBeInTheDocument();
  });

  it("renders discount percentage", () => {
    renderCard();
    expect(screen.getByText(/35%/)).toBeInTheDocument();
  });

  it("renders HOT badge when badge prop is HOT", () => {
    renderCard();
    expect(screen.getByText(/HOT/i)).toBeInTheDocument();
  });

  it("calls onWishlistToggle with productId when heart clicked", () => {
    const onWishlistToggle = vi.fn();
    renderCard({ onWishlistToggle });
    fireEvent.click(screen.getByLabelText(/wishlist/i));
    expect(onWishlistToggle).toHaveBeenCalledWith("prod_001");
  });

  it("calls onAddToCart when add to cart clicked", () => {
    const onAddToCart = vi.fn();
    renderCard({ onAddToCart, showQuickAdd: true });
    fireEvent.click(screen.getByText(/add to cart/i));
    expect(onAddToCart).toHaveBeenCalledWith("prod_001", undefined);
  });

  it("shows out of stock state when stock is 0", () => {
    renderCard({ product: { ...mockProduct, stock: 0 } });
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });
});
