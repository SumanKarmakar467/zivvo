const MAX_RECENTLY_VIEWED = 10;
const RECENTLY_VIEWED_KEY = "zivvo_recently_viewed";

export function useRecentlyViewed() {
  const addProduct = (productId) => {
    if (!productId) return;
    const existing = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
    const updated = [productId, ...existing.filter((id) => id !== productId)].slice(0, MAX_RECENTLY_VIEWED);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  };

  const getIds = () => JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");

  const clear = () => localStorage.removeItem(RECENTLY_VIEWED_KEY);

  return { addProduct, getIds, clear, key: RECENTLY_VIEWED_KEY };
}

