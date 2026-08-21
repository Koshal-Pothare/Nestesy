import React, { useEffect, useState } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Home,
  Plus,
  X,
  LogOut,
  LayoutDashboard,
  Building2,
  MessageSquare,
  TrendingUp,
  ArrowLeft,
  Menu,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const HostLayout = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    try {
      const storedOwner = localStorage.getItem("owner");

      if (storedOwner) {
        setOwner(JSON.parse(storedOwner));
      }
    } catch (error) {
      console.error("Failed to read owner data:", error);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;

      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/host",
      end: true,
    },
    {
      id: "properties",
      label: "My Properties",
      icon: Building2,
      path: "/host/my-properties",
    },
    {
      id: "add-property",
      label: "Add Property",
      icon: Plus,
      path: "/host/add-property",
    },
    {
      id: "visits",
      label: "Visits",
      icon: MessageSquare,
      path: "/host/visits",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: TrendingUp,
      path: "/host/analytics",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    localStorage.removeItem("owner");

    navigate("/become-a-host", {
      replace: true,
    });
  };

  const handleBackToWebsite = () => {
    navigate("/");
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const ownerName =
    owner?.name ||
    owner?.fullName ||
    owner?.username ||
    "Host";

  const ownerEmail =
    owner?.email ||
    "host@nestesy.com";

  const ownerInitials = ownerName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: isMobile
            ? sidebarOpen
              ? 0
              : -288
            : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="fixed lg:static inset-y-0 left-0 w-72 bg-white shadow-2xl lg:shadow-sm border-r border-gray-100 z-50 flex flex-col"
      >

        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <Home className="w-6 h-6 text-white" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  NESTESY
                </h2>

                <p className="text-xs text-gray-500">
                  Host Dashboard
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.end}
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-green-50 text-green-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive
                            ? "text-green-600"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />

                      <span className="font-medium text-sm">
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleBackToWebsite}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />

              <span className="font-medium text-sm">
                Back to Website
              </span>
            </button>
          </div>

        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl">

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
              {ownerInitials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {ownerName}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {ownerEmail}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
            </button>

          </div>
        </div>

      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">

        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Open sidebar"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-800">
                    Host Dashboard
                  </h1>

                  <span className="hidden sm:inline-flex px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Pro
                  </span>
                </div>

                <p className="hidden sm:block text-xs text-gray-500 mt-0.5">
                  Manage your properties and bookings
                </p>
              </div>

            </div>

          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default HostLayout;