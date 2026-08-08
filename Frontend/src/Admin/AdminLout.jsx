import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Building2,
  Calendar,
  DollarSign,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  LayoutDashboard,
  Star,
  MessageSquare,
} from 'lucide-react';

// Navigation items  
const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'properties', name: 'Properties', icon: Building2, path: '/admin/properties' },
  { id: 'users', name: 'Users', icon: Users, path: '/admin/users' },
  { id: 'bookings', name: 'Bookings', icon: Calendar, path: '/admin/bookings' },
  { id: 'payments', name: 'Payments', icon: DollarSign, path: '/admin/payments' },
  { id: 'reviews', name: 'Reviews', icon: Star, path: '/admin/reviews' },
  { id: 'inquiries', name: 'Inquiries', icon: MessageSquare, path: '/admin/inquiries' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle responsive
  useEffect(() => {
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

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  const handleLogout = () => { 
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar  */}
      <aside 
        className={`
          fixed lg:sticky lg:top-0 z-50
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
          transition-all duration-300 ease-in-out
          w-72 bg-white border-r border-gray-200 
          h-screen
          flex-shrink-0
          shadow-lg lg:shadow-none
          flex flex-col
          overflow-hidden
        `}
      >
        {/* Logo  */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50/50 to-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center shadow-lg shadow-green-200">
              <Home className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Nestesy</h1>
              <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation - Full height with no overflow */}
        <nav className="p-4 flex-1 flex flex-col overflow-hidden">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold px-4 mb-3 flex-shrink-0">
            Main Menu
          </p>
          <div className="space-y-1 flex-1 overflow-hidden">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-green-50 to-green-100/50 text-green-700 font-semibold shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }
                  `}
                >
                  <item.icon 
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`} 
                  />
                  <span className="text-sm">{item.name}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-8 bg-gradient-to-b from-green-500 to-green-300 rounded-full" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom section - Fixed at bottom */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-white">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600" />
            <span className="text-sm font-medium">Logout</span>
          </button>

          {/* User Profile Card */}
          <div className="mt-3 p-4 bg-gradient-to-r from-green-50 to-blue-50/50 rounded-xl border border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                AD
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 hidden sm:block">
                  {navigation.find(item => item.path === location.pathname)?.name || 'Dashboard'}
                </h2>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  Live
                </span>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 transition-all">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none ml-2 text-sm w-32 lg:w-48 text-gray-700 placeholder:text-gray-400"
                />
                <kbd className="ml-2 px-2 py-0.5 bg-gray-200 rounded text-xs text-gray-500 hidden lg:block">
                  ⌘K
                </kbd>
              </div>

              {/* Profile */}
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 pr-3 rounded-xl transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center text-white font-semibold text-sm">
                  AD
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
              </div>
            </div>
          </div>
        </header>
 
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;