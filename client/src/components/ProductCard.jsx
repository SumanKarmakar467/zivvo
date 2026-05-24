import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../store/slices/cartSlice";
import { selectIsWishlisted, toggleWishlist } from "../store/wishlistSlice";
import UiProductCard from "./ui/ProductCard";
import { notifyError, notifySuccess } from "./common/Toast";

const fallbackEmoji = "🛍️";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlisted = useSelector(selectIsWishlisted(product?._id));
  const image = product?.image || product?.images?.[0] || "";
  const href = product?.slug ? `/product/${product.slug}` : product?._id ? `/product/${product._id}` : "/search";

  return (
    <Link to={href} className="block">
      <UiProductCard
        id={product?._id}
        name={product?.name || "Zivvo Product"}
        brand={product?.brand || product?.category?.name || product?.cat || "Zivvo"}
        price={product?.price || 0}
        mrp={product?.mrp || product?.oldPrice}
        discount={product?.discount}
        rating={product?.averageRating ?? product?.rating ?? 4.5}
        reviewCount={product?.reviewCount ?? product?.numReviews ?? 0}
        emoji={product?.emoji || fallbackEmoji}
        image={image}
        badge={product?.isNew ? "new" : product?.sale || product?.discount ? "sale" : product?.isFeatured ? "hot" : ""}
        isWishlisted={wishlisted}
        href={href}
        onWishlistToggle={() => dispatch(toggleWishlist(product))}
        onAddToCart={async () => {
          try {
            await dispatch(addToCart({ productId: product?._id, quantity: 1, productData: product }));
            notifySuccess("Added to cart");
          } catch (error) {
            notifyError(error?.message || "Failed to add to cart");
          }
        }}
      />
    </Link>
  );
}
