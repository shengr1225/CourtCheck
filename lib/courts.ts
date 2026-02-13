import { apiFetch } from "./api";

/** API court status (uppercase). See https://court-check-server.vercel.app/api/docs */
export type ApiCourtStatus = "EMPTY" | "LOW" | "MEDIUM" | "CROWDED";

/** App-facing status key (lowercase). Matches COURT_STATUS in theme. */
export type CourtStatusKey = "empty" | "low" | "medium" | "crowded";

export function apiStatusToApp(api: ApiCourtStatus): CourtStatusKey {
  return api.toLowerCase() as CourtStatusKey;
}

export function appStatusToApi(app: CourtStatusKey): ApiCourtStatus {
  return app.toUpperCase() as ApiCourtStatus;
}

export type ApiCourt = {
  id: string;
  name: string;
  addressLine: string;
  courtCount: number;
  status: ApiCourtStatus;
  lastUpdatedAt: string;
  photoUrl: string | null;
  /** Present when the API embeds check-ins in the courts list */
  checkins?: ApiCheckinWithUser[];
};

export type ApiCheckin = {
  checkinId: string;
  courtId: string;
  userId: string;
  status: ApiCourtStatus;
  createdAt: string;
  photoUrl?: string | null;
};

/** Check-in with optional user display name (when returned by list endpoint) */
export type ApiCheckinWithUser = ApiCheckin & { userName?: string | null };

export type CourtsResponse = { ok: true; courts: ApiCourt[] };
export type CheckinResponse = { ok: true; checkin: ApiCheckin };
export type CheckinsListResponse = { ok: true; checkins: ApiCheckinWithUser[] };

type CourtsLocationQuery = {
  lat: number;
  long: number;
};

export async function listCourts(
  location?: CourtsLocationQuery
): Promise<ApiCourt[]> {
  const query = location
    ? `?${new URLSearchParams({
        lat: String(location.lat),
        long: String(location.long),
      }).toString()}`
    : "";
  const data = await apiFetch(`/api/courts${query}`);
  if (!data.ok || !Array.isArray(data.courts))
    throw new Error("Failed to load courts");
  return data.courts;
}

export async function createCheckin(
  courtId: string,
  body: { status: CourtStatusKey; photoUrl?: string | null }
): Promise<ApiCheckin> {
  const data = await apiFetch(`/api/courts/${courtId}/checkin`, {
    method: "POST",
    body: JSON.stringify({
      status: appStatusToApi(body.status),
      ...(body.photoUrl && { photoUrl: body.photoUrl }),
    }),
  });
  if (!data.ok || !data.checkin)
    throw new Error(data.error || "Check-in failed");
  return data.checkin;
}

/** List check-ins for a court (latest first). Returns [] if endpoint not available (e.g. 404). */
export async function listCheckins(
  courtId: string
): Promise<ApiCheckinWithUser[]> {
  try {
    const data = await apiFetch(`/api/courts/${courtId}/checkins`);
    if (!data.ok || !Array.isArray(data.checkins)) return [];
    return data.checkins;
  } catch {
    return [];
  }
}
