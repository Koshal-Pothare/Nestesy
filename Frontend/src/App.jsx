import { useState , useLayoutEffect} from 'react'

import './App.css'
import Home from './pages/Home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route ,useLocation , } from 'react-router-dom';
import BecomeHost from './pages/BecomeHost'
import Login from './auth/Login'
import About from './pages/AboutUs'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Contact from "./pages/Contact";

import Explore from './pages/Explore'
import Whishlist from './pages/Wishlist'

//Admin
import AdminLayout from '../src/Admin/AdminLout'
import AdminDashboard from '../src/Admin/AdminDashboard'

// Host 
import HostDashboard from './Host/HostDashboard'
import HostLayout from './Host/HostLayout'


function App() {
  const location = useLocation();
  const pathname = location.pathname;

  useLayoutEffect(() => {
    window.scrollTo(0, 0, 
     );
  }, [pathname]);

  const hideRoutes = [
    "/login",
    "/admin",
    "/host"
   
  ];

  const HideNavbarFooter = hideRoutes.includes(location.pathname);




  return (

    <>
  
      {!HideNavbarFooter &&<Navbar/> }
      <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
       <Route path="/login" element={<Login/>} />
   



             
         <Route path="/explore" element={<Explore/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Whishlist/>} />

         {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> 
        </Route>

        {/* // Host Routes */}
        <Route path="/host" element={<HostLayout />}>
          <Route index element={<HostDashboard />} />
        </Route>

      </Routes>

       

      {!HideNavbarFooter && <Footer />}

       <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="light"
      />

    </>
  );
}
export default App;
