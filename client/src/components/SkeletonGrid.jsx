export function SearchSkeletonRows() {
  return (
    <section className="z-section py-20">
      <h2 className="font-playfair text-3xl font-black text-[var(--cream)] md:text-5xl">Results That Respect Your Time</h2>
      <div className="mt-8 grid gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="z-glass grid grid-cols-[56px_1fr_auto] items-center gap-4 rounded-[14px] p-4 max-sm:grid-cols-[56px_1fr]">
            <div className="z-skeleton h-14 w-14 rounded-xl" />
            <div className="space-y-3">
              <div className="z-skeleton h-3 w-[70%] rounded-full" />
              <div className="z-skeleton h-3 w-[45%] rounded-full" />
            </div>
            <div className="z-skeleton h-10 w-32 rounded-full max-sm:col-span-2 max-sm:w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function SkeletonGrid({ count = 9 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="z-glass overflow-hidden rounded-[14px]">
          <div className="z-skeleton aspect-[4/3]" />
          <div className="space-y-3 p-4">
            <div className="z-skeleton h-6 w-24 rounded-full" />
            <div className="z-skeleton h-4 w-[80%] rounded-full" />
            <div className="z-skeleton h-4 w-[46%] rounded-full" />
            <div className="z-skeleton h-10 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonGrid;
