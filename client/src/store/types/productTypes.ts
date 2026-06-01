export interface ProductState {
  filters: Record<string, unknown>;
  selected: unknown | null;
}

export type SetFiltersPayload = Record<string, unknown>;
export type SetSelectedProductPayload = unknown | null;
