# 📚 FEETI PLAY - Documentation Backend & Sécurité

## 🏗️ Architecture du Dashboard Administratif

Cette documentation décrit l'architecture backend nécessaire pour mettre en production le dashboard administratif de FEETI PLAY.

---

## 🔐 1. SYSTÈME D'AUTHENTIFICATION FORTE

### 1.1 Technologies Recommandées

**Supabase Auth** (Recommandé) :
- Authentification multi-facteurs (2FA)
- OAuth providers (Google, Facebook, Apple)
- Magic Links par email
- Row Level Security (RLS)
- Sessions sécurisées avec JWT

**Alternative - NextAuth.js** :
- Compatible avec multiple providers
- Sessions côté serveur
- CSRF protection

### 1.2 Configuration de Sécurité

```typescript
// Exemple Supabase Auth
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Login avec MFA
async function loginWithMFA(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (data.user && !data.user.confirmed_at) {
    // Exiger la vérification 2FA
    await supabase.auth.mfa.enroll({
      factorType: 'totp',
    });
  }
  
  return { data, error };
}
```

### 1.3 Politiques de Mots de Passe

**Exigences minimales** :
- Minimum 12 caractères
- Au moins 1 majuscule
- Au moins 1 minuscule
- Au moins 1 chiffre
- Au moins 1 caractère spécial
- Pas de mots du dictionnaire
- Historique des 10 derniers mots de passe

### 1.4 Gestion des Sessions

```typescript
// Configuration session
{
  maxAge: 24 * 60 * 60, // 24 heures
  updateAge: 60 * 60,   // Rafraîchir toutes les heures
  secure: true,         // HTTPS uniquement
  httpOnly: true,       // Pas d'accès JavaScript
  sameSite: 'strict',   // Protection CSRF
}
```

---

## 🛡️ 2. SYSTÈME DE RÔLES & PERMISSIONS

### 2.1 Hiérarchie des Rôles

```typescript
enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  FINANCE = 'finance',
  MARKETING = 'marketing',
}

// Matrice de permissions
const PERMISSIONS_MATRIX = {
  super_admin: [
    'manage_all',
    'manage_users',
    'manage_roles',
    'manage_events',
    'manage_finances',
    'manage_crm',
    'send_notifications',
    'view_logs',
    'manage_backup',
    'manage_monitoring',
    'manage_settings',
  ],
  admin: [
    'manage_events',
    'manage_users',
    'manage_crm',
    'send_notifications',
    'view_logs',
  ],
  moderator: [
    'manage_events',
    'view_users',
    'view_logs',
  ],
  finance: [
    'view_finances',
    'view_events',
    'view_users',
    'view_logs',
  ],
  marketing: [
    'manage_crm',
    'send_notifications',
    'view_events',
    'view_users',
  ],
};
```

### 2.2 Row Level Security (RLS) - Supabase

```sql
-- Politique RLS pour la table events
CREATE POLICY "Super admins can do anything"
  ON events
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'super_admin'
  );

CREATE POLICY "Admins can manage events"
  ON events
  FOR ALL
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'moderator')
  );

CREATE POLICY "Finance can only read events"
  ON events
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'finance'
  );
```

### 2.3 Middleware de Vérification

```typescript
// Middleware Express/Next.js
export async function requirePermission(permission: string) {
  return async (req, res, next) => {
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    
    const userPermissions = PERMISSIONS_MATRIX[user.role] || [];
    
    if (!userPermissions.includes(permission) && !userPermissions.includes('manage_all')) {
      return res.status(403).json({ error: 'Permission refusée' });
    }
    
    next();
  };
}

// Utilisation
app.post('/api/events', requirePermission('manage_events'), createEvent);
```

---

## 📝 3. SYSTÈME DE LOGS

### 3.1 Structure de la Table Logs

```sql
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  user_role TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  description TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  level TEXT CHECK (level IN ('info', 'warning', 'error', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_logs_user_id ON admin_logs(user_id);
CREATE INDEX idx_logs_action ON admin_logs(action);
CREATE INDEX idx_logs_created_at ON admin_logs(created_at DESC);
CREATE INDEX idx_logs_level ON admin_logs(level);
```

### 3.2 Fonction de Logging

```typescript
interface LogEntry {
  action: string;
  resourceType?: string;
  resourceId?: string;
  description: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  metadata?: Record<string, any>;
}

async function createLog(userId: string, entry: LogEntry, req: Request) {
  const { data, error } = await supabase
    .from('admin_logs')
    .insert({
      user_id: userId,
      action: entry.action,
      resource_type: entry.resourceType,
      resource_id: entry.resourceId,
      description: entry.description,
      level: entry.level,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      metadata: entry.metadata,
    });
    
  return { data, error };
}

// Utilisation
await createLog(user.id, {
  action: 'event.create',
  resourceType: 'event',
  resourceId: newEvent.id,
  description: `Événement "${newEvent.title}" créé`,
  level: 'info',
  metadata: { eventType: newEvent.category },
}, req);
```

