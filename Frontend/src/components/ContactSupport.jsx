import { motion } from "framer-motion";
import {
  FaHeadset,
  FaPhoneAlt,
  FaArrowRight,
  FaEnvelope,
} from "react-icons/fa";

const ContactSupport = () => {
  return (
    <section className="w-full pb-12">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-green-900 via-green-800 to-green-700 shadow-2xl"
      >

        {/* Background Blur */}

        <div className="absolute -top-20 -left-20 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 right-0 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-10 lg:px-10 lg:py-12">

          {/* LEFT */}

          <motion.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: .8 }}
          >

            <span className="uppercase tracking-[3px] text-green-200 text-xs font-semibold">
              24 / 7 CUSTOMER SUPPORT
            </span>

            <h2 className="text-white text-3xl lg:text-4xl font-bold mt-4 leading-tight">
              Need Help?
              <br />
              Our Experts Are
              <br />
              Always Ready.
            </h2>

            <p className="text-green-100 mt-4 leading-7 max-w-lg text-sm">
              Whether you have questions about services,
              pricing or support, our dedicated team is
              always available to help you.
            </p>

            <div className="flex flex-wrap gap-4 mt-7">

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: .96 }}
                className="bg-white text-green-800 px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg text-sm"
              >
                <FaPhoneAlt />
                Call Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: .96 }}
                className="border border-white text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-white hover:text-green-800 transition text-sm"
              >
                <FaEnvelope />
                Email Us
              </motion.button>

            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: .8 }}
            className="flex justify-center"
          >

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[24px] p-6 w-full max-w-sm">

              <div className="flex justify-center">

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl"
                >
                  <FaHeadset className="text-green-700 text-3xl" />
                </motion.div>

              </div>

              <h3 className="text-white text-2xl font-bold text-center mt-5">
                Live Support
              </h3>

              <p className="text-green-100 text-center text-sm leading-6 mt-3">
                Chat with our support team and get instant
                assistance for your questions.
              </p>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: .96 }}
                className="mt-5 w-full bg-white text-green-800 py-3 rounded-xl font-semibold flex justify-center items-center gap-2 shadow-lg text-sm"
              >
                Start Live Chat
                <FaArrowRight />
              </motion.button>

              <div className="grid grid-cols-2 gap-3 mt-5">

                <div className="bg-white/10 rounded-xl py-4 text-center">

                  <h4 className="text-2xl font-bold text-white">
                    24/7
                  </h4>

                  <p className="text-green-200 text-xs mt-1">
                    Support
                  </p>

                </div>

                <div className="bg-white/10 rounded-xl py-4 text-center">

                  <h4 className="text-2xl font-bold text-white">
                    99%
                  </h4>

                  <p className="text-green-200 text-xs mt-1">
                    Satisfaction
                  </p>

                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </motion.div>

    </section>
  );
};

export default ContactSupport;