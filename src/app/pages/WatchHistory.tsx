import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Trash2, Play, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';
import StreamingAPI, { type WatchHistoryEntry } from '../services/api/StreamingAPI';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

function ProgressRing({ progress }: { progress: number }) {
  const r = 20;
  const circumference = 2 * Math.PI * r;
  const dash = (progress / 100) * circumference;

  return (
    <svg width="52" height="52" className="rotate-[-90deg]">
      <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
      <circle
        cx="26" cy="26" r={r} fill="none"
        stroke={progress >= 95 ? '#CDFF71' : '#DE0035'}
        strokeWidth="3"
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.5s ease' }}
      />
      <text
        x="26" y="26"
        textAnchor="middle" dominantBaseline="central"
        fill="white" fontSize="10" fontWeight="bold"
        style={{ transform: 'rotate(90deg)', transformOrigin: '26px 26px' }}
      >
        {progress}%
      </text>
    </svg>
  );
}

export function WatchHistory() {
  const [history, setHistory] = useState<WatchHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await StreamingAPI.getWatchHistory('me');
      setHistory(data);
    } catch {
      setError('Impossible de charger l\'historique. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleClear = async () => {
    setClearing(true);
    try {
      await StreamingAPI.clearWatchHistory();
      setHistory([]);
      setShowConfirm(false);
    } catch {
      setError('Erreur lors de la suppression de l\'historique.');
    } finally {
      setClearing(false);
    }
  };

  const formatWatchedAt = (iso: string) => {
    try {
      return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: fr });
    } catch {
      return iso;
    }
  };

  return (
    <div className="relative bg-[#080808] min-h-screen pt-24 pb-12">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#DE0035]/20 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#DE0035]" />
            </div>
            <div>
              <h1 className="font-['Inter',sans-serif] font-bold text-white text-2xl">
                Historique de visionnage
              </h1>
              {!loading && (
                <p className="font-['Inter',sans-serif] text-white/40 text-sm mt-0.5">
                  {history.length} événement{history.length !== 1 ? 's' : ''} regardé{history.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Tout effacer
            </button>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-[#DE0035]/10 border border-[#DE0035]/30 rounded-xl mb-6">
            <AlertTriangle className="w-5 h-5 text-[#DE0035] flex-shrink-0" />
            <p className="font-['Inter',sans-serif] text-white/80 text-sm">{error}</p>
            <button onClick={fetchHistory} className="ml-auto text-[#CDFF71] text-sm underline">
              Réessayer
            </button>
          </div>
        )}

        {/* Chargement */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Liste vide */}
        {!loading && !error && history.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-6"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
              <Clock className="w-10 h-10 text-white/20" />
            </div>
            <div className="text-center">
              <p className="font-['Inter',sans-serif] text-white/40 text-lg mb-2">
                Aucun historique
              </p>
              <p className="font-['Inter',sans-serif] text-white/25 text-sm">
                Les événements que vous regardez apparaîtront ici
              </p>
            </div>
            <button
              onClick={() => navigate('/replay')}
              className="px-6 py-3 bg-[#DE0035] text-white font-['Inter',sans-serif] font-semibold rounded-full hover:bg-[#c5002f] transition-colors"
            >
              Découvrir les replays
            </button>
          </motion.div>
        )}

        {/* Entrées */}
        {!loading && !error && history.length > 0 && (
          <div className="space-y-3">
            {history.map((entry, i) => (
              <motion.div
                key={`${entry.eventId}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/8 border border-white/5 rounded-xl transition-colors group"
              >
                {/* Progress ring */}
                <div className="flex-shrink-0">
                  <ProgressRing progress={entry.progress} />
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-['Inter',sans-serif] font-semibold text-white text-base truncate">
                    {entry.eventTitle}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-['Inter',sans-serif] text-white/40 text-xs">
                      {formatWatchedAt(entry.watchedAt)}
                    </span>
                    {entry.duration && (
                      <>
                        <span className="text-white/20">·</span>
                        <span className="font-['Inter',sans-serif] text-white/40 text-xs">
                          {entry.duration}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Barre de progression */}
                  <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${entry.progress}%`,
                        backgroundColor: entry.progress >= 95 ? '#CDFF71' : '#DE0035',
                      }}
                    />
                  </div>
                  <p className="font-['Inter',sans-serif] text-white/30 text-xs mt-1">
                    {entry.progress >= 95 ? 'Terminé' : `${entry.progress}% regardé`}
                  </p>
                </div>

                {/* Bouton reprendre */}
                {entry.progress < 95 && (
                  <button
                    onClick={() => navigate(`/event/${entry.eventId}`)}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#DE0035] text-white text-sm font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#c5002f]"
                  >
                    <Play className="w-3.5 h-3.5" fill="white" />
                    Reprendre
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal confirmation effacement */}
        <AnimatePresence>
          {showConfirm && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                onClick={() => setShowConfirm(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              >
                <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-sm w-full pointer-events-auto text-center">
                  <div className="w-14 h-14 bg-[#DE0035]/15 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-7 h-7 text-[#DE0035]" />
                  </div>
                  <h3 className="font-['Inter',sans-serif] font-bold text-white text-lg mb-2">
                    Effacer l'historique ?
                  </h3>
                  <p className="font-['Inter',sans-serif] text-white/50 text-sm mb-6">
                    Cette action est irréversible. Votre progression sur tous les replays sera perdue.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors font-['Inter',sans-serif] font-semibold"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleClear}
                      disabled={clearing}
                      className="flex-1 py-3 bg-[#DE0035] hover:bg-[#c5002f] text-white rounded-full transition-colors font-['Inter',sans-serif] font-semibold disabled:opacity-50"
                    >
                      {clearing ? 'Suppression…' : 'Effacer'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
