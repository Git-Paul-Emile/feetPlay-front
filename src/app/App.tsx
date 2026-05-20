import { RouterProvider } from 'react-router';
import { router } from './routes';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { CreatorAuthProvider } from './contexts/CreatorAuthContext';

// FEETI PLAY - Plateforme de streaming sportif
export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AdminAuthProvider>
          <CreatorAuthProvider>
            <RouterProvider router={router} />
          </CreatorAuthProvider>
        </AdminAuthProvider>
      </AppProvider>
    </AuthProvider>
  );
}