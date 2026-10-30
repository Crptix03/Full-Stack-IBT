import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useOrderStore = create(
  persist(
    (set) => ({
      orders: [],

      placeOrder: (payload) => {
        const now = new Date().toISOString();
        const newOrder = {
          ...payload,
          id: `order-${Date.now()}`,
          placedAt: now,
          status: "pending",
          statusHistory: [{ status: "pending", at: now }],
          customerUsername: payload.customerUsername || "Guest",
          delivery: payload.delivery || null,
        };

        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },

      updateStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id
              ? {
                  ...o,
                  status,
                  statusHistory: [
                    ...(o.statusHistory || []),
                    { status, at: new Date().toISOString() },
                  ],
                }
              : o
          ),
        })),

      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        })),

      _syncFromStorage: (freshOrders) => set({ orders: freshOrders }),
    }),
    {
      name: "royale-bistro-orders",
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== "royale-bistro-orders" || !e.newValue) return;
    try {
      const parsed = JSON.parse(e.newValue);
      const freshOrders = parsed?.state?.orders;
      if (Array.isArray(freshOrders)) {
        useOrderStore.getState()._syncFromStorage(freshOrders);
      }
    } catch {
    }
  });
}