import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  signOut: (onSuccess?: () => void) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    const state = get();
    if (state.initialized) return;

    // Check both localStorage and sessionStorage to determine which one has the session
    // This handles cases where user might have sessions in either storage
    let supabase = createClient(true); // Try localStorage first
    let session = null;

    try {
      // Try localStorage first
      const localStorageResult = await supabase.auth.getSession();
      if (localStorageResult.data.session) {
        session = localStorageResult.data.session;
      } else {
        // If no session in localStorage, try sessionStorage
        supabase = createClient(false);
        const sessionStorageResult = await supabase.auth.getSession();
        if (sessionStorageResult.data.session) {
          session = sessionStorageResult.data.session;
        }
      }

      set({
        user: session?.user ?? null,
        loading: false,
        initialized: true,
      });

      // Listen for auth changes - we need to listen on both clients
      // But in practice, only one will have active sessions
      const localStorageClient = createClient(true);
      const sessionStorageClient = createClient(false);

      localStorageClient.auth.onAuthStateChange((_, session) => {
        set({
          user: session?.user ?? null,
          loading: false,
        });
      });

      sessionStorageClient.auth.onAuthStateChange((_, session) => {
        set({
          user: session?.user ?? null,
          loading: false,
        });
      });
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({
        user: null,
        loading: false,
        initialized: true,
      });
    }
  },

  signOut: async (onSuccess) => {
    try {
      // Always clear local state first for immediate UI feedback
      set({
        user: null,
        loading: false,
      });

      // Clear sessions from both localStorage and sessionStorage
      const localStorageClient = createClient(true);
      const sessionStorageClient = createClient(false);

      // Sign out from both clients to ensure complete cleanup
      await Promise.allSettled([
        localStorageClient.auth.signOut(),
        sessionStorageClient.auth.signOut(),
      ]);

      // Server-side logout (always succeeds due to robust error handling)
      await fetch("/auth/signout", {
        method: "POST",
        credentials: "include",
      });

      // Call the success callback
      onSuccess?.();
    } catch (error) {
      console.error("Error during logout process:", error);
      // Ensure local state is cleared even if everything fails
      set({
        user: null,
        loading: false,
      });
      // Still call success callback to redirect user
      onSuccess?.();
    }
  },
}));
