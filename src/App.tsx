import { lazy, Suspense, useEffect } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
} from 'react-router-dom'
import { AdminLayout } from '@/components/layout'
import { LoadingSpinner, SessionExpiredModal } from '@/components/shared'
import { loginPathWithFrom } from '@/lib/authRedirect'
import { useAuthStore } from '@/store/authStore'
import { RouteErrorPage } from '@/pages/RouteErrorPage'

const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const GalleryManager = lazy(() => import('@/pages/GalleryManager'))
const ContentEditor = lazy(() => import('@/pages/ContentEditor'))
const LeadershipManager = lazy(() => import('@/pages/LeadershipManager'))
const SiteSettings = lazy(() => import('@/pages/SiteSettings'))
const Settings = lazy(() => import('@/pages/Settings'))
const Donations = lazy(() => import('@/pages/Donations'))
const Messages = lazy(() => import('@/pages/Messages'))
const AuditLog = lazy(() => import('@/pages/AuditLog'))
const Administrators = lazy(() => import('@/pages/Administrators'))

/**
 * Root shell — hydrates the httpOnly session, then mounts routes + modals.
 */
function RootLayout(): React.ReactElement {
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const hydrateSession = useAuthStore((s) => s.hydrateSession)

  useEffect(() => {
    void hydrateSession()
  }, [hydrateSession])

  if (!isHydrated) {
    return (
      <LoadingSpinner
        label="Checking session…"
        className="min-h-svh"
        size="lg"
      />
    )
  }

  return (
    <>
      <Outlet />
      <SessionExpiredModal />
    </>
  )
}

/**
 * Redirects unauthenticated users to login, preserving the current page.
 */
function ProtectedRoute(): React.ReactElement {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={loginPathWithFrom(location.pathname)} replace />
  }

  return <Outlet />
}

/**
 * Suspense wrapper for the public login chunk only.
 */
function LoginRoute(): React.ReactElement {
  return (
    <Suspense
      fallback={
        <LoadingSpinner label="Loading…" className="min-h-svh" size="lg" />
      }
    >
      <Login />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: '/login',
        element: <LoginRoute />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: '/',
                element: <Navigate to="/dashboard" replace />,
              },
              {
                path: '/dashboard',
                element: <Dashboard />,
              },
              {
                path: '/gallery',
                element: <GalleryManager />,
              },
              {
                path: '/content',
                element: <ContentEditor />,
              },
              {
                path: '/leadership',
                element: <LeadershipManager />,
              },
              {
                path: '/site-settings',
                element: <SiteSettings />,
              },
              {
                path: '/settings',
                element: <Settings />,
              },
              {
                path: '/administrators',
                element: <Administrators />,
              },
              {
                path: '/donations',
                element: <Donations />,
              },
              {
                path: '/messages',
                element: <Messages />,
              },
              {
                path: '/audit-log',
                element: <AuditLog />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
])

/**
 * Root application — data router with lazy pages and route error boundary.
 */
export default function App(): React.ReactElement {
  return <RouterProvider router={router} />
}
