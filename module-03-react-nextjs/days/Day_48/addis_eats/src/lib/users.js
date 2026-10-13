export const users = [
  {
    id: "u-chef",
    username: "chef",
    password: "kitchen2026",
    role: "staff",
  },
  {
    id: "u-abebe",
    username: "Abebe",
    password: "demo2026",
    role: "customer",
  },
  {
    id: "u-bekele",
    username: "Bekele",
    password: "Bekele2026",
    role: "customer",
  },
  {
    id: "u-sara",
    username: "Sara",
    password: "sara2026",
    role: "customer",
  },
];

export function findUserByUsername(username) {
  return (
    users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    ) || null
  );
}

export function findUserById(id) {
  return users.find((u) => u.id === id) || null;
}