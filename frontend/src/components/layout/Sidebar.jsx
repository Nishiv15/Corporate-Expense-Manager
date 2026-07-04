import { NavLink, Link } from "react-router-dom";
import { X, Wallet, ChevronRight } from "lucide-react";
import useAuthStore from "../../app/authStore";
import { sidebarConfig } from "../../utils/sidebarConfig";

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const menuItems = sidebarConfig[user?.userType] || [];

  const getInitials = (name) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 lg:static top-0 left-0 h-full w-64 bg-white border-r border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
          <Link to="/app/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-200 transition-transform duration-300 group-hover:rotate-6">
              <Wallet size={18} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-800 tracking-tight leading-none">
                SpendSync
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider mt-0.5 uppercase">
                Finance Hub
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
            Menu
          </div>
          {menuItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group cursor-pointer
                 ${
                   isActive
                     ? "bg-indigo-50/70 text-indigo-600 font-semibold shadow-sm shadow-indigo-50/20"
                     : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                 }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className="transition-transform duration-200 group-hover:scale-110" />
                <span>{label}</span>
              </div>
              <ChevronRight
                size={14}
                className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-indigo-500"
              />
            </NavLink>
          ))}
        </nav>

        {/* Profile Card Footer */}
        {user && (
          <div className="p-4 border-t border-slate-100 mt-auto bg-slate-50/30">
            <Link
              to="/app/profile"
              onClick={onClose}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm hover:border-slate-100 border border-transparent transition-all duration-300 group"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform duration-200">
                {getInitials(user?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                  {user?.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate capitalize font-medium">
                  {user?.userType}
                </p>
              </div>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;