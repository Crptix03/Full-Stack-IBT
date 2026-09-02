import { createContext, useReducer, useMemo } from "react";
import { cartReducer, initialCartState } from "./cartReducer";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const total = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const value = useMemo(
    () => ({ items: state.items, dispatch, total }),
    [state.items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}