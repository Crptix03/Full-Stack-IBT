import { createContext, useState, useMemo, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("addis-eats-auth") === "true"
  );

  useEffect(() => {
    localStorage.setItem("addis-eats-auth", isAuthenticated ? "true" : "false");
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      signIn: () => setIsAuthenticated(true),
      signOut: () => setIsAuthenticated(false),
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}