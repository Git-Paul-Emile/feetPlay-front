import { RouterProvider } from 'react-router';
import { router } from './routes';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { CreatorAuthProvider } from './contexts/CreatorAuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { LocationProvider } from './contexts/LocationContext';

// FEETI PLAY - Plateforme de streaming et de divertissement
export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <LocationProvider>
          <AdminAuthProvider>
            <CreatorAuthProvider>
              <FavoritesProvider>
                <SubscriptionProvider>
                  <RouterProvider router={router} />
                </SubscriptionProvider>
              </FavoritesProvider>
            </CreatorAuthProvider>
          </AdminAuthProvider>
        </LocationProvider>
      </AppProvider>
    </AuthProvider>
  );
}