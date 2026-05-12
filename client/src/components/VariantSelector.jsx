import { useMemo, useState } from "react";

const colorMap = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  black: "#111827",
  white: "#ffffff",
  yellow: "#facc15",
  pink: "#ec4899",
  purple: "#a855f7",
  orange: "#f97316",
  grey: "#6b7280",
  gray: "#6b7280"
};

export default function VariantSelector({ attributeOptions = {}, variants = [], onSelect, basePrice = 0 }) {
  const options = useMemo(() => Object.entries(attributeOptions || {}), [attributeOptions]);
  const [selected, setSelected] = useState({});

  const activeVariants = variants.filter((variant) => variant.isActive !== false);

  const selectedVariant = useMemo(() => {
    const keys = Object.keys(selected);
    if (!keys.length || keys.length < options.length) return null;
    return activeVariants.find((variant) =>
      options.every(([attr]) => String(variant.attributes?.[attr] || "") === String(selected[attr] || ""))
    ) || null;
  }, [activeVariants, options, selected]);

  const isCombinationUnavailable = options.length > 0 && Object.keys(selected).length === options.length && !selectedVariant;

  const choose = (attr, value) => {
    const next = { ...selected, [attr]: value };
    setSelected(next);
    const matched = activeVariants.find((variant) =>
      options.every(([k]) => String(variant.attributes?.[k] || "") === String(next[k] || ""))
    ) || null;
    onSelect(matched);
  };

  const isOptionDisabled = (attr, value) => {
    const next = { ...selected, [attr]: value };
    const matched = activeVariants.find((variant) =>
      options.every(([k]) => (k === attr ? String(variant.attributes?.[k] || "") === String(value) : String(variant.attributes?.[k] || "") === String(next[k] || "")))
    );
    return !matched || Number(matched.stock || 0) <= 0;
  };

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-zivvo-dark-raised bg-zivvo-dark-surface p-4">
      {options.map(([attr, values]) => {
        const isColor = attr.toLowerCase() === "color";
        return (
          <div key={attr}>
            <p className="mb-2 text-xs uppercase tracking-wide text-zivvo-text-soft">{attr}</p>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const active = selected[attr] === value;
                const disabled = isOptionDisabled(attr, value);
                if (isColor) {
                  const swatch = colorMap[String(value).toLowerCase()] || "#9ca3af";
                  return (
                    <button key={value} type="button" onClick={() => choose(attr, value)} disabled={disabled} className={`h-8 w-8 rounded-full border-2 ${active ? "border-[#ef9f27]" : "border-zinc-600"} ${disabled ? "opacity-35 line-through" : ""}`} title={value} style={{ backgroundColor: swatch }} />
                  );
                }
                return (
                  <button key={value} type="button" onClick={() => choose(attr, value)} disabled={disabled} className={`rounded-full px-3 py-1 text-xs ${active ? "bg-[#ef9f27] text-black" : "bg-zinc-900 text-zivvo-text-base"} ${disabled ? "line-through opacity-40" : ""}`}>
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {selectedVariant && (
        <div className="text-sm">
          {Number(selectedVariant.stock || 0) <= 5 && <p className="text-amber-300">Only {selectedVariant.stock} left</p>}
          <p className="text-zivvo-text-muted">
            Price adjustment: {Number(selectedVariant.priceDelta || 0) >= 0 ? "+" : "-"}₹{Math.abs(Number(selectedVariant.priceDelta || 0)).toLocaleString("en-IN")}
          </p>
          <p className="text-zivvo-text-base">Final price: ₹{Number(basePrice + Number(selectedVariant.priceDelta || 0)).toLocaleString("en-IN")}</p>
        </div>
      )}
      {isCombinationUnavailable && <p className="text-sm text-red-400">Combination unavailable</p>}
    </div>
  );
}
