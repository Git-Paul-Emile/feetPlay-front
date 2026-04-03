# 🔐 Accès Dashboard Administrateur - FEETI PLAY

## 🚀 Accès Rapide

### URL du Dashboard
```
http://localhost:5173/admin/login
```

---

## 👥 COMPTES DE DÉMONSTRATION

### 🔴 Super Administrateur
**Accès complet à toutes les fonctionnalités**

```
Email    : superadmin@feetiplay.com
Password : Super@123
```

**Permissions** :
- ✅ Gestion totale événements
- ✅ Gestion totale utilisateurs
- ✅ Attribution/modification rôles
- ✅ Finances complètes
- ✅ Configuration système
- ✅ Backup & restauration
- ✅ Monitoring & logs
- ✅ Envoi notifications
- ✅ CRM & Analytics

---

### 🟢 Administrateur
**Gestion quotidienne de la plateforme**

```
Email    : admin@feetiplay.com
Password : Admin@123
```

**Permissions** :
- ✅ Gestion événements
- ✅ Gestion utilisateurs
- ✅ CRM & Analytics
- ✅ Envoi notifications
- ✅ Consultation logs
- ❌ Modification rôles
- ❌ Configuration système

---

### 🟡 Modérateur
**Modération du contenu**

```
Email    : moderator@feetiplay.com
Password : Mod@123
```

**Permissions** :
- ✅ Modération événements
- ✅ Consultation utilisateurs
- ✅ Consultation logs
- ❌ Suppression contenu
- ❌ Gestion rôles

---

### 💰 Finance
**Gestion financière et rapports**

```
Email    : finance@feetiplay.com
Password : Finance@123
```

**Permissions** :
- ✅ Vue complète finances
- ✅ Rapports de ventes
- ✅ Export comptable
- ✅ Consultation événements
- ❌ Modification contenu

---

### 📈 Marketing & Growth
**Communication et analytics**

```
Email    : marketing@feetiplay.com
Password : Marketing@123
```

**Permissions** :
- ✅ Gestion CRM
- ✅ Envoi notifications
- ✅ Analytics & métriques
- ✅ Consultation événements
- ❌ Modification contenu

---

## 📱 GUIDE DE CONNEXION

### Étape 1 : Accéder à la page de connexion

Ouvrez votre navigateur et allez sur :
```
http://localhost:5173/admin/login
```

### Étape 2 : Voir les identifiants de démo

Cliquez sur le bouton **"▶ Voir les accès de démo"** en bas du formulaire.

### Étape 3 : Copier les identifiants

Choisissez le rôle souhaité et copiez :
- L'email
- Le mot de passe

### Étape 4 : Se connecter

1. Collez l'email dans le champ **"Adresse email"**
2. Collez le mot de passe dans le champ **"Mot de passe"**
3. Cliquez sur **"Se connecter"**

### Étape 5 : Accéder au dashboard

Vous serez automatiquement redirigé vers :
```
http://localhost:5173/admin/dashboard
```

---

## 🎯 PAGES DISPONIBLES

### ✅ Fonctionnelles

| Page | URL | Description |
|------|-----|-------------|
| **Connexion** | `/admin/login` | Page d'authentification |
| **Dashboard** | `/admin/dashboard` | Vue d'ensemble avec stats |
| **Événements** | `/admin/events` | Gestion complète des événements |
| **Logs** | `/admin/logs` | Historique des actions |

### 🚧 En construction

| Page | URL | Description |
|------|-----|-------------|
| **Utilisateurs** | `/admin/users` | Gestion des utilisateurs |
| **CRM** | `/admin/crm` | CRM & Analytics |
| **Notifications** | `/admin/notifications` | Envoi de notifications push |
| **Finances** | `/admin/finances` | Gestion financière |
| **Paramètres** | `/admin/settings` | Configuration système |

---

## 🔒 SÉCURITÉ

### Stockage des sessions

Les sessions sont stockées dans `localStorage` :
```javascript
localStorage.getItem('admin_user')
```

### Logs des actions

Toutes les actions admin sont enregistrées dans :
```javascript
localStorage.getItem('admin_logs')
```

### Déconnexion automatique

La session expire après **24 heures** d'inactivité.

---

## 🛠️ FONCTIONNALITÉS ACTUELLES

### ✅ Dashboard Principal
- Vue d'ensemble avec 4 statistiques principales
- Graphiques d'activité récente
- Liste des événements récents
- Timeline des actions utilisateurs

