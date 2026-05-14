import { useNavigate } from "react-router-dom";
import { thumbnailImageFallback } from "../../utils/imageFallbacks";

export default function TopProductsTable({ by, onChangeBy, products }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#1f1a14] p-4">
      <div className="mb-3 flex gap-2">
        <button type="button" onClick={() => onChangeBy("revenue")} className={`rounded-full px-3 py-1 text-xs ${by === "revenue" ? "bg-[#ef9f27] text-black" : "bg-zinc-900 text-zinc-200"}`}>By revenue</button>
        <button type="button" onClick={() => onChangeBy("units")} className={`rounded-full px-3 py-1 text-xs ${by === "units" ? "bg-[#ef9f27] text-black" : "bg-zinc-900 text-zinc-200"}`}>By units sold</button>
      </div>
      <div className="space-y-2">
        {products.map((product, idx) => (
          <button key={product.productId} type="button" onClick={() => navigate(`/seller/products/${product.productId}/edit`)} className="flex w-full items-center gap-3 rounded-lg bg-zinc-900 p-2 text-left">
            <span className="w-5 text-xs text-zinc-400">#{idx + 1}</span>
            <img src={product.image || thumbnailImageFallback} alt={product.name} onError={(e) => { e.currentTarget.src = thumbnailImageFallback; }} className="h-10 w-10 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{product.name}</p>
              <p className="text-xs text-zinc-400">₹{Number(product.revenue || 0).toLocaleString("en-IN")} • {product.units || 0} units</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
