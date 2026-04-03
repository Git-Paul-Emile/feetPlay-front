import { Navigate } from 'react-router';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="p-8 text-center">
        <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] p-8 max-w-md mx-auto">
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-2xl mb-4">
            Accès refusé
          </h2>
          <p className="font-['Inter',sans-serif] text-white/60">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
