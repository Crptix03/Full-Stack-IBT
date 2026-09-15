import { createContext, useContext, useEffect, useState, useCallback } from "react";

const MenuContext = createContext(null);
const MENU_KEY = "royale-menu";
const CATEGORY_KEY = "royale-categories";
const VERSION_KEY = "royale-menu-version";
const SEED_URL = "/menu-data.json";

const CURRENT_VERSION = "8";

const DEFAULT_CATEGORIES = ["starters", "mains", "soups", "desserts", "drinks"];

export function MenuProvider({ children }) {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load from localStorage or seed from JSON
  useEffect(() => {
    async function load() {
      try {
        const savedVersion = localStorage.getItem(VERSION_KEY);
        const isOutdated = savedVersion !== CURRENT_VERSION;

        if (isOutdated) {
          console.log(
            `📦 Menu version changed (${savedVersion} → ${CURRENT_VERSION}). Clearing cache...`
          );
          localStorage.removeItem(MENU_KEY);
          localStorage.removeItem(CATEGORY_KEY);
          localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
        }

        const savedMenu = localStorage.getItem(MENU_KEY);
        const savedCats = localStorage.getItem(CATEGORY_KEY);

        if (savedMenu) {
          setDishes(JSON.parse(savedMenu));
        } else {
          const res = await fetch(SEED_URL);
          if (!res.ok) throw new Error("Failed to fetch menu seed");
          const seed = await res.json();
          setDishes(seed);
          localStorage.setItem(MENU_KEY, JSON.stringify(seed));
        }

        if (savedCats) setCategories(JSON.parse(savedCats));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Persist menu
  useEffect(() => {
    if (!loading) localStorage.setItem(MENU_KEY, JSON.stringify(dishes));
  }, [dishes, loading]);

  // Persist categories
  useEffect(() => {
    if (!loading) localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
  }, [categories, loading]);

  const addDish = useCallback((dish) => {
    setDishes((prev) => [
      ...prev,
      { ...dish, id: `dish-${Date.now()}` },
    ]);
  }, []);

  const updateDish = useCallback((id, patch) => {
    setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }, []);

  const removeDish = useCallback((id) => {
    setDishes((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const toggleAvailability = useCallback((id) => {
    setDishes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isHidden: !d.isHidden } : d))
    );
  }, []);

  const addCategory = useCallback((cat) => {
    setCategories((prev) => (prev.includes(cat) ? prev : [...prev, cat]));
  }, []);

  const removeCategory = useCallback((cat) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  }, []);

  const resetMenu = useCallback(async () => {
    const res = await fetch(SEED_URL);
    const seed = await res.json();
    setDishes(seed);
    setCategories(DEFAULT_CATEGORIES);
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  }, []);

  return (
    <MenuContext.Provider
      value={{
        dishes,
        categories,
        loading,
        error,
        addDish,
        updateDish,
        removeDish,
        toggleAvailability,
        addCategory,
        removeCategory,
        resetMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used inside MenuProvider");
  return ctx;
}