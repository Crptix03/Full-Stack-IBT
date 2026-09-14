import { createContext, useContext, useReducer, useEffect } from "react";

const AuthContext = createContext(null);
const STORAGE_KEY = "royale-bistro-auth";

// ── Pre-seeded admin account ──────────────────────────────
const DEFAULT_ADMIN = {
  username: "admin",
  password: "royale2026",
  fullName: "Admin User",
  phone: "+251901023362",
  avatar: null,
  isAdmin: true,
};

const initialState = {
  users: [DEFAULT_ADMIN],
  currentUser: null,
};

// ── Load + migrate from localStorage ─────────────────────
function init() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      // Ensure users array exists
      if (!Array.isArray(parsed.users)) parsed.users = [];

      // Ensure admin exists even after clearing users
      if (!parsed.users.some((u) => u.isAdmin)) {
        parsed.users.unshift({ ...DEFAULT_ADMIN });
      }

      // Migrate every user to have fullName, phone, isAdmin fields
      parsed.users = parsed.users.map((u) => ({
        ...u,
        isAdmin: u.isAdmin === true,
        fullName: u.fullName || "",
        phone: u.phone || "",
      }));

      // Sync currentUser with the migrated users array
      if (parsed.currentUser) {
        const fresh = parsed.users.find(
          (u) => u.username === parsed.currentUser.username
        );
        parsed.currentUser = fresh
          ? {
              username: fresh.username,
              fullName: fresh.fullName || "",
              phone: fresh.phone || "",
              avatar: fresh.avatar ?? null,
              isAdmin: fresh.isAdmin === true,
            }
          : null;
      } else {
        parsed.currentUser = null;
      }

      return parsed;
    }
  } catch (err) {
    console.error("Auth init failed:", err);
  }
  return initialState;
}

// ── Reducer ───────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {
    case "SIGN_UP": {
      const newUser = {
        username: action.username,
        password: action.password,
        fullName: action.fullName || "",
        phone: action.phone || "",
        avatar: null,
        isAdmin: false,
      };
      return {
        ...state,
        users: [...state.users, newUser],
        currentUser: {
          username: newUser.username,
          fullName: newUser.fullName,
          phone: newUser.phone,
          avatar: null,
          isAdmin: false,
        },
      };
    }

    case "SIGN_IN": {
      const user = state.users.find((u) => u.username === action.username);
      if (!user) return state;
      return {
        ...state,
        currentUser: {
          username: user.username,
          fullName: user.fullName || "",
          phone: user.phone || "",
          avatar: user.avatar ?? null,
          isAdmin: user.isAdmin === true,
        },
      };
    }

    case "SIGN_OUT":
      return { ...state, currentUser: null };

    case "UPDATE_PROFILE": {
      const prevUsername = state.currentUser?.username;
      return {
        ...state,
        users: state.users.map((u) =>
          u.username === prevUsername
            ? {
                ...u,
                username: action.username,
                fullName: action.fullName,
                phone: action.phone,
                avatar: action.avatar,
              }
            : u
        ),
        currentUser: {
          username: action.username,
          fullName: action.fullName,
          phone: action.phone,
          avatar: action.avatar,
          isAdmin: state.currentUser?.isAdmin === true,
        },
      };
    }

    default:
      return state;
  }
}

// ── Provider ──────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState, init);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error("Auth save failed:", err);
    }
  }, [state]);

  // ── Sign Up ─────────────────────────────────────────────
  const signUp = (username, password, fullName, phone) => {
    const trimmedUsername = username.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedUsername || !password) {
      return { success: false, error: "Please fill in all fields." };
    }

    // Username uniqueness
    const usernameTaken = state.users.some(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );
    if (usernameTaken) {
      return { success: false, error: "That username is already taken." };
    }

    // Phone uniqueness
    const phoneTaken = state.users.some(
      (u) => (u.phone || "").trim() === trimmedPhone && trimmedPhone !== ""
    );
    if (phoneTaken) {
      return {
        success: false,
        error: "That phone number is already registered to another account.",
      };
    }

    dispatch({
      type: "SIGN_UP",
      username: trimmedUsername,
      password,
      fullName,
      phone: trimmedPhone,
    });
    return { success: true };
  };

  // ── Sign In ─────────────────────────────────────────────
  const signIn = (username, password) => {
    const trimmed = username.trim();
    const match = state.users.find(
      (u) =>
        u.username.toLowerCase() === trimmed.toLowerCase() &&
        u.password === password
    );
    if (!match) {
      return { success: false, error: "Incorrect username or password." };
    }
    dispatch({ type: "SIGN_IN", username: match.username });
    return { success: true, isAdmin: match.isAdmin === true };
  };

  // ── Sign Out ────────────────────────────────────────────
  const signOut = () => dispatch({ type: "SIGN_OUT" });

  // ── Update Profile ──────────────────────────────────────
  const updateProfile = (username, fullName, phone, avatar) => {
    const trimmedUsername = username.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedUsername || trimmedUsername.length < 3) {
      return {
        success: false,
        error: "Username must be at least 3 characters.",
      };
    }

    // Username uniqueness (exclude self)
    const usernameTaken = state.users.some(
      (u) =>
        u.username.toLowerCase() === trimmedUsername.toLowerCase() &&
        u.username !== state.currentUser?.username
    );
    if (usernameTaken) {
      return { success: false, error: "That username is already taken." };
    }

    // Phone uniqueness (exclude self)
    const phoneTaken = state.users.some(
      (u) =>
        (u.phone || "").trim() === trimmedPhone &&
        u.username !== state.currentUser?.username &&
        trimmedPhone !== ""
    );
    if (phoneTaken) {
      return {
        success: false,
        error: "That phone number is already registered to another account.",
      };
    }

    dispatch({
      type: "UPDATE_PROFILE",
      username: trimmedUsername,
      fullName,
      phone: trimmedPhone,
      avatar,
    });
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: state.currentUser,
        users: state.users,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}