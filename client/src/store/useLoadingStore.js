import { create } from "zustand";

export const useLoadingStore = create((set) => ({
  isLoading: false,
  isSearching: false,
  setLoading: (isLoading) => set({ isLoading }),
  setSearching: (isSearching) => set({ isSearching })
}));

export default useLoadingStore;
