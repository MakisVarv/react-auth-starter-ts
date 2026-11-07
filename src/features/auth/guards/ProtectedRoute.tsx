import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  if (user === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
export default ProtectedRoute;
