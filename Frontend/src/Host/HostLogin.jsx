import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
  Clock,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { loginOwner } from "../services/ownerService";

const HostLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginOwner(
        email.trim().toLowerCase(),
        password
      );

      const data = response?.data;

      console.log("HOST LOGIN RESPONSE:", data);

      // -----------------------------------------
      // CHECK API RESPONSE
      // -----------------------------------------

      if (!data?.success || !data?.token) {
        setError(
          data?.message || "Login failed. Token not received."
        );
        return;
      }

      // -----------------------------------------
      // GET OWNER DATA
      // -----------------------------------------

      const owner = data.owner;

      console.log("Owner:", owner);

      // -----------------------------------------
      // CHECK OWNER APPROVAL STATUS
      // -----------------------------------------

      const ownerStatus =
        owner?.status ||
        owner?.approvalStatus ||
        owner?.accountStatus;

      console.log("Owner status:", ownerStatus);

      // -----------------------------------------
      // PENDING OWNER
      // -----------------------------------------

      if (
        ownerStatus === "pending" ||
        ownerStatus === "Pending" ||
        ownerStatus === "awaiting" ||
        ownerStatus === "awaiting_approval"
      ) {
        setError(
          "Your Host account is still awaiting admin approval."
        );

        // Do not save token for dashboard access
        localStorage.removeItem("ownerToken");
        localStorage.removeItem("owner");

        return;
      }

      // -----------------------------------------
      // REJECTED OWNER
      // -----------------------------------------

      if (
        ownerStatus === "rejected" ||
        ownerStatus === "Rejected"
      ) {
        setError(
          "Your Host account has been rejected by the admin."
        );

        localStorage.removeItem("ownerToken");
        localStorage.removeItem("owner");

        return;
      }

      // -----------------------------------------
      // SAVE OWNER TOKEN
      // -----------------------------------------

      localStorage.setItem("ownerToken", data.token);

      // -----------------------------------------
      // SAVE OWNER DATA
      // -----------------------------------------

      if (owner) {
        localStorage.setItem(
          "owner",
          JSON.stringify(owner)
        );
      }

      console.log(
        "Owner token saved:",
        localStorage.getItem("ownerToken")
      );

      console.log(
        "Owner:",
        JSON.parse(localStorage.getItem("owner"))
      );

      // -----------------------------------------
      // SUCCESS
      // -----------------------------------------

      setSuccess("Login successful!");

      // -----------------------------------------
      // CALLBACK
      // -----------------------------------------

      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // -----------------------------------------
      // GO HOST DASHBOARD
      // -----------------------------------------

      navigate("/host", {
        replace: true,
      });

    } catch (error) {
      console.error("Host login error:", error);

      const status = error?.response?.status;

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Invalid email or password.";

      // -----------------------------------------
      // ACCOUNT WAITING FOR ADMIN
      // -----------------------------------------

      if (
        status === 403 &&
        message.toLowerCase().includes("awaiting admin")
      ) {
        setError(
          "Your Host account is still awaiting admin approval."
        );

        localStorage.removeItem("ownerToken");
        localStorage.removeItem("owner");

        return;
      }

      // -----------------------------------------
      // OTHER ERRORS
      // -----------------------------------------

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8"
    >
      {/* HEADER */}

      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary-800">
          Welcome Back
        </h1>

        <p className="text-gray-500 mt-2">
          Login to your Host account
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">
          <AlertCircle
            size={20}
            className="mt-0.5 flex-shrink-0"
          />

          <span className="text-sm">
            {error}
          </span>
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700">
          <CheckCircle size={20} />

          <span className="text-sm">
            {success}
          </span>
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        {/* EMAIL */}

        <div>
          <label className="block font-semibold mb-2">
            Email
          </label>

          <div className="flex items-center border border-gray-300 rounded-2xl px-4 h-14 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
            <Mail
              className="text-gray-400 flex-shrink-0"
              size={20}
            />

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="email"
              className="w-full px-3 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* PASSWORD */}

        <div>
          <label className="block font-semibold mb-2">
            Password
          </label>

          <div className="flex items-center border border-gray-300 rounded-2xl px-4 h-14 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
            <Lock
              className="text-gray-400 flex-shrink-0"
              size={20}
            />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
              className="w-full px-3 outline-none bg-transparent"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              disabled={loading}
              className="text-gray-500 hover:text-primary-600 transition"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <Eye size={20} />
              ) : (
                <EyeOff size={20} />
              )}
            </button>
          </div>
        </div>

        {/* LOGIN BUTTON */}

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="w-full h-14 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin"
              />

              Logging in...
            </>
          ) : (
            "Login"
          )}
        </motion.button>
      </form>

      {/* REGISTER */}

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have a Host account?{" "}

        <button
          type="button"
          onClick={() =>
            navigate("/become-a-host")
          }
          disabled={loading}
          className="text-primary-600 font-semibold hover:underline disabled:opacity-50"
        >
          Register
        </button>
      </p>

      {/* APPROVAL INFORMATION */}

      <div className="mt-6 flex items-start gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-blue-700">
        <Clock
          size={18}
          className="mt-0.5 flex-shrink-0"
        />

        <p className="text-xs leading-5">
          New Host accounts require admin approval
          before accessing the Host Dashboard.
        </p>
      </div>
    </motion.div>
  );
};

export default HostLogin;