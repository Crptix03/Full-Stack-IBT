import { createContext, useContext, useReducer, useEffect } from "react";

const OrderContext = createContext(null);
const STORAGE_KEY = "royale-bistro-orders";

const initialState = {
  orders: [],
};

function init() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { orders: parsed.orders || [] };
    }
  } catch (err) {
    console.error("Order init failed:", err);
  }
  return initialState;
}

function orderReducer(state, action) {
  switch (action.type) {
    case "PLACE_ORDER": {
      //  Just store what was handed to us — no more ID generation here
      return { ...state, orders: [action.order, ...state.orders] };
    }

    case "UPDATE_STATUS": {
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.id
            ? {
                ...o,
                status: action.status,
                statusHistory: [
                  ...(o.statusHistory || []),
                  { status: action.status, at: new Date().toISOString() },
                ],
              }
            : o
        ),
      };
    }

    case "DELETE_ORDER": {
      return {
        ...state,
        orders: state.orders.filter((o) => o.id !== action.id),
      };
    }

    case "SYNC_FROM_STORAGE": {
      return action.state;
    }

    default:
      return state;
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState, init);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Order save failed:", err);
    }
  }, [state]);

  // Sync across browser tabs — so admin changes reach the customer instantly
  useEffect(() => {
    function syncFromStorage(e) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const fresh = JSON.parse(e.newValue);
          dispatch({ type: "SYNC_FROM_STORAGE", state: fresh });
        } catch {
          // Ignore parse errors
        }
      }
    }
    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);

  //  Build the order ONCE, dispatch it, and return the SAME object
  const placeOrder = (payload) => {
    const now = new Date().toISOString();
    const newOrder = {
      // Spread payload first, so explicit fields below can override safely
      ...payload,

      // Guaranteed fields
      id: `order-${Date.now()}`,
      placedAt: now,
      status: "pending",
      statusHistory: [{ status: "pending", at: now }],
      customerUsername: payload.customerUsername || "Guest",
      delivery: payload.delivery || null,
    };

    dispatch({ type: "PLACE_ORDER", order: newOrder });
    return newOrder;
  };

  const updateStatus = (id, status) =>
    dispatch({ type: "UPDATE_STATUS", id, status });

  const deleteOrder = (id) =>
    dispatch({ type: "DELETE_ORDER", id });

  return (
    <OrderContext.Provider
      value={{
        orders: state.orders,
        placeOrder,
        updateStatus,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) {
    throw new Error("useOrders must be used inside OrderProvider");
  }
  return ctx;
}