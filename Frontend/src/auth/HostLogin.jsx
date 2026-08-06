import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const HostLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 40 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-primary-200 p-6 md:p-8"
    >
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-3xl font-serif font-bold text-primary-800">
          Welcome Back
        </h1>

        <p className="text-gray-500 mt-2">
          Please login to continue as a Host.
        </p>
      </div>

      <form className="mt-8 space-y-5">
        {/* Email / Username */}
        <div>
          <label className="block font-semibold mb-2">
            Email or Username
          </label>

          <div className="flex items-center border border-gray-300 rounded-2xl px-4 h-14 focus-within:border-primary-500 transition">
            <Mail className="text-gray-400" size={20} />

            <input
              type="text"
              placeholder="Enter email or username"
              className="w-full px-3 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block font-semibold mb-2">
            Password
          </label>

          <div className="flex items-center border border-gray-300 rounded-2xl px-4 h-14 focus-within:border-primary-500 transition">
            <Lock className="text-gray-400" size={20} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-3 outline-none bg-transparent"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-primary-500"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>

        {/* Remember */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary-600"
            />
            Remember Me
          </label>

          <button
            type="button"
            className="text-primary-600 font-semibold hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full h-14 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg shadow-lg"
        >
          Login
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300"></div>

          <span className="text-gray-500 text-sm">
            OR
          </span>

          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          className="w-full h-14 rounded-2xl border-2 border-primary-600 flex items-center justify-center gap-3 hover:bg-primary-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />

          <span className="font-medium">
            Continue with Google
          </span>
        </motion.button>
      </form>

      {/* Footer */}
      
    </motion.div>
  );
};

export default HostLogin;