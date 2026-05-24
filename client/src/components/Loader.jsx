import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function Loader({ active = true }) {
  const [visible, setVisible] = useState(active);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return undefined;
    }

    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 1, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0 : 0.4 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05060F] text-center"
        >
          <h2 className="z-loader-word font-head text-5xl font-black tracking-[0.22em] sm:text-7xl">ZIVVO</h2>
          <div className="z-loader-bar mt-8 h-[2px] w-[280px] overflow-hidden rounded-full bg-white/10" />
          <div className="mt-6 flex items-center gap-3">
            {[0, 0.2, 0.4].map((delay) => (
              <span
                key={delay}
                className="z-pulse-dot h-2 w-2 rounded-full bg-[#22D3EE]"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Loader;
