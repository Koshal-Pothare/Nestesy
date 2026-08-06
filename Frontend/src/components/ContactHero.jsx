import { motion } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";
import heroImage from "../assets/contact-hero.jpg";

const ContactHero = () => {
  return (
    <section className="relative w-full min-h-[100vh] overflow-hidden">

      {/* Background Image */}
      <img
        src={heroImage}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20"></div>

      {/* Blur Circle */}
      <div className="absolute -left-40 top-32 w-96 h-96 bg-green-500/20 rounded-full blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        <div className="min-h-[100vh] flex items-center">

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}
            className="max-w-2xl"
          >

            <span className="inline-block text-green-300 uppercase tracking-[5px] font-semibold text-sm mb-6">
              Get In Touch
            </span>

            <h1 className="text-white font-bold leading-tight
                           text-4xl
                           sm:text-5xl
                           md:text-6xl
                           lg:text-7xl">

              We're here to help
              <br />

              you find your

              <br />

              <span className="text-green-400">
                perfect home.
              </span>

            </h1>

            <p className="text-white/80 mt-8 text-base sm:text-lg leading-8 max-w-xl">
              Have questions or need assistance?
              Our experts are always available to help you
              with buying, selling and investing in properties.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: .95 }}
              className="mt-10 bg-green-700 hover:bg-green-800 transition-all text-white px-8 py-4 rounded-xl font-semibold shadow-xl"
            >
              Contact Us
            </motion.button>

          </motion.div>

        </div>

      </div>

      {/* Floating Card */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: .5, duration: .8 }}
        className="
          absolute
          bottom-8
          right-4
          sm:right-8
          lg:right-14
          w-[92%]
          sm:w-[360px]
          bg-white
          rounded-3xl
          shadow-2xl
          p-6
        "
      >

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">

            <FaPhoneAlt className="text-green-700 text-xl" />

          </div>

          <div>

            <p className="text-gray-500 text-sm">
              Need immediate help?
            </p>

            <h3 className="font-bold text-lg text-gray-800">
              Call us directly
            </h3>

            <p className="mt-2 text-green-700 font-bold text-xl">
              +91 98765 43210
            </p>

          </div>

        </div>

      </motion.div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F8F6F2] to-transparent"></div>

    </section>
  );
};

export default ContactHero;