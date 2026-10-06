export const users = [
  {
    id: "u-chef",
    username: "chef",
    password: "kitchen2026",
    role: "staff",
  },
  {
    id: "u-customer_1",
    username: "Abebe",
    password: "demo2026",
    role: "Abebe",
  },
  {
    id: "u-customer_2",
    username: "Bekele",
    password: "Bekele2026",
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