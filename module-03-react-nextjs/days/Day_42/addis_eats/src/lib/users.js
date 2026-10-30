// ⚠️ DEMO ONLY — passwords are stored in plaintext.

export const users = [
  {
    id: "u-chef",
    username: "chef",
    password: "kitchen2026",
    role: "staff",
  },
  {
    id: "u-customer",
    username: "customer",
    password: "demo2026",
    role: "customer",
  },
];

export function findUserByUsername(username) {
  return users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  ) || null;
}

export function findUserById(id) {
  return users.find((u) => u.id === id) || null;
}