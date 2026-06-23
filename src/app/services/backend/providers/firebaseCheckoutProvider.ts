import { auth } from "../../../config/firebase";
import { firebaseStreamingProvider } from "./firebaseStreamingProvider";
import type { CheckoutProvider, CheckoutPurchaseInput, CheckoutPurchaseResult } from "../types";

export const firebaseCheckoutProvider: CheckoutProvider = {
  mode: "firebase",

  async purchaseAccess(input: CheckoutPurchaseInput): Promise<CheckoutPurchaseResult> {
    const event = await firebaseStreamingProvider.purchaseTicket({
      eventId: input.eventId,
      eventTitle: input.eventTitle,
      eventDate: input.eventDate,
      eventTime: input.eventTime,
      channelName: "FeetiPlay",
      holderName: input.holderName,
      holderEmail: input.holderEmail,
      price: input.price ?? 0,
      currency: input.currency,
    });

    return {
      orderId: event.id,
      accessCode: event.qrCode,
      paymentId: `firebase_${auth.currentUser?.uid ?? "guest"}_${Date.now()}`,
      paymentProvider: input.paymentMethod === "mobile-money" ? "mobile_money" : input.paymentMethod === "paystack" ? "paystack" : "stripe",
      emailSent: false,
    };
  },
};
