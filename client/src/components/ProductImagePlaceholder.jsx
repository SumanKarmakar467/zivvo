import { ShoppingBag } from "lucide-react";

export default function ProductImagePlaceholder({ className = "" }) {
  return (
    <div className={`grid place-items-center bg-[#1E1B4B] text-white ${className}`}>
      <ShoppingBag className="h-14 w-14" />
    </div>
  );
}
