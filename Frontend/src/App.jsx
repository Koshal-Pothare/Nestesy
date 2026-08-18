import { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import BecomeHost from "./pages/BecomeHost";
import Contact from "./pages/Contact";
import Explore from "./pages/Explore";
import Wishlist from "./pages/Wishlist";
import PropertyDetails from "./pages/PropertyDetails";
import Review from "./pages/Review";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsCondition";

import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import AdminRegister from "./auth/AdminRegister";
import AdminLogin from "./auth/AdminLogin";

import HostLogin from "./Host/HostLogin";
import HostRegister from "./Host/HostRegister";

import AdminLayout from "./Admin/AdminLout";
import AdminDashboard from "./Admin/AdminDashboard";
import PropertyVerificationDetail from "./Admin/PropertyVerificationDetail";
import HostManagement from "./Admin/HostManagement";
import HostDetails from "./Admin/HostDetail";

import HostDashboard from "./Host/HostDashboard";
import HostLayout from "./Host/HostLayout";
import AddProperty from "./Host/AddProperty";
import MyProperties from "./Host/MyProperties";
import HostAnalytics from "./Host/HostAnalytics";
import HostPropertyDetails from "./Host/HostPropertyDetails";
import VisitManagement from "./Host/VisitManagement";

import UserLayout from "./User/UserLayout";
import UserDashboard from "./User/UserDashboard";
import UpcomingVisits from "./User/UpcomingVisits";
import BookingHistory from "./User/BookingHistory";
import UserWishlist from "./User/UserWishlist";
import UserProfile from "./User/UserProfile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const hideLayout = [
    "/login",
    "/admin",
    "/admin-register",
    "/admin-login",
    "/host",
    "/user",
    "/forgot-password",
  ];

  const hideNavbarFooter = hideLayout.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/become-a-host"
          element={<BecomeHost />}
        />

        <Route path="/explore" element={<Explore />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/reviews" element={<Review />} />

        <Route path="/faq" element={<FAQ />} />

        <Route
          path="/property/:id"
          element={<PropertyDetails />}
        />

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms-conditions"
          element={<TermsConditions />}
        />

        <Route
          path="/admin-register"
          element={<AdminRegister />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route path="/admin" element={<AdminLayout />}>
          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="propertyverification"
            element={<PropertyVerificationDetail />}
          />

          <Route
            path="hosts"
            element={<HostManagement />}
          />

          <Route
            path="hosts/:id"
            element={<HostDetails />}
          />
        </Route>

        <Route
          path="/host/login"
          element={<HostLogin />}
        />

        <Route
          path="/host/register"
          element={<HostRegister />}
        />

        <Route path="/host" element={<HostLayout />}>
          <Route
            index
            element={<HostDashboard />}
          />

          <Route
            path="add-property"
            element={<AddProperty />}
          />

          <Route
            path="my-properties"
            element={<MyProperties />}
          />

          <Route
            path="analytics"
            element={<HostAnalytics />}
          />

          <Route
            path="property/:id"
            element={<HostPropertyDetails />}
          />

          <Route
            path="visits"
            element={<VisitManagement />}
          />
        </Route>

        <Route path="/user" element={<UserLayout />}>
          <Route
            index
            element={<UserDashboard />}
          />

          <Route
            path="dashboard"
            element={<UserDashboard />}
          />

          <Route
            path="upcoming-visits"
            element={<UpcomingVisits />}
          />

          <Route
            path="booking-history"
            element={<BookingHistory />}
          />

          <Route
            path="wishlist"
            element={<UserWishlist />}
          />

          <Route
            path="profile"
            element={<UserProfile />}
          />
        </Route>
      </Routes>

      {!hideNavbarFooter && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="light"
      />
    </>
  );
}

export default App;