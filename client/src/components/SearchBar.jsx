import { SearchIcon, X } from "lucide-react";

export default function SearchBar({ value = "", onSearch, isLoading = false, placeholder = "Search products" }) {
  const handleChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div className="relative w-full max-w-xl">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-300/80" />
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-violet-500/30 bg-[#05060F]/90 pl-12 pr-20 text-sm text-white outline-none transition placeholder:text-cyan-300/60 focus:border-violet-400 focus:ring-2 focus:ring-violet-600/50"
      />
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
        {isLoading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />}
        {value && (
          <button
            type="button"
            onClick={() => onSearch("")}
            className="grid h-7 w-7 place-items-center rounded-full text-cyan-200 transition hover:bg-violet-500/20 hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
