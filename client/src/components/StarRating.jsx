import { useMemo, useState } from "react";

export default function StarRating({ value = 0, onChange, size = 18 }) {
  const [hoverValue, setHoverValue] = useState(null);
  const interactive = typeof onChange === "function";
  const displayValue = hoverValue ?? Number(value || 0);
  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const fill = Math.max(0, Math.min(1, displayValue - (star - 1)));
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={interactive ? () => setHoverValue(star) : undefined}
            onMouseLeave={interactive ? () => setHoverValue(null) : undefined}
            onClick={interactive ? () => onChange(star) : undefined}
            className={`${interactive ? "cursor-pointer" : "cursor-default"} relative`}
            style={{ width: size, height: size }}
          >
            <span className="absolute inset-0 text-zinc-500" style={{ fontSize: size, lineHeight: `${size}px` }}>★</span>
            <span
              className="absolute inset-0 overflow-hidden text-[#ef9f27]"
              style={{ width: `${fill * 100}%`, fontSize: size, lineHeight: `${size}px` }}
            >
              ★
            </span>
          </button>
        );
      })}
    </div>
  );
}
