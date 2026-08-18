


import React ,{useState,useEffect} from 'react'
import { IoHomeOutline } from "react-icons/io5";
import { Search ,Heart,Menu, X ,User,LogOut} from 'lucide-react';
import {NavLink,useLocation,useNavigate,Link} from 'react-router-dom'
import {motion,AnimatePresence} from 'framer-motion'
import AthenuraLogo from '../assets/AthenuraLogo.png'
import Logo from '../assets/Logo.png'

const Navbar = () => {

    const[isUser,setIsUser]= useState(false);
    const[userData,setUserData]=useState()
    const[profile,setProfile]= useState(false);
    const[isHost,setIsHost]= useState(false);
    const[activeLink,setActiverLink]= useState('/');
    const[mobileMenuOpen,setMobileMenuOpen]= useState(false);

const location = useLocation();
const navigate = useNavigate();

useEffect(() => {
  setActiverLink(location.pathname);
}, [location]);

useEffect(() => {
  const loadUser = () => {
    const user = JSON.parse(localStorage.getItem("nestesyLoggedInUser"));
    setUserData(user);
    setIsUser(!!user);
  };

  loadUser();

  window.addEventListener("storage", loadUser);

  return () => {
    window.removeEventListener("storage", loadUser);
  };
}, []);


const menuItems = [
  { name: 'Home', link: '/' },
  { name: 'About', link: '/about' },
  { name: 'Explore', link: '/explore' },
  {name:'Become Host' , link:"/become-a-host"},
   {name:"Reviews" , link:"/reviews"},
  { name: 'Contact', link: '/contact' },
];

const handleLogout = () => {
  localStorage.removeItem("nestesyLoggedInUser");
  setIsUser(false);

}


  return (
   <>
    <nav className=" fixed w-full h-18 bg-white text-gray-800 py-3  flex justify-between md:justify-around items-center z-50 shadow-2xl ">
      <Link to="/" className="h-full flex items-center">
          <img
            src={AthenuraLogo}
            alt="Athenura Logo"
            className="h-full w-full mt-1 md:h-16 md:mt-0"
          />
        </Link>

        {/* mobile navbar menu */}
      <div className="md:hidden">
  <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="p-2"
  >
    {mobileMenuOpen ? (
      <X size={28} className="text-primary-500 mr-5" />
    ) : (
      <Menu size={28} className="text-primary-500 mr-5" />
    )}
  </button>
</div>

{/* desktop menu */}
<div className="hidden md:flex">
    <ul className="flex items-center justify-around  gap-10 font-semibold ">
        {menuItems.map((item) => (
          <li key={item.link}>
            <NavLink to={item.link} className={`flex flex-col items-center  hover:text-primary-500 text-[16px] transition duration-300 ${activeLink === item.link ? 'text-primary-500 font-bold' : ''}`}>
              {item.name}
              {activeLink === item.link && (
                <motion.span 
                 layoutId="active-indicator"
                  transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 30,
                            }}
                
                className="block translate-x-1 h-[2px] w-[25px]  bg-primary-500 mt-1 rounded-full"></motion.span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
</div>

<div className=" hidden md:flex gap-4 ">
    <button onClick={()=>navigate("/wishlist")} 
      className="cursor-pointer"
      ><Heart size={18} className="text-primary-500"/></button>
  
    {/* <button className="bg-primary-500 text-white font-semibold px-3 py-2 rounded-2xl flex items-center gap-1"><Search size={18} className="text-white"/>Search</button> */}

{isUser ? 
(<>
    <div
              className="relative"
              onMouseEnter={() => setProfile(true)}
              onMouseLeave={() =>  setProfile(false)}
              onClick={() => setProfile(!profile)}
            >
              <button
                className="flex items-center gap-2 py-1.5 px-4 bg-white border-2 border-primary-600 rounded-full text-primary-700 cursor-pointer font-semibold transition-all duration-300 hover:scale-105 hover:bg-primary-700 hover:text-white hover:border-primary-700"
                aria-label="User profile menu"
                aria-expanded={profile}
              >
                <User size={18} />
                {userData?.name || "Profile"}
              </button>

              <AnimatePresence>
                {profile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full -right-20 mt-2 shadow-lg rounded-xl p-4 w-48 z-50 bg-linear-to-b from-primary-50 to-primary-100 text-primary-600 font-semibold border border-primary-200"
                    role="menu"
                  >
                    <div className="pb-3 mb-3 border-b border-primary-200">
                      <h3 className="text-sm text-primary-500">
                        Hello,{" "}
                        <span className="text-primary-700 font-bold">
                          {userData?.name}
                        </span>
                      </h3>
                     
                    </div>

                    <Link
                      to="/user/dashboard"
                      onClick={() => setProfile(false)}
                      className="block py-2 px-3 rounded-lg hover:bg-primary-200/50 hover:text-priamry-500 transition-all duration-200"
                      role="menuitem"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-3 mt-1 text-red-600 flex items-center gap-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                      role="menuitem"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
</>):(<>
<button 
onClick={()=>navigate("/login")}
className="bg-primary-500 text-white font-semibold px-3 py-2 rounded-2xl transition-all duration-300 hover:bg-primary-600 hover:scale-102 ">Login / Sign Up</button>
</>)}

</div>
      

    </nav>

{/* mobile menu */}
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
        className="fixed top-16 right-0 h-screen w-72 bg-white shadow-2xl z-50 p-6"
      >
        <ul className="mt-2 flex flex-col gap-8">
          {menuItems.map((item) => (
            <li key={item.link}>
              <NavLink
                to={item.link}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-semibold transition  ${
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

        <div className="mt-12 flex flex-col gap-4">
          <button className="bg-primary-500 text-white rounded-xl py-3">
            Search
          </button>

          <button
          onClick=
          {()=>navigate("/login")}
          className="border border-primary-500 text-primary-500 rounded-xl py-3">
            Login / Sign Up
          </button>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>


   </>
  )
}

export default Navbar