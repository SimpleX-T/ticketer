import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // While loading, show a placeholder (e.g., spinner or nothing)
  if (isLoading) {
    return (
      <div className="w-full h-screen fixed inset-0 bg-primary grid place-items-center">
        <div className="w-12 h-12 border-[6px] border-t-transparent border-secondary animate-spin rounded-full" />
      </div>
    );
  }

  // Once loading is done, check authentication
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }

  return children;
}
