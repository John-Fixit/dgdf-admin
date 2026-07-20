import { QueryClient } from '@tanstack/react-query'

/**
 * Shared TanStack Query client with a 5-minute stale time.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
