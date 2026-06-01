import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToWishlist, optimisticToggleWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { selectIsWishlisted } from "../store/selectors";
import { notifyError } from "./common/Toast";

export default function WishlistButton({ product, className = "", iconClassName = "", showLabel = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // TODO: Replace with memoized selector from store/selectors.js
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const wishlisted = useSelector(selectIsWishlisted(product?._id));

  const onToggle = async (e) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(optimisticToggleWishlist({ productId: product._id, product }));
    try {
      if (wishlisted) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
      }
    } catch (error) {
      dispatch(optimisticToggleWishlist({ productId: product._id, product }));
      notifyError(error?.message || "Wishlist update failed");
    }
  };

  return (
    <button type="button" onClick={onToggle} className={className} aria-pressed={wishlisted}>
      <span className={`${wishlisted ? "text-red-500" : "text-white"} ${iconClassName}`}>{wishlisted ? "♥" : "♡"}</span>
      {showLabel && <span className="ml-2">{wishlisted ? "Wishlisted" : "Add to Wishlist"}</span>}
    </button>
  );
}
