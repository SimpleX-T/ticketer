import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  // const { user } = useAuth();
  // console.log(user);

  if (!isAuthenticated)
    return (
      <Navigate
        to="/login"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  return children;
}
