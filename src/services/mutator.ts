import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';

export const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach auth token if present
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      const existing = (config.headers as Record<string, string> | undefined) ?? {};
      config.headers = {
        ...existing,
        Authorization: `Bearer ${token}`,
      } as InternalAxiosRequestConfig['headers'];
    }
  } catch {
    // ignore errors reading localStorage
  }
  return config;
}, (error) => Promise.reject(error));

client.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response) {
      const typedError = new Error(error.response.statusText || 'Request failed') as Error & {
        status?: number;
        payload?: unknown;
      };
      typedError.status = error.response.status;
      typedError.payload = error.response.data;
      return Promise.reject(typedError);
    }

    return Promise.reject(error);
  }
);

export type MutatorRequest = {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  signal?: AbortSignal;
};

export const mutator = async <T = unknown>(
  request: MutatorRequest,
  _config?: unknown
): Promise<T> => {
  void _config;
  const { url, method = 'GET', headers, params, data, signal } = request;

  const opts: AxiosRequestConfig = {
    url,
    method: method as AxiosRequestConfig['method'],
    headers: {
      ...(headers ?? {}),
    },
    params,
    data,
    signal,
  };

  const response = await client.request<T>(opts);
  return response.data as T;
};

export default mutator;
