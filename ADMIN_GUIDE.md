# 👨‍💼 FEETI PLAY - Guide Administrateur

## 🎯 Bienvenue dans le Dashboard Admin

Ce guide vous aidera à comprendre et utiliser efficacement le dashboard administratif de FEETI PLAY.

---

## 🔐 ACCÈS DE DÉMONSTRATION

### Comptes de Test Disponibles

| Rôle | Email | Mot de passe | Permissions |
|------|-------|--------------|-------------|
| **Super Admin** | superadmin@feetiplay.com | `Super@123` | Accès complet à toutes les fonctionnalités |
| **Admin** | admin@feetiplay.com | `Admin@123` | Gestion événements, utilisateurs, CRM, notifications |
| **Modérateur** | moderator@feetiplay.com | `Mod@123` | Modération contenu, gestion événements |
| **Finance** | finance@feetiplay.com | `Finance@123` | Vue finances, analytics, rapports |
| **Marketing** | marketing@feetiplay.com | `Marketing@123` | CRM, envoi notifications, analytics |

---

## 🚀 ACCÈS AU DASHBOARD

### URL d'accès
```
http://localhost:5173/admin/login
```

### Première connexion

1. **Ouvrez la page de connexion** `/admin/login`
2. **Cliquez sur "Voir les accès de démo"**
3. **Choisissez le rôle** selon vos besoins
4. **Copiez les identifiants** affichés
5. **Connectez-vous**

---

## 📊 STRUCTURE DU DASHBOARD

### Navigation Principale

```
Dashboard (/)
├── 📈 Dashboard Principal
│   └── Vue d'ensemble, statistiques, activité récente
│
├── 📅 Gestion des Événements
│   ├── Liste des événements
│   ├── Création d'événement
│   ├── Modification
│   └── Suppression
│
├── 👥 Gestion des Utilisateurs
│   ├── Liste utilisateurs
│   ├── Gestion des rôles
│   ├── Modération
│   └── Statistiques
│
├── 📊 CRM & Analytics
│   ├── Métriques utilisateurs
│   ├── Taux de conversion
│   ├── Analyses comportementales
│   └── Rapports exportables
│
├── 🔔 Notifications Push
│   ├── Création notification
│   ├── Programmation
│   ├── Ciblage audience
│   └── Historique des envois
│
├── 💰 Finances
│   ├── Revenus & transactions
│   ├── Rapports financiers
│   ├── Statistiques de vente
│   └── Export comptabilité
│
├── 📝 Logs Système
│   ├── Historique actions
│   ├── Audit de sécurité
│   ├── Filtrage avancé
│   └── Export logs
│
└── ⚙️ Paramètres
    ├── Configuration système
    ├── Backup & restauration
    ├── Monitoring
    └── Gestion des rôles
```

---

## 🎭 RÔLES ET PERMISSIONS

### 1️⃣ Super Administrateur

**Permissions complètes** :
- ✅ Gestion totale des événements
- ✅ Gestion totale des utilisateurs
- ✅ Attribution/modification des rôles
- ✅ Accès aux finances
- ✅ Configuration système
- ✅ Backup & restauration
- ✅ Monitoring & logs
- ✅ Envoi notifications
- ✅ Gestion CRM

**Cas d'usage** :
- Configuration initiale de la plateforme
- Gestion des urgences
- Attribution des rôles aux autres admins
- Décisions stratégiques

---

### 2️⃣ Administrateur

**Permissions** :
- ✅ Gestion des événements (création, modification, suppression)
- ✅ Gestion des utilisateurs (modération, bannissement)
- ✅ CRM et analytics
- ✅ Envoi de notifications
- ✅ Consultation des logs
- ❌ Modification des rôles
- ❌ Configuration système
- ❌ Accès finances détaillé

**Cas d'usage** :
- Gestion quotidienne du contenu
- Modération de la plateforme
- Campagnes marketing
- Support utilisateur

---

### 3️⃣ Modérateur

**Permissions** :
- ✅ Modération du contenu événements
- ✅ Consultation des utilisateurs
- ✅ Consultation des logs
- ❌ Suppression d'événements
- ❌ Gestion des rôles
- ❌ Accès finances
- ❌ Envoi notifications

**Cas d'usage** :
- Validation des événements créés
- Modération des commentaires
- Vérification de la qualité du contenu
- Signalement des abus

---

### 4️⃣ Finance

**Permissions** :
- ✅ Vue complète des finances
- ✅ Rapports de ventes
- ✅ Export données comptables
- ✅ Consultation événements
- ✅ Consultation utilisateurs
- ✅ Consultation logs financiers
- ❌ Modification événements
- ❌ Envoi notifications

