import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  History,
  Heart,
  User,
  LogOut,
} from "lucide-react";
import WishlistSidebar from "../components/WishlistSidebar";

const UserLayout = () => {
  const navLinks = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Active Booking",
      path: "/user/active-booking",
      icon: CalendarCheck,
    },
    {
      name: "Booking History",
      path: "/user/booking-history",
      icon: History,
    },
    {
      name: "Wishlist",
      path: "/user/wishlist",
      icon: Heart,
    },
    {
      name: "Profile",
      path: "/user/profile",
      icon: User,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 w-72 h-screen bg-white border-r border-gray-200 p-6 flex flex-col">

        {/* Logo */}
        <div className="mb-10">
          <h1 className="text-3xl font-serif font-bold text-primary-700">
            Nestesy
          </h1>

          <p className="text-sm text-gray-500 mt-1">
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

      

        {/* Logout */}
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition">
          <LogOut size={20} />
          Logout
        </button>

      </aside>


      {/* Right Content */}
      <main className="ml-72 h-screen overflow-y-auto">

        {/* Header */}
        <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-8">

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome Back 👋
            </h2>

            <p className="text-sm text-gray-500">
              Manage your Nestesy account
            </p>
          </div>

          <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
            KP
          </div>

        </header>


        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default UserLayout;