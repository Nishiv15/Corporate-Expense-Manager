import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../app/authStore";

const RoleGuard = ({ allowed }) => {
  const { user } = useAuthStore();

  if (!user || !allowed.includes(user.userType)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
