const normalizeAttributes = (attributes) => {
  if (!attributes) return {};
  if (attributes instanceof Map) return Object.fromEntries(attributes);
  return attributes;
};

export function VariantSelector({ product, selectedVariant, onSelect }) {
  const variants = product?.variants || [];
  const options = product?.attributeOptions || {};
  const optionEntries = Object.entries(options instanceof Map ? Object.fromEntries(options) : options);

  if (!product?.hasVariants || !variants.length) return null;

  const findVariant = (key, value) =>
    variants.find((variant) => {
      const attrs = normalizeAttributes(variant.attributes);
      return attrs[key] === value && variant.isActive !== false;
    });

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-4">
      <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Choose Variant</h3>
      {optionEntries.length ? (
        optionEntries.map(([key, values]) => (
          <div key={key}>
            <p className="mb-2 text-sm font-semibold text-[var(--cream)]">{key}</p>
            <div className="flex flex-wrap gap-2">
              {(values || []).map((value) => {
                const variant = findVariant(key, value);
                const active = selectedVariant?.sku === variant?.sku;
                const isColor = /^#|rgb|black|white|red|blue|green|yellow|pink|purple|brown|grey|gray/i.test(value);
                return (
                  <button
                    key={`${key}-${value}`}
                    type="button"
                    disabled={!variant}
                    onClick={() => variant && onSelect(variant)}
                    className={`min-h-11 rounded-full border px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${active ? "border-[#7C5CFC] bg-[#7C5CFC]/20 text-[var(--cream)]" : "border-[var(--border)] text-[var(--muted)] hover:border-[#A78BFA]"}`}
                  >
                    {isColor ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border border-white/30" style={{ background: value }} />
                        {value}
                      </span>
                    ) : value}
                  </button>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const attrs = normalizeAttributes(variant.attributes);
            const label = Object.values(attrs).join(" / ") || variant.sku;
            const active = selectedVariant?.sku === variant.sku;
            return (
              <button
                key={variant.sku}
                type="button"
                onClick={() => onSelect(variant)}
                className={`min-h-11 rounded-full border px-4 text-sm font-bold ${active ? "border-[#7C5CFC] bg-[#7C5CFC]/20" : "border-[var(--border)] text-[var(--muted)]"}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VariantSelector;
