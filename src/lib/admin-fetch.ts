const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

export function authHeaders(): Record<string, string> {
  return ADMIN_TOKEN ? { Authorization: `Bearer ${ADMIN_TOKEN}` } : {};
}

export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers);
  if (ADMIN_TOKEN) {
    headers.set("Authorization", `Bearer ${ADMIN_TOKEN}`);
  }
  return fetch(url, { ...options, headers });
}
