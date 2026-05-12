import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { firebaseClientErrorToUserMessage } from "../utils/firebaseUserFacingError";

type Prefill = { name?: string; email?: string; avatar?: string | null };

export function GoogleCompletion() {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeGoogleRegistration } = useAuth();
  const prefill = (location.state as { prefill?: Prefill } | null)?.prefill;

  const [name, setName] = useState(prefill?.name ?? "");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"viewer" | "streamer">("viewer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await completeGoogleRegistration({ name: name.trim(), phone: phone.trim() || undefined, role });
      window.sessionStorage.removeItem('feetiplay_google_requires_completion');
      navigate("/", { replace: true });
    } catch (err: unknown) {
      setError(
        firebaseClientErrorToUserMessage(
          err,
          "Impossible de finaliser votre compte Google. Vérifiez vos informations et réessayez.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 bg-[#121212] p-6 rounded-2xl border border-[#2b2b2b]">
        <h1 className="text-2xl font-semibold">Compléter votre inscription</h1>
        {prefill?.email ? <p className="text-sm text-[#b8b8b8]">Compte Google: {prefill.email}</p> : null}

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom complet"
          required
          className="w-full h-12 rounded-xl bg-transparent border border-[#3a3a3a] px-4"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Téléphone (optionnel)"
          className="w-full h-12 rounded-xl bg-transparent border border-[#3a3a3a] px-4"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "viewer" | "streamer")}
          className="w-full h-12 rounded-xl bg-transparent border border-[#3a3a3a] px-4"
        >
          <option value="viewer" className="text-black">Spectateur</option>
          <option value="streamer" className="text-black">Streamer</option>
        </select>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-[#CDFF71] text-black font-semibold disabled:opacity-50"
        >
          {isSubmitting ? "Validation..." : "Terminer et accéder au dashboard"}
        </button>
      </form>
    </div>
  );
}
