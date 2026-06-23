import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Save, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function Profile() {
  const { user, isAuthenticated, isLoading, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/profile' } } });
      return;
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone ?? '');
      setAvatar(user.avatar ?? '');
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updateProfile({ name, email, phone: phone || null, avatar: avatar || null });
      setMessage('Profil mis à jour avec succès.');
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setError(null);
    setMessage(null);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setMessage('Mot de passe modifié avec succès.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Erreur lors du changement de mot de passe.');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative bg-[#080808] min-h-screen pt-24 pb-12">
      <div className="max-w-[600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#CDFF71]/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-[#CDFF71]" />
          </div>
          <h1 className="font-bold text-white text-2xl">Mon profil</h1>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-[#CDFF71]/10 border border-[#CDFF71]/30 rounded-xl text-[#CDFF71] text-sm">{message}</div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-[#DE0035]/10 border border-[#DE0035]/30 rounded-xl text-white text-sm">{error}</div>
        )}

        <motion.form onSubmit={handleProfileSave} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 space-y-4">
          <h2 className="text-white font-semibold mb-2">Informations personnelles</h2>

          <div>
            <label className="text-white/60 text-sm block mb-1">Nom</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#CDFF71]" />
          </div>
          <div>
            <label className="text-white/60 text-sm block mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#CDFF71]" />
          </div>
          <div>
            <label className="text-white/60 text-sm block mb-1">Téléphone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#CDFF71]" />
          </div>
          <div>
            <label className="text-white/60 text-sm block mb-1">URL avatar</label>
            <input value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#CDFF71]" />
          </div>

          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#DE0035] text-white rounded-full font-semibold hover:bg-[#c5002f] disabled:opacity-50 transition-colors">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer
          </button>
        </motion.form>

        <motion.form onSubmit={handlePasswordSave} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Changer le mot de passe
          </h2>

          <div>
            <label className="text-white/60 text-sm block mb-1">Mot de passe actuel</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#CDFF71]" />
          </div>
          <div>
            <label className="text-white/60 text-sm block mb-1">Nouveau mot de passe</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={8}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#CDFF71]" />
          </div>
          <div>
            <label className="text-white/60 text-sm block mb-1">Confirmer</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#CDFF71]" />
          </div>

          <button type="submit" disabled={passwordSaving}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 disabled:opacity-50 transition-colors">
            {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Modifier le mot de passe
          </button>
        </motion.form>
      </div>
    </div>
  );
}
