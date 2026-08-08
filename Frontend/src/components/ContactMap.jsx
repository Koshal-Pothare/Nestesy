import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaDirections,
} from "react-icons/fa";

const ContactMap = () => {
  return (
    <section className="py-20 bg-[#F8F6F2]">

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="
          relative
          overflow-hidden
          rounded-[32px]
          shadow-[0_25px_60px_rgba(0,0,0,0.12)]
        "
      >

        {/* Google Map */}

        <iframe
          title="Google Map"
          src="https://www.google.com/maps?q=New+Delhi&output=embed"
          loading="lazy"
          className="
            w-full
            h-[360px]
            sm:h-[420px]
            lg:h-[470px]
          "
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-black/5"></div>

        {/* Card Wrapper */}

        <div
          className="
            absolute
            inset-y-0
            left-8
            flex
            items-center
            z-20
            mt-4
          "
        >

         <motion.div
  initial={{ opacity: 0, x: -60 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{
    delay: 0.3,
    duration: 0.8,
  }}
  className="
    bg-white/95
    backdrop-blur-xl
    rounded-[20px]
    shadow-2xl

    lg:w-[245px]

    px-4
    py-3
  "
>
  {/* Top */}

  <span className="uppercase tracking-[3px] text-[10px] font-semibold text-green-700">
    FIND OUR OFFICE
  </span>

  <h2 className="text-[18px] font-bold text-slate-800 leading-6 mt-2">
    Visit Our Office
  </h2>

  <p className="text-[12px] text-gray-500 leading-5 mt-2">
    Come and meet our professional team.
    We'd love to discuss your next property.
  </p>

  {/* Address */}

  <div className="flex gap-3 mt-4">

    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
      <FaMapMarkerAlt className="text-green-700 text-sm" />
    </div>

    <div>

      <h3 className="font-semibold text-[14px] text-slate-800">
        Office Address
      </h3>

      <p className="text-[11px] text-gray-500 leading-4 mt-1">
        123 Green Street
        <br />
        Eco City
        <br />
        New Delhi 110001
      </p>

    </div>

  </div>

  {/* Button */}

  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.96 }}
    className="
      mt-4
      w-full
      h-9

      rounded-lg

      bg-gradient-to-r
      from-green-700
      to-green-600

      text-white
      text-[13px]
      font-medium

      flex
      items-center
      justify-center
      gap-2
    "
  >
    <FaDirections className="text-xs" />
    Get Directions
  </motion.button>

</motion.div>

        </div>

        {/* Floating Green Pin */}

        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="
            hidden
            lg:flex

            absolute

            right-20
            top-1/2
            -translate-y-1/2

            w-16
            h-16

            rounded-full

            bg-green-700

            shadow-[0_20px_40px_rgba(22,163,74,0.45)]

            items-center
            justify-center
          "
        >
          <FaMapMarkerAlt
            className="
              text-white
              text-2xl
            "
          />
        </motion.div>

      </motion.div>

    </section>
  );
};

export default ContactMap;