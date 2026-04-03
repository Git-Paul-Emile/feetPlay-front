# 🎛️ FEETI PLAY - Dashboard Administratif

## 📋 Vue d'ensemble

Dashboard administratif complet pour la gestion de la plateforme de streaming sportif FEETI PLAY.

**Version** : 1.0.0 (Frontend-Only Demo)  
**Date** : Mars 2025  
**Statut** : ✅ Fonctionnel en mode démo

---

## 🚀 DÉMARRAGE RAPIDE

### 1. Accéder au dashboard

```bash
# URL de connexion
http://localhost:5173/admin/login
```

### 2. Utiliser les comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Super Admin | superadmin@feetiplay.com | Super@123 |
| Admin | admin@feetiplay.com | Admin@123 |
| Modérateur | moderator@feetiplay.com | Mod@123 |
| Finance | finance@feetiplay.com | Finance@123 |
| Marketing | marketing@feetiplay.com | Marketing@123 |

### 3. Explorer le dashboard

Une fois connecté, vous accéderez à :
- Dashboard avec statistiques en temps réel
- Gestion des événements (CRUD complet)
- Logs système avec filtrage
- Navigation par rôles et permissions

---

## 📁 DOCUMENTATION COMPLÈTE

### 📖 Guides disponibles

| Document | Description | Lien |
|----------|-------------|------|
| **Guide Accès** | Connexion et comptes de démo | [ADMIN_ACCESS.md](./ADMIN_ACCESS.md) |
| **Guide Admin** | Utilisation complète du dashboard | [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) |
| **Doc Backend** | Architecture et sécurité backend | [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md) |

---

## 🏗️ ARCHITECTURE

### Structure du projet

```
src/app/
├── pages/admin/               # Pages du dashboard
│   ├── AdminLogin.tsx         # ✅ Page de connexion
│   ├── AdminLayout.tsx        # ✅ Layout avec sidebar
│   ├── AdminDashboard.tsx     # ✅ Dashboard principal
│   ├── EventsManagement.tsx   # ✅ Gestion événements
│   └── SystemLogs.tsx         # ✅ Logs système
│
├── contexts/
│   └── AdminAuthContext.tsx   # ✅ Gestion auth & permissions
│
├── components/
│   └── ProtectedRoute.tsx     # ✅ Protection des routes
│
└── config/
    └── permissions.ts         # ✅ Configuration rôles
```

### Routes disponibles

```typescript
/admin/login          // Page de connexion
/admin/dashboard      // Dashboard principal ✅
/admin/events         // Gestion événements ✅
/admin/users          // Gestion utilisateurs 🚧
/admin/crm            // CRM & Analytics 🚧
/admin/notifications  // Notifications push 🚧
/admin/finances       // Finances 🚧
/admin/logs           // Logs système ✅
/admin/settings       // Paramètres 🚧
```

**Légende** :
- ✅ Fonctionnel
- 🚧 En construction

---

## 🎯 FONCTIONNALITÉS

### ✅ Implémentées

#### 1. Authentification & Sécurité
- [x] Page de connexion sécurisée
- [x] Système de rôles (5 niveaux)
- [x] Gestion des permissions granulaires
- [x] Sessions avec localStorage
- [x] Protection des routes
- [x] Déconnexion automatique (24h)

#### 2. Dashboard Principal
- [x] Statistiques temps réel (4 métriques)
- [x] Graphiques d'activité
- [x] Événements récents
- [x] Timeline des actions
- [x] Vue personnalisée par rôle

#### 3. Gestion des Événements
- [x] Liste avec recherche
- [x] Filtres par statut
- [x] Création d'événements
- [x] Modification
- [x] Suppression
- [x] Gestion des statuts (Draft/Published/Live/Ended)
- [x] Upload d'images
- [x] Prix en FCFA

#### 4. Système de Logs
- [x] Historique complet des actions
- [x] 4 niveaux (Info/Success/Warning/Error)
- [x] Recherche dans les logs
- [x] Filtrage par niveau
- [x] Export JSON
- [x] Statistiques par niveau
- [x] Auto-logging des actions critiques

