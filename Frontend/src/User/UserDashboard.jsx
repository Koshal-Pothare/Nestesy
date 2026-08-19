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

const UserDashboard = () => {
  const navigate = useNavigate();

  const [favorite, setFavorite] = useState([]);
  const [visits, setVisits] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      try {
        setLoading(true);

        /*
         * ==========================================
         * 1. GET LOGGED-IN TENANT
         * ==========================================
         *
         * Backend response:
         *
         * {
         *   success: true,
         *   message: "...",
         *   tenant: {
         *     id: "...",
         *     name: "...",
         *     email: "..."
         *   }
         * }
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
         * 2. GET FAVORITES
         * ==========================================
         */

        const favoriteResponse =
          await WishlistService.getFavorites();

        const favorites =
          favoriteResponse?.favorites ||
          favoriteResponse?.data?.favorites ||
          [];

        if (mounted) {
          setFavorite(
            Array.isArray(favorites) ? favorites : []
          );
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

    return () => {
      mounted = false;
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
      path: "/terms",
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

      {/* KEEP YOUR EXISTING:
          UPCOMING VISITS
          BOOKING HISTORY
          FAVORITE PROPERTIES
          PROFILE & PRIVACY
          JSX HERE
      */}

      {/* PROFILE CARD EXAMPLE */}
      <section className="mt-10 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {/* Your existing Favorites JSX */}
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