import axios from "axios";

export async function purchaseTicket(eventId: string, holderName: string, holderEmail: string) {
  const res = await axios.post("/api/streaming/tickets", { eventId, holderName, holderEmail });
  return res.data?.data;
}

export async function getMuxToken(eventId: string) {
  const res = await axios.get(`/api/streaming/mux-token/${eventId}`);
  return res.data?.data;
}
