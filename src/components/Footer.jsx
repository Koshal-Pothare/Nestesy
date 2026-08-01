import React from 'react'
import { IoHomeOutline } from "react-icons/io5";
import {     FaLinkedin,FaFacebookF } from "react-icons/fa";
import { FaInstagram ,FaXTwitter } from "react-icons/fa6";
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
import { Mail,Phone ,MapPin } from 'lucide-react';

const Footer = () => {

const menuItems = [
  { name: 'Home', link: '/' },
  { name: 'About', link: '/about' },
  { name: 'Explore', link: '/explore' },
  {name:'Become Host' , link:"/become-host"},

 
];

  return (
    <>
    <section className="bg-footer text-white py-8 ">

        <div className="container max-w-7xl mx-auto">
        <motion.div
        
        
        
        className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 px-4 space-y-5 md:space-y-0">
            <div className="md:ml-10">
                <div className="flex items-center gap-2 cursor-pointer">
                    <IoHomeOutline size={27} className="text-xl text-primary-400" />
                    <h1 className="text-3xl font-serif ">NESTESY</h1>
                    </div>  
                <p className="mt-3">Find home that feels likes yours. <br/> Trusted stays. Happy living</p>
                <div className="flex gap-3 mt-5">
                    <a href="#" className="text-white hover:bg-blue-400 h-10 w-10 rounded-full flex items-center justify-center bg-primary-500">
                        <FaFacebookF size={20} />
                    </a>
                    <a href="#" className="text-white hover:bg-pink-600 h-10 w-10 rounded-full flex items-center justify-center bg-primary-500">
                        <FaInstagram size={20}/>
                    </a>
                    <a href="#" className="text-white hover:bg-gray-900 h-10 w-10 rounded-full flex items-center justify-center bg-primary-500">
                        <FaXTwitter size={20}/>
                    </a>
                    <a href="#" className="text-white hover:bg-blue-500 h-10 w-10 rounded-full flex items-center justify-center bg-primary-500">
                        <FaLinkedin size={20} />
                    </a>
                </div>
                
            </div>


          <div className="  text-left md:text-center">
            <h1 className="text-2xl">Quick Links</h1>
            <ul className="flex flex-col gap-2 mt-2 ">
                {menuItems.map((item) => (
                    <li key={item.link}>
                      <a href={item.link}
                        className=" text-gray-400 hover:text-primary-300  transition duration-300">
                        {item.name}
                      </a>
                    </li>
                  ))}
            </ul>
          </div>

          <div>
            <h1 className="text-2xl font-semibold">Support</h1>
            <ul className="mt-2 space-y-2">
                <li><Link  className="text-gray-400 hover:text-primary-300  transition duration-300">Help Center</Link></li>
                 <li><Link  className="text-gray-400 hover:text-primary-300  transition duration-300">Terms & Condition</Link></li>
                  <li><Link  className="text-gray-400 hover:text-primary-300  transition duration-300">Privact Policy </Link></li>
                
            </ul>
          </div>
           
           <div>
            <h1 className="text-2xl font-semibold">Contact Us</h1> 
            <ul className="mt-2 space-y-2">
                <li className="text-gray-400 hover:text-primary-300  transition duration-300 cursor-pointer flex items-center gap-2"><Mail size={15} className="text-primary-400" /> : info@nestesy.com</li>
                <li className="text-gray-400 hover:text-primary-300  transition duration-300 cursor-pointer flex items-center gap-2"><Phone size={15} className="text-primary-400" /> : +1 (123) 456-7890</li>
                <li className="text-gray-400 hover:text-primary-300  transition duration-300 cursor-pointer flex items-center gap-2"><MapPin size={15} className="text-primary-400" /> : 123 Main Street, City, Country</li>
            </ul>
           </div>

        </motion.div>
           
           <div className="w-full h-0.5 bg-primary-300 mt-10 "  />
        <p className="text-center mt-3">All right reserved &copy; 2026 NESTESY</p>

</div>
    </section>
    </>
  )
}

export default Footer