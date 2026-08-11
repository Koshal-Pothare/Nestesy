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

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    location: "",
  });

  useEffect(() => {
    const loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser")
    );

    if (loggedInUser) {
      setUser(loggedInUser);

      setFormData({
        username: loggedInUser.username || "",
        email: loggedInUser.email || "",
        phone: loggedInUser.phone || "",
        location: loggedInUser.location || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...formData,
    };

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setEditMode(false);

    toast.success("Profile updated successfully");
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
    });

    setEditMode(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  if (!user) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <User size={45} className="mx-auto text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            No Profile Found
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Please login to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
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
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                <X size={17} />
                Cancel
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700"
              >
                <Save size={17} />
                Save Changes
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Profile Card */}
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
                {user.username
                  ? user.username.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-green-500 text-white">
                <CheckCircle2 size={15} />
              </div>
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              {user.username || "User"}
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
                {JSON.parse(localStorage.getItem("upcomingVisits") || "[]").length}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Active Visits
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 text-center">
              <p className="text-xl font-bold text-primary-600">
                {JSON.parse(localStorage.getItem("favorites") || "[]").length}
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

        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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
            {/* Username */}
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
        </motion.div>

        {/* Account & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
            {/* Password */}
            <button
              onClick={() => toast.info("Password change coming soon")}
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

            {/* Privacy */}
            <button
              onClick={() => toast.info("Privacy settings coming soon")}
              className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-primary-100 hover:bg-primary-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
                  <Lock size={19} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Privacy Settings
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Control your account privacy
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