### 3.3 Actions à Logger

**Actions critiques** :
- ✅ Connexion/Déconnexion
- ✅ Modification de rôle utilisateur
- ✅ Création/Suppression d'événement
- ✅ Modification de prix
- ✅ Envoi de notifications push
- ✅ Export de données
- ✅ Modification des paramètres système
- ✅ Accès aux données financières
- ✅ Tentatives de connexion échouées

---

## 💾 4. SYSTÈME DE BACKUP

### 4.1 Stratégie de Backup

**Supabase** (Backup automatique) :
- Point-in-Time Recovery (PITR) : 7 jours
- Snapshots quotidiens : 30 jours
- Export manuel à la demande

**Configuration manuelle** :

```bash
# Backup PostgreSQL quotidien
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
  | gzip > backups/feeti_backup_$DATE.sql.gz

# Upload vers S3
aws s3 cp backups/feeti_backup_$DATE.sql.gz \
  s3://feeti-backups/daily/

# Nettoyer les backups > 30 jours
find backups/ -name "*.sql.gz" -mtime +30 -delete
```

### 4.2 Script de Restauration

```bash
#!/bin/bash
# Restaurer depuis le dernier backup
LATEST_BACKUP=$(ls -t backups/*.sql.gz | head -1)

echo "Restauration depuis: $LATEST_BACKUP"
gunzip -c $LATEST_BACKUP | psql -h $DB_HOST -U $DB_USER -d $DB_NAME
```

### 4.3 Backup des Médias

```typescript
// Backup des images/vidéos vers S3
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

async function backupMedia(fileUrl: string) {
  const s3 = new S3Client({ region: 'eu-west-1' });
  
  const response = await fetch(fileUrl);
  const buffer = await response.arrayBuffer();
  
  await s3.send(new PutObjectCommand({
    Bucket: 'feeti-media-backup',
    Key: `backups/${Date.now()}_${path.basename(fileUrl)}`,
    Body: Buffer.from(buffer),
  }));
}
```

---

## 📊 5. MONITORING & ALERTES

### 5.1 Métriques à Surveiller

**Performances** :
- Temps de réponse API (< 200ms)
- Taux d'erreur (< 1%)
- CPU usage (< 70%)
- RAM usage (< 80%)
- Database queries (< 100ms)

**Business** :
- Nombre de connexions actives
- Événements publiés/jour
- Transactions/heure
- Taux de conversion
- Revenus temps réel

### 5.2 Configuration Sentry (Monitoring Erreurs)

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
  ],
});

// Capturer les erreurs
app.use(Sentry.Handlers.errorHandler());
```

### 5.3 Configuration Datadog (APM)

```typescript
import tracer from 'dd-trace';

tracer.init({
  service: 'feeti-api',
  env: process.env.NODE_ENV,
  analytics: true,
  runtimeMetrics: true,
});

// Auto-instrumentation
tracer.use('express');
tracer.use('pg');
tracer.use('redis');
```

### 5.4 Alertes Email/SMS

```typescript
// Envoyer alerte critique
async function sendCriticalAlert(message: string, metadata: any) {
  // Email
  await sendEmail({
    to: 'admin@feetiplay.com',
    subject: '🚨 ALERTE CRITIQUE - FEETI PLAY',
    body: `${message}\n\nDétails: ${JSON.stringify(metadata, null, 2)}`,
  });
  
  // SMS (Twilio)
  await twilioClient.messages.create({
    to: '+242064000000',
    from: process.env.TWILIO_NUMBER,
    body: `[FEETI] ${message}`,
  });
  
  // Slack
  await slackClient.chat.postMessage({
    channel: '#alerts',
    text: `:rotating_light: ${message}`,
  });
}

// Déclencher sur erreur critique
if (error.level === 'critical') {
  await sendCriticalAlert('Base de données inaccessible', {
    error: error.message,
    timestamp: new Date().toISOString(),
  });
}
```

---

## 🔔 6. NOTIFICATIONS PUSH

### 6.1 Configuration Firebase Cloud Messaging

```typescript
import admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

