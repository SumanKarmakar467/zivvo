import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import SearchResultsPage from "./pages/SearchResultsPage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetailPage from "./pages/OrderDetailPage";
import AccountOrders from "./pages/AccountOrders";
import Account from "./pages/Account";
import SellerDashboard from "./pages/SellerDashboard";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import AdminPanel from "./pages/AdminPanel";
import WishlistPage from "./pages/WishlistPage";
import NotificationsPage from "./pages/NotificationsPage";
import { setCredentials, setLoading } from "./store/slices/authSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { fetchWishlist } from "./features/wishlist/wishlistSlice";
import { fetchNotifications } from "./features/notifications/notificationsSlice";
import { useNotificationSocket } from "./hooks/useNotificationSocket";

function Placeholder({ title }) {
  return <main className="min-h-screen bg-zivvo-dark-bg p-8 text-zivvo-text-base">{title}</main>;
}

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function SellerRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || (user.role !== "seller" && user.role !== "admin")) return <Navigate to="/" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

const parseJwt = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);
  useNotificationSocket();

  useEffect(() => {
    const restore = async () => {
      dispatch(setLoading(true));
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include"
        });
        if (!res.ok) throw new Error("No active session");
        const data = await res.json();
        const payload = parseJwt(data.accessToken);
        if (payload?.id) {
          dispatch(
            setCredentials({
              accessToken: data.accessToken,
              user: { _id: payload.id, email: payload.email || "", role: payload.role || "user", name: "" }
            })
          );
        }
      } catch {
        dispatch(setLoading(false));
      }
    };

    restore();
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    dispatch(fetchWishlist());
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
  }, [dispatch, isAuthenticated, accessToken]);

  return (
    <div className="min-h-screen bg-zivvo-dark-bg text-zivvo-text-base">
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname + location.search}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/seller" element={<SellerRoute><SellerDashboardPage /></SellerRoute>} />
          <Route path="/seller/manage" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
          <Route path="/order-success/:orderId" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
          <Route path="/account/orders" element={<PrivateRoute><AccountOrders /></PrivateRoute>} />
          <Route path="/orders/:id" element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
          <Route path="*" element={<Placeholder title="Not Found" />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
