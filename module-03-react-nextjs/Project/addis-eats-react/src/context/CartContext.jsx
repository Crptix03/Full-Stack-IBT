import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

const initialState = {
  items: [],       // { id, name, price, img, qty }
  orderHistory: [], // { id, placedAt, items, total }
};

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

      const total = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
      const newOrder = {
        id: `order-${Date.now()}`,
        placedAt: new Date().toISOString(),
        items: state.items,
        total,
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
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (dish) => dispatch({ type: "ADD_TO_CART", dish });
  const removeFromCart = (id) => dispatch({ type: "REMOVE_FROM_CART", id });
  const updateQty = (id, qty) => dispatch({ type: "UPDATE_QTY", id, qty });
  const placeOrder = () => dispatch({ type: "PLACE_ORDER" });

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