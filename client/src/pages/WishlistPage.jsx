import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { addToCart } from "../store/slices/cartSlice";
import { fetchWishlist, removeFromWishlist, selectWishlistItems } from "../features/wishlist/wishlistSlice";
import { notifyError, notifySuccess } from "../components/common/Toast";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectWishlistItems);
  const status = useSelector((state) => state.wishlist.status);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const onRemove = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      notifySuccess("Removed from wishlist");
    } catch (error) {
      notifyError(error?.message || "Failed to remove");
    }
  };

  const onMoveToCart = async (product) => {
    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1, productData: product }));
      await dispatch(removeFromWishlist(product._id)).unwrap();
      notifySuccess("Moved to cart");
    } catch (error) {
      notifyError(error?.message || "Failed to move item");
    }
  };

  if (status === "loading") {
    return <main className="min-h-screen bg-zivvo-dark-bg p-6 text-zivvo-text-muted">Loading wishlist...</main>;
  }

  return (
    <main className="min-h-screen bg-zivvo-dark-bg px-4 py-6 text-zivvo-text-base md:px-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-2xl font-bold">My Wishlist</h1>
        {items.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zivvo-surface p-10 text-center">
            <p className="text-lg">Your wishlist is empty.</p>
            <Link to="/" className="mt-4 inline-block rounded-md bg-[#ef9f27] px-4 py-2 text-sm font-semibold text-black">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <div key={product._id} className="rounded-xl border border-zinc-800 bg-zivvo-surface p-3">
                <ProductCard product={product} />
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => onRemove(product._id)} className="rounded-md border border-zinc-700 py-2 text-sm">
                    Remove
                  </button>
                  <button type="button" onClick={() => onMoveToCart(product)} className="rounded-md bg-[#ef9f27] py-2 text-sm font-semibold text-black">
                    Move to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
