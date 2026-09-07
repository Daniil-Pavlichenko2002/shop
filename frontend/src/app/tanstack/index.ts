import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

const tanstackQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 0,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
    },
  },
})

export { tanstackQueryClient, VueQueryPlugin }
