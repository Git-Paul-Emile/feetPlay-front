/**
 * Configuration des permissions et rôles du système
 * 
 * Ce fichier définit :
 * - Les différents rôles utilisateurs
 * - Les permissions associées à chaque rôle
 * - Les descriptions de chaque permission
 */

export type Permission =
  | 'view_dashboard'
  | 'manage_events'
  | 'view_events'
  | 'manage_users'
  | 'view_users'
  | 'manage_crm'
  | 'send_notifications'
  | 'view_logs'
  | 'manage_settings'
  | 'manage_backup'
  | 'manage_monitoring'
  | 'manage_roles'
  | 'view_finances';

export type Role = 'super_admin' | 'admin' | 'moderator' | 'finance' | 'marketing';

/**
 * Descriptions des permissions
 */
export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  view_dashboard: 'Accéder au dashboard principal',
  manage_events: 'Créer, modifier et supprimer des événements',
  view_events: 'Consulter les événements',
  manage_users: 'Gérer les utilisateurs (créer, modifier, bannir)',
  view_users: 'Consulter la liste des utilisateurs',
  manage_crm: 'Accéder et gérer le CRM et les analytics',
  send_notifications: 'Envoyer des notifications push',
  view_logs: 'Consulter les logs système',
  manage_settings: 'Modifier les paramètres système',
  manage_backup: 'Gérer les backups et restaurations',
  manage_monitoring: 'Accéder au monitoring et aux alertes',
  manage_roles: 'Attribuer et modifier les rôles utilisateurs',
  view_finances: 'Consulter les données financières',
};

/**
 * Descriptions des rôles
 */
export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  super_admin: 'Accès complet à toutes les fonctionnalités (Fondateur, CTO)',
  admin: 'Gestion quotidienne de la plateforme (Chef de produit, Community Manager)',
  moderator: 'Modération du contenu (Modérateurs)',
  finance: 'Accès aux données financières et rapports (Comptable, CFO)',
  marketing: 'Gestion CRM et communications (Marketing Manager, Growth)',
};

/**
 * Configuration des permissions par rôle
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    'view_dashboard',
    'manage_events',
    'view_events',
    'manage_users',
    'view_users',
    'manage_crm',
    'send_notifications',
    'view_logs',
    'manage_settings',
    'manage_backup',
    'manage_monitoring',
    'manage_roles',
    'view_finances',
  ],
  admin: [
    'view_dashboard',
    'manage_events',
    'view_events',
    'manage_users',
    'view_users',
    'manage_crm',
    'send_notifications',
    'view_logs',
  ],
  moderator: [
    'view_dashboard',
    'manage_events',
    'view_events',
    'view_users',
    'view_logs',
  ],
  finance: [
    'view_dashboard',
    'view_finances',
    'view_events',
    'view_users',
    'view_logs',
  ],
  marketing: [
    'view_dashboard',
    'manage_crm',
    'send_notifications',
    'view_events',
    'view_users',
  ],
};

/**
 * Couleurs des rôles pour l'UI
 */
export const ROLE_COLORS: Record<Role, string> = {
  super_admin: '#de0035',
  admin: '#cdff71',
  moderator: '#fcc434',
  finance: '#60a5fa',
  marketing: '#c084fc',
};

/**
 * Badges des rôles
 */
export const ROLE_BADGES: Record<Role, { bg: string; text: string }> = {
  super_admin: { bg: 'bg-red-500/20', text: 'text-red-400' },
  admin: { bg: 'bg-[#cdff71]/20', text: 'text-[#cdff71]' },
  moderator: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  finance: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  marketing: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
};

/**
 * Vérifie si un rôle a une permission spécifique
 */
export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

/**
 * Récupère toutes les permissions d'un rôle
 */
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Récupère la liste de tous les rôles
 */
export function getAllRoles(): Role[] {
  return ['super_admin', 'admin', 'moderator', 'finance', 'marketing'];
}

/**
 * Récupère la liste de toutes les permissions
 */
export function getAllPermissions(): Permission[] {
  return Object.keys(PERMISSION_DESCRIPTIONS) as Permission[];
}
