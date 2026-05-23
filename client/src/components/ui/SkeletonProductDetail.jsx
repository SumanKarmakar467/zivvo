export default function SkeletonProductDetail() {
  return (
    <div className="grid gap-8 lg:grid-cols-[55fr_45fr]">
      <div className="skeleton-base aspect-square max-w-[500px] rounded-xl" />
      <div className="flex flex-col gap-3">
        <div className="skeleton-base h-7 w-[80%]" />
        <div className="skeleton-base h-7 w-[55%]" />
        <div className="skeleton-base h-3.5 w-[35%]" />
        <div className="skeleton-base h-6 w-[40%]" />
        <div className="skeleton-base h-3 w-[72%]" />
        <div className="skeleton-base h-3 w-[62%]" />
        <div className="skeleton-base h-3 w-[48%]" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="skeleton-base h-12 rounded-3xl" />
          <div className="skeleton-base h-12 rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
