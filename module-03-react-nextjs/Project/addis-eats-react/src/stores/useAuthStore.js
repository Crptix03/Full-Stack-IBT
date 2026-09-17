// src/stores/useAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const DEFAULT_ADMIN = {
  username: "admin",
  password: "royale2026",
  fullName: "Admin User",
  phone: "+251901023362",
  avatar: null,
  isAdmin: true,
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      users: [DEFAULT_ADMIN],
      currentUser: null,

      // ── Sign Up ─────────────────────────────────────────
      signUp: (username, password, fullName, phone) => {
        const trimmedUsername = username.trim();
        const trimmedPhone = phone.trim();

        if (!trimmedUsername || !password) {
          return { success: false, error: "Please fill in all fields." };
        }

        const { users } = get();

        const usernameTaken = users.some(
          (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
        );
        if (usernameTaken) {
          return { success: false, error: "That username is already taken." };
        }

        const phoneTaken = users.some(
          (u) => (u.phone || "").trim() === trimmedPhone && trimmedPhone !== ""
        );
        if (phoneTaken) {
          return {
            success: false,
            error: "That phone number is already registered to another account.",
          };
        }

        const newUser = {
          username: trimmedUsername,
          password,
          fullName: fullName || "",
          phone: trimmedPhone,
          avatar: null,
          isAdmin: false,
        };

        set({
          users: [...users, newUser],
          currentUser: {
            username: newUser.username,
            fullName: newUser.fullName,
            phone: newUser.phone,
            avatar: null,
            isAdmin: false,
          },
        });

        return { success: true };
      },

      // ── Sign In ─────────────────────────────────────────
      signIn: (username, password) => {
        const trimmed = username.trim();
        const { users } = get();

        const match = users.find(
          (u) =>
            u.username.toLowerCase() === trimmed.toLowerCase() &&
            u.password === password
        );

        if (!match) {
          return { success: false, error: "Incorrect username or password." };
        }

        set({
          currentUser: {
            username: match.username,
            fullName: match.fullName || "",
            phone: match.phone || "",
            avatar: match.avatar ?? null,
            isAdmin: match.isAdmin === true,
          },
        });

        return { success: true, isAdmin: match.isAdmin === true };
      },

      // ── Sign Out ────────────────────────────────────────
      signOut: () => set({ currentUser: null }),

      // ── Update Profile ──────────────────────────────────
      updateProfile: (username, fullName, phone, avatar) => {
        const trimmedUsername = username.trim();
        const trimmedPhone = phone.trim();
        const { users, currentUser } = get();

        if (!trimmedUsername || trimmedUsername.length < 3) {
          return {
            success: false,
            error: "Username must be at least 3 characters.",
          };
        }

        const usernameTaken = users.some(
          (u) =>
            u.username.toLowerCase() === trimmedUsername.toLowerCase() &&
            u.username !== currentUser?.username
        );
        if (usernameTaken) {
          return { success: false, error: "That username is already taken." };
        }

        const phoneTaken = users.some(
          (u) =>
            (u.phone || "").trim() === trimmedPhone &&
            u.username !== currentUser?.username &&
            trimmedPhone !== ""
        );
        if (phoneTaken) {
          return {
            success: false,
            error: "That phone number is already registered to another account.",
          };
        }

        const prevUsername = currentUser?.username;

        set({
          users: users.map((u) =>
            u.username === prevUsername
              ? {
                  ...u,
                  username: trimmedUsername,
                  fullName,
                  phone: trimmedPhone,
                  avatar,
                }
              : u
          ),
          currentUser: {
            username: trimmedUsername,
            fullName,
            phone: trimmedPhone,
            avatar,
            isAdmin: currentUser?.isAdmin === true,
          },
        });

        return { success: true };
      },
    }),
    {
      name: "royale-bistro-auth",
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
      }),
      // Migration runs once when rehydrating from localStorage.
      // It ensures every user has the required fields, and that
      // the admin account always exists.
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // Ensure users is an array
        const users = Array.isArray(state.users) ? state.users : [];

        // Ensure admin exists
        if (!users.some((u) => u.isAdmin)) {
          users.unshift({ ...DEFAULT_ADMIN });
        }

        // Backfill missing fields on every user
        const migratedUsers = users.map((u) => ({
          ...u,
          isAdmin: u.isAdmin === true,
          fullName: u.fullName || "",
          phone: u.phone || "",
        }));

        // Re-sync currentUser with the migrated users array
        let migratedCurrentUser = null;
        if (state.currentUser) {
          const fresh = migratedUsers.find(
            (u) => u.username === state.currentUser.username
          );
          migratedCurrentUser = fresh
            ? {
                username: fresh.username,
                fullName: fresh.fullName,
                phone: fresh.phone,
                avatar: fresh.avatar ?? null,
                isAdmin: fresh.isAdmin,
              }
            : null;
        }

        // Push migrated data back into the store
        useAuthStore.setState({
          users: migratedUsers,
          currentUser: migratedCurrentUser,
        });
      },
    }
  )
);