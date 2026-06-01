export interface WishlistProduct {
  _id: string;
  [key: string]: unknown;
}

export interface WishlistState {
  items: Array<string | WishlistProduct>;
  status?: "idle" | "loading" | "succeeded" | "failed";
}

export type SetWishlistPayload = string[];
export type ToggleWishlistItemPayload = string;
export type ToggleWishlistPayload = WishlistProduct;
