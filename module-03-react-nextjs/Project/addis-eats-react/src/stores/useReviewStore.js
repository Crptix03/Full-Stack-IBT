import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useReviewStore = create(
  persist(
    (set, get) => ({
      ratings: [],

      rateDish: ({ dishId, username, stars, comment = "" }) => {
        const existing = get().ratings.find(
          (r) => r.dishId === dishId && r.username === username
        );

        if (existing) {
          set((state) => ({
            ratings: state.ratings.map((r) =>
              r.id === existing.id
                ? { ...r, stars, comment, createdAt: new Date().toISOString() }
                : r
            ),
          }));
          return;
        }

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

      getUserRating: (dishId, username) =>
        get().ratings.find(
          (r) => r.dishId === dishId && r.username === username
        ) || null,

      getDishRatings: (dishId) =>
        get().ratings.filter((r) => r.dishId === dishId),

      getAverageRating: (dishId) => {
        const list = get().ratings.filter((r) => r.dishId === dishId);
        if (list.length === 0) return null;
        const sum = list.reduce((acc, r) => acc + r.stars, 0);
        return sum / list.length;
      },

      removeRating: (dishId, username) =>
        set((state) => ({
          ratings: state.ratings.filter(
            (r) => !(r.dishId === dishId && r.username === username)
          ),
        })),

      clearAllRatings: () => set({ ratings: [] }),
    }),
    { name: "royale-bistro-ratings" }
  )
);

export const selectDishRating = (dishId) => (state) => {
  const list = state.ratings.filter((r) => r.dishId === dishId);
  if (list.length === 0) return { average: null, count: 0 };
  const sum = list.reduce((acc, r) => acc + r.stars, 0);
  return { average: sum / list.length, count: list.length };
};