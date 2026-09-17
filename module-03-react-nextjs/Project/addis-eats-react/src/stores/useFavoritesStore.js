// src/stores/useFavoritesStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),

      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f !== id),
        })),

      clearFavorites: () => set({ favorites: [] }),

      isFavorite: (id) => get().favorites.includes(id),
    }),
    { name: "royale-bistro-favorites" }
  )
);

// Selector for the count
export const selectFavoritesCount = (state) => state.favorites.length;