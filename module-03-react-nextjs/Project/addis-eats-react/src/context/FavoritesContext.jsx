import { createContext, useContext, useReducer, useEffect } from "react";

const FavoritesContext = createContext(null);

const STORAGE_KEY = "royale-bistro-favorites";

const initialState = {
  favorites: [], // array of dish IDs
};

function init() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [] };
    }
  } catch (err) {
    console.error("Failed to load favorites from localStorage:", err);
  }
  return initialState;
}

function favoritesReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_FAVORITE": {
      const id = action.id;
      const exists = state.favorites.includes(id);
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((f) => f !== id)
          : [...state.favorites, id],
      };
    }

    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((f) => f !== action.id),
      };

    case "CLEAR_FAVORITES":
      return { ...state, favorites: [] };

    default:
      return state;
  }
}

export function FavoritesProvider({ children }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState, init);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save favorites to localStorage:", err);
    }
  }, [state]);

  const toggleFavorite = (id) => dispatch({ type: "TOGGLE_FAVORITE", id });
  const removeFavorite = (id) => dispatch({ type: "REMOVE_FAVORITE", id });
  const clearFavorites = () => dispatch({ type: "CLEAR_FAVORITES" });
  const isFavorite = (id) => state.favorites.includes(id);

  return (
    <FavoritesContext.Provider
      value={{
        favorites: state.favorites,
        favoritesCount: state.favorites.length,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used inside a FavoritesProvider");
  }
  return context;
}