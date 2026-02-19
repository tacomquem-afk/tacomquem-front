// Server-side: call the backend directly using the private env var.
// Client-side: call the backend directly using the public env var.
const API_URL =
  typeof window === "undefined"
    ? (process.env.API_URL ?? "http://localhost:3333")
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333");

type RequestConfig = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

type ApiError = {
  error: string;
  status: number;
};

async function getAccessToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("tcq_access_token");
  }
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore.get("tcq_access_token")?.value ?? null;
  } catch {
    return null;
  }
}

async function getRefreshToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("tcq_refresh_token");
  }
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore.get("tcq_refresh_token")?.value ?? null;
  } catch {
    return null;
  }
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("tcq_access_token", accessToken);
  localStorage.setItem("tcq_refresh_token", refreshToken);
  document.cookie = `tcq_access_token=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  document.cookie = `tcq_refresh_token=${refreshToken}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("tcq_access_token");
  localStorage.removeItem("tcq_refresh_token");
  document.cookie = "tcq_access_token=; path=/; max-age=0";
  document.cookie = "tcq_refresh_token=; path=/; max-age=0";
}

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.doRefresh();

    try {
      return await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async doRefresh(): Promise<boolean> {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        clearTokens();
        return false;
      }

      const data = await response.json();
      setTokens(data.accessToken, refreshToken);
      return true;
    } catch {
      clearTokens();
      return false;
    }
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const {
      method = "GET",
      body,
      headers = {},
      skipAuth = false,
      cache,
      next,
    } = config;

    const requestHeaders: Record<string, string> = {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    };

    if (!skipAuth) {
      const token = await getAccessToken();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
    }

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      cache,
      next,
    };

    if (body) {
      requestInit.body = JSON.stringify(body);
    }

    // allow callers to pass an absolute URL (e.g. `https://api.example.com/...`) or a path
    const url = String(endpoint).startsWith("http")
      ? String(endpoint)
      : `${this.baseUrl}${endpoint}`;

    let response = await fetch(url, requestInit);

    if (response.status === 401 && !skipAuth) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        const newToken = await getAccessToken();
        requestHeaders.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, {
          ...requestInit,
          headers: requestHeaders,
        });
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        error: errorData.detail ?? errorData.error ?? "An error occurred",
        status: response.status,
      } as ApiError;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  get<T>(endpoint: string, config?: Omit<RequestConfig, "method" | "body">) {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  post<T>(
    endpoint: string,
    body?: unknown,
    config?: Omit<RequestConfig, "method">
  ) {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  patch<T>(
    endpoint: string,
    body?: unknown,
    config?: Omit<RequestConfig, "method">
  ) {
    return this.request<T>(endpoint, { ...config, method: "PATCH", body });
  }

  delete<T>(endpoint: string, config?: Omit<RequestConfig, "method" | "body">) {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = await getAccessToken();

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const uploadUrl = String(endpoint).startsWith("http")
      ? String(endpoint)
      : `${this.baseUrl}${endpoint}`;

    let response = await fetch(uploadUrl, {
      method: "POST",
      headers,
      body: formData,
    });

    if (response.status === 401) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        const newToken = await getAccessToken();
        if (newToken) {
          headers.Authorization = `Bearer ${newToken}`;
        }
        response = await fetch(uploadUrl, {
          method: "POST",
          headers,
          body: formData,
        });
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        error: errorData.detail ?? errorData.error ?? "An error occurred",
        status: response.status,
      } as ApiError;
    }

    return response.json();
  }
}

export const api = new ApiClient(API_URL);
export type { ApiError };
