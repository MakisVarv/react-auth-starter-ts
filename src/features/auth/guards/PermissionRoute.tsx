import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { hasAllPermissions } from "../../access-control/authorization";
import type { ReactNode } from "react";

function PermissionRoute({
  children,
  permissions,
}: {
  children: ReactNode;
  permissions: string[];
}) {
  const { user } = useAuth();

  if (user === null) {
    return <Navigate to="/login" replace />;
  }
  if (hasAllPermissions(user, permissions)) {
    return children;
  }
  return <Navigate to="/" replace />;
}
export default PermissionRoute;
