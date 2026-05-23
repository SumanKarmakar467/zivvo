export default function SkeletonSearchBar() {
  return (
    <div className="grid gap-1 py-1">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex gap-2.5 px-3.5 py-2">
          <div className="skeleton-base h-7 w-7 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="skeleton-base h-3 w-[60%]" />
            <div className="skeleton-base h-2.5 w-[40%]" />
          </div>
        </div>
      ))}
    </div>
  );
}
