import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) =>
        set((state) => {
          const id = String(productId);
          return {
            items: state.items.includes(id)
              ? state.items.filter((item) => item !== id)
              : [id, ...state.items]
          };
        }),
      isWishlisted: (productId) => get().items.includes(String(productId)),
      syncWithServer: async () => {}
    }),
    { name: "zivvo-wishlist" }
  )
);

export default useWishlistStore;
