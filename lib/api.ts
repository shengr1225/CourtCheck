const API_BASE = "https://court-check-server.vercel.app";

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
        const error = await res.json().catch(() => ({ error: "Network error" }));
        throw new Error(error.error || "Request failed");
    }

    return res.json();
}