# 🏗️ FEETI PLAY - Architecture Dashboard Admin

## 📊 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                     FEETI PLAY ADMIN DASHBOARD                  │
│                         (Frontend + Backend)                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Login      │  │   Dashboard  │  │   Events     │         │
│  │   /admin/    │→ │   Stats &    │→ │   Management │         │
│  │   login      │  │   Overview   │  │   CRUD       │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Users      │  │   CRM &      │  │   Push       │         │
│  │   Management │  │   Analytics  │  │   Notifs     │         │
│  │   (todo)     │  │   (todo)     │  │   (todo)     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Finances   │  │   Logs       │  │   Settings   │         │
│  │   Reports    │  │   System     │  │   Config     │         │
│  │   (todo)     │  │   Audit      │  │   (todo)     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕ API REST / GraphQL
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express + Prisma/PostgreSQL)         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Authentication Layer                     │  │
│  │  - JWT Tokens                                            │  │
│  │  - 2FA (TOTP)                                            │  │
│  │  - Session Management                                    │  │
│  │  - Role-Based Access Control (RBAC)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Business Logic                         │  │
│  │  - Events CRUD                                           │  │
│  │  - Users Management                                      │  │
│  │  - Notifications Scheduler                               │  │
│  │  - Analytics Processor                                   │  │
│  │  - Payment Handler                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Data Access Layer                      │  │
│  │  - ORM / Prisma                                          │  │
│  │  - Query Builder                                         │  │
│  │  - Caching (Redis)                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   users     │  │   events    │  │   tickets   │            │
│  │   profiles  │  │   metadata  │  │   purchases │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   logs      │  │   notifs    │  │   analytics │            │
│  │   audit     │  │   scheduled │  │   metrics   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Flux d'Authentification

```
┌────────────┐
│   Client   │
│  (Browser) │
└─────┬──────┘
      │
      │ 1. POST /auth/login
      │    { email, password }
      ↓
┌─────────────────────┐
│   Auth Service      │
│   - Vérif password  │
│   - Vérif 2FA       │
│   - Générer JWT     │
└─────┬───────────────┘
      │
      │ 2. Return JWT + Refresh Token
      │    { accessToken, refreshToken, user }
      ↓
┌────────────┐
│   Client   │
│  Stockage  │
│  localStorage
└─────┬──────┘
      │
      │ 3. Toutes les requêtes
      │    Headers: { Authorization: Bearer <JWT> }
      ↓
┌─────────────────────┐
│   API Middleware    │
│   - Verify JWT      │
│   - Check perms     │
│   - Rate limiting   │
└─────┬───────────────┘
      │
      │ 4. Access granted ✅
      ↓
┌─────────────────────┐
│   Protected Route   │
│   /admin/dashboard  │
└─────────────────────┘
```

---

## 📦 Structure des Dossiers

```
feeti-play/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── admin/                    # Pages admin
│   │   │   │   ├── AdminLogin.tsx        # ✅ Login page
│   │   │   │   ├── AdminLayout.tsx       # ✅ Sidebar layout
│   │   │   │   ├── AdminDashboard.tsx    # ✅ Main dashboard
│   │   │   │   ├── EventsManagement.tsx  # ✅ Events CRUD
│   │   │   │   ├── SystemLogs.tsx        # ✅ Logs viewer
│   │   │   │   └── index.ts              # Exports
│   │   │   │
│   │   │   ├── Home.tsx                  # Public home
│   │   │   ├── Live.tsx                  # Live events
│   │   │   └── ...                       # Other pages
│   │   │
│   │   ├── contexts/
│   │   │   ├── AdminAuthContext.tsx      # ✅ Auth state
│   │   │   └── FavoritesContext.tsx      # Favorites
│   │   │
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx        # ✅ Route guard
│   │   │   ├── Navbar.tsx                # Public navbar
│   │   │   └── ...                       # Other components
│   │   │
│   │   ├── config/
│   │   │   └── permissions.ts            # ✅ Roles config
│   │   │
│   │   ├── routes.ts                     # ✅ Router config
│   │   └── App.tsx                       # ✅ Root component
│   │
│   └── imports/                           # Figma imports
│
├── public/                                # Static assets
│
├── docs/                                  # Documentation
│   ├── QUICK_START.md                    # ✅ Quick start
│   ├── ADMIN_ACCESS.md                   # ✅ Access guide
│   ├── ADMIN_GUIDE.md                    # ✅ User guide
│   ├── BACKEND_DOCUMENTATION.md          # ✅ Backend doc
│   ├── DASHBOARD_README.md               # ✅ Overview
│   ├── INDEX_DOCUMENTATION.md            # ✅ Index
│   └── ARCHITECTURE.md                   # ✅ This file
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 🎯 Flux de Données

### Gestion des Événements

```
┌──────────────┐
│   Admin UI   │
│  Events Page │
└──────┬───────┘
       │
       │ 1. Create Event
       │    POST /api/events
       ↓
