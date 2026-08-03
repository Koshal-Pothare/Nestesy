import { useState , useLayoutEffect} from 'react'

import './App.css'
import Home from './pages/Home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route ,useLocation , } from 'react-router-dom';
import SignUp from './auth/SignUp'
import Login from './auth/Login'

function App() {
  const location = useLocation();
  const pathname = Location.pathname;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const hideRoutes =[
    "/login",
    "/signup"
  ]

  const HideNavbarFooter = hideRoutes.includes(location.pathname);


  return (
    <>
  
      {!HideNavbarFooter &&<Navbar/> }
      <Routes>
        <Route path="/" element={<Home/>} />
       
       <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />

      </Routes>


      {!HideNavbarFooter &&<Footer/> }
    </>
  )
}

export default App
