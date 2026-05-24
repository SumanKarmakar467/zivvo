import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, setLoading } from "./store/slices/authSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import { fetchWishlist } from "./features/wishlist/wishlistSlice";
import { fetchNotifications } from "./features/notifications/notificationsSlice";
import { useNotificationSocket } from "./hooks/useNotificationSocket";
import useLoadingStore from "./store/useLoadingStore";
import PageWrapper from "./components/ui/PageWrapper";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import PageSeo from "./components/PageSeo";
import Spinner from "./components/Spinner";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const AccountOrders = lazy(() => import("./pages/AccountOrders"));
const Account = lazy(() => import("./pages/Account"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const SellerDashboardPage = lazy(() => import("./pages/seller/SellerDashboardPage"));
const SellerDashboardNew = lazy(() => import("./pages/seller/SellerDashboard"));
const SellerProducts = lazy(() => import("./pages/seller/SellerProducts"));
const SellerOrders = lazy(() => import("./pages/seller/SellerOrders"));
const SellerCouponsPage = lazy(() => import("./pages/seller/SellerCouponsPage"));
const SellerReturnsPage = lazy(() => import("./pages/seller/SellerReturnsPage"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const ReturnDetailPage = lazy(() => import("./pages/ReturnDetailPage"));
const SellerStorefrontPage = lazy(() => import("./pages/SellerStorefrontPage"));
const SellerVerificationPage = lazy(() => import("./pages/seller/SellerVerificationPage"));
const AdminVerificationPage = lazy(() => import("./pages/admin/AdminVerificationPage"));
const AdminVerificationDetailPage = lazy(() => import("./pages/admin/AdminVerificationDetailPage"));
const AddressBookPage = lazy(() => import("./pages/AddressBookPage"));

function Placeholder({ title }) {
  return <main className="min-h-screen bg-zivvo-dark-bg p-8 text-zivvo-text-base">{title}</main>;
}

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) return <main className="min-h-screen bg-zivvo-dark-bg" />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function SellerRoute({ children }) {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  if (loading) return <main className="min-h-screen bg-zivvo-dark-bg" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || (user.role !== "seller" && user.role !== "admin")) return <Navigate to="/" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  if (loading) return <main className="min-h-screen bg-zivvo-dark-bg" />;
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
  const reduceMotion = useReducedMotion();
  const [routeLoading, setRouteLoading] = useState(true);
  const [globalLoadingVisible, setGlobalLoadingVisible] = useState(false);
  const seo = useMemo(() => {
    if (location.pathname.startsWith("/search")) return { title: "Search Products | Zivvo", description: "Search and filter Zivvo products by category, price, rating, and newest arrivals." };
    if (location.pathname.startsWith("/product")) return { title: "Product Details | Zivvo", description: "View product details, ratings, offers, delivery options, and secure checkout on Zivvo." };
    if (location.pathname.startsWith("/seller/dashboard")) return { title: "Seller Dashboard | Zivvo", description: "Track seller products, orders, revenue, ratings, and recent activity on Zivvo." };
    if (location.pathname.startsWith("/cart")) return { title: "Cart | Zivvo", description: "Review your Zivvo cart, coupons, delivery charges, and checkout total." };
    if (location.pathname.startsWith("/checkout")) return { title: "Checkout | Zivvo", description: "Complete your Zivvo order with saved addresses and secure payment options." };
    if (location.pathname.startsWith("/account/orders")) return { title: "My Orders | Zivvo", description: "Track your Zivvo orders, shipment status, cancellation, and returns." };
    return { title: "Zivvo | Indian E-commerce Marketplace", description: "Shop curated Indian products on Zivvo with secure checkout, seller tools, and fast discovery." };
  }, [location.pathname]);
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
      <PageSeo title={seo.title} description={seo.description} />
      <Loader active={!reduceMotion && (routeLoading || globalLoadingVisible)} />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={<main className="grid min-h-[60vh] place-items-center"><Spinner label="Loading page" /></main>}>
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
          <Route path="/seller/dashboard" element={<PageWrapper><SellerRoute><ErrorBoundary><SellerDashboardNew /></ErrorBoundary></SellerRoute></PageWrapper>} />
          <Route path="/seller/products" element={<PageWrapper><SellerRoute><ErrorBoundary><SellerProducts /></ErrorBoundary></SellerRoute></PageWrapper>} />
          <Route path="/seller/orders" element={<PageWrapper><SellerRoute><ErrorBoundary><SellerOrders /></ErrorBoundary></SellerRoute></PageWrapper>} />
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
        </Suspense>
      </AnimatePresence>
      {location.pathname !== "/" && <Footer />}
    </div>
  );
}
