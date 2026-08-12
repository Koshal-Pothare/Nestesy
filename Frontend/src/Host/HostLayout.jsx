import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Plus,
  BarChart2,
  Users,
  X,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Building2,
  MessageSquare,
  TrendingUp,
  Star,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HostLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Handle window resize for mobile
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation items - Removed Settings
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      path: '/host'
    },
    { 
      id: 'properties', 
      label: 'My Properties', 
      icon: Building2,
      path: '/host/my-properties'
    },
    { 
      id: 'add-property', 
      label: 'Add Property', 
      icon: Plus,
      path: '/host/add-property'
    },
    { 
      id: 'inquiries', 
      label: 'Inquiries', 
      icon: MessageSquare,
      path: '/host/inquiries'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: TrendingUp,
      path: '/host/analytics'
    }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const handleBackToWebsite = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:translate-x-0 transition-transform duration-300`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">NESTESY</h2>
                <p className="text-xs text-gray-500">Host Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-green-50 text-green-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`
                }
                onClick={() => {
                  if (isMobile) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <item.icon className={`w-5 h-5 ${
                  ({ isActive }) => isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                <span className="font-medium text-sm">{item.label}</span>
                {item.id === 'add-property'  }
              </NavLink>
            ))}
          </div>

          {/* Back to Website Button */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={handleBackToWebsite}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              <span className="font-medium text-sm">Back to Website</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer user profile */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">host@nestesy.com</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0"> 
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-800">Host Dashboard</h1>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Pro
                </span>
              </div>
            </div> 
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default HostLayout;