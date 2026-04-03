import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';

// Pages chargées immédiatement (légères / critiques)
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Admin imports
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Lazy load des pages légales
const TermsOfServiceLazy = lazy(() => import('./pages/legal/TermsOfService').then(m => ({ default: m.TermsOfService })));
const PrivacyPolicyLazy  = lazy(() => import('./pages/legal/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const CookiePolicyLazy   = lazy(() => import('./pages/legal/CookiePolicy').then(m => ({ default: m.CookiePolicy })));
const LegalNoticeLazy    = lazy(() => import('./pages/legal/LegalNotice').then(m => ({ default: m.LegalNotice })));
const RefundPolicyLazy   = lazy(() => import('./pages/legal/RefundPolicy').then(m => ({ default: m.RefundPolicy })));
const FAQLazy            = lazy(() => import('./pages/legal/FAQ').then(m => ({ default: m.FAQ })));

// Lazy load des pages lourdes — pattern identique à feeti2
const LiveLazy           = lazy(() => import('./pages/Live').then(m => ({ default: m.Live })));
const ReplayLazy         = lazy(() => import('./pages/Replay').then(m => ({ default: m.Replay })));
const ChainesLazy        = lazy(() => import('./pages/Chaines').then(m => ({ default: m.Chaines })));
const AgendaLazy         = lazy(() => import('./pages/Agenda').then(m => ({ default: m.Agenda })));
const FavoritesLazy      = lazy(() => import('./pages/Favorites').then(m => ({ default: m.Favorites })));
const EventDetailLazy    = lazy(() => import('./pages/EventDetail').then(m => ({ default: m.EventDetail })));
const EventListLazy      = lazy(() => import('./pages/EventList').then(m => ({ default: m.EventList })));
const SearchResultsLazy  = lazy(() => import('./pages/SearchResults').then(m => ({ default: m.SearchResults })));

// Lazy load admin sous-pages
const EventsManagementLazy = lazy(() => import('./pages/admin/EventsManagement').then(m => ({ default: m.EventsManagement })));
const SystemLogsLazy       = lazy(() => import('./pages/admin/SystemLogs').then(m => ({ default: m.SystemLogs })));

// Spinner de chargement commun
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// HOC Suspense — pattern feeti2
function withSuspense<P extends object>(Component: ComponentType<P>) {
  return function SuspenseWrapper(props: P) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// Composants lazy wrappés
const Live           = withSuspense(LiveLazy);
const Replay         = withSuspense(ReplayLazy);
const Chaines        = withSuspense(ChainesLazy);
const Agenda         = withSuspense(AgendaLazy);
const Favorites      = withSuspense(FavoritesLazy);
const EventDetail    = withSuspense(EventDetailLazy);
const EventList      = withSuspense(EventListLazy);
const SearchResults  = withSuspense(SearchResultsLazy);
const EventsManagement = withSuspense(EventsManagementLazy);
const SystemLogs       = withSuspense(SystemLogsLazy);

// Pages légales wrappées
const TermsOfService = withSuspense(TermsOfServiceLazy);
const PrivacyPolicy  = withSuspense(PrivacyPolicyLazy);
const CookiePolicy   = withSuspense(CookiePolicyLazy);
const LegalNotice    = withSuspense(LegalNoticeLazy);
const RefundPolicy   = withSuspense(RefundPolicyLazy);
const FAQ            = withSuspense(FAQLazy);

// Placeholders pour les pages en construction
function UsersPlaceholder() {
  return <div className="p-8 text-white">Gestion des utilisateurs - En construction</div>;
}
function CRMPlaceholder() {
  return <div className="p-8 text-white">CRM & Analytics - En construction</div>;
}
function NotificationsPlaceholder() {
  return <div className="p-8 text-white">Notifications Push - En construction</div>;
}
function FinancesPlaceholder() {
  return <div className="p-8 text-white">Finances - En construction</div>;
}
function SettingsPlaceholder() {
  return <div className="p-8 text-white">Paramètres - En construction</div>;
}

function AdminRedirect() {
  return <Navigate to="/admin/dashboard" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'live',      Component: Live },
      { path: 'replay',    Component: Replay },
      { path: 'chaines',   Component: Chaines },
      { path: 'agenda',    Component: Agenda },
      { path: 'favorites', Component: Favorites },
      { path: 'events',    Component: EventList },
      { path: 'event/:id', Component: EventDetail },
      { path: 'search',    Component: SearchResults },
    ],
  },
  // ── Legal ────────────────────────────────────────────────────────────────
  { path: '/legal/terms',   Component: TermsOfService },
  { path: '/legal/privacy', Component: PrivacyPolicy },
  { path: '/legal/cookies', Component: CookiePolicy },
  { path: '/legal/notice',  Component: LegalNotice },
  { path: '/legal/refund',  Component: RefundPolicy },
  { path: '/legal/faq',     Component: FAQ },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  // ── Admin ────────────────────────────────────────────────────────────────
  {
    path: '/admin/login',
    Component: AdminLogin,
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true,                Component: AdminRedirect },
      { path: 'dashboard',          Component: AdminDashboard },
      { path: 'events',             Component: EventsManagement },
      { path: 'logs',               Component: SystemLogs },
      { path: 'users',              Component: UsersPlaceholder },
      { path: 'crm',                Component: CRMPlaceholder },
      { path: 'notifications',      Component: NotificationsPlaceholder },
      { path: 'finances',           Component: FinancesPlaceholder },
      { path: 'settings',           Component: SettingsPlaceholder },
    ],
  },
]);