#### 5. Interface Utilisateur
- [x] Design moderne dark mode
- [x] Sidebar collapse
- [x] Responsive mobile
- [x] Animations fluides (Motion)
- [x] Feedback visuel
- [x] Indicateurs de rôle

### 🚧 À Implémenter

#### Phase 2 : Gestion Utilisateurs
- [ ] Liste complète des utilisateurs
- [ ] CRUD utilisateurs
- [ ] Modification des rôles (Super Admin)
- [ ] Bannissement/Débannissement
- [ ] Statistiques par utilisateur
- [ ] Export CSV

#### Phase 3 : CRM & Analytics
- [ ] Dashboard analytics avancé
- [ ] Segmentation utilisateurs
- [ ] Taux de conversion
- [ ] Parcours utilisateur
- [ ] Heatmaps
- [ ] Rapports exportables

#### Phase 4 : Notifications Push
- [ ] Interface de création
- [ ] Éditeur riche (texte + image)
- [ ] Programmation d'envoi
- [ ] Ciblage audience (tous/segment/custom)
- [ ] Preview notification
- [ ] Statistiques d'ouverture
- [ ] A/B testing

#### Phase 5 : Finances
- [ ] Vue des transactions
- [ ] Graphiques de revenus
- [ ] Rapports de ventes
- [ ] Export comptable (CSV/Excel)
- [ ] Filtres par période
- [ ] Réconciliation bancaire

#### Phase 6 : Paramètres
- [ ] Configuration générale
- [ ] Gestion des rôles
- [ ] Backup manuel
- [ ] Restauration
- [ ] Monitoring en temps réel
- [ ] Alertes système

---

## 🔐 SYSTÈME DE PERMISSIONS

### Matrice des permissions

| Permission | Super Admin | Admin | Modérateur | Finance | Marketing |
|-----------|:-----------:|:-----:|:----------:|:-------:|:---------:|
| **Dashboard** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Créer événement** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Modifier événement** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Supprimer événement** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Gérer utilisateurs** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Modifier rôles** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Vue finances** | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Envoi notifications** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Gestion CRM** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Vue logs** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Paramètres système** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Backup/Restore** | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 💾 STOCKAGE DES DONNÉES

### LocalStorage (Version Demo)

```javascript
// Session utilisateur
localStorage.getItem('admin_user')
// Structure:
{
  id: string,
  email: string,
  name: string,
  role: 'super_admin' | 'admin' | 'moderator' | 'finance' | 'marketing',
  permissions: string[]
}

// Logs système
localStorage.getItem('admin_logs')
// Array de logs avec:
{
  id: string,
  action: string,
  description: string,
  user: string,
  role: string,
  timestamp: ISO string,
  level: 'info' | 'warning' | 'error' | 'success'
}
```

### Migration vers Backend

Pour la production, remplacer localStorage par :

**Option 1 : Supabase** (Recommandé)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
```

**Option 2 : API Custom**
```typescript
const API_BASE = 'https://api.feetiplay.com';

