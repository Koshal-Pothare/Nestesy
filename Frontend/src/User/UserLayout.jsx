import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  History,
  Heart,
  User,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import AthenuraLogo from "../assets/AthenuraLogo.png";

const UserLayout = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const user = JSON.parse(
      localStorage.getItem("nestesyLoggedInUser") ||
        localStorage.getItem("nestesyUser") ||
        "null"
    );

    if (!token && !user) {
      navigate("/login", { replace: true });
    } else {
      setUserData(user || {});
    }
  }, [navigate]);

  const navLinks = [
    { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
    { name: "Upcoming Visits", path: "/user/upcoming-visits", icon: CalendarCheck },
    { name: "Booking History", path: "/user/booking-history", icon: History },
    { name: "Wishlist", path: "/user/wishlist", icon: Heart },
    { name: "Profile", path: "/user/profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("nestesyLoggedInUser");
    setIsSidebarOpen(false);
    navigate("/");
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 w-72 h-screen bg-white border-r border-gray-200 p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Mobile close button */}
        <button
          onClick={closeSidebar}
          className="absolute top-5 right-5 flex md:hidden items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
        >
          <X size={22} />
        </button>

        {/* Logo */}
        <div className="mb-10">
          <div className="w-35 h-20 flex justify-center items-center">
            <img
              src={AthenuraLogo}
              alt="Athenura Logo"
              className="w-full"
            />
          </div>

          <p className="text-md text-gray-800 font-semibold mt-1">
            User Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                      : "text-gray-600 hover:bg-primary-50 hover:text-primary-700"
                  }`
                }
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Back to website */}
        <button
          onClick={() => {
            closeSidebar();
            navigate("/");
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-primary-600 transition"
        >
          <ArrowLeft size={20} />
          <span>Back to website</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main content */}
      <main className="ml-0 md:ml-72 min-h-screen">

        {/* Header */}
        <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 md:px-8">

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex md:hidden items-center justify-center w-10 h-10 rounded-xl text-gray-700 hover:bg-gray-100 transition shrink-0"
          >
            <Menu size={24} />
          </button>

          {/* Welcome text */}
          <div className="ml-0 md:ml-0">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              Welcome Back{" "}
              <span className="text-primary-600 font-bold">
                {userData?.name || "User"}
              </span>
              👋
            </h2>

            <p className="text-xs sm:text-sm text-gray-500">
              Manage your Nestesy account
            </p>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;