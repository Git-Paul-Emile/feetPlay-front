import { useEffect } from 'react';
import { Outlet, useSearchParams } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ChatButton } from './ChatButton';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { loginFromFeeti2SSO, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const ssoToken = searchParams.get('sso_token');
    if (!ssoToken || isLoading || isAuthenticated) return;

    loginFromFeeti2SSO(ssoToken)
      .then(() => {
        searchParams.delete('sso_token');
        setSearchParams(searchParams, { replace: true });
      })
      .catch(() => {});
  }, [searchParams, isLoading, isAuthenticated, loginFromFeeti2SSO, setSearchParams]);

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
