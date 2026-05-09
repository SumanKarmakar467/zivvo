export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="skeleton-shimmer h-52 w-full" />
      <div className="space-y-3 p-4">
        <div className="skeleton-shimmer h-4 w-4/5 rounded" />
        <div className="skeleton-shimmer h-4 w-2/5 rounded" />
        <div className="skeleton-shimmer h-6 w-1/2 rounded" />
      </div>
    </div>
  );
}
