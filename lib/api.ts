const FALLBACK_API_BASE = "https://court-check-server.vercel.app";
const API_BASE = (
  process.env.EXPO_PUBLIC_API_BASE_URL || FALLBACK_API_BASE
).replace(/\/+$/, "");

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

    if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Network error" }));
        const err = new Error(body.error || "Request failed") as Error & { status?: number };
        err.status = res.status;
        throw err;
    }

  return res.json();
}
