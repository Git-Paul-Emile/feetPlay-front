import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { MuxPlayer } from "../components/MuxPlayer";
import { SubscriptionModal } from "../components/creator/SubscriptionModal";
import CreatorAPI, { type CreatorVideo } from "../services/api/CreatorAPI";
import { useAuth } from "../contexts/AuthContext";

type VideoData = CreatorVideo & {
  creator: { id: string; channelName: string; channelSlug: string; avatar: string | null };
};

export function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Access state
  const [hasAccess, setHasAccess] = useState(false);
  const [accessReason, setAccessReason] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    CreatorAPI.getVideoById(id)
      .then((data) => {
        setVideo(data);
        setError(null);
      })
      .catch((err) => setError(err.message ?? "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !video) return;
    setCheckingAccess(true);
    CreatorAPI.checkVideoAccess(id)
      .then((res) => {
        setHasAccess(res.hasAccess);
        setAccessReason(res.reason);
        if (res.reason === "subscription") setIsSubscribed(true);

        if (!res.hasAccess && res.reason === "subscription_required") {
          setShowSubModal(true);
        }
      })
      .catch(() => {
        setHasAccess(false);
        setAccessReason("Erreur de vérification");
      })
      .finally(() => setCheckingAccess(false));
  }, [id, video, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center flex-col gap-4">
        <p className="text-white text-lg">{error ?? "Vidéo introuvable"}</p>
        <button onClick={() => navigate(-1)} className="text-[#CDFF71] hover:underline">
          Retour
        </button>
      </div>
    );
  }

  const handleSubToggle = (subscribed: boolean) => {
    setIsSubscribed(subscribed);
    if (subscribed) {
      setHasAccess(true);
      setAccessReason("subscription");
    } else {
      setHasAccess(false);
      setAccessReason("subscription_required");
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{video.title}</h1>
          <div className="flex items-center gap-3">
            {video.creator.avatar && (
              <img src={video.creator.avatar} alt={video.creator.channelName} className="w-8 h-8 rounded-full object-cover" />
            )}
            <Link to={`/chaines/${video.creator.channelSlug}`} className="text-[#CDFF71] hover:underline font-medium">
              {video.creator.channelName}
            </Link>
            <span className="text-gray-500 text-sm">•</span>
            <span className="text-gray-500 text-sm">{new Date(video.createdAt).toLocaleDateString()}</span>
            {video.category && (
              <>
                <span className="text-gray-500 text-sm">•</span>
                <span className="text-gray-400 text-sm">{video.category}</span>
              </>
            )}
          </div>
        </motion.div>

        {checkingAccess ? (
          <div className="w-full aspect-video bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <p className="text-white/60 text-sm">Vérification des accès…</p>
            </div>
          </div>
        ) : !hasAccess ? (
          <div className="w-full aspect-video bg-gradient-to-br from-[#111] to-black rounded-2xl flex items-center justify-center border border-white/10 relative overflow-hidden">
            {video.thumbnail && (
              <img src={video.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" />
            )}
            <div className="relative z-10 text-center max-w-sm px-6">
              <h3 className="text-xl font-bold text-white mb-2">Contenu Premium</h3>
              <p className="text-gray-400 text-sm mb-6">
                Cette vidéo est réservée aux abonnés de la chaîne <span className="text-white font-medium">{video.creator.channelName}</span>.
              </p>
              {accessReason === "login_required" ? (
                <Link to="/login" className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-[#CDFF71] text-black font-semibold hover:bg-[#b0ff2b] transition-colors">
                  Se connecter pour s'abonner
                </Link>
              ) : (
                <button
                  onClick={() => setShowSubModal(true)}
                  className="w-full px-6 py-3 rounded-xl bg-[#DE0035] text-white font-semibold hover:bg-[#DE0035]/80 transition-colors"
                >
                  S'abonner à la chaîne
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            {(video.streamUrl || video.videoUrl) ? (
              video.streamUrl ? (
                // On utilise le composant MuxPlayer si streamUrl est un playbackId
                <MuxPlayer
                  playbackId={video.streamUrl}
                  title={video.title}
                  startTime={0}
                />
              ) : (
                <video
                  src={video.videoUrl!}
                  controls
                  className="w-full h-full object-contain"
                  poster={video.thumbnail ?? undefined}
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#111]">
                <p className="text-white/60">Le flux vidéo n'est pas encore disponible.</p>
              </div>
            )}
          </div>
        )}

        {video.description && (
          <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
            <p className="text-gray-400 whitespace-pre-wrap leading-relaxed">
              {video.description}
            </p>
          </div>
        )}
      </div>

      {showSubModal && (
        <SubscriptionModal
          creator={{ id: video.creator.id, channelName: video.creator.channelName } as any}
          isSubscribed={isSubscribed}
          subscriptionPrice={(video as any).subscriptionPrice ?? 5000}
          onClose={() => setShowSubModal(false)}
          onToggle={handleSubToggle}
        />
      )}
    </div>
  );
}
