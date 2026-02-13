import { apiFetch } from "./api";

export type ApiSubscription = {
  id: string;
  status: string;
  trialEnd: number | null;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  customer: string;
};

type GetCurrentUserSubscriptionResponse = {
  ok: boolean;
  subscription: ApiSubscription | null;
};

export async function getCurrentUserSubscription(customId: string) {
  const data = (await apiFetch(
    `/api/stripe/${encodeURIComponent(customId)}`
  )) as GetCurrentUserSubscriptionResponse;
  return data.subscription ?? null;
}

type UnsubscribeCurrentUserResponse = {
  ok: boolean;
  subscription: ApiSubscription;
};

export async function unsubscribeCurrentUser(customId: string) {
  const data = (await apiFetch(
    `/api/stripe/${encodeURIComponent(customId)}/unsubscribe`,
    {
      method: "POST",
    }
  )) as UnsubscribeCurrentUserResponse;
  return data.subscription;
}

type SubscribeCurrentUserResponse = {
  ok: boolean;
  subscription: ApiSubscription;
};

export async function subscribeCurrentUser(customId: string) {
  const data = (await apiFetch(
    `/api/stripe/${encodeURIComponent(customId)}/subscribe`,
    {
      method: "POST",
    }
  )) as SubscribeCurrentUserResponse;
  return data.subscription;
}
