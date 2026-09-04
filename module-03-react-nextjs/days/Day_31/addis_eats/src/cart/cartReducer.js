export const initialCartState = { items: [] };

export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find(i => i.id === action.dish.id);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.id === action.dish.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.dish, qty: 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter(i => i.id !== action.id) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}