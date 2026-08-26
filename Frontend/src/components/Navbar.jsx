import React, { useState, useEffect } from "react";
import { Search, Heart, Menu, X, User, LogOut, LayoutDashboard, Building2 } from "lucide-react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AthenuraLogo from "../assets/AthenuraLogo.png";

const Navbar = () => {
  const [isUser, setIsUser] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveLink(location.pathname);
    setProfile(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const loadUser = () => {
    try {
      // 1. Check if logged in as Host/Owner
      const hostToken = localStorage.getItem("ownerToken");
      const hostData =
        JSON.parse(localStorage.getItem("owner")) ||
        JSON.parse(localStorage.getItem("hostSession"));

      if (hostToken && hostData) {
        setIsHost(true);
        setIsUser(false);
        setUserData(hostData);
        return;
      }

      // 2. Check if logged in as Tenant/User
      const tenantToken = localStorage.getItem("token");
      const tenantUser =
        JSON.parse(localStorage.getItem("nestesyLoggedInUser")) ||
        JSON.parse(localStorage.getItem("nestesyUser"));

      if (tenantUser || (tenantToken && !localStorage.getItem("adminSession"))) {
        setIsUser(true);
        setIsHost(false);
        setUserData(tenantUser || { name: "My Account" });
        return;
      }

      setIsUser(false);
      setIsHost(false);
      setUserData(null);
    } catch {
      setIsUser(false);
      setIsHost(false);
      setUserData(null);
    }
  };

  useEffect(() => {
    loadUser();

    window.addEventListener("storage", loadUser);
    window.addEventListener("userLogin", loadUser);
    window.addEventListener("hostLogin", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userLogin", loadUser);
      window.removeEventListener("hostLogin", loadUser);
    };
  }, []);

  // Menu items: Hide "Become Host" if the user is already a host
  const menuItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Explore", link: "/explore" },
    ...(!isHost ? [{ name: "Become Host", link: "/become-a-host" }] : []),
    { name: "Reviews", link: "/reviews" },
    { name: "Contact", link: "/contact" },
  ];

  const handleLogout = () => {
    if (isHost) {
      localStorage.removeItem("ownerToken");
      localStorage.removeItem("owner");
      localStorage.removeItem("hostSession");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("nestesyLoggedInUser");
    localStorage.removeItem("nestesyUser");

    setIsUser(false);
    setIsHost(false);
    setUserData(null);
    setProfile(false);
    navigate("/");
  };

  const isLoggedIn = isUser || isHost;
  const dashboardLink = isHost ? "/host" : "/user/dashboard";
  const userDisplayName = userData?.name || (isHost ? "Host" : "User");

  return (
    <>
      <nav className="fixed w-full h-18 bg-white text-gray-800 py-3 flex justify-between md:justify-around items-center z-50 shadow-2xl">
        <Link to="/" className="h-full flex items-center">
          <img
            src={AthenuraLogo}
            alt="Nestesy Logo"
            className="h-full w-full mt-1 md:h-16 md:mt-0"
          />
        </Link>

        {/* Mobile hamburger button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X size={28} className="text-primary-500 mr-5" />
            ) : (
              <Menu size={28} className="text-primary-500 mr-5" />
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex">
          <ul className="flex items-center justify-around gap-10 font-semibold">
            {menuItems.map((item) => (
              <li key={item.link}>
                <NavLink
                  to={item.link}
                  className={`flex flex-col items-center hover:text-primary-500 text-[16px] transition duration-300 ${
                    activeLink === item.link ? "text-primary-500 font-bold" : ""
                  }`}
                >
                  {item.name}
                  {activeLink === item.link && (
                    <motion.span
                      layoutId="active-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 30,
                      }}
                      className="block translate-x-1 h-[2px] w-[25px] bg-primary-500 mt-1 rounded-full"
                    />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => navigate("/wishlist")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart size={20} className="text-primary-500 hover:fill-primary-500 transition-colors" />
          </button>

          {isLoggedIn ? (
            <div
              className="relative"
              onMouseEnter={() => setProfile(true)}
              onMouseLeave={() => setProfile(false)}
            >
              <button
                onClick={() => setProfile(!profile)}
                className={`flex items-center gap-2 py-1.5 px-4 bg-white border-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                  isHost
                    ? "border-emerald-600 text-emerald-700 hover:bg-emerald-700 hover:text-white"
                    : "border-primary-600 text-primary-700 hover:bg-primary-700 hover:text-white"
                }`}
                aria-label="Account menu"
                aria-expanded={profile}
              >
                {isHost ? <Building2 size={18} /> : <User size={18} />}
                <span className="max-w-[120px] truncate">{userDisplayName}</span>
                {isHost && (
                  <span className="text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Host
                  </span>
                )}
              </button>

              <AnimatePresence>
                {profile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 shadow-xl rounded-2xl p-4 w-52 z-50 bg-white text-gray-700 font-medium border border-gray-100"
                    role="menu"
                  >
                    <div className="pb-3 mb-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <h3 className="text-sm font-bold text-gray-800 truncate">
                        {userDisplayName}
                      </h3>
                      <span className="text-xs text-primary-600 font-semibold">
                        {isHost ? "Host Account" : "Tenant Account"}
                      </span>
                    </div>

                    <Link
                      to={dashboardLink}
                      onClick={() => setProfile(false)}
                      className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                      role="menuitem"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    {!isHost && (
                      <Link
                        to="/wishlist"
                        onClick={() => setProfile(false)}
                        className="flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                        role="menuitem"
                      >
                        <Heart size={16} />
                        My Wishlist
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-3 mt-1 text-red-600 flex items-center gap-2 rounded-xl hover:bg-red-50 transition-all duration-200 cursor-pointer"
                      role="menuitem"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-primary-500 text-white font-semibold px-4 py-2 rounded-2xl transition-all duration-300 hover:bg-primary-600 hover:scale-102 cursor-pointer shadow-md shadow-primary-500/20"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-16 bg-black/40 z-20"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="fixed top-16 right-0 h-screen w-72 bg-white shadow-2xl z-50 p-6 flex flex-col justify-between pb-24 overflow-y-auto"
            >
              <div>
                {isLoggedIn && (
                  <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="font-bold text-gray-800 truncate">{userDisplayName}</p>
                    <span className="text-xs text-primary-600 font-semibold">
                      {isHost ? "Host Account" : "User Account"}
                    </span>
                  </div>
                )}

                <ul className="flex flex-col gap-6">
                  {menuItems.map((item) => (
                    <li key={item.link}>
                      <NavLink
                        to={item.link}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `text-lg font-semibold transition ${
                            isActive
                              ? "text-primary-500"
                              : "text-gray-700 hover:text-primary-500"
                          }`
                        }
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/wishlist");
                  }}
                  className="flex items-center justify-center gap-2 border border-primary-500 text-primary-600 rounded-xl py-3 font-semibold"
                >
                  <Heart size={18} />
                  My Wishlist
                </button>

                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate(dashboardLink);
                      }}
                      className="bg-primary-500 text-white rounded-xl py-3 font-semibold shadow-md"
                    >
                      Go to Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="text-red-600 border border-red-200 rounded-xl py-3 font-semibold hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/login");
                    }}
                    className="bg-primary-500 text-white rounded-xl py-3 font-semibold shadow-md"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;