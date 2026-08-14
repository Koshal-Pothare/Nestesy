import React from 'react'
import { IoHomeOutline } from "react-icons/io5";
import { FaLinkedin, FaFacebookF } from "react-icons/fa";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { motion } from 'framer-motion'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react';
import WhiteLogo from '../assets/WhiteLogo.png'

const Footer = () => {
  const Navigate = useNavigate();

  const menuItems = [
    { name: 'Home', link: '/' },
    { name: 'About', link: '/about' },
    { name: 'Explore', link: '/explore' },
    { name: 'Become Host', link: "/become-a-host" },
    {name:"Reviews" , link:"/reviews"}


  ];

  return (
    <>
      <section className="bg-footer text-white py-8 ">

         <div className="container max-w-7xl mx-auto">
          <motion.div
              className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 px-4 py-2 space-y-5 md:space-y-0">
             <div className="md:ml-10">
              <div className="flex items-center justify-center w-35 h-20 cursor-pointer">
               <img src={WhiteLogo} className="bg-cover bg-center w-full " />
              </div>
              <p className="mt-3">Find home that feels likes yours. <br /> Trusted stays. Happy living</p>
              <div className="flex gap-3 mt-5">
                <a href="#" className="text-white hover:bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center bg-emerald-600">
                  <FaFacebookF size={20} />
                </a>
                <a href="#" className="text-white hover:bg-pink-600 h-10 w-10 rounded-full flex items-center justify-center bg-emerald-600">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-white hover:bg-gray-900 h-10 w-10 rounded-full flex items-center justify-center bg-emerald-600">
                  <FaXTwitter size={20} />
                </a>
                <a href="#" className="text-white hover:bg-blue-500 h-10 w-10 rounded-full flex items-center justify-center bg-emerald-600">
                  <FaLinkedin size={20} />
                </a>
              </div>

             </div>


             <div className="  text-left md:text-center mt-5">
              <h1 className="text-2xl">Quick Links</h1>
              <ul className="flex flex-col gap-2 mt-2 ">
                {menuItems.map((item) => (
                  <li key={item.link}>
                    <a href={item.link}
                      className=" text-gray-400 hover:text-emerald-500  transition duration-300">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
             </div>

             <div className='mt-5'>
              <h1 className="text-2xl font-semibold">Support</h1>
              <ul className="mt-2 space-y-2">

                <li><Link to='/faq' className="text-gray-400 hover:text-emerald-500  transition duration-300" >FAQ</Link></li>
                <li>  <Link to="/terms-conditions" className="text-gray-400 hover:text-emerald-500 transition duration-300">Terms & Conditions</Link></li>
                <li><Link to="/privacy-policy" className="text-gray-400 hover:text-emerald-500 transition duration-300">Privacy Policy</Link></li>
                 
                 
                </ul>
                </div>

                <div>
                  <h1 className="text-2xl font-semibold mt-5">Contact Us</h1>
                  <ul className="mt-2 space-y-2">
                    <li className="text-gray-400 hover:text-emerald-500  transition duration-300 cursor-pointer flex items-center gap-2"><Mail size={15} className="text-emerald-400" /> : info@nestesy.com</li>
                    <li className="text-gray-400 hover:text-emerald-500  transition duration-300 cursor-pointer flex items-center gap-2"><Phone size={15} className="text-emerald-400" /> : +91 90334 65887</li>
                    <li className="text-gray-400 hover:text-emerald-500  transition duration-300 cursor-pointer flex items-center gap-2"><MapPin size={15} className="text-emerald-400" /> : Sector 27 Delhi , India</li>
                  </ul>
                </div>

           

             

       
         
          </motion.div>
           <div className="w-full h-px bg-emerald-300 mt-10 " />
              <p className="text-center mt-3 text-gray-400">All right reserved &copy; 2026 NESTESY</p>
 
        </div>
        </section>
        </>
        )
}

export default Footer;