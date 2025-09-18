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

    try {
      const supabase = createClient();
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error);
      }

      set({
        user: session?.user ?? null,
        loading: false,
        initialized: true,
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_, session) => {
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

      // Clear session
      const supabase = createClient();
      await supabase.auth.signOut();

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
