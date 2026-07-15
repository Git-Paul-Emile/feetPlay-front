import { fetchWithApiFallback } from "../../utils/serviceConfig";

export interface PromotionPack {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationDays: number;
  isActive: boolean;
}

async function promotionFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetchWithApiFallback(endpoint, options);
  const body = await response.json().catch(() => ({ message: "Erreur serveur" }));
  if (!response.ok) {
    const err: any = new Error(body.message ?? "Erreur serveur");
    err.status = response.status;
    err.errors = body.errors;
    throw err;
  }
  return body.data as T;
}

export const PromotionAPI = {
  async getPacks(): Promise<PromotionPack[]> {
    return promotionFetch<PromotionPack[]>("/api/promotions");
  },

  async updatePack(id: string, data: Partial<PromotionPack>): Promise<PromotionPack> {
    return promotionFetch<PromotionPack>(`/api/promotions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async promoteEvent(eventId: string, packId: string, paymentData: {
    paymentSimulated?: boolean;
    paymentProvider?: string;
    paymentRef?: string;
  }): Promise<unknown> {
    return promotionFetch<unknown>(`/api/promotions/events/${eventId}/promote`, {
      method: "POST",
      body: JSON.stringify({ packId, ...paymentData }),
    });
  },
};
