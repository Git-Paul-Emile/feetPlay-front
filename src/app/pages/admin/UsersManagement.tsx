import { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Trash2, Shield, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminAPI, { type AdminUserItem } from '../../services/api/AdminAPI';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

const ROLES = ['viewer', 'premium', 'streamer', 'admin', 'super_admin'] as const;
const ROLE_LABELS: Record<string, string> = {
  viewer: 'Visiteur', premium: 'Premium', streamer: 'Streamer',
  admin: 'Admin', super_admin: 'Super Admin',
};
const ROLE_COLORS: Record<string, string> = {
  viewer: 'bg-white/10 text-white/70',
  premium: 'bg-[#fcc434]/20 text-[#fcc434]',
  streamer: 'bg-purple-500/20 text-purple-400',
  admin: 'bg-[#cdff71]/20 text-[#cdff71]',
  super_admin: 'bg-[#de0035]/20 text-[#de0035]',
};

const PAGE_SIZE = 20;

export function UsersManagement() {
  const { hasPermission } = useAdminAuth();
  const canEdit   = hasPermission('manage_users');
  const canDelete = hasPermission('manage_users');

  const [users, setUsers]         = useState<AdminUserItem[]>([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(0);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modale changement de rôle
  const [roleModal, setRoleModal] = useState<AdminUserItem | null>(null);
  const [newRole, setNewRole]     = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    AdminAPI.getUsers({
      search: search || undefined,
      role: roleFilter || undefined,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    })
      .then(({ users: u, total: t }) => { setUsers(u); setTotal(t); })
      .catch(err => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [search, roleFilter, page]);

  useEffect(() => { load(); }, [load]);

  // reset page on filter change
  useEffect(() => { setPage(0); }, [search, roleFilter]);

  const handleDelete = async (user: AdminUserItem) => {
    if (!confirm(`Supprimer ${user.name} (${user.email}) ?`)) return;
    setActionLoading(user.id);
    try {
      await AdminAPI.deleteUser(user.id);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      setTotal(prev => prev - 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async () => {
    if (!roleModal || !newRole) return;
    setActionLoading(roleModal.id);
    try {
      await AdminAPI.updateUserRole(roleModal.id, newRole);
      setUsers(prev => prev.map(u => u.id === roleModal.id ? { ...u, role: newRole } : u));
      setRoleModal(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl mb-2">
            Utilisateurs
          </h1>
          <p className="font-['Inter',sans-serif] text-white/60 text-base">
            {total.toLocaleString()} utilisateurs enregistrés
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[#cdff71] transition-colors"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#cdff71] transition-colors min-w-[180px]"
        >
          <option value="">Tous les rôles</option>
          {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-[#DE0035]/30 bg-[#DE0035]/10 px-4 py-3 text-sm text-white">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-white/80 text-sm font-semibold">Utilisateur</th>
                <th className="text-left px-6 py-4 text-white/80 text-sm font-semibold">Rôle</th>
                <th className="text-left px-6 py-4 text-white/80 text-sm font-semibold">Plan</th>
                <th className="text-left px-6 py-4 text-white/80 text-sm font-semibold hidden md:table-cell">Tickets</th>
                <th className="text-left px-6 py-4 text-white/80 text-sm font-semibold hidden lg:table-cell">Inscrit le</th>
                {(canEdit || canDelete) && (
                  <th className="text-right px-6 py-4 text-white/80 text-sm font-semibold">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-5 bg-white/5 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-white text-sm font-semibold">{user.name}</p>
                        <p className="text-white/50 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[user.role] ?? 'bg-white/10 text-white/70'}`}>
                      {ROLE_LABELS[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/60 text-sm capitalize">{user.subscriptionPlan}</td>
                  <td className="px-6 py-4 text-white/60 text-sm hidden md:table-cell">{user._count.tickets}</td>
                  <td className="px-6 py-4 text-white/60 text-sm hidden lg:table-cell">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  {(canEdit || canDelete) && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {canEdit && (
                          <button
                            onClick={() => { setRoleModal(user); setNewRole(user.role); }}
                            className="p-2 bg-[#cdff71]/10 hover:bg-[#cdff71]/20 text-[#cdff71] rounded-lg transition-colors"
                            title="Changer le rôle"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(user)}
                            disabled={actionLoading === user.id}
                            className="p-2 bg-[#de0035]/10 hover:bg-[#de0035]/20 text-[#de0035] rounded-lg transition-colors disabled:opacity-40"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && users.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-white/50 text-sm">
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} sur {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white/60 text-sm px-2">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modale changement de rôle */}
      {roleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111] border border-white/10 rounded-[16px] p-6 w-full max-w-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-[#cdff71]" />
              <h3 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg">
                Changer le rôle
              </h3>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Utilisateur : <span className="text-white font-semibold">{roleModal.name}</span>
            </p>
            <select
              value={newRole}
              onChange={e => setNewRole(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#cdff71] mb-6"
            >
              {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setRoleModal(null)}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleRoleChange}
                disabled={actionLoading === roleModal.id || newRole === roleModal.role}
                className="flex-1 py-2.5 bg-[#cdff71] hover:bg-[#cdff71]/90 text-black font-semibold rounded-lg transition-colors disabled:opacity-40"
              >
                {actionLoading === roleModal.id ? 'Enregistrement...' : 'Confirmer'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