┌─────────────────┐
│   API Router    │
│  auth.required  │
└──────┬──────────┘
       │
       │ 2. Validate permissions
       │    hasPermission('manage_events')
       ↓
┌─────────────────┐
│  Event Service  │
│  - Validation   │
│  - Upload image │
│  - Create DB    │
└──────┬──────────┘
       │
       │ 3. Insert to DB
       ↓
┌─────────────────┐
│   PostgreSQL    │
│   events table  │
└──────┬──────────┘
       │
       │ 4. Log action
       ↓
┌─────────────────┐
│   Logs Service  │
│   admin_logs    │
└──────┬──────────┘
       │
       │ 5. Return success
       ↓
┌──────────────┐
│   Admin UI   │
│  Refresh list│
└──────────────┘
```

---

## 🔔 Système de Notifications

```
┌────────────────┐
│  Admin Creates │
│  Notification  │
└───────┬────────┘
        │
        │ Save to DB
        ↓
┌────────────────────┐
│  push_notifications│
│  status: scheduled │
└───────┬────────────┘
        │
        │ Cron Job (every minute)
        ↓
┌────────────────────┐
│  Notification      │
│  Scheduler         │
│  - Check scheduled │
│  - Get user tokens │
└───────┬────────────┘
        │
        │ Send to Firebase
        ↓
┌────────────────────┐
│  Firebase Cloud    │
│  Messaging (FCM)   │
└───────┬────────────┘
        │
        │ Push to devices
        ↓
┌────────────────────┐
│  User Devices      │
│  (Mobile/Web)      │
└────────────────────┘
```

---

## 💾 Schéma de Base de Données

```sql
┌──────────────────────────────────────────┐
│               Firebase Auth               │
│  (authentification uniquement — email/   │
│   mot de passe + Google OAuth)           │
├──────────────────────────────────────────┤
│  uid             STRING (Firebase UID)    │
│  email           TEXT UNIQUE              │
│  (mot de passe géré par Firebase)         │
└──────────────────┬───────────────────────┘
                   │
                   │ 1:1 (via firebaseUid)
                   ↓
┌──────────────────────────────────────────┐
│         User (table Prisma/PostgreSQL)    │
├──────────────────────────────────────────┤
│  id              UUID → référence firebaseUid │
│  role            TEXT (super_admin...)    │
│  full_name       TEXT                     │
│  avatar_url      TEXT                     │
│  phone           TEXT                     │
│  city            TEXT                     │
│  created_at      TIMESTAMP                │
│  updated_at      TIMESTAMP                │
└──────────────────┬───────────────────────┘
                   │
                   │ 1:N
                   ↓
┌──────────────────────────────────────────┐
│                events                     │
├──────────────────────────────────────────┤
│  id              UUID PRIMARY KEY         │
│  title           TEXT NOT NULL            │
│  description     TEXT                     │
│  category        TEXT                     │
│  location        TEXT                     │
│  date            DATE NOT NULL            │
│  time            TIME NOT NULL            │
│  price           DECIMAL(10,2)            │
│  reference       TEXT UNIQUE              │
│  image_url       TEXT                     │
│  video_url       TEXT                     │
│  status          TEXT (draft...)          │
│  max_attendees   INTEGER                  │
│  created_by      UUID → user_profiles(id) │
│  created_at      TIMESTAMP                │
│  updated_at      TIMESTAMP                │
└──────────────────┬───────────────────────┘
                   │
                   │ 1:N
                   ↓
