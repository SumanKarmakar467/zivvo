import { SkeletonProductCard } from "./ProductCard";

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
      {Array.from({ length: count }).map((_, index) => <SkeletonProductCard key={index} />)}
    </div>
  );
}

export default SkeletonGrid;
