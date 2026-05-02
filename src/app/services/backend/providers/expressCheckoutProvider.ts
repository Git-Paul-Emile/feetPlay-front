import { legacyApiRaw } from "../legacyApi";
import type { CheckoutProvider, CheckoutPurchaseInput, CheckoutPurchaseResult } from "../types";

export const expressCheckoutProvider: CheckoutProvider = {
  mode: "express",

  async purchaseAccess(input: CheckoutPurchaseInput): Promise<CheckoutPurchaseResult> {
    const isFreeEvent = !input.price || input.price === 0;
    let paymentProvider: "stripe" | "mobile_money" | "paystack" = "stripe";
    let paymentId = `fp_sim_${Date.now()}`;

    if (!isFreeEvent && input.paymentMethod === "mobile-money") {
      paymentProvider = "mobile_money";
      const response = await legacyApiRaw("/payments/mobile-money/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: input.holderPhone,
          provider: input.mobileOperator ?? "mtn",
          amount: input.price ?? 0,
          currency: input.currency,
        }),
      });
      const body = await response.json().catch(() => ({}));
      paymentId = body?.data?.transaction_id ?? paymentId;
    } else if (!isFreeEvent && input.paymentMethod === "card") {
      paymentProvider = "stripe";
      const response = await legacyApiRaw("/payments/stripe/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: input.price ?? 0, currency: input.currency }),
      });
      const body = await response.json().catch(() => ({}));
      paymentId = body?.data?.intent_id ?? paymentId;
    }

    const confirmResponse = await legacyApiRaw("/payments/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventSource: input.eventSource,
        eventId: input.eventId,
        eventTitle: input.eventTitle,
        eventDate: input.eventDate,
        eventTime: input.eventTime,
        price: input.price,
        currency: input.currency,
        holderName: input.holderName,
        holderEmail: input.holderEmail,
        holderPhone: input.holderPhone,
        paymentProvider,
        paymentId,
      }),
    });

    const confirmBody = await confirmResponse.json().catch(() => ({}));
    if (!confirmResponse.ok) {
      throw new Error(confirmBody?.message ?? "Erreur lors du paiement");
    }

    return {
      orderId: confirmBody?.data?.orderId ?? `order_${Date.now()}`,
      accessCode: confirmBody?.data?.accessCode,
      paymentId,
      paymentProvider,
      emailSent: confirmBody?.data?.emailSent,
    };
  },
};
