import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1, // 1 minute default stale time
      gcTime: 1000 * 60 * 5, // 5 minutes garbage collection time
      retry: (failureCount, error: any) => {
        // Do not retry client authorization or not found errors
        const message = error?.message || '';
        if (
          message.includes('session has expired') ||
          message.includes('permission') ||
          message.includes('not found') ||
          message.includes('Invalid credentials') ||
          failureCount >= 2
        ) {
          return false;
        }
        return true;
      },
      refetchOnWindowFocus: false, // Prevent aggressive refetching on mobile tab focus
    },
    mutations: {
      retry: false,
    },
  },
});
