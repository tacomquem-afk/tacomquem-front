const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5173";

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

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tcq_access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tcq_refresh_token");
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("tcq_access_token", accessToken);
  localStorage.setItem("tcq_refresh_token", refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("tcq_access_token");
  localStorage.removeItem("tcq_refresh_token");
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
    const refreshToken = getRefreshToken();
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
      "Content-Type": "application/json",
      ...headers,
    };

    if (!skipAuth) {
      const token = getAccessToken();
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

    let response = await fetch(`${this.baseUrl}${endpoint}`, requestInit);

    if (response.status === 401 && !skipAuth) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        const newToken = getAccessToken();
        requestHeaders.Authorization = `Bearer ${newToken}`;
        response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...requestInit,
          headers: requestHeaders,
        });
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        error: errorData.error ?? "An error occurred",
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
}

export const api = new ApiClient(API_URL);
export type { ApiError };
