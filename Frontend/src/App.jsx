import { useState , useLayoutEffect} from 'react'

import './App.css'
import Home from './pages/Home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route ,useLocation , } from 'react-router-dom';
import BecomeHost from './pages/BecomeHost'
import Login from './auth/Login'
import About from './pages/AboutUs'

import Contact from "./pages/Contact";

import Explore from './pages/Explore'
import Whishlist from './pages/Wishlist'




function App() {
  const location = useLocation();
  const pathname = location.pathname;

  useLayoutEffect(() => {
    window.scrollTo(0, 0, 
     );
  }, [pathname]);

  const hideRoutes = [
    "/login",
   
  ];

  const HideNavbarFooter = hideRoutes.includes(location.pathname);




  return (

    <>
  
      {!HideNavbarFooter &&<Navbar/> }
      <Routes>

        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
       <Route path="/login" element={<Login/>} />
   



             <Route path="/become-a-host" element={<BecomeHost/>} />
         <Route path="/explore" element={<Explore/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Whishlist/>} />

      </Routes>

      {!HideNavbarFooter && <Footer />}

    </>
  );
}
export default App;
