export type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

export interface SearchState {
  results: unknown[];
  total: number;
  pages: number;
  currentPage: number;
  status: AsyncStatus;
  error: string | null;
}

export type FetchSearchResultsPayload = Record<string, string | number | boolean | null | undefined>;
