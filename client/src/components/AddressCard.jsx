export default function AddressCard({ address, compact = false, selected = false, onSelect, onEdit, onDelete, onSetDefault }) {
  return (
    <div className={`rounded-lg border p-3 ${selected ? "border-zivvo-amber-brand" : "border-zivvo-dark-raised"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {compact && (
            <label className="mb-2 flex items-center gap-2 text-sm">
              <input type="radio" checked={selected} onChange={() => onSelect?.(address)} />
              Deliver here
            </label>
          )}
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-zivvo-dark-raised px-2 py-0.5 text-[11px] uppercase">{address.label}</span>
            {address.isDefault && <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[11px] text-green-300">Default</span>}
          </div>
          <p className="mt-1 text-sm font-semibold">{address.fullName} · {address.phone}</p>
          <p className="mt-1 text-xs text-zivvo-text-muted">
            {address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} - {address.pincode}
          </p>
        </div>
      </div>
      {!compact && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => onEdit?.(address)} className="rounded border border-zivvo-dark-raised px-2 py-1 text-xs">Edit</button>
          <button onClick={() => onDelete?.(address)} className="rounded border border-red-500/50 px-2 py-1 text-xs text-red-300">Delete</button>
          {!address.isDefault && (
            <button onClick={() => onSetDefault?.(address)} className="rounded border border-zivvo-amber-brand px-2 py-1 text-xs text-zivvo-amber-brand">Set as default</button>
          )}
        </div>
      )}
    </div>
  );
}

