export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-violet-500/20 bg-[#0B0D1A] shadow-lg shadow-violet-950/20">
      <div className="aspect-[4/3] w-full animate-pulse bg-violet-950/50" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-cyan-400/10" />
        <div className="h-4 w-full animate-pulse rounded bg-violet-400/15" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-violet-400/15" />
        <div className="h-3 w-28 animate-pulse rounded bg-cyan-400/10" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 animate-pulse rounded bg-violet-400/20" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-cyan-400/10" />
        </div>
      </div>
    </div>
  );
}
