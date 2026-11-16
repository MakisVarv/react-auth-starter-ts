import './App.css'
import { Route, Routes } from 'react-router'
import SecurityPageLayout from './features/auth/components/SecurityPageLayout'
import ProtectedRoute from './features/auth/guards/ProtectedRoute'
import { ChangePasswordPage } from './features/auth/pages/ChangePasswordPage'
import { ChangeEmailPage } from './features/auth/pages/ChangeEmailPage'
import { LogoutAllPage } from './features/auth/pages/LogoutAllPage'
import ProfilePage from './features/auth/pages/ProfilePage'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import { ResetPasswordPage } from './features/auth/pages/ResetPasswordPage'
import GuestOnlyRoute from './features/auth/guards/GuestOnlyRoute'
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import LoginPage from './features/auth/pages/LoginPage'
import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'
import PermissionRoute from './features/auth/guards/PermissionRoute'
import DashboardPage from './features/dashboard/DashboardPage'
import CreateUserPage from './features/users/pages/CreateUserPage'
import EditUserPage from './features/users/pages/EditUserPage'
import UserDetailsPage from './features/users/pages/UserDetailsPage'
import UsersPage from './features/users/pages/UsersPage'

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
        <Route element={<AdminLayout />}>
          <Route
            path="/dashboard"
            element={
              <PermissionRoute permissions={['dashboard.read']}>
                <DashboardPage />
              </PermissionRoute>
            }
          />
          {/* <Route
            path="/accessControl"
            element={
              <PermissionRoute permissions={['role.read', 'permission.read']}>
                <AccessManagementPage />
              </PermissionRoute>
            }
          /> */}
          <Route
            path="/users"
            element={
              <PermissionRoute permissions={['user.read']}>
                <UsersPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/users/new"
            element={
              <PermissionRoute permissions={['user.create']}>
                <CreateUserPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/users/:userId/edit"
            element={
              <PermissionRoute permissions={['user.update']}>
                <EditUserPage />
              </PermissionRoute>
            }
          />
          <Route
            path="/users/:userId"
            element={
              <PermissionRoute permissions={['user.read']}>
                <UserDetailsPage />
              </PermissionRoute>
            }
          />
        </Route>
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
    </Routes>
  )
}

export default App
