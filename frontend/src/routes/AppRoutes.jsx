import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/guards/ProtectedRoute";
import RoleGuard from "../components/guards/RoleGuard";
import AppLayout from "../components/layout/AppLayout";

import Auth from "../pages/auth/Auth";
import Dashboard from "../pages/dashboard/Dashboard";
import ExpenseList from "../pages/expenses/ExpenseList";
import ExpenseCreate from "../pages/expenses/ExpenseCreate";
import ExpenseDetails from "../pages/expenses/ExpenseDetails";
// import UserList from "../pages/users/UserList";
// import UserCreate from "../pages/users/UserCreate";
// import CompanyDetails from "../pages/company/CompanyDetails";
// import Profile from "../pages/profile/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Auth />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="expenses">
            <Route index element={<ExpenseList />} />
            <Route path="new" element={<ExpenseCreate />} />
            <Route path=":id" element={<ExpenseDetails />} />
          </Route>

          {/* <Route element={<RoleGuard allowed={["manager"]} />}>
            <Route path="users" element={<UserList />} />
            <Route path="users/new" element={<UserCreate />} />
            <Route path="company" element={<CompanyDetails />} />
          </Route> */}

          {/* <Route path="profile" element={<Profile />} /> */}
        </Route>
      </Route>

      {/* Default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