┌──────────────────────────────────────────┐
│               tickets                     │
├──────────────────────────────────────────┤
│  id              UUID PRIMARY KEY         │
│  event_id        UUID → events(id)        │
│  user_id         UUID → user_profiles(id) │
│  user_name       TEXT                     │
│  user_email      TEXT                     │
│  user_phone      TEXT                     │
│  qr_code         TEXT UNIQUE              │
│  price_paid      DECIMAL(10,2)            │
│  status          TEXT (pending...)        │
│  purchased_at    TIMESTAMP                │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│             admin_logs                    │
├──────────────────────────────────────────┤
│  id              UUID PRIMARY KEY         │
│  user_id         UUID → user_profiles(id) │
│  user_email      TEXT                     │
│  user_role       TEXT                     │
│  action          TEXT NOT NULL            │
│  resource_type   TEXT                     │
│  resource_id     TEXT                     │
│  description     TEXT                     │
│  ip_address      INET                     │
│  user_agent      TEXT                     │
│  metadata        JSONB                    │
│  level           TEXT (info...)           │
│  created_at      TIMESTAMP                │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│         push_notifications                │
├──────────────────────────────────────────┤
│  id              UUID PRIMARY KEY         │
│  title           TEXT NOT NULL            │
│  body            TEXT NOT NULL            │
│  image_url       TEXT                     │
│  target_audience TEXT (all...)            │
│  custom_user_ids UUID[]                   │
│  scheduled_at    TIMESTAMP                │
│  sent_at         TIMESTAMP                │
│  success_count   INTEGER                  │
│  failure_count   INTEGER                  │
│  status          TEXT (draft...)          │
│  created_by      UUID → user_profiles(id) │
│  created_at      TIMESTAMP                │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│          user_analytics                   │
├──────────────────────────────────────────┤
│  id              UUID PRIMARY KEY         │
│  user_id         UUID → user_profiles(id) │
│  event_views     INTEGER DEFAULT 0        │
│  tickets_bought  INTEGER DEFAULT 0        │
│  total_spent     DECIMAL(10,2)            │
│  last_active_at  TIMESTAMP                │
│  created_at      TIMESTAMP                │
└──────────────────────────────────────────┘
```

---

## 🔒 Contrôle d'accès par rôle

Il n'y a pas de Row Level Security (RLS) au niveau de la base PostgreSQL — ce mécanisme n'a jamais été implémenté. Le contrôle d'accès par rôle (`super_admin`, `admin`, `moderator`, `finance`, `marketing`, ...) est appliqué au niveau applicatif, via les middlewares Express qui vérifient le rôle porté par le JWT interne avant d'exécuter les requêtes Prisma correspondantes (voir `back/src/middlewares/`).

---

## 📈 Monitoring & Observabilité

```
┌─────────────────────────────────────────┐
│          Application Layer               │
└────────┬───────────┬───────────┬────────┘
         │           │           │
         │           │           │
         ↓           ↓           ↓
    ┌────────┐  ┌────────┐  ┌────────┐
    │ Errors │  │  Logs  │  │Metrics │
    │ Sentry │  │Winston │  │Datadog │
    └───┬────┘  └───┬────┘  └───┬────┘
        │           │           │
        └───────────┴───────────┘
                    │
                    ↓
        ┌───────────────────────┐
        │   Centralized         │
        │   Dashboard           │
        │   - Grafana           │
        │   - Datadog           │
        │   - Custom Admin      │
        └───────────────────────┘
                    │
                    ↓
        ┌───────────────────────┐
        │   Alerting            │
        │   - Email             │
        │   - SMS (Twilio)      │
        │   - Slack             │
        │   - PagerDuty         │
        └───────────────────────┘
```

---

## 🔄 CI/CD Pipeline

```
┌──────────────┐
│  Developer   │
│  git push    │
└──────┬───────┘
       │
       │ trigger
       ↓
┌──────────────────┐
│   GitHub Actions │
│   /GitLab CI     │
└──────┬───────────┘
       │
       │ 1. Run tests
       ↓
┌──────────────────┐
│   Jest + Vitest  │
│   Unit tests     │
└──────┬───────────┘
       │
       │ 2. Build
       ↓
┌──────────────────┐
│   Vite build     │
│   TypeScript     │
└──────┬───────────┘
       │
       │ 3. Security scan
       ↓
┌──────────────────┐
│   npm audit      │
│   Snyk           │
└──────┬───────────┘
       │
       │ 4. Deploy
       ↓
┌──────────────────┐
│   Vercel/Netlify │
│   Production     │
└──────────────────┘
       │
       │ 5. Notify
       ↓
