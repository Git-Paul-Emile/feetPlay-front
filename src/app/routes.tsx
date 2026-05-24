import { lazy, Suspense, type ComponentType } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';

// Pages chargées immédiatement (légères / critiques)
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { GoogleCompletion } from './pages/GoogleCompletion';

// Admin imports
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Creator imports
import { CreatorLogin } from './pages/creator/CreatorLogin';
import { CreatorRegister } from './pages/creator/CreatorRegister';
import { CreatorLayout } from './pages/creator/CreatorLayout';

// Creator lazy pages
const CreatorDashboardLazy       = lazy(() => import('./pages/creator/CreatorDashboard').then(m => ({ default: m.CreatorDashboard })));
const CreatorDashboardPublicLazy = lazy(() => import('./pages/CreatorDashboard').then(m => ({ default: m.CreatorDashboard })));

// Lazy load des pages légales
const TermsOfServiceLazy = lazy(() => import('./pages/legal/TermsOfService').then(m => ({ default: m.TermsOfService })));
const PrivacyPolicyLazy  = lazy(() => import('./pages/legal/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const CookiePolicyLazy   = lazy(() => import('./pages/legal/CookiePolicy').then(m => ({ default: m.CookiePolicy })));
const LegalNoticeLazy    = lazy(() => import('./pages/legal/LegalNotice').then(m => ({ default: m.LegalNotice })));
const RefundPolicyLazy   = lazy(() => import('./pages/legal/RefundPolicy').then(m => ({ default: m.RefundPolicy })));
const FAQLazy            = lazy(() => import('./pages/legal/FAQ').then(m => ({ default: m.FAQ })));

// Lazy load des pages lourdes — pattern identique à feeti2
const LiveLazy             = lazy(() => import('./pages/Live').then(m => ({ default: m.Live })));
const ReplayLazy           = lazy(() => import('./pages/Replay').then(m => ({ default: m.Replay })));
const ChainesLazy          = lazy(() => import('./pages/Chaines').then(m => ({ default: m.Chaines })));
const AgendaLazy           = lazy(() => import('./pages/Agenda').then(m => ({ default: m.Agenda })));
const FavoritesLazy        = lazy(() => import('./pages/Favorites').then(m => ({ default: m.Favorites })));
const EventDetailLazy      = lazy(() => import('./pages/EventDetail').then(m => ({ default: m.EventDetail })));
const EventListLazy        = lazy(() => import('./pages/EventList').then(m => ({ default: m.EventList })));
const SearchResultsLazy    = lazy(() => import('./pages/SearchResults').then(m => ({ default: m.SearchResults })));
const WatchHistoryLazy     = lazy(() => import('./pages/WatchHistory').then(m => ({ default: m.WatchHistory })));
// Pages v2 — nouvelles / mises à jour
const CreateursLazy         = lazy(() => import('./pages/Createurs').then(m => ({ default: m.Createurs })));
const CreatorDetailLazy     = lazy(() => import('./pages/CreatorDetail').then(m => ({ default: m.CreatorDetail })));
const CreatorProfileLazy    = lazy(() => import('./pages/CreatorProfile').then(m => ({ default: m.CreatorProfile })));
const ManageSubscriptionsLazy = lazy(() => import('./pages/ManageSubscriptions').then(m => ({ default: m.ManageSubscriptions })));
const AboutLazy             = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const PressLazy             = lazy(() => import('./pages/Press').then(m => ({ default: m.Press })));
const CGULazy               = lazy(() => import('./pages/CGU').then(m => ({ default: m.CGU })));
const CookiesLazy           = lazy(() => import('./pages/Cookies').then(m => ({ default: m.Cookies })));
const HelpLazy              = lazy(() => import('./pages/Help').then(m => ({ default: m.Help })));
const PrivacyLazy           = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));

