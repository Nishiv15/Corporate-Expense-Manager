import {
  LayoutDashboard,
  Receipt,
  Users,
  UserCircle
} from "lucide-react";

export const sidebarConfig = {
  employee: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/app/dashboard" },
    { label: "Expenses", icon: Receipt, path: "/app/expenses" },
    { label: "Profile", icon: UserCircle, path: "/app/profile" }
  ],
  manager: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/app/dashboard" },
    { label: "Expenses", icon: Receipt, path: "/app/expenses" },
    { label: "Users", icon: Users, path: "/app/users" },
    { label: "Profile", icon: UserCircle, path: "/app/profile" }
  ]
};
