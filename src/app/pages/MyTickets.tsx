import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Ticket, Play, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';
import StreamingAPI, { type DigitalTicketData } from '../services/api/StreamingAPI';
import { useAuth } from '../contexts/AuthContext';

function statusLabel(status: DigitalTicketData['status']) {
  if (status === 'valid') return { text: 'Actif', color: '#CDFF71' };
  if (status === 'used') return { text: 'Utilisé', color: '#999' };
  return { text: 'Expiré', color: '#DE0035' };
}

export function MyTickets() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<DigitalTicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/my-tickets' } } });
      return;
    }
    StreamingAPI.getMyTickets('me')
      .then(setTickets)
      .catch(() => setError('Impossible de charger vos tickets.'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="relative bg-[#080808] min-h-screen pt-24 pb-12">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#DE0035]/20 rounded-full flex items-center justify-center">
            <Ticket className="w-5 h-5 text-[#DE0035]" />
          </div>
          <div>
            <h1 className="font-['Inter',sans-serif] font-bold text-white text-2xl">Mes tickets</h1>
            <p className="text-white/40 text-sm">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-[#DE0035]/10 border border-[#DE0035]/30 rounded-xl mb-6">
            <AlertTriangle className="w-5 h-5 text-[#DE0035]" />
            <p className="text-white/80 text-sm">{error}</p>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && !error && tickets.length === 0 && (
          <div className="text-center py-24">
            <Ticket className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-lg mb-6">Aucun ticket pour le moment</p>
            <button
              onClick={() => navigate('/events')}
              className="px-6 py-3 bg-[#DE0035] text-white rounded-full font-semibold hover:bg-[#c5002f] transition-colors"
            >
              Découvrir les événements
            </button>
          </div>
        )}

        {!loading && tickets.length > 0 && (
          <div className="space-y-3">
            {tickets.map((ticket, i) => {
              const st = statusLabel(ticket.status);
              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/8 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{ticket.eventTitle}</h3>
                    <p className="text-white/40 text-xs mt-1">
                      {ticket.eventDate} · {ticket.eventTime} · {ticket.channelName}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-medium" style={{ color: st.color }}>{st.text}</span>
                      <span className="text-white/30 text-xs">{ticket.price} {ticket.currency}</span>
                    </div>
                  </div>
                  {ticket.status === 'valid' && (
                    <button
                      onClick={() => navigate(`/event/${ticket.eventId}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#DE0035] text-white text-sm font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="w-3.5 h-3.5" fill="white" />
                      Regarder
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
