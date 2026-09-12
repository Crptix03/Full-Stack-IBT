import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "royale-bistro-cart";

const initialState = {
  items: [],
  orderHistory: [],
};

function init(initialState) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
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
          { id: dish.id, name: dish.name, price: dish.price, img: dish.img, qty: 1 },
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
        items: state.items.map((item) => (item.id === id ? { ...item, qty } : item)),
      };
    }

    case "PLACE_ORDER": {
      if (state.items.length === 0) return state;

      const subtotal = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      const total = action.details?.total ?? subtotal;

      const newOrder = {
        id: `order-${Date.now()}`,
        placedAt: new Date().toISOString(),
        items: state.items,
        subtotal,
        total,
        delivery: action.details || null,
      };

      return {
        items: [],
        orderHistory: [newOrder, ...state.orderHistory],
      };
    }

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

  const addToCart = (dish) => dispatch({ type: "ADD_TO_CART", dish });
  const removeFromCart = (id) => dispatch({ type: "REMOVE_FROM_CART", id });
  const updateQty = (id, qty) => dispatch({ type: "UPDATE_QTY", id, qty });
  const placeOrder = (details) => dispatch({ type: "PLACE_ORDER", details });

  const cartCount = state.items.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        orderHistory: state.orderHistory,
        addToCart,
        removeFromCart,
        updateQty,
        placeOrder,
        cartCount,
        cartTotal,
      }}
    >
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