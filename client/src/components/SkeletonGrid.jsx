import UiSkeletonGrid from "./ui/SkeletonGrid";

export function SearchSkeletonRows() {
  return (
    <section className="z-section py-20">
      <h2 className="font-head text-3xl font-black text-[var(--cream)] md:text-5xl">Results That Respect Your Time</h2>
      <div className="mt-8 grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="z-glass grid grid-cols-[56px_1fr_auto] items-center gap-4 rounded-[14px] p-4 max-sm:grid-cols-[56px_1fr]">
            <div className="skeleton-base h-14 w-14 rounded-xl" />
            <div className="space-y-3">
              <div className="skeleton-base h-3 w-[70%] rounded-full" />
              <div className="skeleton-base h-3 w-[45%] rounded-full" />
            </div>
            <div className="skeleton-base h-10 w-32 rounded-full max-sm:col-span-2 max-sm:w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function SkeletonGrid({ count = 9 }) {
  return <UiSkeletonGrid count={count} />;
}

export default SkeletonGrid;
