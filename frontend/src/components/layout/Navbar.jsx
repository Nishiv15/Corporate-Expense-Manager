import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, LogOut, Bell, ChevronDown, Shield, UserCircle, Settings } from "lucide-react";
import useAuthStore from "../../app/authStore";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/expenses")) return "Expenses";
    if (path.includes("/users")) return "Users";
    if (path.includes("/profile")) return "Profile";
    return "Overview";
  };

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
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-6 transition-all duration-300">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* Mobile sidebar toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-600 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>

        {/* Dynamic Title / Breadcrumb */}
        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <span>SpendSync</span>
            <span>/</span>
            <span className="text-slate-500 font-normal">{getPageTitle()}</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-800 tracking-tight leading-none mt-0.5">
            {getPageTitle()}
          </h1>
        </div>

        {/* Mobile view page title (smaller) */}
        <h1 className="sm:hidden text-base font-semibold text-slate-800">
          {getPageTitle()}
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="ml-auto flex items-center gap-4">

        <div className="h-6 w-px bg-slate-200" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 pr-2 rounded-full hover:bg-slate-50 transition-all duration-200 cursor-pointer group"
          >
            {/* Avatar */}
            <div className="h-8.5 w-8.5 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 text-white font-semibold text-xs flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              {getInitials(user?.name)}
            </div>

            {/* User Info (hidden on mobile) */}
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-700 leading-tight">
                {user?.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium capitalize">
                {user?.userType}
              </span>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180 text-indigo-600" : ""}`} />
          </button>

          {/* Dropdown Card */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/50 py-2.5 transition-all duration-200">
              {/* Header profile info */}
              <div className="px-4 py-2 border-b border-slate-50 pb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 text-white font-semibold text-sm flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
                  {getInitials(user?.name)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-800 truncate">
                    {user?.name}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate mb-1">
                    {user?.email || "No email available"}
                  </span>
                  <div className="flex items-center gap-1 self-start bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-100/50">
                    <Shield size={10} />
                    <span className="capitalize">{user?.userType}</span>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <div className="p-1.5">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors font-medium text-left cursor-pointer border-none"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;