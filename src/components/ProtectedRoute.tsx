import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
