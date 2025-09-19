import { create } from "zustand";
import type { Movie, TVShow } from "@/lib/tmbd/tmdb";
import type { WatchlistItem } from "@/lib/types/database";
import * as watchlistService from "@/lib/watchlist/watchlist-service";

interface WatchlistState {
  items: WatchlistItem[];
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Actions
  loadWatchlist: () => Promise<void>;
  addToWatchlist: (item: Movie | TVShow, type: "movie" | "tv") => Promise<void>;
  removeFromWatchlist: (
    tmdbId: number,
    mediaType: "movie" | "tv",
  ) => Promise<void>;
  updateWatchlistItem: (
    id: string,
    updates: Partial<WatchlistItem>,
  ) => Promise<void>;
  isInWatchlist: (tmdbId: number, mediaType: "movie" | "tv") => boolean;
  getWatchlistItem: (
    tmdbId: number,
    mediaType: "movie" | "tv",
  ) => WatchlistItem | null;
  clearError: () => void;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  initialized: false,

  loadWatchlist: async () => {
    set({ loading: true, error: null });
    try {
      const items = await watchlistService.getWatchlist();
      set({ items, loading: false, initialized: true });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to load watchlist",
        loading: false,
      });
    }
  },

  addToWatchlist: async (item: Movie | TVShow, type: "movie" | "tv") => {
    const state = get();

    // Check if already in watchlist
    if (state.isInWatchlist(item.id, type)) {
      throw new Error("Item is already in your watchlist");
    }

    // Optimistic update - add to UI immediately
    const optimisticItem: WatchlistItem = {
      id: `temp-${item.id}-${Date.now()}`, // Unique temporary ID
      user_id: "temp",
      tmdb_id: item.id,
      media_type: type,
      title: type === "movie" ? (item as Movie).title : (item as TVShow).name,
      poster_path: item.poster_path,
      overview: item.overview,
      release_date:
        type === "movie"
          ? (item as Movie).release_date
          : (item as TVShow).first_air_date,
      vote_average: item.vote_average,
      added_at: new Date().toISOString(),
      watched: false,
      user_rating: null,
      notes: null,
    };

    set((state) => ({
      items: [optimisticItem, ...state.items],
      error: null,
    }));

    try {
      // Make actual API call
      const newItem = await watchlistService.addToWatchlist({
        tmdb_id: item.id,
        media_type: type,
        title: optimisticItem.title,
        poster_path: item.poster_path,
        overview: item.overview,
        release_date: optimisticItem.release_date,
        vote_average: item.vote_average,
      });

      // Replace optimistic item with real item
      set((state) => ({
        items: state.items.map((i) =>
          i.id === optimisticItem.id ? newItem : i,
        ),
      }));
    } catch (error) {
      // Revert optimistic update on error
      set((state) => ({
        items: state.items.filter((i) => i.id !== optimisticItem.id),
        error:
          error instanceof Error ? error.message : "Failed to add to watchlist",
      }));
      throw error; // Re-throw so component can handle it
    }
  },

  removeFromWatchlist: async (tmdbId: number, mediaType: "movie" | "tv") => {
    const state = get();
    const itemToRemove = state.items.find(
      (i) => i.tmdb_id === tmdbId && i.media_type === mediaType,
    );

    if (!itemToRemove) return;

    // Optimistic update - remove from UI immediately
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.tmdb_id === tmdbId && i.media_type === mediaType),
      ),
      error: null,
    }));

    try {
      await watchlistService.removeFromWatchlist(tmdbId, mediaType);
    } catch (error) {
      // Revert optimistic update on error
      set((state) => ({
        items: [...state.items, itemToRemove],
        error:
          error instanceof Error
            ? error.message
            : "Failed to remove from watchlist",
      }));
      throw error; // Re-throw so component can handle it
    }
  },

  updateWatchlistItem: async (id: string, updates: Partial<WatchlistItem>) => {
    const state = get();
    const originalItem = state.items.find((i) => i.id === id);

    if (!originalItem) return;

    // Optimistic update
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
      error: null,
    }));

    try {
      const updatedItem = await watchlistService.updateWatchlistItem(
        id,
        updates,
      );
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updatedItem : i)),
      }));
    } catch (error) {
      // Revert optimistic update on error
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? originalItem : i)),
        error: error instanceof Error ? error.message : "Failed to update item",
      }));
    }
  },

  isInWatchlist: (tmdbId: number, mediaType: "movie" | "tv") => {
    const state = get();
    return state.items.some(
      (item) => item.tmdb_id === tmdbId && item.media_type === mediaType,
    );
  },

  getWatchlistItem: (tmdbId: number, mediaType: "movie" | "tv") => {
    const state = get();
    return (
      state.items.find(
        (item) => item.tmdb_id === tmdbId && item.media_type === mediaType,
      ) || null
    );
  },

  clearError: () => set({ error: null }),
}));
