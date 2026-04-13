import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Send, Trash2, Info, AlertTriangle, Gift, Wrench } from 'lucide-react';
import AdminAPI, { type AdminNotificationItem, type SendNotificationInput } from '../../services/api/AdminAPI';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const TYPE_CONFIG = {
  info:        { icon: Info,          color: 'text-blue-400',   bg: 'bg-blue-500/10',    label: 'Info'          },
  warning:     { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10',  label: 'Avertissement' },
  promo:       { icon: Gift,          color: 'text-[#cdff71]',  bg: 'bg-[#cdff71]/10',   label: 'Promotion'     },
  maintenance: { icon: Wrench,        color: 'text-orange-400', bg: 'bg-orange-500/10',  label: 'Maintenance'   },
} as const;

const AUDIENCE_LABELS = { all: 'Tous les utilisateurs', premium: 'Abonnés Premium+', free: 'Compte gratuit' };

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const DEFAULT_FORM: SendNotificationInput = {
  title: '',
  message: '',
  type: 'info',
  audience: 'all',
  sentBy: '',
};

export function NotificationsPage() {
  const { user } = useAdminAuth();

  const [notifications, setNotifications] = useState<AdminNotificationItem[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const [form, setForm]       = useState<SendNotificationInput>({ ...DEFAULT_FORM, sentBy: user?.name ?? '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    AdminAPI.getNotifications({ limit: 50 })
      .then(({ notifications: n, total: t }) => { setNotifications(n); setTotal(t); })
      .catch(err => setError(err instanceof Error ? err.message : 'Erreur'))
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async () => {
    if (!form.title.trim()) { setFormError('Le titre est requis.'); return; }
    if (!form.message.trim()) { setFormError('Le message est requis.'); return; }
    setSending(true);
    setFormError(null);
    try {
      const notif = await AdminAPI.sendNotification({ ...form, sentBy: user?.name ?? 'Admin' });
      setNotifications(prev => [notif, ...prev]);
      setTotal(prev => prev + 1);
      setForm({ ...DEFAULT_FORM, sentBy: user?.name ?? '' });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erreur d\'envoi');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    try {
      await AdminAPI.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl mb-2">Notifications</h1>
        <p className="font-['Inter',sans-serif] text-white/60">Envoyer des notifications aux utilisateurs de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Formulaire d'envoi */}
        <div className="lg:col-span-2">
          <div className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] p-6 sticky top-6">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg mb-5 flex items-center gap-2">
              <Send className="w-5 h-5 text-[#cdff71]" />
              Nouvelle notification
            </h2>

            {formError && (
              <div className="mb-4 rounded-lg border border-[#DE0035]/30 bg-[#DE0035]/10 px-4 py-3 text-sm text-white">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-xs mb-1.5">Titre *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Ex : Nouvelle mise à jour disponible"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 outline-none focus:border-[#cdff71] transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs mb-1.5">Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Corps du message..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 outline-none focus:border-[#cdff71] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-white/60 text-xs mb-1.5">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(TYPE_CONFIG) as [keyof typeof TYPE_CONFIG, typeof TYPE_CONFIG[keyof typeof TYPE_CONFIG]][]).map(([key, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, type: key }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${form.type === key ? `${cfg.bg} border-current ${cfg.color}` : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs font-medium">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-xs mb-1.5">Audience</label>
                <select
                  value={form.audience}
                  onChange={e => setForm(p => ({ ...p, audience: e.target.value as SendNotificationInput['audience'] }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors"
                >
                  {(Object.entries(AUDIENCE_LABELS) as [string, string][]).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSend}
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-[#cdff71] hover:bg-[#cdff71]/90 text-black font-semibold py-3 rounded-lg transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Envoi en cours...' : 'Envoyer la notification'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Historique */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg">
              Historique <span className="text-white/40 text-sm font-normal ml-2">{total} envois</span>
            </h2>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-[#DE0035]/30 bg-[#DE0035]/10 px-4 py-3 text-sm text-white">{error}</div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[0,1,2].map(i => <div key={i} className="h-24 rounded-[12px] bg-white/5 animate-pulse" />)}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20">
              <Bell className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">Aucune notification envoyée</p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {notifications.map((notif, i) => {
                  const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.info;
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03 }}
                      className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Icon className={`w-5 h-5 ${cfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm">{notif.title}</p>
                            <p className="text-white/60 text-xs mt-0.5 line-clamp-2">{notif.message}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`text-xs ${cfg.color}`}>{cfg.label}</span>
                              <span className="text-white/30 text-xs">•</span>
                              <span className="text-white/50 text-xs">{AUDIENCE_LABELS[notif.audience]}</span>
                              <span className="text-white/30 text-xs">•</span>
                              <span className="text-white/40 text-xs">{formatDate(notif.sentAt)}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(notif.id)}
                          disabled={deleteId === notif.id}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors disabled:opacity-40 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
