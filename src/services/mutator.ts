import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { AUTH_EVENTS, broadcastAuthEvent } from '../utils/auth';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';

export const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// When sending FormData, do not set Content-Type so the browser sets multipart/form-data with boundary
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.data instanceof FormData && config.headers) {
    const headers = config.headers as Record<string, unknown>;
    delete headers['Content-Type'];
  }
  return config;
}, (error) => Promise.reject(error));

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
      // If backend signals invalid access token, broadcast a global auth event
      try {
        const payload = error.response.data as unknown;
        if (
          payload &&
          typeof payload === 'object' &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (payload as any).error === 'access_token_invalid'
        ) {
          broadcastAuthEvent(AUTH_EVENTS.ACCESS_TOKEN_INVALID, { status: error.response.status });
        }
      } catch {
        // ignore
      }
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
