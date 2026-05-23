import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
import PageWrapper from "./components/ui/PageWrapper";

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
          <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
          <Route path="/search" element={<PageWrapper><SearchResultsPage /></PageWrapper>} />
          <Route path="/category/:slug" element={<PageWrapper><CategoryPage /></PageWrapper>} />
          <Route path="/product/:slug" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
          <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
          <Route path="/wishlist" element={<PageWrapper><PrivateRoute><WishlistPage /></PrivateRoute></PageWrapper>} />
          <Route path="/notifications" element={<PageWrapper><PrivateRoute><NotificationsPage /></PrivateRoute></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
          <Route path="/reset-password/:token" element={<PageWrapper><ResetPassword /></PageWrapper>} />
          <Route path="/seller" element={<PageWrapper><SellerRoute><SellerDashboardPage /></SellerRoute></PageWrapper>} />
          <Route path="/seller/manage" element={<PageWrapper><SellerRoute><SellerDashboard /></SellerRoute></PageWrapper>} />
          <Route path="/seller/coupons" element={<PageWrapper><SellerRoute><SellerCouponsPage /></SellerRoute></PageWrapper>} />
          <Route path="/seller/returns" element={<PageWrapper><SellerRoute><SellerReturnsPage /></SellerRoute></PageWrapper>} />
          <Route path="/seller/verification" element={<PageWrapper><SellerRoute><SellerVerificationPage /></SellerRoute></PageWrapper>} />
          <Route path="/admin" element={<PageWrapper><AdminRoute><AdminPanel /></AdminRoute></PageWrapper>} />
          <Route path="/admin/verification" element={<PageWrapper><AdminRoute><AdminVerificationPage /></AdminRoute></PageWrapper>} />
          <Route path="/admin/verification/:sellerId" element={<PageWrapper><AdminRoute><AdminVerificationDetailPage /></AdminRoute></PageWrapper>} />
          <Route path="/checkout" element={<PageWrapper><PrivateRoute><Checkout /></PrivateRoute></PageWrapper>} />
          <Route path="/account" element={<PageWrapper><PrivateRoute><Account /></PrivateRoute></PageWrapper>} />
          <Route path="/account/addresses" element={<PageWrapper><PrivateRoute><AddressBookPage /></PrivateRoute></PageWrapper>} />
          <Route path="/order-success/:orderId" element={<PageWrapper><PrivateRoute><OrderSuccess /></PrivateRoute></PageWrapper>} />
          <Route path="/account/orders" element={<PageWrapper><PrivateRoute><AccountOrders /></PrivateRoute></PageWrapper>} />
          <Route path="/orders/:id" element={<PageWrapper><PrivateRoute><OrderDetailPage /></PrivateRoute></PageWrapper>} />
          <Route path="/seller/:sellerId" element={<PageWrapper><SellerStorefrontPage /></PageWrapper>} />
          <Route path="/returns/:id" element={<PageWrapper><PrivateRoute><ReturnDetailPage /></PrivateRoute></PageWrapper>} />
          <Route path="*" element={<PageWrapper><Placeholder title="Not Found" /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      {location.pathname !== "/" && <Footer />}
    </div>
  );
}