**Cas d'usage** :
- Suivi des revenus
- Rapports comptables
- Analyse financière
- Export vers outils comptables

---

### 5️⃣ Marketing & Growth

**Permissions** :
- ✅ Gestion CRM complète
- ✅ Envoi de notifications push
- ✅ Analytics & métriques
- ✅ Consultation événements
- ✅ Consultation utilisateurs
- ❌ Modification événements
- ❌ Accès finances détaillé
- ❌ Configuration système

**Cas d'usage** :
- Campagnes de communication
- Segmentation utilisateurs
- A/B testing notifications
- Analyse croissance

---

## 📋 FONCTIONNALITÉS DÉTAILLÉES

### 1. Gestion des Événements

#### Créer un événement

1. Cliquer sur **"Événements"** dans le menu
2. Cliquer sur **"Nouvel événement"**
3. Remplir le formulaire :
   - **Titre** : Nom de l'événement
   - **Date et heure** : Programmation
   - **Lieu** : Stade/Localisation
   - **Catégorie** : Sport concerné
   - **Prix** : En FCFA (0 pour gratuit)
   - **Description** : Détails de l'événement
   - **Image** : Upload ou URL
4. Choisir le **statut** :
   - 📝 Brouillon (non visible)
   - ✅ Publié (visible utilisateurs)
   - 🔴 En direct (live)
   - ⏹️ Terminé (archivé)
5. Cliquer sur **"Publier"**

#### Modifier un événement

1. Trouver l'événement dans la liste
2. Cliquer sur l'icône **✏️ Modifier**
3. Effectuer les modifications
4. Sauvegarder

#### Supprimer un événement

⚠️ **Action irréversible** (Super Admin / Admin uniquement)

1. Cliquer sur l'icône **🗑️ Supprimer**
2. Confirmer la suppression
3. L'événement sera archivé (soft delete recommandé)

---

### 2. Gestion des Utilisateurs

#### Consulter les utilisateurs

- **Liste complète** avec filtres
- **Recherche** par nom/email
- **Filtrage** par statut, rôle, date d'inscription

#### Modifier un rôle (Super Admin uniquement)

1. Sélectionner l'utilisateur
2. Cliquer sur **"Modifier le rôle"**
3. Choisir le nouveau rôle
4. Confirmer
5. ✅ Log automatique créé

#### Bannir un utilisateur

1. Cliquer sur **"Actions" → "Bannir"**
2. Indiquer la raison
3. Confirmer
4. L'utilisateur ne pourra plus se connecter

---

### 3. Envoi de Notifications Push

#### Créer une notification

1. Aller dans **"Notifications"**
2. Cliquer sur **"Nouvelle notification"**
3. Remplir :
   - **Titre** (60 caractères max)
   - **Message** (160 caractères max)
   - **Image** (optionnel)
4. Choisir **l'audience** :
   - 🌍 Tous les utilisateurs
   - 🎯 Abonnés d'un événement
   - 👥 Liste personnalisée
5. **Programmer** ou **Envoyer immédiatement**

#### Programmer une notification

1. Cocher **"Programmer l'envoi"**
2. Sélectionner date et heure
3. Sauvegarder
4. La notification s'enverra automatiquement

---

### 4. CRM & Analytics

#### Métriques disponibles

**Dashboard principal** :
- 📊 Utilisateurs actifs
- 📅 Événements en ligne
- 💰 Revenus du mois
- 🎫 Tickets vendus

**Analytics détaillées** :
- Taux de conversion
- Parcours utilisateur
- Événements les plus vus
- Horaires de pic d'activité
- Géolocalisation des utilisateurs

#### Exporter les données

1. Cliquer sur **"Export"**
2. Choisir le format (CSV, Excel, JSON)
3. Sélectionner la période
4. Télécharger

---

### 5. Finances

#### Consulter les revenus

- **Vue d'ensemble** : Revenus totaux
- **Par événement** : Détail des ventes
- **Par période** : Graphiques évolution
- **Transactions** : Liste complète

#### Générer un rapport

1. Sélectionner la période
2. Choisir les métriques
3. Cliquer sur **"Générer rapport"**
4. Export PDF ou Excel

---

### 6. Logs Système

#### Consulter les logs

- **Recherche** par action, utilisateur, date
- **Filtrage** par niveau (Info, Warning, Error)
- **Export** pour audit externe

#### Niveaux de logs

