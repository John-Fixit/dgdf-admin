import { lazy, Suspense } from 'react'
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
const Donations = lazy(() => import('@/pages/Donations'))
const Messages = lazy(() => import('@/pages/Messages'))

/**
 * Root shell — mounts global modals above all routes.
 */
function RootLayout(): React.ReactElement {
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
                path: '/donations',
                element: <Donations />,
              },
              {
                path: '/messages',
                element: <Messages />,
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
