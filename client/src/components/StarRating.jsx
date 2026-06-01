import { useMemo, useState } from "react";
import { Star } from "lucide-react";

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24
};

export default function StarRating({ rating, value = 0, maxStars = 5, size = "md", interactive = false, onRate, onChange }) {
  const [hoverValue, setHoverValue] = useState(null);
  const canRate = interactive || typeof onRate === "function" || typeof onChange === "function";
  const numericSize = typeof size === "number" ? size : sizeMap[size] || sizeMap.md;
  const displayValue = hoverValue ?? Number(rating ?? value ?? 0);
  const stars = useMemo(() => Array.from({ length: maxStars }, (_, index) => index + 1), [maxStars]);

  const handleRate = (star) => {
    if (onRate) onRate(star);
    if (onChange) onChange(star);
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const fill = Math.max(0, Math.min(1, displayValue - (star - 1)));
        return (
          <button
            key={star}
            type="button"
            disabled={!canRate}
            onMouseEnter={canRate ? () => setHoverValue(star) : undefined}
            onMouseLeave={canRate ? () => setHoverValue(null) : undefined}
            onClick={canRate ? () => handleRate(star) : undefined}
            className={`${canRate ? "cursor-pointer" : "cursor-default"} relative grid place-items-center`}
            style={{ width: numericSize, height: numericSize }}
            aria-label={`Rate ${star} stars`}
          >
            <Star className="absolute inset-0 text-violet-900/80" size={numericSize} strokeWidth={1.8} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="fill-cyan-300 text-violet-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.45)]" size={numericSize} strokeWidth={1.8} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
