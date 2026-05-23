import { useEffect, useRef, useState } from "react";

export default function useCountUp(target, duration = 1800, startOnView = true) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(!startOnView);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) return undefined;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!inView) return undefined;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}
