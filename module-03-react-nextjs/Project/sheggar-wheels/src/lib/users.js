
import { db } from "./db";

export function findUserById(id) {
  return db.users.find((u) => u.id === id) || null;
}

export function findUserByUsername(username) {
  if (!username) return null;
  const lower = username.toLowerCase();
  return (
    db.users.find(
      (u) =>
        (u.username && u.username.toLowerCase() === lower) ||
        (u.email && u.email.toLowerCase() === lower)
    ) || null
  );
}
