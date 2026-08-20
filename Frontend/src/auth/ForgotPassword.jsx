import React, { useState } from "react";
import { Mail, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to process request");
      }
      await Swal.fire({
        title: "Password Reset Sent!",
        text: data.message || "Check your email for password reset instructions.",
        icon: "success",
        confirmButtonColor: "#1e3a5f",
      });
      setEmail("");
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to send password reset request.",
        icon: "error",
        confirmButtonColor: "#1e3a5f",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-primary-50 rounded-2xl shadow-xl p-6 sm:p-8"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
            <RotateCcw className="w-8 h-8 text-primary-800" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-3xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>

        <p className="text-center text-gray-500 text-sm mt-2 leading-relaxed">
          Enter your email address and we'll send you a link
          <br className="hidden sm:block" />
          to reset your password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? "Sending Link..." : "Send Recovery Link"}
            {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200"></div>

        {/* Back */}
        <Link to="/login">
          <button className="flex items-center justify-center gap-2 text-primary-500 font-medium hover:text-primary-600 transition w-full">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPassword; 