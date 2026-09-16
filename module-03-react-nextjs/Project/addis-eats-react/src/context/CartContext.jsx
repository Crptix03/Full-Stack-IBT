import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "royale-bistro-cart";

const initialState = {
  items: [],
};

function init() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { items: parsed.items || [] };
    }
  } catch (err) {
    console.error("Failed to load cart from localStorage:", err);
  }
  return initialState;
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const dish = action.dish;
      const existing = state.items.find((item) => item.id === dish.id);

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === dish.id ? { ...item, qty: item.qty + 1 } : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            id: dish.id,
            name: dish.name,
            price: dish.price,
            img: dish.img,
            qty: 1,
          },
        ],
      };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };

    case "UPDATE_QTY": {
      const { id, qty } = action;
      if (qty < 1) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, qty } : item
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, init);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [state]);

  //  Stable callbacks — same reference across renders, so memoized children don't re-render
  const addToCart = useCallback(
    (dish) => dispatch({ type: "ADD_TO_CART", dish }),
    []
  );
  const removeFromCart = useCallback(
    (id) => dispatch({ type: "REMOVE_FROM_CART", id }),
    []
  );
  const updateQty = useCallback(
    (id, qty) => dispatch({ type: "UPDATE_QTY", id, qty }),
    []
  );
  const clearCart = useCallback(
    () => dispatch({ type: "CLEAR_CART" }),
    []
  );

  const cartCount = state.items.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = state.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  //  Memoized context value — new reference only when cart contents actually change
  const value = useMemo(
    () => ({
      items: state.items,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartCount,
      cartTotal,
    }),
    [state.items, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}