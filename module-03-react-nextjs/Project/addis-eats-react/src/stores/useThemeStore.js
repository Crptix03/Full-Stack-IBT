// src/stores/useThemeStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "dark",

      toggleTheme: () =>
        set({ theme: get().theme === "dark" ? "light" : "dark" }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme",
      onRehydrateStorage: () => (state) => {
        // Apply the persisted theme to <html> as soon as the store rehydrates
        if (state?.theme) {
          document.documentElement.setAttribute("data-theme", state.theme);
        }
      },
    }
  )
);

// Subscribe to changes and apply the theme to the DOM
useThemeStore.subscribe((state) => {
  document.documentElement.setAttribute("data-theme", state.theme);
});