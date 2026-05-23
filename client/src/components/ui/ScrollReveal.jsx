import { motion } from "framer-motion";
import { fadeUp } from "../../utils/motionVariants";

export default function ScrollReveal({ children, variants = fadeUp, className = "", delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            ...variants.visible.transition,
            delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}
