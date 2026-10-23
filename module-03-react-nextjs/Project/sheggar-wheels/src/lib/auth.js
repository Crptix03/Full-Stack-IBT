// Role and guard helpers — all client-side.

import { getCurrentSession } from "./session";

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

// Combined check — the current user must have this role AND be active.
export function canAccess(role) {
  const user = getCurrentSession();
  if (!user) return { allowed: false, reason: "not_signed_in" };
  if (!isActive(user)) return { allowed: false, reason: "suspended" };
  if (!hasRole(user, role)) return { allowed: false, reason: "wrong_role" };
  return { allowed: true, user };
}