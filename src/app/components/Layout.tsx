import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FavoritesProvider } from '../contexts/FavoritesContext';

export function Layout() {
  return (
    <FavoritesProvider>
      <div className="min-h-screen bg-[#0a0a0a]">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </FavoritesProvider>
  );
}
