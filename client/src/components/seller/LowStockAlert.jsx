import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LowStockAlert({ products }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!products?.length) return null;

  return (
    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full text-left text-sm font-semibold text-amber-300">
        ⚠ {products.length} products are running low on stock
      </button>
      {open && (
        <div className="mt-3 space-y-2">
          {products.map((product) => (
            <div key={product._id} className="flex items-center gap-3 rounded-lg bg-zinc-900 p-2">
              <img src={product.images?.[0] || "https://via.placeholder.com/40"} alt={product.name} className="h-10 w-10 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{product.name}</p>
                <p className={`text-xs font-bold ${product.stock <= 2 ? "text-red-400" : "text-zinc-300"}`}>Stock: {product.stock}</p>
              </div>
              <button type="button" onClick={() => navigate(`/seller/products/${product._id}/edit`)} className="rounded bg-[#ef9f27] px-2 py-1 text-xs font-semibold text-black">
                Update stock
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