// Envoyer notification
async function sendPushNotification(
  userTokens: string[],
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
    data?: Record<string, string>;
  }
) {
  const message = {
    notification: {
      title: notification.title,
      body: notification.body,
      imageUrl: notification.imageUrl,
    },
    data: notification.data || {},
    tokens: userTokens,
  };
  
  const response = await admin.messaging().sendMulticast(message);
  
  console.log(`${response.successCount} notifications envoyées`);
  console.log(`${response.failureCount} échecs`);
  
  return response;
}
```

### 6.2 Table de Gestion des Notifications

```sql
CREATE TABLE push_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  target_audience TEXT CHECK (target_audience IN ('all', 'event_subscribers', 'custom')),
  custom_user_ids UUID[],
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.3 Envoi Programmé

```typescript
// Cron job pour les notifications programmées
import cron from 'node-cron';

cron.schedule('* * * * *', async () => {
  const { data: notifications } = await supabase
    .from('push_notifications')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString());
    
  for (const notif of notifications) {
    try {
      // Récupérer les tokens utilisateurs
      const tokens = await getUserTokens(notif.target_audience, notif.custom_user_ids);
      
      const response = await sendPushNotification(tokens, notif);
      
      await supabase
        .from('push_notifications')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          success_count: response.successCount,
          failure_count: response.failureCount,
        })
        .eq('id', notif.id);
    } catch (error) {
      await supabase
        .from('push_notifications')
        .update({ status: 'failed' })
        .eq('id', notif.id);
    }
  }
});
```

---

## 🗄️ 7. STRUCTURE BASE DE DONNÉES

### 7.1 Schéma Complet

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'user',
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  city TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  location TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  price DECIMAL(10,2),
  reference TEXT UNIQUE NOT NULL,
  image_url TEXT,
  video_url TEXT,
  status TEXT CHECK (status IN ('draft', 'published', 'live', 'ended')),
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets/Purchases table
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  user_email TEXT,
  user_phone TEXT,
  qr_code TEXT UNIQUE,
  price_paid DECIMAL(10,2),
  status TEXT CHECK (status IN ('pending', 'paid', 'used', 'cancelled')),
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Analytics table
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_views INTEGER DEFAULT 0,
  tickets_purchased INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔒 8. CHECKLIST SÉCURITÉ

### 8.1 Configuration Serveur

- [ ] HTTPS uniquement (TLS 1.3)
- [ ] Headers de sécurité (HSTS, CSP, X-Frame-Options)
- [ ] Rate limiting (100 req/min par IP)
- [ ] CORS configuré strictement
- [ ] Firewall activé (UFW/AWS Security Groups)
- [ ] Fail2ban pour attaques brute-force
- [ ] DDoS protection (Cloudflare)

### 8.2 Code & API

- [ ] Validation des inputs (Zod/Joi)
- [ ] Sanitization des données
- [ ] Prepared statements (SQL injection)
- [ ] JWT avec expiration courte
- [ ] Secrets stockés dans variables d'environnement
- [ ] Dependencies régulièrement mises à jour
- [ ] Audit de sécurité avec npm audit

### 8.3 Base de Données

- [ ] Row Level Security (RLS) activée
- [ ] Backups automatiques quotidiens
- [ ] Chiffrement au repos
- [ ] Accès limité par IP
- [ ] Mots de passe forts + rotation
- [ ] Monitoring des requêtes lentes

---

## 📦 9. DÉPLOIEMENT

### 9.1 Variables d'Environnement Requises

```bash
# Database
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx

# Auth
JWT_SECRET=xxx
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=https://admin.feetiplay.com

# Firebase (Push Notifications)
FIREBASE_PROJECT_ID=xxx
FIREBASE_CLIENT_EMAIL=xxx
FIREBASE_PRIVATE_KEY=xxx

# AWS S3 (Backups)
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=feeti-backups

# Monitoring
SENTRY_DSN=xxx
DATADOG_API_KEY=xxx

# Emails
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASSWORD=xxx

# SMS
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_NUMBER=+1234567890
```

### 9.2 Docker Compose (Production)

```yaml
version: '3.8'

services:
  app:
    image: feeti-admin:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - redis
    restart: always
    
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: always
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: always

volumes:
  redis_data:
```

---

## 📞 SUPPORT & CONTACT

**Équipe Technique FEETI PLAY**
- Email: tech@feetiplay.com
- Téléphone: +242 06 XXX XX XX
- Slack: #feeti-tech

**En cas d'urgence** :
- Super Admin: +242 06 YYY YY YY
- Hotline 24/7: +242 06 ZZZ ZZ ZZ

---

## 📄 LICENCE

© 2025 FEETI PLAY - Tous droits réservés

Cette documentation est confidentielle et réservée à l'usage interne de FEETI PLAY.
