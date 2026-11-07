import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
        <span className="sr-only">Restoring session...</span>
      </div>
    );
  }

  return children;
}

export default AuthGate;
