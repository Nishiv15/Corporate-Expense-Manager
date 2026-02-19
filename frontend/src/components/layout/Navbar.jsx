import { Menu, LogOut } from "lucide-react";
import useAuthStore from "../../app/authStore";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b flex items-center px-4">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* Mobile sidebar toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600"
        >
          <Menu size={22} />
        </button>

        {/* User name */}
        <span className="text-sm font-medium text-gray-700">
          Hello, {user?.name}
        </span>
      </div>

      {/* RIGHT SIDE */}
      <div className="ml-auto">
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-red-500 hover:underline"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;