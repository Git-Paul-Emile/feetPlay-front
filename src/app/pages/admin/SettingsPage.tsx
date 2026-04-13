import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { fetchWithApiFallback } from '../../utils/serviceConfig';
import { ImageUpload } from '../../components/ImageUpload';

const ADMIN_TOKEN_KEY = 'feetiplay_admin_token';
const ADMIN_USER_KEY  = 'feetiplay_admin_user';

async function patchMe(data: object) {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const res = await fetchWithApiFallback('/admin/auth/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({ message: 'Erreur serveur' }));
  if (!res.ok) throw new Error(body.message ?? 'Erreur serveur');
  return body.data;
}

interface Toast { type: 'success' | 'error'; message: string }

export function SettingsPage() {
  const { user } = useAdminAuth();

  // Profile
  const [name, setName]     = useState(user?.name ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileToast, setProfileToast]     = useState<Toast | null>(null);

  // Password
  const [currentPwd, setCurrentPwd]   = useState('');
  const [newPwd, setNewPwd]           = useState('');
  const [confirmPwd, setConfirmPwd]   = useState('');
  const [pwdLoading, setPwdLoading]   = useState(false);
  const [pwdToast, setPwdToast]       = useState<Toast | null>(null);

  const showToast = (setter: (t: Toast | null) => void, type: 'success' | 'error', message: string) => {
    setter({ type, message });
    setTimeout(() => setter(null), 4000);
  };

  const handleProfileSave = async () => {
    if (!name.trim()) { showToast(setProfileToast, 'error', 'Le nom ne peut pas être vide.'); return; }
    setProfileLoading(true);
    try {
      const updated = await patchMe({ name: name.trim(), avatar });
      // Mettre à jour le localStorage
      const stored = JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || '{}');
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({ ...stored, name: updated.name, avatar: updated.avatar }));
      showToast(setProfileToast, 'success', 'Profil mis à jour avec succès.');
    } catch (err) {
      showToast(setProfileToast, 'error', err instanceof Error ? err.message : 'Erreur de mise à jour');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPwd) { showToast(setPwdToast, 'error', 'Entrez votre mot de passe actuel.'); return; }
    if (newPwd.length < 8) { showToast(setPwdToast, 'error', 'Le nouveau mot de passe doit contenir au moins 8 caractères.'); return; }
    if (newPwd !== confirmPwd) { showToast(setPwdToast, 'error', 'Les mots de passe ne correspondent pas.'); return; }
    setPwdLoading(true);
    try {
      await patchMe({ currentPassword: currentPwd, newPassword: newPwd });
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      showToast(setPwdToast, 'success', 'Mot de passe modifié avec succès.');
    } catch (err) {
      showToast(setPwdToast, 'error', err instanceof Error ? err.message : 'Erreur de modification');
    } finally {
      setPwdLoading(false);
    }
  };

  const ToastAlert = ({ toast }: { toast: Toast }) => (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm mb-4 ${
        toast.type === 'success'
          ? 'bg-green-500/10 border border-green-500/30 text-green-400'
          : 'bg-[#DE0035]/10 border border-[#DE0035]/30 text-white'
      }`}
    >
      {toast.type === 'success'
        ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
        : <AlertCircle className="w-4 h-4 flex-shrink-0" />
      }
      {toast.message}
    </motion.div>
  );

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl mb-2">Paramètres</h1>
        <p className="font-['Inter',sans-serif] text-white/60">Gestion de votre compte administrateur</p>
      </div>

      {/* Info compte */}
      <div className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] p-4 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#cdff71]/20 flex items-center justify-center text-[#cdff71] font-bold text-lg">
          {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
        </div>
        <div>
          <p className="text-white font-semibold">{user?.name}</p>
          <p className="text-white/50 text-sm">{user?.email} · <span className="capitalize">{user?.role?.replace('_', ' ')}</span></p>
        </div>
      </div>

      {/* Section Profil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] p-6 mb-6"
      >
        <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg mb-5 flex items-center gap-2">
          <User className="w-5 h-5 text-[#cdff71]" />
          Informations du profil
        </h2>

        {profileToast && <ToastAlert toast={profileToast} />}

        <div className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Nom d'affichage</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors"
            />
          </div>
          <ImageUpload
            value={avatar}
            onChange={setAvatar}
            folder="feetiplay/avatars"
            label="Avatar"
            aspect="square"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleProfileSave}
          disabled={profileLoading}
          className="mt-5 px-6 py-2.5 bg-[#cdff71] hover:bg-[#cdff71]/90 text-black font-semibold rounded-lg transition-colors disabled:opacity-40"
        >
          {profileLoading ? 'Enregistrement...' : 'Sauvegarder le profil'}
        </motion.button>
      </motion.div>

      {/* Section Mot de passe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] p-6"
      >
        <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg mb-5 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#cdff71]" />
          Changer le mot de passe
        </h2>

        {pwdToast && <ToastAlert toast={pwdToast} />}

        <div className="space-y-4">
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPwd}
              onChange={e => setCurrentPwd(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              placeholder="Min. 8 caractères"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 outline-none focus:border-[#cdff71] transition-colors"
            />
          </div>
          <div>
            <label className="block text-white/60 text-xs mb-1.5">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePasswordChange}
          disabled={pwdLoading}
          className="mt-5 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors disabled:opacity-40"
        >
          {pwdLoading ? 'Modification...' : 'Changer le mot de passe'}
        </motion.button>
      </motion.div>
    </div>
  );
}
