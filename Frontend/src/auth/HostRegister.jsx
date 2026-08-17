import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'

const HostRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setErrorMsg('Please fill in username, email, and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/owner/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.username,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Registration failed');
        setLoading(false);
        return;
      }

      setSuccessMsg('Host registered successfully! Please login to continue.');
    } catch (err) {
      console.error('Host Register Error:', err);
      setErrorMsg('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full mt-8">
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
            {successMsg}
          </div>
        )}

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Username */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <label className="block text-sm md:text-base font-semibold mb-2">
              Username / Name
            </label>

            <div className="flex items-center h-13 md:h-14 border border-gray-300 rounded-2xl px-4 focus-within:border-primary-500 transition">
              <User size={20} className="text-gray-400" />

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full px-3 outline-none"
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label className="block text-sm md:text-base font-semibold mb-2">
              Email Address
            </label>

            <div className="flex items-center h-13 md:h-14 border border-gray-300 rounded-2xl px-4 focus-within:border-primary-500 transition">
              <Mail size={20} className="text-gray-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-3 outline-none"
              />
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label className="block text-sm md:text-base font-semibold mb-2">
              Phone Number
            </label>

            <div className="flex items-center h-13 md:h-14 border border-gray-300 rounded-2xl px-4 focus-within:border-primary-500 transition">
              <Phone size={20} className="text-gray-400" />

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-3 outline-none"
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label className="block text-sm md:text-base font-semibold mb-2">
              Password
            </label>

            <div className="flex items-center h-13 md:h-14 border border-gray-300 rounded-2xl px-4 focus-within:border-primary-500 transition">
              <Lock size={20} className="text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye size={20} className="text-gray-500" />
                ) : (
                  <EyeOff size={20} className="text-gray-500" />
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Terms */}
        <motion.label
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-start gap-3 mt-6 text-sm text-gray-600"
        >
          <input
            type="checkbox"
            required
            className="mt-1 h-5 w-5 accent-primary-600"
          />

          <span>
            I agree to{" "}
            <span className="text-primary-600 font-semibold cursor-pointer">
              Terms & Conditions
            </span>{" "}
            and{" "}
            <span className="text-primary-600 font-semibold cursor-pointer">
              Privacy Policy
            </span>
          </span>
        </motion.label>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full h-14 mt-8 rounded-2xl bg-primary-600 text-white font-semibold text-lg shadow-lg hover:bg-primary-700 transition-all disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register as Host"}
        </motion.button>
      </form>
    </>
  );
};

export default HostRegister;