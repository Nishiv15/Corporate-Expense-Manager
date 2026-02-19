import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import useAuthStore from "../../app/authStore";
import { sidebarConfig } from "../../utils/sidebarConfig";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const menuItems = sidebarConfig[user?.userType] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 lg:static top-0 left-0 h-full w-64 bg-white border-r transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <h2 className="text-lg font-semibold text-indigo-600">
            Expense Manager
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                 ${
                   isActive
                     ? "bg-indigo-50 text-indigo-600 font-medium"
                     : "text-gray-600 hover:bg-gray-100"
                 }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;