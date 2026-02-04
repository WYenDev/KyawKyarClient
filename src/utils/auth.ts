export const AUTH_EVENTS = {
  ACCESS_TOKEN_INVALID: 'auth:access_token_invalid',
} as const;

export type AuthEventName = typeof AUTH_EVENTS[keyof typeof AUTH_EVENTS];

export function broadcastAuthEvent(name: AuthEventName, detail?: unknown) {
  try {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    }
  } catch {
    // no-op if dispatch fails
  }
}