- 🔵 **Info** : Actions normales
- 🟡 **Warning** : Actions à surveiller
- 🔴 **Error** : Erreurs système
- ⚫ **Critical** : Alertes urgentes

---

## 🛡️ BONNES PRATIQUES

### Sécurité

1. ✅ **Ne jamais partager vos identifiants**
2. ✅ **Déconnectez-vous après chaque session**
3. ✅ **Utilisez un mot de passe fort** (12+ caractères)
4. ✅ **Activez la double authentification** (2FA)
5. ✅ **Vérifiez les logs** régulièrement
6. ✅ **Signalez toute activité suspecte**

### Gestion du contenu

1. ✅ **Vérifiez les informations** avant publication
2. ✅ **Utilisez des images de qualité**
3. ✅ **Testez sur mobile** avant publication
4. ✅ **Programmez les événements** à l'avance
5. ✅ **Archivez les événements terminés**

### Communication

1. ✅ **Personnalisez les notifications**
2. ✅ **Évitez le spam** (max 2 notifications/jour)
3. ✅ **Segmentez votre audience**
4. ✅ **Testez avant envoi massif**
5. ✅ **Analysez les taux d'ouverture**

---

## 🆘 RÉSOLUTION DE PROBLÈMES

### Problème : "Permission refusée"

**Cause** : Votre rôle n'a pas accès à cette fonctionnalité

**Solution** :
1. Vérifiez votre rôle (coin supérieur gauche)
2. Contactez un Super Admin si besoin d'élévation

---

### Problème : "Session expirée"

**Cause** : Inactivité > 24 heures

**Solution** :
1. Reconnectez-vous avec vos identifiants
2. Vos données non sauvegardées seront perdues

---

### Problème : "Événement non visible"

**Cause** : Statut "Brouillon" ou date passée

**Solution** :
1. Vérifiez le statut de l'événement
2. Passez-le en "Publié"
3. Vérifiez la date de l'événement

---

### Problème : "Notification non envoyée"

**Cause** : Erreur réseau ou audience vide

**Solution** :
1. Vérifiez la connexion internet
2. Vérifiez que l'audience n'est pas vide
3. Consultez les logs pour détails

---

## 📞 SUPPORT TECHNIQUE

### Contacts

**Support Technique** :
- 📧 Email : support@feetiplay.com
- 📱 Téléphone : +242 06 XXX XX XX
- 💬 Chat : Disponible dans le dashboard (coin inférieur droit)

**Horaires** :
- Lundi - Vendredi : 8h - 18h (GMT+1)
- Weekend : Support d'urgence uniquement

### Urgences

**Problème critique** (site down, perte de données) :
- 🚨 Hotline 24/7 : +242 06 YYY YY YY
- 📧 Email urgent : urgent@feetiplay.com

---

## 📚 RESSOURCES ADDITIONNELLES

### Documentation Technique

- 📖 [Documentation Backend](/BACKEND_DOCUMENTATION.md)
- 🔧 [Guide d'intégration API](#)
- 🎨 [Charte graphique](#)
- 📊 [Guide Analytics](#)

### Formation

- 🎓 **Formation initiale** : 2 heures (obligatoire)
- 📹 **Vidéos tutoriels** : Disponibles dans le dashboard
- 📝 **Webinaires mensuels** : Nouvelles fonctionnalités

---

## ✅ CHECKLIST QUOTIDIENNE ADMIN

### Matin (9h)

- [ ] Vérifier les logs de la nuit
- [ ] Consulter les nouveaux utilisateurs
- [ ] Vérifier les événements du jour
- [ ] Consulter le dashboard analytics

### Après-midi (15h)

- [ ] Modérer le nouveau contenu
- [ ] Répondre aux signalements
- [ ] Préparer les notifications du soir
- [ ] Mettre à jour les événements

### Soir (18h)

- [ ] Vérifier les ventes du jour
- [ ] Consulter les logs d'erreurs
- [ ] Programmer les notifications lendemain
- [ ] Backup manuel si nécessaire

---

## 🎉 CONCLUSION

Ce dashboard vous donne tous les outils pour gérer efficacement FEETI PLAY. N'hésitez pas à explorer toutes les fonctionnalités et à contacter le support en cas de question.

**Bon travail ! 🚀**

---

## 📄 CHANGELOG

### Version 1.0.0 (Mars 2025)
- ✅ Lancement initial du dashboard
- ✅ Gestion événements complète
- ✅ Système de rôles 5 niveaux
- ✅ CRM & Analytics
- ✅ Notifications push
- ✅ Logs système

---

© 2025 FEETI PLAY - Tous droits réservés