### ✅ Gestion des Événements
- Liste avec recherche et filtres
- Création d'événements (formulaire complet)
- Modification d'événements
- Suppression d'événements
- Gestion des statuts (Brouillon, Publié, Live, Terminé)

### ✅ Système de Logs
- Historique complet des actions
- Filtrage par niveau (Info, Warning, Error)
- Recherche dans les logs
- Export JSON des logs
- Statistiques par niveau

### ✅ Authentification
- Login sécurisé
- Gestion des rôles
- Permissions granulaires
- Vérification des accès par page

---

## 📊 PROCHAINES ÉTAPES

### Phase 2 : Gestion Utilisateurs
- [ ] Liste complète des utilisateurs
- [ ] Modification des rôles
- [ ] Bannissement/Débannissement
- [ ] Statistiques par utilisateur

### Phase 3 : CRM & Analytics
- [ ] Dashboard analytics complet
- [ ] Segmentation utilisateurs
- [ ] Rapports exportables
- [ ] Graphiques interactifs

### Phase 4 : Notifications Push
- [ ] Interface de création
- [ ] Programmation d'envoi
- [ ] Ciblage d'audience
- [ ] Statistiques d'ouverture

### Phase 5 : Finances
- [ ] Vue des transactions
- [ ] Rapports de ventes
- [ ] Export comptable
- [ ] Graphiques revenus

---

## 🔐 BACKEND À IMPLÉMENTER

Pour passer en production, vous devrez implémenter :

### 1. API Backend
- Authentification JWT
- CRUD événements
- CRUD utilisateurs
- Gestion des permissions

### 2. Base de données
- PostgreSQL (recommandé)
- Tables : users, events, tickets, logs, notifications
- Row Level Security (RLS)

### 3. Stockage fichiers
- AWS S3 ou Supabase Storage
- Upload images/vidéos
- Backup automatique

### 4. Monitoring
- Sentry (erreurs)
- Datadog (APM)
- Logs centralisés

Consultez [BACKEND_DOCUMENTATION.md](/BACKEND_DOCUMENTATION.md) pour les détails complets.

---

## 🆘 SUPPORT

### En cas de problème

1. **Vérifiez la console du navigateur** (F12)
2. **Consultez les logs** dans `/admin/logs`
3. **Vérifiez votre rôle** (coin supérieur gauche du dashboard)

### Contacts

- 📧 Email : support@feetiplay.com
- 📱 Téléphone : +242 06 XXX XX XX
- 📖 Documentation : [ADMIN_GUIDE.md](/ADMIN_GUIDE.md)

---

## 📝 NOTES IMPORTANTES

### ⚠️ Version Frontend-Only

Cette version du dashboard est **frontend-only** pour démonstration. 

**Limitations actuelles** :
- ❌ Pas de persistance réelle (données en `localStorage`)
- ❌ Pas d'envoi de notifications réelles
- ❌ Pas de backup automatique
- ❌ Pas d'intégration paiement

**Pour la production** :
- ✅ Intégrez Supabase ou votre backend
- ✅ Implémentez l'authentification sécurisée
- ✅ Configurez la base de données
- ✅ Activez les backups automatiques

### 🔄 Migration vers Production

Suivez le guide [BACKEND_DOCUMENTATION.md](/BACKEND_DOCUMENTATION.md) pour :
1. Configuration Supabase
2. Structure base de données
3. Politiques de sécurité (RLS)
4. Intégration Firebase (notifications)
5. Configuration monitoring

---

## ✅ CHECKLIST AVANT PRODUCTION

- [ ] Backend API implémenté
- [ ] Base de données configurée
- [ ] Authentification forte activée (2FA)
- [ ] HTTPS configuré
- [ ] Backup automatique activé
- [ ] Monitoring en place
- [ ] Logs centralisés
- [ ] Mots de passe changés
- [ ] Variables d'environnement sécurisées
- [ ] Tests de charge effectués

---

## 🎉 PROFITEZ DU DASHBOARD !

Vous avez maintenant accès à un dashboard administratif complet pour FEETI PLAY.

**Bonnes pratiques** :
- ✅ Testez avec différents rôles
- ✅ Explorez toutes les fonctionnalités
- ✅ Consultez régulièrement les logs
- ✅ Utilisez les filtres de recherche
- ✅ Exportez les données importantes

---

© 2025 FEETI PLAY - Dashboard Administratif v1.0.0
