import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Lock, CheckCircle, AlertCircle, Settings2, Database,
  Activity, RefreshCw, Server, Cpu, HardDrive, Terminal, Shield,
  Globe, Mail, ShieldAlert, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { fetchWithApiFallback } from '../../utils/serviceConfig';
import { firebaseClientErrorToUserMessage } from '../../utils/firebaseUserFacingError';
import { ImageUpload } from '../../components/ImageUpload';
import AdminAPI from '../../services/api/AdminAPI';

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
  const { user, hasPermission } = useAdminAuth();

  // Navigation
  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'backups' | 'monitoring'>('profile');

  // Profile states
  const [name, setName]     = useState(user?.name ?? '');
  const [avatar, setAvatar] = useState(user?.avatar ?? '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileToast, setProfileToast]     = useState<Toast | null>(null);

  // Password states
  const [currentPwd, setCurrentPwd]   = useState('');
  const [newPwd, setNewPwd]           = useState('');
  const [confirmPwd, setConfirmPwd]   = useState('');
  const [pwdLoading, setPwdLoading]   = useState(false);
  const [pwdToast, setPwdToast]       = useState<Toast | null>(null);

  // System settings states
  const [sysSettings, setSysSettings] = useState<Record<string, string>>({});
  const [sysLoading, setSysLoading]   = useState(false);
  const [sysToast, setSysToast]       = useState<Toast | null>(null);

  // Backups states
  const [backups, setBackups]         = useState<Array<{ id: string; filename: string; size: number; status: string; createdAt: string }>>([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupActionId, setBackupActionId] = useState<string | null>(null);
  const [backupToast, setBackupToast]   = useState<Toast | null>(null);

  // Monitoring states
  const [monitoringData, setMonitoringData] = useState<any>(null);
  const [monitorLoading, setMonitorLoading] = useState(false);
  const [monitorError, setMonitorError]     = useState<string | null>(null);

  const showToast = (setter: (t: Toast | null) => void, type: 'success' | 'error', message: string) => {
    setter({ type, message });
    setTimeout(() => setter(null), 4000);
  };

  // Load system settings
  const loadSystemSettings = async () => {
    if (!hasPermission('manage_settings')) return;
    setSysLoading(true);
    try {
      const data = await AdminAPI.getSettings();
      setSysSettings(data);
    } catch (err) {
      showToast(setSysToast, 'error', firebaseClientErrorToUserMessage(err, 'Erreur de chargement des paramètres système.'));
    } finally {
      setSysLoading(false);
    }
  };

  // Load backups list
  const loadBackups = async () => {
    if (!hasPermission('manage_backup')) return;
    setBackupLoading(true);
    try {
      const data = await AdminAPI.getBackups();
      setBackups(data);
    } catch (err) {
      showToast(setBackupToast, 'error', firebaseClientErrorToUserMessage(err, 'Erreur de chargement des sauvegardes.'));
    } finally {
      setBackupLoading(false);
    }
  };

  // Load monitoring data
  const loadMonitoring = async () => {
    if (!hasPermission('manage_monitoring')) return;
    setMonitorLoading(true);
    setMonitorError(null);
    try {
      const data = await AdminAPI.getMonitoring();
      setMonitoringData(data);
    } catch (err) {
      setMonitorError(firebaseClientErrorToUserMessage(err, 'Erreur de chargement du monitoring technique.'));
    } finally {
      setMonitorLoading(false);
    }
  };

  // Load data based on selected tab
  useEffect(() => {
    if (activeTab === 'system') {
      loadSystemSettings();
    } else if (activeTab === 'backups') {
      loadBackups();
    } else if (activeTab === 'monitoring') {
      loadMonitoring();
    }
  }, [activeTab]);

  const handleProfileSave = async () => {
    if (!name.trim()) { showToast(setProfileToast, 'error', 'Le nom ne peut pas être vide.'); return; }
    setProfileLoading(true);
    try {
      const updated = await patchMe({ name: name.trim(), avatar });
      const stored = JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || '{}');
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({ ...stored, name: updated.name, avatar: updated.avatar }));
      showToast(setProfileToast, 'success', 'Profil mis à jour avec succès. Actualisez la page pour voir les changements.');
    } catch (err) {
      showToast(setProfileToast, 'error', firebaseClientErrorToUserMessage(err, 'Erreur de mise à jour du profil.'));
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
      showToast(setPwdToast, 'error', firebaseClientErrorToUserMessage(err, 'Impossible de modifier le mot de passe.'));
    } finally {
      setPwdLoading(false);
    }
  };

  const handleSystemSave = async () => {
    setSysLoading(true);
    try {
      const updated = await AdminAPI.updateSettings(sysSettings);
      setSysSettings(updated);
      showToast(setSysToast, 'success', 'Configuration globale mise à jour.');
    } catch (err) {
      showToast(setSysToast, 'error', firebaseClientErrorToUserMessage(err, 'Erreur lors de l\'enregistrement des paramètres.'));
    } finally {
      setSysLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setBackupLoading(true);
    try {
      const result = await AdminAPI.createBackup();
      setBackups(prev => [result, ...prev]);
      showToast(setBackupToast, 'success', 'Nouvelle sauvegarde de base de données créée.');
    } catch (err) {
      showToast(setBackupToast, 'error', firebaseClientErrorToUserMessage(err, 'Impossible de créer la sauvegarde.'));
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestoreBackup = async (id: string, filename: string) => {
    if (!confirm(`ATTENTION : Restaurer la sauvegarde "${filename}" ? Cette action va écraser les données actuelles de la base de données.`)) return;
    setBackupActionId(id);
    try {
      await AdminAPI.restoreBackup(id);
      showToast(setBackupToast, 'success', 'Données de la base restaurées avec succès.');
    } catch (err) {
      showToast(setBackupToast, 'error', firebaseClientErrorToUserMessage(err, 'Erreur critique lors de la restauration.'));
    } finally {
      setBackupActionId(null);
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
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl mb-2">Paramètres</h1>
        <p className="font-['Inter',sans-serif] text-white/60">Gérez votre compte et la configuration système</p>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-white/10 overflow-x-auto gap-2 mb-8 no-scrollbar">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 outline-none whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-[#cdff71] text-[#cdff71]'
              : 'border-transparent text-white/60 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          Mon Profil
        </button>

        {hasPermission('manage_settings') && (
          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 outline-none whitespace-nowrap ${
              activeTab === 'system'
                ? 'border-[#cdff71] text-[#cdff71]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Settings2 className="w-4 h-4" />
            Configuration Globale
          </button>
        )}

        {hasPermission('manage_backup') && (
          <button
            onClick={() => setActiveTab('backups')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 outline-none whitespace-nowrap ${
              activeTab === 'backups'
                ? 'border-[#cdff71] text-[#cdff71]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            Sauvegarde & Restauration
          </button>
        )}

        {hasPermission('manage_monitoring') && (
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 outline-none whitespace-nowrap ${
              activeTab === 'monitoring'
                ? 'border-[#cdff71] text-[#cdff71]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            Monitoring Technique
          </button>
        )}
      </div>

      {/* Tabs Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* Tab 1: Profile & Password */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Profile Details */}
              <div className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-[12px] p-6">
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
              </div>

              {/* Password change */}
              <div className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-[12px] p-6">
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
              </div>
            </motion.div>
          )}

          {/* Tab 2: System Settings */}
          {activeTab === 'system' && (
            <motion.div
              key="system"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-[12px] p-6 max-w-2xl"
            >
              <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg mb-5 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-[#cdff71]" />
                Configuration du système de la plateforme
              </h2>

              {sysToast && <ToastAlert toast={sysToast} />}

              {sysLoading && Object.keys(sysSettings).length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 text-[#cdff71] animate-spin" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Text Configurations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 text-xs mb-1.5 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-[#cdff71]" /> Nom de la plateforme
                      </label>
                      <input
                        type="text"
                        value={sysSettings.platformName || ''}
                        onChange={e => setSysSettings({ ...sysSettings, platformName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71]"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-1.5 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#cdff71]" /> Email de contact
                      </label>
                      <input
                        type="email"
                        value={sysSettings.contactEmail || ''}
                        onChange={e => setSysSettings({ ...sysSettings, contactEmail: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71]"
                      />
                    </div>
                  </div>

                  {/* Sentry Configuration */}
                  <div className="border-t border-white/5 pt-5 space-y-4">
                    <h3 className="text-white font-medium text-sm flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-orange-400" />
                      Monitoring d'erreurs (Sentry)
                    </h3>
                    <div className="flex items-center gap-3 justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <p className="text-white text-xs font-semibold">Activer Sentry</p>
                        <p className="text-white/40 text-xxs">Transmettre automatiquement les logs d'erreurs</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSysSettings({
                          ...sysSettings,
                          sentryEnabled: sysSettings.sentryEnabled === 'true' ? 'false' : 'true'
                        })}
                        className="text-[#cdff71]"
                      >
                        {sysSettings.sentryEnabled === 'true' ? (
                          <ToggleRight className="w-10 h-10" />
                        ) : (
                          <ToggleLeft className="w-10 h-10 text-white/40" />
                        )}
                      </button>
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-1.5">Sentry DSN URL</label>
                      <input
                        type="text"
                        value={sysSettings.sentryDsn || ''}
                        onChange={e => setSysSettings({ ...sysSettings, sentryDsn: e.target.value })}
                        placeholder="https://key@o0.ingest.sentry.io/0"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* General Features Toggles */}
                  <div className="border-t border-white/5 pt-5 space-y-3">
                    <h3 className="text-white font-medium text-sm">Contrôle d'accès et Maintenance</h3>
                    
                    <div className="flex items-center gap-3 justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <p className="text-white text-xs font-semibold">Mode Maintenance</p>
                        <p className="text-white/40 text-xxs flex items-center gap-1">
                          Restreindre l'accès de l'application cliente aux administrateurs
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSysSettings({
                          ...sysSettings,
                          maintenanceMode: sysSettings.maintenanceMode === 'true' ? 'false' : 'true'
                        })}
                        className="text-[#cdff71]"
                      >
                        {sysSettings.maintenanceMode === 'true' ? (
                          <ToggleRight className="w-10 h-10 text-[#de0035]" />
                        ) : (
                          <ToggleLeft className="w-10 h-10 text-white/40" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-3 justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <p className="text-white text-xs font-semibold">Autoriser les inscriptions</p>
                        <p className="text-white/40 text-xxs">Autoriser les nouveaux spectateurs à créer des comptes</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSysSettings({
                          ...sysSettings,
                          allowRegistrations: sysSettings.allowRegistrations === 'true' ? 'false' : 'true'
                        })}
                        className="text-[#cdff71]"
                      >
                        {sysSettings.allowRegistrations === 'true' ? (
                          <ToggleRight className="w-10 h-10" />
                        ) : (
                          <ToggleLeft className="w-10 h-10 text-white/40" />
                        )}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSystemSave}
                    disabled={sysLoading}
                    className="mt-6 px-6 py-2.5 bg-[#cdff71] hover:bg-[#cdff71]/90 text-black font-semibold rounded-lg transition-colors disabled:opacity-40 flex items-center gap-2"
                  >
                    {sysLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
                    Enregistrer la configuration globale
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {/* Tab 3: Backups & Restoration */}
          {activeTab === 'backups' && (
            <motion.div
              key="backups"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-[12px] p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                  <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#cdff71]" />
                    Sauvegardes de bases de données
                  </h2>
                  <p className="text-white/50 text-xs mt-1">Créez et restaurez des images complètes de l'application (JSON SQL-ready)</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateBackup}
                  disabled={backupLoading}
                  className="px-4 py-2 bg-[#cdff71] hover:bg-[#cdff71]/90 text-black font-semibold rounded-lg flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${backupLoading ? 'animate-spin' : ''}`} />
                  Créer une sauvegarde
                </motion.button>
              </div>

              {backupToast && <ToastAlert toast={backupToast} />}

              {/* Table */}
              <div className="border border-white/10 rounded-lg overflow-x-auto bg-black/30">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 border-b border-white/10 text-white/80 font-medium">
                    <tr>
                      <th className="p-4">Fichier de sauvegarde</th>
                      <th className="p-4">Taille</th>
                      <th className="p-4">Statut</th>
                      <th className="p-4">Créé le</th>
                      <th className="p-4 text-right">Restauration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backupLoading && backups.length === 0 ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <tr key={i} className="border-b border-white/5 animate-pulse">
                          <td colSpan={5} className="p-4 h-12 bg-white/2 animate-pulse" />
                        </tr>
                      ))
                    ) : backups.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-white/40">
                          Aucune sauvegarde disponible. Créez-en une en haut à droite.
                        </td>
                      </tr>
                    ) : (
                      backups.map(b => (
                        <tr key={b.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="p-4 font-mono text-xs text-white/80">{b.filename}</td>
                          <td className="p-4 text-white/60">
                            {b.size > 0 ? `${(b.size / 1024).toFixed(2)} KB` : 'N/A'}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-xxs font-semibold ${
                              b.status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {b.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-white/60">
                            {new Date(b.createdAt).toLocaleString('fr-FR')}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleRestoreBackup(b.id, b.filename)}
                              disabled={backupActionId !== null || b.status !== 'success'}
                              className="px-3 py-1 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:text-orange-300 text-xs font-semibold rounded transition-colors disabled:opacity-40 flex items-center gap-1.5 ml-auto"
                            >
                              {backupActionId === b.id ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="w-3.5 h-3.5" />
                              )}
                              Restaurer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Tab 4: Technical Monitoring */}
          {activeTab === 'monitoring' && (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {monitorLoading && !monitoringData ? (
                <div className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-[12px] p-12 flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-[#cdff71] animate-spin" />
                </div>
              ) : monitorError ? (
                <div className="bg-red-950/20 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
                  <Shield className="w-5 h-5 text-red-400" />
                  <p>{monitorError}</p>
                </div>
              ) : monitoringData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* System Metrics */}
                  <div className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-[12px] p-6 space-y-6 md:col-span-1">
                    <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg flex items-center gap-2 border-b border-white/5 pb-3">
                      <Server className="w-5 h-5 text-[#cdff71]" />
                      État Serveur
                    </h2>

                    {/* Sentry status */}
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/60 text-xs">Sentry Monitoring</span>
                      <span className={`px-2 py-0.5 rounded-full text-xxs font-bold ${
                        monitoringData.sentry.enabled ? 'bg-green-500/10 text-green-400 animate-pulse' : 'bg-white/10 text-white/40'
                      }`}>
                        {monitoringData.sentry.enabled ? 'ACTIF' : 'INACTIF'}
                      </span>
                    </div>

                    {/* RAM */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-white/60">
                        <span className="flex items-center gap-1"><HardDrive className="w-3 h-3 text-cyan-400" /> RAM (Mémoire)</span>
                        <span className="font-semibold">{monitoringData.metrics.ram.usagePercent}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-[#cdff71] transition-all duration-500"
                          style={{ width: `${monitoringData.metrics.ram.usagePercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xxs text-white/40">
                        <span>Utilisé : {monitoringData.metrics.ram.used} GB</span>
                        <span>Total : {monitoringData.metrics.ram.total} GB</span>
                      </div>
                    </div>

                    {/* CPU */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between text-xs text-white/60">
                        <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-orange-400" /> CPU ({monitoringData.metrics.cpu.cores} Cores)</span>
                      </div>
                      <p className="text-white text-xs font-mono font-bold truncate">{monitoringData.metrics.cpu.model}</p>
                      <div className="bg-black/30 rounded p-2 text-xxs text-white/50 font-mono">
                        Charges : {monitoringData.metrics.cpu.loadAvg.map((l: number) => l.toFixed(2)).join(' | ')}
                      </div>
                    </div>

                    {/* Uptime */}
                    <div className="pt-2 border-t border-white/5 flex justify-between text-xs text-white/60">
                      <span>Uptime Processus</span>
                      <span className="font-mono text-[#cdff71] font-bold">
                        {Math.floor(monitoringData.metrics.uptime / 3600)}h {Math.floor((monitoringData.metrics.uptime % 3600) / 60)}m {monitoringData.metrics.uptime % 60}s
                      </span>
                    </div>
                  </div>

                  {/* Error logs */}
                  <div className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-[12px] p-6 md:col-span-2">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                      <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-[#de0035]" />
                        Logs d'Erreurs Bas-Niveau
                      </h2>
                      <button
                        onClick={loadMonitoring}
                        className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded transition-colors"
                        title="Rafraîchir"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    {monitoringData.errorLogs.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center text-white/30 text-xs border border-dashed border-white/10 rounded-lg">
                        <CheckCircle className="w-8 h-8 text-green-500/50 mb-2" />
                        Aucune erreur critique enregistrée dans les logs.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2 no-scrollbar">
                        {monitoringData.errorLogs.map((log: any) => (
                          <div key={log.id} className="bg-black/40 border-l-4 border-[#de0035] rounded p-3 font-mono text-xxs flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-white/40">
                              <span className="text-[#de0035] font-bold">[{log.action}]</span>
                              <span>{new Date(log.createdAt).toLocaleString('fr-FR')}</span>
                            </div>
                            <p className="text-white/80 leading-relaxed font-semibold">{log.description}</p>
                            <div className="flex justify-between items-center text-white/30 border-t border-white/5 pt-1.5">
                              <span>Admin : {log.adminName} ({log.adminRole})</span>
                              <span>IP : {log.ipAddress || 'unknown'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
