import { useEffect, useMemo, useState } from "react";
import { ImageUp, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import useDebounce from "../hooks/useDebounce";
import useClarifai from "../hooks/useClarifai";
import { fetchDummyProducts, searchProducts } from "../services/dummyProducts";

export default function SearchResultsPage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [gender, setGender] = useState("All");
  const [price, setPrice] = useState("All");
  const [sort, setSort] = useState("asc");
  const [imageTerms, setImageTerms] = useState([]);
  const debounced = useDebounce(query, 300);
  const { loading, concepts, searchImage } = useClarifai();

  useEffect(() => {
    fetchDummyProducts({ limit: 30, skip: 0 }).then((data) => setProducts(data.products));
  }, []);

  const categories = useMemo(() => ["All", ...new Set(products.map((product) => product.category))], [products]);
  const results = useMemo(() => {
    const textResults = searchProducts(products, imageTerms[0]?.name || debounced);
    return textResults
      .filter((product) => category === "All" || product.category === category)
      .filter((product) => gender === "All" || product.gender === gender)
      .filter((product) => price === "All" || (price === "Under $50" ? product.price < 50 : product.price >= 50))
      .sort((a, b) => sort === "asc" ? a.price - b.price : b.price - a.price);
  }, [products, debounced, category, gender, price, sort, imageTerms]);

  const onImage = async (file) => {
    const nextConcepts = await searchImage(file);
    setImageTerms(nextConcepts);
    setQuery(nextConcepts[0]?.name || "");
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--cream)] md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="zivvo-card rounded-lg p-4 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <input value={query} onChange={(event) => { setQuery(event.target.value); setImageTerms([]); }} placeholder="Search watches, shirts, lipstick..." className="min-h-12 flex-1 rounded-md border border-[var(--border)] bg-[var(--bg)] px-4 outline-none focus:border-[#C9A84C]" />
            <label className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-[var(--border)] px-4 font-bold">
              <ImageUp className="h-5 w-5" /> {loading ? "Reading image..." : "Search by Image"}
              <input type="file" accept="image/*" className="hidden" onChange={(event) => onImage(event.target.files?.[0])} />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#C9A84C]" />
            <Select value={category} onChange={setCategory} options={categories} />
            <Select value={price} onChange={setPrice} options={["All", "Under $50", "$50 and up"]} />
            <Select value={gender} onChange={setGender} options={["All", "Male", "Female", "Unisex"]} />
            <button type="button" onClick={() => setSort((value) => value === "asc" ? "desc" : "asc")} className="rounded-full border border-[var(--border)] px-3 py-2 text-sm font-bold">
              Price {sort === "asc" ? "Low to High" : "High to Low"}
            </button>
          </div>
          {concepts.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{concepts.map((concept) => <span key={concept.name} className="rounded-full bg-[#C9A84C]/15 px-3 py-1 text-sm">{concept.name} {(concept.value * 100).toFixed(0)}%</span>)}</div>}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((product, index) => <ProductCard key={product.id} product={product} index={index} matchedText={debounced} />)}
        </div>
        {!results.length && <div className="mt-8 rounded-lg border border-dashed border-[var(--border)] p-10 text-center text-[var(--muted)]">No matches yet. Try a broader keyword or another image.</div>}
      </div>
    </main>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-10 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 text-sm outline-none">
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}
