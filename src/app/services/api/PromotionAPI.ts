import { fetchWithApiFallback } from "../../utils/serviceConfig";

export interface PromotionPack {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationDays: number;
  isActive: boolean;
}

export const PromotionAPI = {
  async getPacks(): Promise<PromotionPack[]> {
    return fetchWithApiFallback<PromotionPack[]>("/api/promotions", {
      cacheKey: "promotion_packs",
    });
  },

  async updatePack(id: string, data: Partial<PromotionPack>): Promise<PromotionPack> {
    return fetchWithApiFallback<PromotionPack>(`/api/promotions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async promoteEvent(eventId: string, packId: string, paymentData: {
    paymentSimulated?: boolean;
    paymentProvider?: string;
    paymentRef?: string;
  }): Promise<unknown> {
    return fetchWithApiFallback<unknown>(`/api/promotions/events/${eventId}/promote`, {
      method: "POST",
      body: JSON.stringify({ packId, ...paymentData }),
    });
  },
};
