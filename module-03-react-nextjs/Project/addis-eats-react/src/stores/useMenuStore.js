// src/stores/useMenuStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const SEED_URL = "/menu-data.json";
const CURRENT_VERSION = "8";
const DEFAULT_CATEGORIES = ["starters", "mains", "soups", "desserts", "drinks"];

export const useMenuStore = create(
  persist(
    (set, get) => ({
      dishes: [],
      categories: DEFAULT_CATEGORIES,
      loading: true,
      error: null,
      version: CURRENT_VERSION,

      // ── Data loading ──────────────────────────────────────
      loadMenu: async () => {
        set({ loading: true, error: null });
        try {
          const { version: savedVersion, dishes: savedDishes } = get();
          const isOutdated = savedVersion !== CURRENT_VERSION;

          if (isOutdated || !savedDishes || savedDishes.length === 0) {
            const res = await fetch(SEED_URL);
            if (!res.ok) throw new Error("Failed to fetch menu seed");
            const seed = await res.json();
            set({
              dishes: seed,
              categories: DEFAULT_CATEGORIES,
              version: CURRENT_VERSION,
              loading: false,
            });
          } else {
            set({ loading: false });
          }
        } catch (err) {
          set({ error: err, loading: false });
        }
      },

      resetMenu: async () => {
        const res = await fetch(SEED_URL);
        const seed = await res.json();
        set({
          dishes: seed,
          categories: DEFAULT_CATEGORIES,
          version: CURRENT_VERSION,
        });
      },

      // ── Dish CRUD ─────────────────────────────────────────
      addDish: (dish) =>
        set((state) => ({
          dishes: [
            ...state.dishes,
            { ...dish, id: `dish-${Date.now()}` },
          ],
        })),

      updateDish: (id, patch) =>
        set((state) => ({
          dishes: state.dishes.map((d) =>
            d.id === id ? { ...d, ...patch } : d
          ),
        })),

      removeDish: (id) =>
        set((state) => ({
          dishes: state.dishes.filter((d) => d.id !== id),
        })),

      toggleAvailability: (id) =>
        set((state) => ({
          dishes: state.dishes.map((d) =>
            d.id === id ? { ...d, isHidden: !d.isHidden } : d
          ),
        })),

      // ── Category CRUD ─────────────────────────────────────
      addCategory: (cat) =>
        set((state) => ({
          categories: state.categories.includes(cat)
            ? state.categories
            : [...state.categories, cat],
        })),

      removeCategory: (cat) =>
        set((state) => ({
          categories: state.categories.filter((c) => c !== cat),
        })),
    }),
    {
      name: "royale-menu", // matches the old localStorage key prefix
      // Only persist data (not loading/error transient state)
      partialize: (state) => ({
        dishes: state.dishes,
        categories: state.categories,
        version: state.version,
      }),
    }
  )
);