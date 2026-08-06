import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaPaperPlane,
  FaRegCommentDots,
} from "react-icons/fa";

const ContactForm = () => {
  const [message, setMessage] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-3xl shadow-2xl p-8"
    >
      {/* Heading */}

      <h2 className="text-3xl font-bold text-gray-800">
        Send Us a Message
      </h2>

      <p className="text-gray-500 mt-2">
        Fill out the form below and our team will get back to you shortly.
      </p>

      {/* Form */}

      <form className="mt-8 space-y-5">

        {/* Full Name + Email */}

        <div className="grid md:grid-cols-2 gap-5">

          <div className="relative">

            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition"
            />

          </div>

          <div className="relative">

            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition"
            />

          </div>

        </div>

        {/* Phone */}

        <div className="relative">

          <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition"
          />

        </div>

        {/* Subject */}

        <select
          className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition"
        >
          <option>Select Subject</option>
          <option>General Inquiry</option>
          <option>Property Visit</option>
          <option>Buy Property</option>
          <option>Sell Property</option>
          <option>Rent Property</option>
        </select>

        {/* Message */}

        <div className="relative">

          <FaRegCommentDots className="absolute left-4 top-5 text-gray-400" />

          <textarea
            rows="6"
            maxLength={500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message..."
            className="w-full pl-12 pr-4 pt-4 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none resize-none transition"
          ></textarea>

          <p className="text-right text-sm text-gray-400 mt-2">
            {message.length}/500
          </p>

        </div>

        {/* Button */}

        <motion.button
          whileHover={{
            scale: 1.03,
            y: -2,
          }}
          whileTap={{
            scale: 0.96,
          }}
          className="w-full bg-gradient-to-r from-green-800 to-green-600 text-white py-4 rounded-xl font-semibold flex justify-center items-center gap-3 shadow-lg hover:shadow-green-300 transition"
        >
          <FaPaperPlane />
          Send Message
        </motion.button>

      </form>

      {/* Bottom Features */}

      <div className="grid md:grid-cols-3 gap-4 mt-8">

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-green-50 rounded-2xl p-4 border border-green-100 text-center"
        >
          <div className="text-3xl mb-2">🛡️</div>

          <h4 className="font-semibold text-gray-800">
            100% Secure
          </h4>

          <p className="text-sm text-gray-500 mt-1">
            Your information is safe with us.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-green-50 rounded-2xl p-4 border border-green-100 text-center"
        >
          <div className="text-3xl mb-2">⚡</div>

          <h4 className="font-semibold text-gray-800">
            Quick Response
          </h4>

          <p className="text-sm text-gray-500 mt-1">
            We usually reply within 24 hours.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-green-50 rounded-2xl p-4 border border-green-100 text-center"
        >
          <div className="text-3xl mb-2">🎯</div>

          <h4 className="font-semibold text-gray-800">
            Expert Support
          </h4>

          <p className="text-sm text-gray-500 mt-1">
            Our experts are always ready to help.
          </p>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default ContactForm;