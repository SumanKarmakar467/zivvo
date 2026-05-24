import { useEffect, useRef, useState } from "react";

export default function useIntersectionObserver(options = {}) {
  const ref = useRef(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting), options);
    observer.observe(node);
    return () => observer.disconnect();
  }, [options.root, options.rootMargin, options.threshold]);

  return [ref, isIntersecting];
}
