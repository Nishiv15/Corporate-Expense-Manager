import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../app/authStore";

const ProtectedRoute = () => {
  const { isAuthenticated, hasHydrated } = useAuthStore();
  if (!hasHydrated) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
