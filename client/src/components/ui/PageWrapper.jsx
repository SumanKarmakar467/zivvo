import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="noise-overlay mesh-bg min-h-screen pt-20 pb-24 text-on-surface lg:pb-0"
    >
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}
