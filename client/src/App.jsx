import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LandingPage from "./pages/LandingPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
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
import SellerCouponsPage from "./pages/seller/SellerCouponsPage";
import SellerReturnsPage from "./pages/seller/SellerReturnsPage";
import AdminPanel from "./pages/AdminPanel";
import WishlistPage from "./pages/WishlistPage";
import NotificationsPage from "./pages/NotificationsPage";
import ReturnDetailPage from "./pages/ReturnDetailPage";
import SellerStorefrontPage from "./pages/SellerStorefrontPage";
import SellerVerificationPage from "./pages/seller/SellerVerificationPage";
import AdminVerificationPage from "./pages/admin/AdminVerificationPage";
import AdminVerificationDetailPage from "./pages/admin/AdminVerificationDetailPage";
import AddressBookPage from "./pages/AddressBookPage";
import { setCredentials, setLoading } from "./store/slices/authSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import { fetchWishlist } from "./features/wishlist/wishlistSlice";
import { fetchNotifications } from "./features/notifications/notificationsSlice";
import { useNotificationSocket } from "./hooks/useNotificationSocket";
import useLoadingStore from "./store/useLoadingStore";

function Placeholder({ title }) {
  return <main className="min-h-screen bg-zivvo-dark-bg p-8 text-zivvo-text-base">{title}</main>;
}

function RouteTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
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
  const isLoading = useLoadingStore((state) => state.isLoading);
  const [routeLoading, setRouteLoading] = useState(true);
  const [globalLoadingVisible, setGlobalLoadingVisible] = useState(false);
  useNotificationSocket();

  useEffect(() => {
    setRouteLoading(true);
    const timer = setTimeout(() => setRouteLoading(false), 2200);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isLoading) {
      setGlobalLoadingVisible(false);
      return undefined;
    }

    const timer = setTimeout(() => setGlobalLoadingVisible(true), 400);
    return () => clearTimeout(timer);
  }, [isLoading]);

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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--cream)] transition-colors duration-300">
      <Loader active={routeLoading || globalLoadingVisible} />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname + location.search}>
          <Route path="/" element={<RouteTransition><LandingPage /></RouteTransition>} />
          <Route path="/search" element={<RouteTransition><SearchResultsPage /></RouteTransition>} />
          <Route path="/category/:slug" element={<RouteTransition><CategoryPage /></RouteTransition>} />
          <Route path="/product/:slug" element={<RouteTransition><ProductDetailPage /></RouteTransition>} />
          <Route path="/cart" element={<RouteTransition><Cart /></RouteTransition>} />
          <Route path="/wishlist" element={<RouteTransition><PrivateRoute><WishlistPage /></PrivateRoute></RouteTransition>} />
          <Route path="/notifications" element={<RouteTransition><PrivateRoute><NotificationsPage /></PrivateRoute></RouteTransition>} />
          <Route path="/login" element={<RouteTransition><Login /></RouteTransition>} />
          <Route path="/register" element={<RouteTransition><Register /></RouteTransition>} />
          <Route path="/forgot-password" element={<RouteTransition><ForgotPassword /></RouteTransition>} />
          <Route path="/reset-password/:token" element={<RouteTransition><ResetPassword /></RouteTransition>} />
          <Route path="/seller" element={<RouteTransition><SellerRoute><SellerDashboardPage /></SellerRoute></RouteTransition>} />
          <Route path="/seller/manage" element={<RouteTransition><SellerRoute><SellerDashboard /></SellerRoute></RouteTransition>} />
          <Route path="/seller/coupons" element={<RouteTransition><SellerRoute><SellerCouponsPage /></SellerRoute></RouteTransition>} />
          <Route path="/seller/returns" element={<RouteTransition><SellerRoute><SellerReturnsPage /></SellerRoute></RouteTransition>} />
          <Route path="/seller/verification" element={<RouteTransition><SellerRoute><SellerVerificationPage /></SellerRoute></RouteTransition>} />
          <Route path="/admin" element={<RouteTransition><AdminRoute><AdminPanel /></AdminRoute></RouteTransition>} />
          <Route path="/admin/verification" element={<RouteTransition><AdminRoute><AdminVerificationPage /></AdminRoute></RouteTransition>} />
          <Route path="/admin/verification/:sellerId" element={<RouteTransition><AdminRoute><AdminVerificationDetailPage /></AdminRoute></RouteTransition>} />
          <Route path="/checkout" element={<RouteTransition><PrivateRoute><Checkout /></PrivateRoute></RouteTransition>} />
          <Route path="/account" element={<RouteTransition><PrivateRoute><Account /></PrivateRoute></RouteTransition>} />
          <Route path="/account/addresses" element={<RouteTransition><PrivateRoute><AddressBookPage /></PrivateRoute></RouteTransition>} />
          <Route path="/order-success/:orderId" element={<RouteTransition><PrivateRoute><OrderSuccess /></PrivateRoute></RouteTransition>} />
          <Route path="/account/orders" element={<RouteTransition><PrivateRoute><AccountOrders /></PrivateRoute></RouteTransition>} />
          <Route path="/orders/:id" element={<RouteTransition><PrivateRoute><OrderDetailPage /></PrivateRoute></RouteTransition>} />
          <Route path="/seller/:sellerId" element={<RouteTransition><SellerStorefrontPage /></RouteTransition>} />
          <Route path="/returns/:id" element={<RouteTransition><PrivateRoute><ReturnDetailPage /></PrivateRoute></RouteTransition>} />
          <Route path="*" element={<RouteTransition><Placeholder title="Not Found" /></RouteTransition>} />
        </Routes>
      </AnimatePresence>
      {location.pathname !== "/" && <Footer />}
    </div>
  );
}
