import "./App.css";
import { Route, Routes } from "react-router";
import SecurityPageLayout from "./features/auth/components/SecurityPageLayout";
import ProtectedRoute from "./features/auth/guards/ProtectedRoute";
import { ChangePasswordPage } from "./features/auth/pages/ChangePasswordPage";
import { ChangeEmailPage } from "./features/auth/pages/ChangeEmailPage";
import { LogoutAllPage } from "./features/auth/pages/LogoutAllPage";
import ProfilePage from "./features/auth/pages/ProfilePage";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import { ResetPasswordPage } from "./features/auth/pages/ResetPasswordPage";
import GuestOnlyRoute from "./features/auth/guards/GuestOnlyRoute";
import { ForgotPasswordPage } from "./features/auth/pages/ForgotPasswordPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import AuthLayout from "./layouts/AuthLayout";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route element={<SecurityPageLayout />}>
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-email"
            element={
              <ProtectedRoute>
                <ChangeEmailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout-all"
            element={
              <ProtectedRoute>
                <LogoutAllPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <GuestOnlyRoute>
                <LoginPage />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestOnlyRoute>
                <RegisterPage />
              </GuestOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestOnlyRoute>
                <ForgotPasswordPage />
              </GuestOnlyRoute>
            }
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
