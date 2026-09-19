// src/stores/useReviewStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useReviewStore = create(
  persist(
    (set, get) => ({
      // ratings: [{ id, dishId, username, stars, comment?, createdAt }]
      ratings: [],

      // Add or update a rating for a specific dish by the current user
      rateDish: ({ dishId, username, stars, comment = "" }) => {
        const existing = get().ratings.find(
          (r) => r.dishId === dishId && r.username === username
        );

        if (existing) {
          // Update existing rating
          set((state) => ({
            ratings: state.ratings.map((r) =>
              r.id === existing.id
                ? { ...r, stars, comment, createdAt: new Date().toISOString() }
                : r
            ),
          }));
          return;
        }

        // Add new rating
        const newRating = {
          id: `rating-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          dishId,
          username,
          stars,
          comment,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ ratings: [...state.ratings, newRating] }));
      },

      // Get the current user's rating for a dish
      getUserRating: (dishId, username) =>
        get().ratings.find(
          (r) => r.dishId === dishId && r.username === username
        ) || null,

      // Get all ratings for a dish
      getDishRatings: (dishId) =>
        get().ratings.filter((r) => r.dishId === dishId),

      // Get the average rating (or null if no ratings)
      getAverageRating: (dishId) => {
        const list = get().ratings.filter((r) => r.dishId === dishId);
        if (list.length === 0) return null;
        const sum = list.reduce((acc, r) => acc + r.stars, 0);
        return sum / list.length;
      },

      // Remove a user's rating
      removeRating: (dishId, username) =>
        set((state) => ({
          ratings: state.ratings.filter(
            (r) => !(r.dishId === dishId && r.username === username)
          ),
        })),

      // Clear all (admin action, if needed)
      clearAllRatings: () => set({ ratings: [] }),
    }),
    { name: "royale-bistro-ratings" }
  )
);

// Selectors
export const selectDishRating = (dishId) => (state) => {
  const list = state.ratings.filter((r) => r.dishId === dishId);
  if (list.length === 0) return { average: null, count: 0 };
  const sum = list.reduce((acc, r) => acc + r.stars, 0);
  return { average: sum / list.length, count: list.length };
};