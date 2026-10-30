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
        if (state?.theme) {
          document.documentElement.setAttribute("data-theme", state.theme);
        }
      },
    }
  )
);

useThemeStore.subscribe((state) => {
  document.documentElement.setAttribute("data-theme", state.theme);
});