import React, { useState } from "react";
import axios from "axios";

interface Props {
  eventId: string;
  price?: number;
  currency?: string;
  onClose: () => void;
  onSuccess?: (ticket: any) => void;
}

export default function TicketPurchaseModal({ eventId, price = 0, currency = "FCFA", onClose, onSuccess }: Props) {
  const [holderName, setHolderName] = useState("");
  const [holderEmail, setHolderEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePurchase(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post("/api/streaming/tickets", {
        eventId,
        holderName,
        holderEmail,
      });
      const ticket = res.data?.data;
      setLoading(false);
      if (onSuccess) onSuccess(ticket);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err?.response?.data?.message || err.message || "Erreur");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Acheter un ticket</h3>
        <p className="text-sm text-gray-600 mb-4">Prix : {price} {currency}</p>
        <form onSubmit={handlePurchase}>
          <label className="block mb-2">
            <span className="text-sm">Nom du titulaire</span>
            <input className="mt-1 block w-full border rounded px-3 py-2" value={holderName} onChange={e => setHolderName(e.target.value)} required />
          </label>
          <label className="block mb-4">
            <span className="text-sm">Email du titulaire</span>
            <input type="email" className="mt-1 block w-full border rounded px-3 py-2" value={holderEmail} onChange={e => setHolderEmail(e.target.value)} required />
          </label>

          {error && <div className="text-red-600 mb-2">{error}</div>}

          <div className="flex gap-2 justify-end">
            <button type="button" className="px-4 py-2 rounded border" onClick={onClose} disabled={loading}>Annuler</button>
            <button type="submit" className="px-4 py-2 rounded bg-green-500 text-white" disabled={loading}>{loading ? "..." : `Payer ${price} ${currency}`}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
