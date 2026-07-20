import { lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'
import { AdminLayout } from '@/components/layout'
import { LoadingSpinner } from '@/components/shared'
import { useAuthStore } from '@/store/authStore'
import { RouteErrorPage } from '@/pages/RouteErrorPage'

const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const GalleryManager = lazy(() => import('@/pages/GalleryManager'))
const ContentEditor = lazy(() => import('@/pages/ContentEditor'))
const Donations = lazy(() => import('@/pages/Donations'))
const Messages = lazy(() => import('@/pages/Messages'))

/**
 * Redirects unauthenticated users to the login page.
 */
function ProtectedRoute(): React.ReactElement {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
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
        <LoadingSpinner
          label="Loading…"
          className="min-h-svh"
          size="lg"
        />
      }
    >
      <Login />
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
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
