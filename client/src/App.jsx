import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function Placeholder({ title }) {
  return <main className="min-h-screen bg-zivvo-dark-bg p-8 text-zivvo-text-base">{title}</main>;
}

function PrivateRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-zivvo-dark-bg text-zivvo-text-base">
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname + location.search}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/order-success/:orderId" element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
          <Route path="/orders/:id" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
          <Route path="*" element={<Placeholder title="Not Found" />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
