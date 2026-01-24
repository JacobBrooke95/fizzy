/**
 * HTTP client for Fizzy API with bearer token authentication
 */

export interface FizzyConfig {
  baseUrl: string;
  accountId: string;
  accessToken: string;
}

export interface FizzyResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export class FizzyClient {
  private config: FizzyConfig;

  constructor(config: FizzyConfig) {
    this.config = config;
  }

  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.config.accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  private get accountPath(): string {
    return `${this.config.baseUrl}/${this.config.accountId}`;
  }

  /**
   * Make a GET request to the Fizzy API
   */
  async get<T>(path: string): Promise<FizzyResponse<T>> {
    const url = path.startsWith("/my/")
      ? `${this.config.baseUrl}${path}`
      : `${this.accountPath}${path}`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new FizzyError(response.status, await response.text());
    }

    const data = (await response.json()) as T;
    return { data, status: response.status, headers: response.headers };
  }

  /**
   * Make a POST request to the Fizzy API
   */
  async post<T>(path: string, body?: unknown): Promise<FizzyResponse<T | null>> {
    const url = `${this.accountPath}${path}`;

    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new FizzyError(response.status, await response.text());
    }

    // Handle 201 Created with Location header (no body)
    if (response.status === 201 || response.status === 204) {
      const location = response.headers.get("Location");
      if (location) {
        return { data: { location } as T, status: response.status, headers: response.headers };
      }
      return { data: null, status: response.status, headers: response.headers };
    }

    const data = (await response.json()) as T;
    return { data, status: response.status, headers: response.headers };
  }

  /**
   * Make a PUT request to the Fizzy API
   */
  async put<T>(path: string, body: unknown): Promise<FizzyResponse<T | null>> {
    const url = `${this.accountPath}${path}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new FizzyError(response.status, await response.text());
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return { data: null, status: response.status, headers: response.headers };
    }

    const data = (await response.json()) as T;
    return { data, status: response.status, headers: response.headers };
  }

  /**
   * Make a DELETE request to the Fizzy API
   */
  async delete(path: string): Promise<FizzyResponse<null>> {
    const url = `${this.accountPath}${path}`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new FizzyError(response.status, await response.text());
    }

    return { data: null, status: response.status, headers: response.headers };
  }
}

export class FizzyError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(`Fizzy API error (${status}): ${message}`);
    this.status = status;
    this.name = "FizzyError";
  }
}

/**
 * Create a FizzyClient from environment variables
 */
export function createClientFromEnv(): FizzyClient {
  const baseUrl = process.env.FIZZY_BASE_URL;
  const accountId = process.env.FIZZY_ACCOUNT_ID;
  const accessToken = process.env.FIZZY_ACCESS_TOKEN;

  if (!baseUrl) {
    throw new Error("FIZZY_BASE_URL environment variable is required");
  }
  if (!accountId) {
    throw new Error("FIZZY_ACCOUNT_ID environment variable is required");
  }
  if (!accessToken) {
    throw new Error("FIZZY_ACCESS_TOKEN environment variable is required");
  }

  return new FizzyClient({ baseUrl, accountId, accessToken });
}
