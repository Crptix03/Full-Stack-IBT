// Role helpers — server-safe, no localStorage, no session reads.
// Import getSession() from session.js separately when you need the current user.

import { db } from "./db";
import { newId } from "./id";

export function hasRole(user, role) {
  if (!user || !Array.isArray(user.roles)) return false;
  return user.roles.includes(role);
}

export function isAdmin(user) {
  return hasRole(user, "admin");
}

export function isOwner(user) {
  return hasRole(user, "owner");
}

export function isRenter(user) {
  return hasRole(user, "renter");
}

export function isActive(user) {
  return user?.status === "active";
}

// Find a user by id from the server-side db.
export function findUserById(id) {
  return db.users.find((u) => u.id === id) || null;
}

// Create a new renter account and persist it to the server-side db.
// Called from the signup Server Action.
// Returns { success, user } or { error }.
export function createRenterAccount({ name, email, phone, password }) {
  if (!name || !email) {
    return { error: "Name and email are required." };
  }
  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const emailLower = email.toLowerCase();
  if (db.users.some((u) => u.email.toLowerCase() === emailLower)) {
    return { error: "An account with that email already exists." };
  }

  const user = {
    id: newId("u-renter"),
    name,
    email: emailLower,
    phone: phone || "",
    // ⚠️ Plaintext — demo only. Production would use bcrypt.
    password,
    roles: ["renter"],
    status: "active",
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  return { success: true, user };
}
