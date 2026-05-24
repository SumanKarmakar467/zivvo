import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { fetchDummyProducts } from "../services/dummyProducts";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [sentinelRef, inView] = useIntersectionObserver({ rootMargin: "400px" });

  const load = async () => {
    if (done) return;
    setLoading(true);
    try {
      const data = await fetchDummyProducts({ limit: 30, skip });
      setProducts((current) => uniqueProducts([...current, ...data.products]));
      setSkip((value) => value + 30);
      if (skip + 30 >= data.total) setDone(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { if (inView && !loading) load(); }, [inView]);

  const categories = useMemo(() => [...new Set(products.map((product) => product.category))].slice(0, 8), [products]);

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--cream)] md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-[#C9A84C]">Product Feed</p>
            <h1 className="mt-2 text-4xl font-black md:text-6xl">Fresh picks, no grocery noise</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => <span key={category} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted)]">{category}</span>)}
          </div>
        </div>

        {products.length === 0 && loading ? <SkeletonGrid /> : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          </div>
        )}
        <div ref={sentinelRef} className="grid min-h-24 place-items-center">
          {loading && <span className="text-[var(--muted)]">Loading more products...</span>}
          {done && <span className="text-[var(--muted)]">You reached the end of this drop.</span>}
        </div>
      </div>
    </main>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-80 rounded-lg skeleton" />)}
    </div>
  );
}

const uniqueProducts = (items) => [...new Map(items.map((item) => [item.id, item])).values()];
