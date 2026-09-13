import { createContext, useContext, useReducer, useEffect } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "royale-bistro-auth";

const initialState = {
  users: [],       
  currentUser: null, 
};

function init(initialState) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error("Failed to load auth from localStorage:", err);
  }
  return initialState;
}

function authReducer(state, action) {
  switch (action.type) {
    case "SIGN_UP": {
      const newUser = { username: action.username, password: action.password, avatar: null };
      return {
        ...state,
        users: [...state.users, newUser],
        currentUser: { username: newUser.username, avatar: newUser.avatar },
      };
    }
    case "SIGN_IN": {
      const user = state.users.find((u) => u.username === action.username);
      return { ...state, currentUser: { username: user.username, avatar: user.avatar } };
    }
    case "SIGN_OUT":
      return { ...state, currentUser: null };
    case "UPDATE_PROFILE": {
      const updatedUsers = state.users.map((u) =>
        u.username === state.currentUser.username
          ? { ...u, username: action.username, avatar: action.avatar }
          : u
      );
      return {
        ...state,
        users: updatedUsers,
        currentUser: { username: action.username, avatar: action.avatar },
      };
    }
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState, init);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save auth to localStorage:", err);
    }
  }, [state]);

  const signUp = (username, password) => {
    const trimmed = username.trim();
    const taken = state.users.some((u) => u.username.toLowerCase() === trimmed.toLowerCase());
    if (taken) return { success: false, error: "That username is already taken." };

    dispatch({ type: "SIGN_UP", username: trimmed, password });
    return { success: true };
  };

  const signIn = (username, password) => {
    const trimmed = username.trim();
    const match = state.users.find(
      (u) => u.username.toLowerCase() === trimmed.toLowerCase() && u.password === password
    );
    if (!match) return { success: false, error: "Incorrect username or password." };

    dispatch({ type: "SIGN_IN", username: match.username });
    return { success: true };
  };

  const signOut = () => dispatch({ type: "SIGN_OUT" });

  const updateProfile = (username, avatar) => {
    const trimmed = username.trim();
    const taken = state.users.some(
      (u) => u.username.toLowerCase() === trimmed.toLowerCase() && u.username !== state.currentUser.username
    );
    if (taken) return { success: false, error: "That username is already taken." };

    dispatch({ type: "UPDATE_PROFILE", username: trimmed, avatar });
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{ currentUser: state.currentUser, signUp, signIn, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}