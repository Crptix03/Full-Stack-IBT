import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function RequireAdmin({ children }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  if (!currentUser.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}