import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 }
};

function PageShell({ title }) {
  return (
    <motion.main
      className="min-h-screen bg-zivvo-radial px-6 py-14 md:px-10"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <section className="mx-auto max-w-6xl rounded-2xl border border-zivvo-amber-deep/30 bg-zivvo-dark-surface/85 p-8 shadow-amber backdrop-blur">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-zivvo-amber-brand">Zivvo</p>
        <h1 className="text-3xl font-bold text-zivvo-text-base md:text-4xl">{title}</h1>
      </section>
    </motion.main>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageShell title="Home" />} />
        <Route path="/shop" element={<PageShell title="Shop" />} />
        <Route path="/product/:slug" element={<PageShell title="Product Details" />} />
        <Route path="/cart" element={<PageShell title="Cart" />} />
        <Route path="/checkout" element={<PageShell title="Checkout" />} />
        <Route path="/orders" element={<PageShell title="Orders" />} />
        <Route path="/wishlist" element={<PageShell title="Wishlist" />} />
        <Route path="/profile" element={<PageShell title="Profile" />} />
        <Route path="/login" element={<PageShell title="Login" />} />
        <Route path="/register" element={<PageShell title="Register" />} />
        <Route path="*" element={<PageShell title="Not Found" />} />
      </Routes>
    </AnimatePresence>
  );
}
