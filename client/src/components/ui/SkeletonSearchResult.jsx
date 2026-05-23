export default function SkeletonSearchResult() {
  return (
    <div className="flex min-h-[100px] gap-3.5 rounded-xl bg-[var(--bg2)] p-3.5">
      <div className="skeleton-base h-[72px] w-[72px] shrink-0" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="skeleton-base h-[13px] w-[65%]" />
        <div className="skeleton-base h-[11px] w-[40%]" />
        <div className="skeleton-base h-[11px] w-[25%]" />
      </div>
      <div className="flex w-20 flex-col items-end gap-2">
        <div className="skeleton-base h-4 w-[60px]" />
        <div className="skeleton-base h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}
