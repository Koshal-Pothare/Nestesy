import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CalendarCheck,
  Heart,
  Star,
  ArrowRight,
  MapPin,
  ChevronRight,
  UserRound,
  CheckCircle2,
  FileText,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  WishlistService,
  BookingService,
  AuthService,
} from "../services/UserServices";
import { getFavorites, removeFromFavorites } from "../utils/favorite";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";

const UserDashboard = () => {
  const navigate = useNavigate();

  const [favorite, setFavorite] = useState([]);
  const [visits, setVisits] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizeFav = (fav) => ({
    ...fav,
    id: String(fav.propertyId || fav._id || fav.id || ""),
    _id: String(fav.propertyId || fav._id || fav.id || ""),
    propertyId: String(fav.propertyId || fav._id || fav.id || ""),
    title: fav.title || fav.name || "Untitled Property",
    location:
      fav.location ||
      [fav.locality, fav.city, fav.state].filter(Boolean).join(", ") ||
      fav.address ||
      "Location not available",
    price: Number(fav.price || fav.rent || 0),
    bedrooms: Number(fav.bedrooms || fav.bhk || 0),
    bathrooms: Number(fav.bathrooms || 0),
    area: Number(fav.area || fav.squareFeet || 0),
    images:
      Array.isArray(fav.images) && fav.images.length > 0
        ? fav.images
        : Array.isArray(fav.allImages) && fav.allImages.length > 0
        ? fav.allImages
        : [FALLBACK_IMAGE],
    status: fav.status || "active",
  });

  const loadFavoritesOnly = async () => {
    let favList = [];
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const favoriteResponse = await WishlistService.getFavorites();
        const apiFavs =
          favoriteResponse?.favorites ||
          favoriteResponse?.data?.favorites ||
          [];
        if (Array.isArray(apiFavs) && apiFavs.length > 0) {
          favList = apiFavs.map(normalizeFav);
        }
      } catch (favErr) {
        console.log("API favorites fetch in UserDashboard fallback:", favErr);
      }
    }

    if (favList.length === 0) {
      const localFavs = getFavorites();
      if (Array.isArray(localFavs) && localFavs.length > 0) {
        favList = localFavs.map(normalizeFav);
      }
    }

    setFavorite(favList);
  };

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      try {
        setLoading(true);

        /*
         * ==========================================
         * 1. GET LOGGED-IN TENANT
         * ==========================================
         */
        const userResponse = await AuthService.getMe();

        const freshUser =
          userResponse?.tenant ||
          userResponse?.data?.tenant ||
          userResponse?.user ||
          userResponse?.data ||
          null;

        if (mounted && freshUser) {
          setUserData(freshUser);

          localStorage.setItem(
            "nestesyLoggedInUser",
            JSON.stringify(freshUser)
          );

          localStorage.setItem(
            "nestesyUser",
            JSON.stringify(freshUser)
          );
        }

        /*
         * ==========================================
         * 2. GET FAVORITES (API with localStorage fallback)
         * ==========================================
         */
        let favList = [];
        try {
          const favoriteResponse = await WishlistService.getFavorites();
          const apiFavs =
            favoriteResponse?.favorites ||
            favoriteResponse?.data?.favorites ||
            [];
          if (Array.isArray(apiFavs) && apiFavs.length > 0) {
            favList = apiFavs.map(normalizeFav);
          }
        } catch (favErr) {
          console.log("API favorites fetch in UserDashboard fallback:", favErr);
        }

        if (favList.length === 0) {
          const localFavs = getFavorites();
          if (Array.isArray(localFavs) && localFavs.length > 0) {
            favList = localFavs.map(normalizeFav);
          }
        }

        if (mounted) {
          setFavorite(favList);
        }

        /*
         * ==========================================
         * 3. GET BOOKINGS
         * ==========================================
         */

        const bookingResponse =
          await BookingService.getBookings("all");

        const allBookings =
          bookingResponse?.bookings ||
          bookingResponse?.data?.bookings ||
          [];

        if (mounted) {
          setBookings(
            Array.isArray(allBookings)
              ? allBookings
              : []
          );
        }

        /*
         * ==========================================
         * 4. GET UPCOMING VISITS
         * ==========================================
         */

        const visitResponse =
          await BookingService.getUpcomingVisits();

        const upcomingVisits =
          visitResponse?.bookings ||
          visitResponse?.data?.bookings ||
          [];

        if (mounted) {
          setVisits(
            Array.isArray(upcomingVisits)
              ? upcomingVisits
              : []
          );
        }

        /*
         * ==========================================
         * 5. ACTIVE BOOKINGS
         * ==========================================
         */

        const active =
          Array.isArray(allBookings)
            ? allBookings.filter((booking) => {
                const status = String(
                  booking?.status || ""
                ).toLowerCase();

                return [
                  "active",
                  "confirmed",
                  "approved",
                  "upcoming",
                  "pending",
                ].includes(status);
              })
            : [];

        if (mounted) {
          setActiveBookings(active);
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );

        const status = error?.response?.status;

        if (status !== 401 && mounted) {
          toast.error(
            error?.response?.data?.message ||
              "Failed to load dashboard data"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    const handleFavoritesUpdate = () => {
      loadFavoritesOnly();
    };

    window.addEventListener("storage", handleFavoritesUpdate);
    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);

    return () => {
      mounted = false;
      window.removeEventListener("storage", handleFavoritesUpdate);
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
    };
  }, []);

  /*
   * ==========================================
   * PROFILE LINKS
   * ==========================================
   */

  const profile = [
    {
      id: 1,
      title: "Profile",
      desc: "Manage your personal information",
      icon: UserRound,
      path: "/user/profile",
    },
    {
      id: 2,
      title: "Terms & Conditions",
      desc: "Review Nestesy terms and conditions",
      icon: FileText,
      path: "/terms-conditions",
    },
    {
      id: 3,
      title: "Privacy Policy",
      desc: "Manage your privacy preferences",
      icon: LockKeyhole,
      path: "/privacy-policy",
    },
  ];

  /*
   * ==========================================
   * DASHBOARD STATS
   * ==========================================
   */

  const stats = [
    {
      title: "Upcoming Visits",
      value: visits.length,
      subtitle: "Schedule this week",
      icon: CalendarDays,
      iconBg: "bg-primary-100",
      iconColor: "text-primary-600",
      subtitleColor: "text-primary-500",
    },
    {
      title: "Total Bookings",
      value: bookings.length,
      subtitle: "All time",
      icon: CalendarCheck,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-400",
      subtitleColor: "text-gray-500",
    },
    {
      title: "Favorite Properties",
      value: favorite.length,
      subtitle: "Saved properties",
      icon: Heart,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      subtitleColor: "text-gray-500",
    },
    {
      title: "Active Bookings",
      value: activeBookings.length,
      subtitle: "Currently Active",
      icon: Star,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-400",
      subtitleColor: "text-amber-400",
    },
  ];

  /*
   * ==========================================
   * ANIMATIONS
   * ==========================================
   */

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  /*
   * ==========================================
   * LOADING
   * ==========================================
   */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <>
      {/* YOUR EXISTING JSX STARTS HERE */}

      {/* STATS */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="contents"
        >
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover={{
                  y: -5,
                  scale: 1.015,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="group h-full cursor-default rounded-2xl border border-gray-100 bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-xl sm:p-5"
              >
                <div className="flex items-center gap-3 sm:gap-5">
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                    }}
                    className={`shrink-0 rounded-2xl p-2.5 sm:p-3 ${item.iconBg} ${item.iconColor}`}
                  >
                    <Icon
                      size={32}
                      className="sm:h-10 sm:w-10"
                    />
                  </motion.div>

                  <div className="min-w-0">
                    <h3 className="text-[11px] text-gray-400 sm:text-xs">
                      {item.title}
                    </h3>

                    <motion.h2
                      initial={{
                        opacity: 0,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        delay: 0.3,
                        duration: 0.3,
                      }}
                      className="text-xl font-semibold text-gray-800 sm:text-2xl"
                    >
                      {item.value}
                    </motion.h2>

                    <p
                      className={`truncate text-xs font-semibold sm:text-sm ${item.subtitleColor}`}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>


{/* property section */}

  <section className=" grid grid-cols-1 md:grid-cols-2 gap-5 p-5 h-auto mt-10 ">
      
      {/* upcoming visits */}
      <div className="h-full border border-gray-300 p-3 rounded-2xl shadow-sm bg-white">
        <div className="w-full flex justify-between items-center ">
            <h3 className="text-lg text-gray-800 font-semibold ml-5">Upcoming Visits</h3>
        <button
        onClick={()=>navigate("/user/upcoming-visits")}
        className="text-primary-500 text-sm font-semibold mr-5 cursor-pointer">View all</button>
        </div>
      {visits.length === 0 ? (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl bg-gray-50 px-4 text-center"
  >
    <CalendarDays size={32} className="text-gray-300" />
    <p className="mt-2 text-sm font-semibold text-gray-500">
      No upcoming visits
    </p>
    <p className="mt-1 text-xs text-gray-400">
      Your scheduled property visits will appear here.
    </p>
  </motion.div>
) : (
  <div className="mt-4 space-y-3">
    {visits.slice(0, 2).map((visit, index) => (
       <motion.div
      key={visit.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="group w-full rounded-2xl border border-gray-100 bg-gray-50/70 p-3 transition-all duration-300 hover:bg-white hover:shadow-md"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Image */}
        <div className="h-20 w-20 sm:h-25 sm:w-30 shrink-0 overflow-hidden rounded-xl">
          <img
            src={visit.images?.[0]}
            alt={visit.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Property Details */}
        <div className="min-w-0 flex-1">
          <div className="flex justify-between">
          <h2 className="truncate text-sm sm:text-base font-semibold text-gray-800">
            {visit.title}
          </h2>
            <div className="  flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-primary-700 shadow-sm backdrop-blur-sm sm:text-[12px]">
                    <span className="h-2 w-2 rounded-full bg-primary-500" />
                    Upcoming
                  </div>
          </div>

          <p className="mt-1 truncate text-xs sm:text-sm text-gray-500">
            {visit.location}
          </p>

          {/* Date & Time */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs">
            <span className="rounded-lg bg-primary-50 px-2 py-1 font-medium text-primary-700">
              {visit.visitDate}
            </span>

            <span className="rounded-lg bg-gray-100 px-2 py-1 font-medium text-gray-600">
              {visit.visitTime}
            </span>
          </div>
          
        </div>
        
      </div>
       
    </motion.div>
    ))}
  </div>
)}
      </div>

      {/* booking history */}
       <div className="h-full border border-gray-300 p-3 rounded-2xl shadow-sm bg-white">
        <div className="w-full flex justify-between items-center ">
            <h3 className="text-lg text-gray-800 font-semibold ml-5">Booking History</h3>
        <button 
        onClick={()=>navigate("/user/booking-history")}
        className="text-primary-500 text-sm font-semibold mr-5 cursor-pointer">View all</button>
        </div>
             {activeBookings.length === 0 ? (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl bg-gray-50 px-4 text-center"
  >
    <CalendarDays size={32} className="text-gray-300" />
    <p className="mt-2 text-sm font-semibold text-gray-500">
      No Active Booking
    </p>
    <p className="mt-1 text-xs text-gray-400">
      Your active booking property visits will appear here.
    </p>
  </motion.div>
) : (
  <div className="mt-4 space-y-3">
    {activeBookings.slice(0, 2).map((booking, index) => (
       <motion.div
      key={booking.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="group w-full rounded-2xl border border-gray-100 bg-gray-50/70 p-3 transition-all duration-300 hover:bg-white hover:shadow-md"
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Image */}
        <div className="h-20 w-20 sm:h-25 sm:w-30 shrink-0 overflow-hidden rounded-xl">
          <img
            src={booking.images?.[0]}
            alt={booking.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Property Details */}
        <div className="min-w-0 flex-1">
          <div className="flex justify-between">
          <h2 className="truncate text-sm sm:text-base font-semibold text-gray-800">
            {booking.title}
          </h2>
            <div className="  flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-primary-700 shadow-sm backdrop-blur-sm sm:text-[12px]">
                    <span className="h-2 w-2 rounded-full bg-primary-500" />
                    Upcoming
                  </div>
          </div>

          <p className="mt-1 truncate text-xs sm:text-sm text-gray-500">
            {booking.location}
          </p>

          {/* Date & Time */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs">
            <span className="rounded-lg bg-primary-50 px-2 py-1 font-medium text-primary-700">
              {booking.visitDate}
            </span>

            <span className="rounded-lg bg-gray-100 px-2 py-1 font-medium text-gray-600">
              {booking.visitTime}
            </span>
          </div>
          
        </div>
        
      </div>
       
    </motion.div>
    ))}
  </div>
)}
      
       </div>
    </section>


      {/* PROFILE CARD EXAMPLE */}
      <section className="mt-10 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
        <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="xl:col-span-2 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm"
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Favorite Properties
        </h3>

        <p className="mt-1 text-xs text-gray-400">
          Properties you've saved for later
        </p>
      </div>

     
    </div>

    {/* No Favorites */}
    {favorite.length === 0 ? (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
          <Heart size={30} className="text-primary-500" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-gray-600">
          No saved properties
        </h3>

        <p className="mt-1 max-w-xs text-xs text-gray-400">
          Properties you save will appear here.
        </p>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={()=>navigate("/explore")}
          className="mt-5 flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-primary-600/20"
        >
          Explore Properties

          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <ArrowRight size={16} />
          </motion.div>
        </motion.button>
      </div>
    ) : (
        <>

     {/* favorite cards */}
      <motion.div
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {favorite.slice(0, 3).map((property, index) => {
          const propId = property.propertyId || property._id || property.id;
          const propImage =
            property.images?.[0] ||
            property.image ||
            FALLBACK_IMAGE;

          return (
            <motion.div
              key={propId || `fav-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.08,
              }}
              whileHover={{ y: -5 }}
              onClick={() => {
                if (propId) navigate(`/property/${propId}`);
              }}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-36 sm:h-32 lg:h-36 w-full overflow-hidden">
                <img
                  src={propImage}
                  alt={property.title}
                  onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK_IMAGE) {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Wishlist */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (propId) {
                      try {
                        const token = localStorage.getItem("token");
                        if (token) {
                          await WishlistService.removeFavorite(propId);
                        }
                      } catch (err) {
                        console.error("Remove favorite error:", err);
                      }
                      removeFromFavorites(propId);
                      setFavorite((prev) =>
                        prev.filter(
                          (item) =>
                            (item.propertyId || item._id || item.id) !== propId
                        )
                      );
                      window.dispatchEvent(
                        new CustomEvent("favoritesUpdated")
                      );
                      toast.success("Removed from wishlist");
                    }
                  }}
                  className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-red-50"
                  title="Remove from favorites"
                >
                  <Heart
                    size={15}
                    className="fill-red-500 text-red-500"
                  />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-3.5">
                {/* Title */}
                <h3 className="truncate text-sm font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                  {property.title}
                </h3>

                {/* Location */}
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin
                    size={13}
                    className="shrink-0 text-primary-600"
                  />
                  <span className="truncate">
                    {property.location}
                  </span>
                </div>

                {/* Property Info */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500">
                  <span>{property.bedrooms || 0} Beds</span>
                  <span className="text-gray-300">•</span>
                  <span>{property.bathrooms || 0} Bath</span>
                  <span className="text-gray-300">•</span>
                  <span>{property.area || 0} sq.ft</span>
                </div>

                {/* Price */}
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-base font-bold text-primary-700">
                    ₹{Number(property.price || 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[9px] text-gray-400">
                    / month
                  </span>
                </div>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (propId) navigate(`/property/${propId}`);
                  }}
                  className="mt-3 w-full rounded-xl border border-primary-600 py-2 text-xs font-semibold text-primary-600 transition-all duration-300 hover:bg-primary-600 hover:text-white"
                >
                  View Property
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

        <div className="w-full flex justify-center mt-10">
     <motion.button 
      initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.5,
            }}
     onClick={()=>navigate("/user/wishlist")}
     className="bg-primary-600 text-lg text-white font-semibold hover:bg-primary-700 transition px-10 py-2 rounded-xl">
        View all
      </motion.button>
      </div>

      </>
    )}
   
  </motion.div>

        </div>

        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
                Profile & Privacy
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Manage your account
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <UserRound size={19} />
            </div>
          </div>

          <motion.div
            whileHover={{ y: -2 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 p-4 text-white shadow-lg shadow-primary-600/20"
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10" />

            <div className="absolute -bottom-10 right-10 h-20 w-20 rounded-full bg-white/5" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-xl font-bold text-primary-700 shadow-md">
                {userData?.name
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-sm font-semibold">
                  {userData?.name || "User"}
                </h4>

                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-primary-100">
                  <CheckCircle2 size={13} />
                  <span>Verified Account</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-4 space-y-3">
            {profile.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.button
                  type="button"
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: 0.2 + index * 0.08,
                  }}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-left transition-all duration-300 hover:border-primary-100 hover:bg-primary-50/50 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white text-primary-600 shadow-sm transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white">
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-gray-800 sm:text-sm">
                      {item.title}
                    </h4>

                    <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:text-[11px]">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-400 shadow-sm transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white">
                    <ChevronRight size={15} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-green-700">
            <ShieldCheck size={16} className="shrink-0" />

            <p className="text-[10px] leading-4">
              Your account information is protected and secure.
            </p>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default UserDashboard;