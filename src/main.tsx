import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './features/auth/context/AuthProvider.tsx'
import AuthGate from './features/auth/components/AuthGate.tsx'
import { AppErrorBoundary } from './shared/components/errors/AppErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <Toaster />
        <AuthProvider>
          <AuthGate>
            <App />
          </AuthGate>
        </AuthProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
)
