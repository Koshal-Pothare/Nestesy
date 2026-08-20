import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPaperPlane,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaRegCommentDots,
} from "react-icons/fa";
import Swal from "sweetalert2";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please fill in your name, email, and message.",
        icon: "warning",
        confirmButtonColor: "#166534",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `[Subject: ${formData.subject}] ${formData.message}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send message");
      }

      await Swal.fire({
        title: "Message Sent!",
        text: data.message || "Thank you for contacting Nestesy! We will get back to you shortly.",
        icon: "success",
        confirmButtonColor: "#166534",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to send inquiry. Please try again.",
        icon: "error",
        confirmButtonColor: "#166534",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-[30px] shadow-xl p-8"
      >
        <h2 className="text-3xl font-bold text-gray-800">
          Send Us A Message
        </h2>

        <p className="text-gray-500 mt-3">
          Fill out the form and our team will contact you shortly.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          <div className="relative">
            <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full pl-12 pr-4 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Buy Property">Buy Property</option>
            <option value="Sell Property">Sell Property</option>
            <option value="Rent Property">Rent Property</option>
          </select>

          <div className="relative">
            <FaRegCommentDots className="absolute left-4 top-5 text-gray-400" />
            <textarea
              rows="6"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="w-full pl-12 pt-4 pr-4 border rounded-xl outline-none resize-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full bg-green-800 hover:bg-green-700 text-white py-4 rounded-xl font-semibold flex justify-center items-center gap-3 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <FaPaperPlane />
            {loading ? "Sending Message..." : "Send Message"}
          </motion.button>
        </form>

        {/* FEATURES */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center bg-green-50 rounded-xl p-4">
            <h3 className="text-green-700 font-bold">100%</h3>
            <p className="text-sm text-gray-500 mt-2">Secure</p>
          </div>

          <div className="text-center bg-green-50 rounded-xl p-4">
            <h3 className="text-green-700 font-bold">24H</h3>
            <p className="text-sm text-gray-500 mt-2">Response</p>
          </div>

          <div className="text-center bg-green-50 rounded-xl p-4">
            <h3 className="text-green-700 font-bold">24/7</h3>
            <p className="text-sm text-gray-500 mt-2">Support</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ContactForm;