// Lazy load admin sous-pages
const EventsManagementLazy   = lazy(() => import('./pages/admin/EventsManagement').then(m => ({ default: m.EventsManagement })));
const SystemLogsLazy         = lazy(() => import('./pages/admin/SystemLogs').then(m => ({ default: m.SystemLogs })));
const UsersManagementLazy    = lazy(() => import('./pages/admin/UsersManagement').then(m => ({ default: m.UsersManagement })));
const FinancesPageLazy       = lazy(() => import('./pages/admin/FinancesPage').then(m => ({ default: m.FinancesPage })));
const CRMPageLazy            = lazy(() => import('./pages/admin/CRMPage').then(m => ({ default: m.CRMPage })));
const NotificationsPageLazy  = lazy(() => import('./pages/admin/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const SettingsPageLazy       = lazy(() => import('./pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })));
const StreamingAnalyticsLazy = lazy(() => import('./pages/admin/StreamingAnalytics').then(m => ({ default: m.StreamingAnalytics })));

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
const Live                  = withSuspense(LiveLazy);
const Replay                = withSuspense(ReplayLazy);
const Chaines               = withSuspense(ChainesLazy);
const Agenda                = withSuspense(AgendaLazy);
const Favorites             = withSuspense(FavoritesLazy);
const EventDetail           = withSuspense(EventDetailLazy);
const EventList             = withSuspense(EventListLazy);
const SearchResults         = withSuspense(SearchResultsLazy);
const WatchHistory          = withSuspense(WatchHistoryLazy);
const Createurs             = withSuspense(CreateursLazy);
const CreatorDetail         = withSuspense(CreatorDetailLazy);
const CreatorProfile        = withSuspense(CreatorProfileLazy);
const ManageSubscriptions   = withSuspense(ManageSubscriptionsLazy);
const About                 = withSuspense(AboutLazy);
const Press                 = withSuspense(PressLazy);
const CGU                   = withSuspense(CGULazy);
const Cookies               = withSuspense(CookiesLazy);
const Help                  = withSuspense(HelpLazy);
const Privacy               = withSuspense(PrivacyLazy);
const EventsManagement      = withSuspense(EventsManagementLazy);
const SystemLogs            = withSuspense(SystemLogsLazy);
const UsersManagement       = withSuspense(UsersManagementLazy);
const FinancesPage          = withSuspense(FinancesPageLazy);
const CRMPage               = withSuspense(CRMPageLazy);
const NotificationsPage     = withSuspense(NotificationsPageLazy);
const SettingsPage          = withSuspense(SettingsPageLazy);
const StreamingAnalytics    = withSuspense(StreamingAnalyticsLazy);
const CreatorDashboard      = withSuspense(CreatorDashboardLazy);
const CreatorDashboardPublic = withSuspense(CreatorDashboardPublicLazy);

// Pages légales wrappées
const TermsOfService = withSuspense(TermsOfServiceLazy);
const PrivacyPolicy  = withSuspense(PrivacyPolicyLazy);
const CookiePolicy   = withSuspense(CookiePolicyLazy);
const LegalNotice    = withSuspense(LegalNoticeLazy);
const RefundPolicy   = withSuspense(RefundPolicyLazy);
const FAQ            = withSuspense(FAQLazy);

function AdminRedirect() {
  return <Navigate to="/admin/dashboard" replace />;
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true,                  Component: Home },
      { path: 'live',                 Component: Live },
      { path: 'replay',               Component: Replay },
      { path: 'chaines',              Component: Chaines },
      { path: 'agenda',               Component: Agenda },
      { path: 'favorites',            Component: Favorites },
      { path: 'events',               Component: EventList },
      { path: 'event/:id',            Component: EventDetail },
      { path: 'search',               Component: SearchResults },
      { path: 'watch-history',        Component: WatchHistory },
      // Pages v2
      { path: 'createurs',            Component: Createurs },
      { path: 'creator/:id',          Component: CreatorDetail },
      { path: 'creator-profile/:id',  Component: CreatorProfile },
      { path: 'subscriptions',        Component: ManageSubscriptions },
      { path: 'creator-dashboard',    Component: CreatorDashboardPublic },
      { path: 'about',                Component: About },
      { path: 'press',                Component: Press },
      { path: 'cgu',                  Component: CGU },
      { path: 'terms',                Component: CGU },
      { path: 'cookies',              Component: Cookies },
      { path: 'help',                 Component: Help },
      { path: 'privacy',              Component: Privacy },
    ],
  },
  // ── Legal (pages complètes dédiées) ──────────────────────────────────────
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
  {
    path: '/register/google-complete',
    Component: GoogleCompletion,
  },
  // ── Creator ──────────────────────────────────────────────────────────────
  { path: '/creator/login',    Component: CreatorLogin },
  { path: '/creator/register', Component: CreatorRegister },
  {
    path: '/creator',
    Component: CreatorLayout,
    children: [
      { index: true, Component: () => <Navigate to="/creator/dashboard" replace /> },
      { path: 'dashboard', Component: CreatorDashboard },
    ],
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
      { index: true,                 Component: AdminRedirect },
      { path: 'dashboard',           Component: AdminDashboard },
      { path: 'events',              Component: EventsManagement },
      { path: 'logs',                Component: SystemLogs },
      { path: 'users',               Component: UsersManagement },
      { path: 'crm',                 Component: CRMPage },
      { path: 'notifications',       Component: NotificationsPage },
      { path: 'finances',            Component: FinancesPage },
      { path: 'settings',            Component: SettingsPage },
      { path: 'analytics/streaming', Component: StreamingAnalytics },
    ],
  },
]);
