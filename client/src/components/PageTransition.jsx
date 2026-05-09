import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} exit={{ opacity: 0, y: -10 }}>
      {children}
    </motion.div>
  );
}
