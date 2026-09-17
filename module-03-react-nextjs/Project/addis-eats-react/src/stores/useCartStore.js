// src/stores/useCartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],

      addToCart: (dish) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === dish.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === dish.id ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { id: dish.id, name: dish.name, price: dish.price, img: dish.img, qty: 1 },
            ],
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) =>
        set((state) => {
          if (qty < 1) return { items: state.items.filter((i) => i.id !== id) };
          return {
            items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    { name: "royale-bistro-cart" }
  )
);

// Selectors — computed on the fly, only re-render the component when the result changes
export const selectCartCount = (state) =>
  state.items.reduce((sum, i) => sum + i.qty, 0);

export const selectCartTotal = (state) =>
  state.items.reduce((sum, i) => sum + i.price * i.qty, 0);