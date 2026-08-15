import { useState, useLayoutEffect } from 'react'

import './App.css'
import Home from './pages/Home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route, useLocation, } from 'react-router-dom';
import BecomeHost from './pages/BecomeHost'
import Login from './auth/Login'
import About from './pages/About'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Contact from "./pages/Contact";

import Explore from './pages/Explore'
import Whishlist from './pages/Wishlist'
import PropertyDetails from './pages/PropertyDetails'
import ForgotPassword from './auth/ForgotPassword'
import Review from './pages/Review'

//Admin
import AdminLayout from '../src/Admin/AdminLout'
import AdminDashboard from '../src/Admin/AdminDashboard'
import AdminRegister from './auth/AdminRegister'
import AdminLogin from './auth/AdminLogin'
import PropertyVerificationDetail from './Admin/PropertyVerificationDetail'

// Host 
import HostDashboard from './Host/HostDashboard'
import HostLayout from './Host/HostLayout' 
import Faq from './pages/FAQ'
import FAQ from './pages/FAQ' 
import AddProperty from './Host/AddProperty'
import MyProperties from './Host/MyProperties'
import HostAnalytics from './Host/HostAnalytics'



//User
import UserLayout from "./User/UserLayout";
import UserDashboard from "./User/UserDashboard";
import UpcomingVisits from "./User/UpcomingVisits";
import BookingHistory from "./User/BookingHistory";
import UserWishlist from "./User/UserWishlist";
import UserProfile from "./User/UserProfile";
import PrivacyPolicy from '../src/pages/PrivacyPolicy';
import TermsConditions from '../src/pages/TermsCondition';
import UserManagement from '../src/pages/UserManagment';



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
    "/host",
 
    "/host/add-property", 
    "/admin-register",
    "/admin-login", 
    "/user",
    "/forgot-password",
    "/host/my-properties",
    "/host/analytics",

   
  ];

  const HideNavbarFooter = hideRoutes.some((route) =>
  location.pathname.startsWith(route)
);



  return (

    <>

      {!HideNavbarFooter && <Navbar />}
      <Routes>


        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path='/admin-register' element={<AdminRegister />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path="/faq" element={<FAQ/>} />

        <Route path="/property/:id" element={<PropertyDetails />} />
      
  

         <Route path="/privacy-policy" element={<PrivacyPolicy />} />
         <Route path="/terms-conditions" element={<TermsConditions />} />

   


   <Route path="/forgot-password" element={<ForgotPassword />} />




        <Route path="/become-a-host" element={<BecomeHost />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Whishlist />} />
        <Route path="/reviews" element={<Review/>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> 
          <Route path="propertyverification" element={<PropertyVerificationDetail />} />
                   <Route path="users" element={<UserManagement />}/>

        </Route>

        {/* // Host Routes */}
        <Route path="/host" element={<HostLayout />}>
        <Route index element={<HostDashboard />} />
        <Route path="/host/add-property" element={<AddProperty />} />
        <Route path="/host/my-properties" element={<MyProperties />} />
        <Route path="/host/analytics" element={<HostAnalytics />} />
        </Route>







        {/* User Routes */}
        <Route path="/user" element={<UserLayout/>} >
         <Route index element={<UserDashboard />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="upcoming-visits" element={<UpcomingVisits />} />
           <Route path="booking-history" element={<BookingHistory />} />
            <Route path="wishlist" element={<UserWishlist />} />
             <Route path="profile" element={<UserProfile />} />
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
