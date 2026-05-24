import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ChatButton } from './ChatButton';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatButton />
    </div>
  );
}
