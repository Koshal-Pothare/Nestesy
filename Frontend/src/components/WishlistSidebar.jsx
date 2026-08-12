import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CTA from '../assets/Explore/CTA.png'

import React from 'react'

const WishlistSidebar = () => {


const navigate = useNavigate();

  return (
    <motion.div
  initial={{ opacity: 0, x: 40 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.7 }}
  viewport={{ once: true }}
  whileHover={{ y: -5 }}
  className="hidden lg:block  top-28 col-span-1 mt-17"
>
  <div
    className="relative h-[600px] overflow-hidden rounded-3xl shadow-2xl"
    style={{ backgroundImage: `url(${CTA})`, backgroundSize: "cover", backgroundPosition: "center" }}
  >
    {/* Background Zoom */}
    <motion.div
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${CTA})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80" />

    {/* Floating Glow */}
    <motion.div
      animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 7 }}
      className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary-400/20 blur-3xl"
    />

    {/* Content */}
    <div className="relative z-10 flex h-full flex-col justify-end p-8">

      <span className="w-fit rounded-full bg-white/15 backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
        Premium Homes
      </span>

      <h2 className="mt-6 text-3xl font-serif font-bold leading-tight text-white">
        Let's Find Your
        <br />
        Perfect Place
      </h2>

      <p className="mt-4 text-sm leading-7 text-gray-200">
        Browse verified properties from trusted hosts and discover a home that perfectly fits your lifestyle.
      </p>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/explore")}
        className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-primary-600 py-4 font-semibold text-white shadow-xl hover:bg-primary-500"
      >
        Explore Properties

        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <ArrowRight size={18} />
        </motion.div>
      </motion.button>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 text-center">
          <h3 className="text-2xl font-bold text-white">500+</h3>
          <p className="text-xs text-gray-200">Verified Homes</p>
        </div>

        <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 text-center">
          <h3 className="text-2xl font-bold text-white">4.9★</h3>
          <p className="text-xs text-gray-200">Host Rating</p>
        </div>
      </div>

    </div>
  </div>
</motion.div>
  )
}

export default WishlistSidebar