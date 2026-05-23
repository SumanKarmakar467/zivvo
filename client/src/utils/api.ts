const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken(): string | null {
  return localStorage.getItem("zivvo-token");
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers = {}, ...rest } = options;
  const isFormData = rest.body instanceof FormData;
  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>)
  };
  if (!isFormData) requestHeaders["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, { headers: requestHeaders, ...rest });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || "Something went wrong", response.status);
  }

  return data as T;
}

export const api = {
  get: <T>(url: string, opts?: RequestOptions) => apiRequest<T>(url, { method: "GET", ...opts }),
  post: <T>(url: string, body: unknown, opts?: RequestOptions) => apiRequest<T>(url, { method: "POST", body: JSON.stringify(body), ...opts }),
  put: <T>(url: string, body: unknown, opts?: RequestOptions) => apiRequest<T>(url, { method: "PUT", body: JSON.stringify(body), ...opts }),
  patch: <T>(url: string, body: unknown, opts?: RequestOptions) => apiRequest<T>(url, { method: "PATCH", body: JSON.stringify(body), ...opts }),
  delete: <T>(url: string, opts?: RequestOptions) => apiRequest<T>(url, { method: "DELETE", ...opts })
};