fetch(`${API_BASE}/admin/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

---

## 🔒 SÉCURITÉ

### Mesures implémentées (Frontend)

- ✅ Protection des routes par authentification
- ✅ Vérification des permissions par page
- ✅ Sessions avec expiration (24h)
- ✅ Logging de toutes les actions sensibles
- ✅ Sanitization des inputs
- ✅ Validation des formulaires

### À implémenter (Backend)

- [ ] Authentification JWT avec refresh token
- [ ] Rate limiting (100 req/min)
- [ ] HTTPS uniquement (TLS 1.3)
- [ ] Headers de sécurité (HSTS, CSP)
- [ ] 2FA (Two-Factor Authentication)
- [ ] IP whitelisting pour super admin
- [ ] Chiffrement des données sensibles
- [ ] Audit trail complet
- [ ] Backup automatique quotidien

Voir [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md) pour les détails.

---

## 📊 MONITORING & LOGS

### Actions loggées automatiquement

| Action | Description | Niveau |
|--------|-------------|--------|
| `login` | Connexion utilisateur | success |
| `logout` | Déconnexion utilisateur | info |
| `event.create` | Création d'événement | info |
| `event.update` | Modification d'événement | info |
| `event.delete` | Suppression d'événement | warning |
| `user.ban` | Bannissement utilisateur | warning |
| `role.change` | Modification de rôle | warning |
| `settings.update` | Modification paramètres | warning |
| `api.error` | Erreur API | error |

### Export des logs

Les logs peuvent être exportés en JSON :
```json
[
  {
    "id": "1710512345678",
    "action": "login",
    "description": "Super Administrateur s'est connecté",
    "user": "Super Administrateur",
    "role": "super_admin",
    "timestamp": "2025-03-15T10:30:45.678Z",
    "level": "success"
  }
]
```

---

## 🚀 DÉPLOIEMENT

### Pré-requis

- Node.js 18+
- npm ou pnpm
- Variables d'environnement configurées

### Variables d'environnement

Créer un fichier `.env.production` :

```bash
# Frontend
VITE_APP_NAME=FEETI PLAY Admin
VITE_API_URL=https://api.feetiplay.com

# Backend (voir BACKEND_DOCUMENTATION.md)
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
JWT_SECRET=...
```

### Build & Déploiement

```bash
# Build production
npm run build

# Déployer sur Vercel
vercel --prod

# Ou Netlify
netlify deploy --prod

# Ou serveur custom
scp -r dist/* user@server:/var/www/admin.feetiplay.com
```

---

## 🆘 SUPPORT & CONTRIBUTION

### Besoin d'aide ?

- 📧 **Email** : tech@feetiplay.com
- 📱 **Téléphone** : +242 06 XXX XX XX
- 💬 **Slack** : #feeti-tech
- 📖 **Documentation** : [docs.feetiplay.com](#)

### Signaler un bug

1. Ouvrir un ticket sur GitHub
2. Décrire le problème
3. Joindre les logs (`/admin/logs`)
4. Préciser le navigateur et OS

### Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Ouvrir une Pull Request

---

## 📝 CHANGELOG

### v1.0.0 (Mars 2025)

**Ajouts** :
- ✅ Système d'authentification complet
- ✅ 5 niveaux de rôles avec permissions
- ✅ Dashboard principal avec stats
- ✅ Gestion complète des événements
- ✅ Système de logs avancé
- ✅ Interface responsive
- ✅ Animations fluides
- ✅ Documentation complète

**À venir (v1.1.0)** :
- 🚧 Gestion des utilisateurs
- 🚧 CRM & Analytics
- 🚧 Notifications push
- 🚧 Module finances
- 🚧 Intégration Supabase

---

## 📜 LICENCE

© 2025 FEETI PLAY - Tous droits réservés

**Confidentialité** : Ce dashboard est propriétaire et réservé à l'usage interne de FEETI PLAY.

---

## ✨ CRÉDITS

**Développement** :
- Dashboard UI/UX
- Système de permissions
- Architecture frontend

**Technologies** :
- React 18
- TypeScript
- Tailwind CSS v4
- Motion (Framer Motion)
- React Router 7
- Lucide Icons

---

## 🎯 ROADMAP 2025

### Q1 2025 (Mars)
- [x] Version 1.0 Dashboard frontend
- [ ] Intégration Supabase
- [ ] Gestion utilisateurs

### Q2 2025 (Avril-Juin)
- [ ] CRM complet
- [ ] Notifications push Firebase
- [ ] Module finances
- [ ] Analytics avancés

### Q3 2025 (Juillet-Septembre)
- [ ] A/B Testing
- [ ] Machine Learning recommendations
- [ ] API publique
- [ ] Mobile app admin

### Q4 2025 (Octobre-Décembre)
- [ ] Reporting avancé
- [ ] Automatisations
- [ ] Intégrations tierces
- [ ] Multi-langue

---

**Dernière mise à jour** : 10 Mars 2025

**Version** : 1.0.0

**Statut** : ✅ Production-ready (Frontend) | 🚧 Backend required for full production
