import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerOwner } from "../services/ownerService";

const HostRegister = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!agree) {
      setError(
        "Please agree to Terms & Conditions and Privacy Policy."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await registerOwner({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      });

      const data = response.data;

      if (data?.token && data?.owner) {
        localStorage.setItem("ownerToken", data.token);
        localStorage.setItem("owner", JSON.stringify(data.owner));
      }

      setSuccess(
        data?.message ||
          "Registration successful! Redirecting to host dashboard..."
      );

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setAgree(false);

      setTimeout(() => {
        if (data?.token) {
          navigate("/host", { replace: true });
        } else {
          navigate("/host/login", { replace: true });
        }
      }, 1500);
    } catch (error) {
      console.error(
        "Host registration error:",
        error.response?.data || error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl md:p-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary-800">
          Register as Host
        </h1>

        <p className="mt-2 text-gray-500">
          Create your host account
        </p>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold">
              Name
            </label>

            <div className="flex h-14 items-center rounded-2xl border border-gray-300 px-4 focus-within:border-primary-500">
              <User
                size={20}
                className="text-gray-400"
              />

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
                disabled={loading}
                className="w-full px-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Email
            </label>

            <div className="flex h-14 items-center rounded-2xl border border-gray-300 px-4 focus-within:border-primary-500">
              <Mail
                size={20}
                className="text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="name@example.com"
                disabled={loading}
                className="w-full px-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Phone
            </label>

            <div className="flex h-14 items-center rounded-2xl border border-gray-300 px-4 focus-within:border-primary-500">
              <Phone
                size={20}
                className="text-gray-400"
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="+91 9876543210"
                disabled={loading}
                className="w-full px-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Password
            </label>

            <div className="flex h-14 items-center rounded-2xl border border-gray-300 px-4 focus-within:border-primary-500">
              <Lock
                size={20}
                className="text-gray-400"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                disabled={loading}
                className="w-full px-3 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                disabled={loading}
              >
                {showPassword ? (
                  <Eye size={20} />
                ) : (
                  <EyeOff size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        <label className="mt-6 flex items-start gap-3 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) =>
              setAgree(e.target.checked)
            }
            disabled={loading}
            className="mt-1 h-5 w-5 accent-primary-600"
          />

          <span>
            I agree to Terms & Conditions and
            Privacy Policy.
          </span>
        </label>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.98 }}
          className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 text-lg font-semibold text-white shadow-lg hover:bg-primary-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin"
              />
              Registering...
            </>
          ) : (
            "Register as Host"
          )}
        </motion.button>
      </form>

      {/* <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() =>
            navigate("/host/login")
          }
          className="font-semibold text-primary-600"
        >
          Login
        </button>
      </p> */}
    </motion.div>
  );
};

export default HostRegister;