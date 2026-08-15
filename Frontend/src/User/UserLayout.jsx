import React, { useEffect ,useState} from "react";
import { NavLink, Outlet,useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  History,
  Heart,
  User,
  LogOut,
   ArrowLeft 
} from "lucide-react";
import WishlistSidebar from "../components/WishlistSidebar";
import AthenuraLogo from '../assets/AthenuraLogo.png'

const UserLayout = () => {
const navigate = useNavigate();
const[userData,setUserData] = useState([]);

useEffect(()=>{
const user = JSON.parse(localStorage.getItem("nestesyLoggedInUser"));
setUserData(user);
},[])

  const navLinks = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Upcoming Visits",
      path: "/user/upcoming-visits",
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

  const handleLogout=()=>{
    localStorage.removeItem("nestesyLoggedInUser");
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 w-72 h-screen bg-white border-r border-gray-200 p-6 flex flex-col">

        {/* Logo */}
        <div className="mb-10">
          <div className=" w-35 h-20  flex justify-center items-center">
            <img src={AthenuraLogo} className="bg-cover bg-center w-full " />
            </div>

          <p className="text-md text-gray-800 font-semibold  mt-1">
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


      {/* back to website */}
        <button 
        onClick={()=>navigate("/")}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-primarey-500 transition cursor-pointer">
          <  ArrowLeft size={20} />
          Back to website
        </button>

        {/* Logout */}
        <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition">
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
              Welcome Back <span className="text-primary-600 font-bold">{userData.name}</span>👋
            </h2>

            <p className="text-sm text-gray-500">
              Manage your Nestesy account
            </p>
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