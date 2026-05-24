import { create } from "zustand";
import { notifyError } from "../components/common/Toast";

const API_URL = import.meta.env.VITE_API_URL;

const toQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === false) return;
    if (Array.isArray(value)) {
      if (value.length) query.set(key, value.join(","));
      return;
    }
    query.set(key, String(value));
  });
  return query.toString();
};

export const useSearchStore = create((set, get) => ({
  query: "",
  results: [],
  filters: {
    category: [],
    brand: [],
    minPrice: "",
    maxPrice: "",
    rating: "",
    discount: "",
    inStock: false
  },
  availableFilters: {
    brands: [],
    categories: [],
    priceRange: { min: 0, max: 0 }
  },
  sort: "relevance",
  page: 1,
  total: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  suggestions: { products: [], categories: [] },
  setQuery: (query) => set({ query }),
  setFilters: (nextFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...nextFilters },
      page: 1
    })),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  clearFilters: () =>
    set({
      filters: {
        category: [],
        brand: [],
        minPrice: "",
        maxPrice: "",
        rating: "",
        discount: "",
        inStock: false
      },
      sort: "relevance",
      page: 1
    }),
  fetchResults: async (override = {}) => {
    const state = get();
    const params = {
      q: override.query ?? state.query,
      ...state.filters,
      ...(override.filters || {}),
      sort: override.sort ?? state.sort,
      page: override.page ?? state.page,
      limit: override.limit ?? 20
    };

    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/search?${toQueryString(params)}`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Search failed");

      set({
        query: params.q || "",
        results: data.products || [],
        total: data.total || 0,
        totalPages: data.totalPages || 0,
        page: data.page || 1,
        availableFilters: data.filters || state.availableFilters,
        isLoading: false
      });
    } catch (error) {
      const message = error.message || "Search failed";
      notifyError(message);
      set({ results: [], total: 0, totalPages: 0, isLoading: false, error: message });
    }
  },
  fetchSuggestions: async (query) => {
    const q = String(query || "").trim();
    if (!q) {
      set({ suggestions: { products: [], categories: [] } });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/search/suggest?q=${encodeURIComponent(q)}`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) {
        set({ suggestions: data });
      }
    } catch {
      set({ suggestions: { products: [], categories: [] } });
    }
  }
}));

export default useSearchStore;
