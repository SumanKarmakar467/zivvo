export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zivvo-surface">
      <div className="skeleton aspect-square w-full" />
      <div className="space-y-2 p-3">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
      <div className="p-3 pt-0">
        <div className="skeleton h-9 w-full rounded" />
      </div>
    </div>
  );
}
