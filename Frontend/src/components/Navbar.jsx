


import React ,{useState,useEffect} from 'react'
import { IoHomeOutline } from "react-icons/io5";
import { Search ,Heart,Menu, X } from 'lucide-react';
import {NavLink,useLocation,useNavigate} from 'react-router-dom'
import {motion,AnimatePresence} from 'framer-motion'

const Navbar = () => {

    const[isUser,setIsUser]= useState(false);
    const[isHost,setIsHost]= useState(false);
    const[activeLink,setActiverLink]= useState('/');
    const[mobileMenuOpen,setMobileMenuOpen]= useState(false);

const location = useLocation();
const navigate = useNavigate();

useEffect(() => {
  setActiverLink(location.pathname);
}, [location]);

const menuItems = [
  { name: 'Home', link: '/' },
  { name: 'About', link: '/about' },
  { name: 'Explore', link: '/explore' },
  {name:'Become Host' , link:"/become-host"},

  { name: 'Contact', link: '/contact' },
];



  return (
   <>
    <nav className=" fixed w-full bg-white text-gray-800 py-4  flex justify-between md:justify-around items-center z-50">
      <div className="flex items-center gap-2 cursor-pointer p-1">
        <IoHomeOutline size={25} className="font-extrabold text-emerald-500" />
        <h1 className="text-2xl font-bold font-serif mt-1 tracking-wider">NESTESY</h1>
      </div>

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
    <button><Heart size={18} className="text-primary-500"/></button>
    {/* <button className="bg-primary-500 text-white font-semibold px-3 py-2 rounded-2xl flex items-center gap-1"><Search size={18} className="text-white"/>Search</button> */}
<button 
onClick={()=>navigate("/login")}
className="bg-primary-500 text-white font-semibold px-3 py-2 rounded-2xl transition-all duration-300 hover:bg-primary-600 hover:scale-102 ">Login / Sign Up</button>
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