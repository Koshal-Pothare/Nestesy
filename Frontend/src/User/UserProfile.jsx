import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Lock,
  Edit3,
  Save,
  X,
  LogOut,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  AuthService,
  WishlistService,
  BookingService,
} from "../services/UserServices";

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [favoriteCount, setFavoriteCount] = useState(0);

  const [upcomingVisitsCount, setUpcomingVisitsCount] = useState(0);

  const [totalBookings, setTotalBookings] = useState(0);

  const [activeBookingsCount, setActiveBookingsCount] = useState(0);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    location: "",
  });

  /* =========================================================
     FETCH PROFILE + DASHBOARD DATA
  ========================================================= */

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        const [
          profileResponse,
          favoritesResponse,
          upcomingResponse,
          bookingsResponse,
        ] = await Promise.all([
          AuthService.getMe(),
          WishlistService.getCount(),
          BookingService.getUpcomingVisits(),
          BookingService.getBookings("all"),
        ]);

        /* ---------------- PROFILE ---------------- */

        const freshUser =
          profileResponse?.tenant ||
          profileResponse?.user ||
          profileResponse?.data?.tenant ||
          profileResponse?.data?.user;

        if (!freshUser) {
          throw new Error("User profile not found");
        }

        setUser(freshUser);

        setFormData({
          username: freshUser.name || "",
          email: freshUser.email || "",
          phone: freshUser.phone || "",
          location: freshUser.city || freshUser.location || "",
        });

        /* ---------------- FAVORITES ---------------- */

        setFavoriteCount(
          Number(
            favoritesResponse?.count ??
              favoritesResponse?.data?.count ??
              0
          )
        );

        /* ---------------- UPCOMING VISITS ---------------- */

        const upcomingBookings =
          upcomingResponse?.bookings ||
          upcomingResponse?.data?.bookings ||
          [];

        setUpcomingVisitsCount(upcomingBookings.length);

        /* ---------------- ALL BOOKINGS ---------------- */

        const bookings =
          bookingsResponse?.bookings ||
          bookingsResponse?.data?.bookings ||
          [];

        setTotalBookings(
          Number(
            bookingsResponse?.count ??
              bookingsResponse?.data?.count ??
              bookings.length
          )
        );

        /* ---------------- ACTIVE BOOKINGS ---------------- */

        const activeStatuses = [
          "pending",
          "confirmed",
          "approved",
          "active",
        ];

        const activeBookings = bookings.filter((booking) =>
          activeStatuses.includes(
            String(booking.status || "").toLowerCase()
          )
        );

        setActiveBookingsCount(activeBookings.length);
      } catch (error) {
        console.error("Failed to load profile data:", error);

        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Failed to load profile information"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await AuthService.updateProfile({
        name: formData.username.trim(),
        phone: formData.phone.trim(),
        city: formData.location.trim(),
      });

      const updatedUser =
        response?.tenant ||
        response?.user ||
        response?.data?.tenant ||
        response?.data?.user;

      if (!updatedUser) {
        throw new Error("Updated user data not returned");
      }

      setUser(updatedUser);

      setFormData({
        username: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        location:
          updatedUser.city ||
          updatedUser.location ||
          "",
      });

      setEditMode(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     CANCEL EDIT
  ========================================================= */

  const handleCancel = () => {
    if (!user) return;

    setFormData({
      username: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.city || user.location || "",
    });

    setEditMode(false);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nestesyLoggedInUser");

    navigate("/login");

    toast.success("Logged out successfully");
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     NO USER
  ========================================================= */

  if (!user) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <User
            size={45}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            No Profile Found
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Please login to view your profile.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-5 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     PROFILE COMPLETION
  ========================================================= */

  const profileFields = [
    formData.username,
    formData.email,
    formData.phone,
    formData.location,
  ];

  const completedFields = profileFields.filter(
    (field) =>
      field &&
      String(field).trim() !== ""
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-2">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <User size={21} />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
                Account
              </span>

            </div>

            <h1 className="text-2xl font-serif font-bold text-gray-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Manage your personal information and account settings.
            </p>
          </div>

          {!editMode ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setEditMode(true)}
              className="flex w-fit items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700"
            >
              <Edit3 size={17} />
              Edit Profile
            </motion.button>
          ) : (
            <div className="flex gap-2">

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                <X size={17} />
                Cancel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {saving ? "Saving..." : "Save Changes"}
              </motion.button>

            </div>
          )}

        </div>
      </motion.div>

   

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

     

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
        >

          <div className="flex flex-col items-center text-center">

            {/* Avatar */}

            <div className="relative">

              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary-100 text-3xl font-bold text-primary-700 ring-8 ring-primary-50">
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-green-500 text-white">
                <CheckCircle2 size={15} />
              </div>

            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              {user.name || "User"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {user.email}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-600">
              <ShieldCheck size={15} />
              Verified Account
            </div>

          </div>

          {/* Account Stats */}

          <div className="mt-7 grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-gray-50 p-4 text-center">
              <p className="text-xl font-bold text-primary-600">
                {upcomingVisitsCount}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Active Visits
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 text-center">
              <p className="text-xl font-bold text-primary-600">
                {favoriteCount}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Favorites
              </p>
            </div>

          </div>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </button>

        </motion.div>

        {/* ===================================================
            PERSONAL INFORMATION
        =================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
          className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2"
        >

          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Keep your information up to date.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* Full Name */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Enter your name"
                  className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition ${
                    editMode
                      ? "border-primary-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                      : "border-gray-100 bg-gray-50 text-gray-600"
                  }`}
                />

              </div>
            </div>

            {/* Email */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-500 outline-none"
                />

              </div>
            </div>

            {/* Phone */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500">
                Phone Number
              </label>

              <div className="relative">

                <Phone
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Enter phone number"
                  className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition ${
                    editMode
                      ? "border-primary-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                      : "border-gray-100 bg-gray-50 text-gray-600"
                  }`}
                />

              </div>
            </div>

            {/* Location */}

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500">
                Location
              </label>

              <div className="relative">

                <MapPin
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!editMode}
                  placeholder="Enter your city"
                  className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition ${
                    editMode
                      ? "border-primary-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50"
                      : "border-gray-100 bg-gray-50 text-gray-600"
                  }`}
                />

              </div>
            </div>

          </div>

          {/* =================================================
              PROFILE COMPLETION + JOINED
          ================================================= */}

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* Profile Completion */}

            <div className="rounded-2xl border border-primary-100 bg-primary-50/50 px-4 py-3">

              <div className="flex items-center justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <CheckCircle2 size={17} />
                  </div>

                  <div className="min-w-0">

                    <h3 className="text-sm font-bold text-gray-800">
                      Profile Completion
                    </h3>

                    <p className="mt-0.5 text-[11px] text-gray-500">
                      {completedFields} of {profileFields.length} completed
                    </p>

                  </div>

                </div>

                <motion.span
                  key={profileCompletion}
                  initial={{
                    scale: 0.8,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  className="shrink-0 text-lg font-bold text-primary-600"
                >
                  {profileCompletion}%
                </motion.span>

              </div>

              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-primary-100">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${profileCompletion}%`,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-primary-300 via-primary-400 to-primary-600"
                />

              </div>

              <div className="mt-1.5 flex justify-end">

                {profileCompletion === 100 ? (
                  <span className="text-[10px] font-semibold text-green-600">
                    Profile complete ✓
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400">
                    Complete your profile
                  </span>
                )}

              </div>

            </div>

            {/* Joined */}

            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-3">

              <div className="flex h-full items-center justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm">
                    <CalendarDays size={18} />
                  </div>

                  <div>

                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Joined on
                    </p>

                    <p className="mt-0.5 text-sm font-bold text-gray-700">
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Not available"}
                    </p>

                  </div>

                </div>

                <div className="hidden h-7 w-7 items-center justify-center rounded-full bg-green-50 text-green-600 sm:flex">
                  <CheckCircle2 size={15} />
                </div>

              </div>

            </div>

          </div>

        </motion.div>

        {/* ===================================================
            ACCOUNT SECURITY
        =================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.2,
          }}
          className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-3"
        >

          <div className="mb-6">

            <h2 className="text-lg font-bold text-gray-800">
              Account & Security
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Manage your account security and privacy.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <button
              onClick={() =>
                toast.info(
                  "Password change coming soon"
                )
              }
              className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-primary-100 hover:bg-primary-50"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
                  <KeyRound size={19} />
                </div>

                <div>

                  <h3 className="text-sm font-semibold text-gray-800">
                    Change Password
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Update your account password
                  </p>

                </div>

              </div>

              <Edit3
                size={17}
                className="text-gray-400 transition group-hover:text-primary-600"
              />

            </button>

          </div>

        </motion.div>

      </div>
    </div>
  );
};

export default UserProfile;