┌──────────────────┐
│   Slack/Email    │
│   Deploy success │
└──────────────────┘
```

---

## 🌐 Environnements

```
┌─────────────────────────────────────────┐
│           LOCAL (Development)            │
├─────────────────────────────────────────┤
│  URL: http://localhost:5173/admin       │
│  DB:  PostgreSQL local (Prisma)         │
│  Auth: Firebase Auth (émulateur/projet) │
│  Logs: Console + localStorage           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           STAGING (Pre-prod)             │
├─────────────────────────────────────────┤
│  URL: https://staging-admin.feetiplay.com│
│  DB:  PostgreSQL staging (hébergeur au choix)│
│  Auth: Firebase Auth (projet "feetiplay")│
│  Logs: Sentry (dev mode)                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           PRODUCTION                     │
├─────────────────────────────────────────┤
│  URL: https://admin.feetiplay.com       │
│  DB:  PostgreSQL production (Render)    │
│  Auth: Firebase Auth (projet "feetiplay")│
│  Logs: Sentry + Datadog                 │
│  CDN: Cloudflare                        │
│  Monitoring: Full observability         │
└─────────────────────────────────────────┘
```

---

## 🔐 Matrice de Sécurité

| Couche | Mesure | Statut | Priorité |
|--------|--------|--------|----------|
| **Network** | HTTPS (TLS 1.3) | 🚧 | P0 |
| **Network** | DDoS Protection (Cloudflare) | 🚧 | P0 |
| **Network** | Rate Limiting (100 req/min) | 🚧 | P0 |
| **Auth** | JWT avec expiration courte | 🚧 | P0 |
| **Auth** | 2FA (TOTP) | 🚧 | P1 |
| **Auth** | IP Whitelisting (Super Admin) | 🚧 | P2 |
| **API** | Input validation (Zod) | 🚧 | P0 |
| **API** | SQL Injection prevention | 🚧 | P0 |
| **API** | CORS strict | 🚧 | P0 |
| **DB** | Contrôle d'accès applicatif (middlewares, pas de RLS) | ✅ | P0 |
| **DB** | Encryption at rest | 🚧 | P0 |
| **DB** | Daily backups | 🚧 | P0 |
| **Logs** | Audit trail complet | ✅ | P0 |
| **Logs** | Centralized logging | 🚧 | P1 |
| **Code** | Dependencies scan (npm audit) | 🚧 | P1 |
| **Code** | Secret management (Vault) | 🚧 | P1 |

**Légende** : ✅ Implémenté | 🚧 À faire | P0 = Critique | P1 = Important | P2 = Nice to have

---

## 📊 Performances Cibles

| Métrique | Target | Actuel | Statut |
|----------|--------|--------|--------|
| **Time to First Byte (TTFB)** | < 200ms | TBD | 🚧 |
| **First Contentful Paint (FCP)** | < 1s | TBD | 🚧 |
| **Largest Contentful Paint (LCP)** | < 2.5s | TBD | 🚧 |
| **Time to Interactive (TTI)** | < 3s | TBD | 🚧 |
| **API Response Time** | < 200ms | TBD | 🚧 |
| **Database Query Time** | < 100ms | TBD | 🚧 |
| **Error Rate** | < 1% | TBD | 🚧 |
| **Uptime** | 99.9% | TBD | 🚧 |

---

## 🚀 Roadmap Technique

### Q1 2025 (Mars)
- [x] Frontend dashboard (React + TypeScript)
- [x] Système d'auth frontend (localStorage)
- [x] Pages principales (Dashboard, Events, Logs)
- [x] Backend Express + Prisma/PostgreSQL (`back/`)
- [x] Authentification Firebase Auth + JWT interne (access/refresh token)

### Q2 2025 (Avril-Juin)
- [ ] Gestion utilisateurs complète
- [ ] CRM & Analytics
- [ ] Notifications push (Firebase)
- [ ] Module finances
- [ ] Export de données

### Q3 2025 (Juillet-Septembre)
- [ ] A/B Testing
- [ ] Machine Learning (recommendations)
- [ ] API publique
- [ ] Webhooks

### Q4 2025 (Octobre-Décembre)
- [ ] Mobile app admin (React Native)
- [ ] Advanced reporting
- [ ] Automatisations
- [ ] Multi-langue

---

**Dernière mise à jour** : 10 Mars 2025  
**Version** : 1.0.0

© 2025 FEETI PLAY
