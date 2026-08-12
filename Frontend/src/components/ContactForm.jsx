import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
  FaUser,
  FaRegCommentDots,
} from "react-icons/fa";



const ContactForm = () => {
  return (
   

    <>

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: .8 }}
        className="bg-white rounded-[30px] shadow-xl p-8"
       >

        <h2 className="text-3xl font-bold text-gray-800">
          Send Us A Message
        </h2>

        <p className="text-gray-500 mt-3">
          Fill out the form and our team will contact you shortly.
        </p>

        <form className="mt-8 space-y-5">

          <div className="grid md:grid-cols-2 gap-5">

            <div className="relative">

              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-green-600"
              />

            </div>

            <div className="relative">

              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-green-600"
              />

            </div>

          </div>

          <div className="relative">

            <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Phone Number"
              className="w-full pl-12 pr-4 py-4 border rounded-xl outline-none focus:ring-2 focus:ring-green-600"
            />

          </div>

          <select className="w-full border rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-green-600">

            <option>Select Subject</option>

            <option>General Inquiry</option>

            <option>Buy Property</option>

            <option>Sell Property</option>

            <option>Rent Property</option>

          </select>

          <div className="relative">

            <FaRegCommentDots className="absolute left-4 top-5 text-gray-400" />

            <textarea
              rows="6"
              placeholder="Your Message"
              className="w-full pl-12 pt-4 pr-4 border rounded-xl outline-none resize-none focus:ring-2 focus:ring-green-600"
            />

          </div>

          <motion.button

            whileHover={{
              scale: 1.03
            }}

            whileTap={{
              scale: .95
            }}

            className="w-full bg-green-800 hover:bg-green-700 text-white py-4 rounded-xl font-semibold flex justify-center items-center gap-3"
          >

            <FaPaperPlane />

            Send Message

          </motion.button>

        </form>

        {/* FEATURES */}

        <div className="grid grid-cols-3 gap-4 mt-8">

          <div className="text-center bg-green-50 rounded-xl p-4">

            <h3 className="text-green-700 font-bold">
              100%
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Secure
            </p>

          </div>

          <div className="text-center bg-green-50 rounded-xl p-4">

            <h3 className="text-green-700 font-bold">
              24H
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Response
            </p>

          </div>

          <div className="text-center bg-green-50 rounded-xl p-4">

            <h3 className="text-green-700 font-bold">
              24/7
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Support
            </p>

          </div>

        </div>

      </motion.div>

  </>
  );
};

export default ContactForm;