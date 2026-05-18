import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useSearchStore from "../../store/useSearchStore";

const RECENT_KEY = "zivvo-recent-searches";
const formatRupees = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const getRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveRecentSearch = (query) => {
  const q = String(query || "").trim();
  if (!q) return;
  const next = [q, ...getRecentSearches().filter((item) => item.toLowerCase() !== q.toLowerCase())].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
};

export function SearchBar({ autoFocus = false }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fetchSuggestions = useSearchStore((state) => state.fetchSuggestions);
  const suggestions = useSearchStore((state) => state.suggestions);
  const [value, setValue] = useState(searchParams.get("q") || "");
  const [open, setOpen] = useState(false);
  const [debouncing, setDebouncing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    const q = value.trim();
    setDebouncing(Boolean(q));
    const timer = setTimeout(() => {
      fetchSuggestions(q);
      setDebouncing(false);
      if (q) setOpen(true);
    }, 350);
    return () => clearTimeout(timer);
  }, [fetchSuggestions, value]);

  const recentSearches = useMemo(() => getRecentSearches(), [open]);
  const suggestionItems = useMemo(() => {
    const recents = recentSearches.map((item) => ({ type: "recent", label: item, value: item }));
    const products = (suggestions.products || []).map((product) => ({ type: "product", value: product.name, product }));
    const categories = (suggestions.categories || []).map((category) => ({ type: "category", value: category.name, category }));
    const search = value.trim() ? [{ type: "search", value: value.trim() }] : [];
    return [...recents, ...products, ...categories, ...search].slice(0, 14);
  }, [recentSearches, suggestions, value]);

  const submitSearch = (query = value) => {
    const q = String(query || "").trim();
    if (!q) return;
    saveRecentSearch(q);
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}&page=1`);
  };

  const onKeyDown = (event) => {
    if (!open && ["ArrowDown", "ArrowUp"].includes(event.key)) {
      setOpen(true);
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, suggestionItems.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Enter" && activeIndex >= 0 && suggestionItems[activeIndex]) {
      event.preventDefault();
      submitSearch(suggestionItems[activeIndex].value);
    }
  };

  return (
    <form onSubmit={(event) => { event.preventDefault(); submitSearch(); }} className="relative mx-auto w-full max-w-[600px]">
      <div className={`relative rounded-full bg-gradient-to-r from-[#7C5CFC] via-[#22D3EE] to-[#7C5CFC] p-[1px] ${debouncing ? "animate-[searchBorder_1.4s_linear_infinite]" : ""}`}>
        <div className="flex min-h-12 items-center rounded-full bg-[var(--bg2)] px-4">
          <span className="mr-3 text-[var(--muted)]">⌕</span>
          <input
            ref={inputRef}
            autoFocus={autoFocus}
            value={value}
            onFocus={() => setOpen(true)}
            onChange={(event) => { setValue(event.target.value); setActiveIndex(-1); }}
            onKeyDown={onKeyDown}
            placeholder="Search for products, brands and more"
            className="min-h-11 flex-1 bg-transparent text-sm font-medium text-[var(--cream)] outline-none placeholder:text-[var(--muted)]"
          />
          {value && (
            <button
              type="button"
              onClick={() => { setValue(""); inputRef.current?.focus(); }}
              className="grid h-9 w-9 place-items-center rounded-full text-[var(--muted)] hover:bg-white/5 hover:text-[var(--cream)]"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {open && suggestionItems.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-2 shadow-2xl">
          {suggestionItems.map((item, index) => {
            const active = index === activeIndex;
            if (item.type === "product") {
              const image = item.product.images?.[0] || item.product.image;
              return (
                <button
                  type="button"
                  key={`${item.type}-${item.product._id}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => submitSearch(item.value)}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm ${active ? "bg-[rgba(124,92,252,0.18)]" : "hover:bg-white/5"}`}
                >
                  <img src={image} alt="" className="h-8 w-8 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1 truncate text-[var(--cream)]">{item.product.name}</span>
                  <span className="text-xs font-bold text-[var(--cyan)]">{formatRupees(item.product.price)}</span>
                </button>
              );
            }

            return (
              <button
                type="button"
                key={`${item.type}-${item.value}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => submitSearch(item.value)}
                className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm ${active ? "bg-[rgba(124,92,252,0.18)]" : "hover:bg-white/5"}`}
              >
                <span className="text-[var(--muted)]">{item.type === "recent" ? "◷" : item.type === "category" ? "▦" : "⌕"}</span>
                <span className="text-[var(--cream)]">{item.type === "search" ? `Search for "${item.value}"` : item.value}</span>
              </button>
            );
          })}
        </div>
      )}
    </form>
  );
}

export default SearchBar;
