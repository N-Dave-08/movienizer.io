"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";

interface AppProvidersProps {
  children: React.ReactNode;
}

function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors
              if (error instanceof Error && error.message.includes("4")) {
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const { loadWatchlist, initialized } = useWatchlistStore();

  useEffect(() => {
    if (user && !initialized) {
      loadWatchlist();
    }
  }, [user, initialized, loadWatchlist]);

  return <>{children}</>;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <WatchlistProvider>{children}</WatchlistProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
