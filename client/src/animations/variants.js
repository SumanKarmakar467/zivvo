export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};

export const scalePop = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 220, damping: 20 } }
};
