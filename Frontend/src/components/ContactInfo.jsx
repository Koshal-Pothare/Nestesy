import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaHeadset,
  FaComments,
} from "react-icons/fa";

const contactData = [
  {
    icon: <FaMapMarkerAlt />,
    title: "Our Office",
    value: "123 Green Street, Eco City,\nNew Delhi, India - 110001",
  },
  {
    icon: <FaPhoneAlt />,
    title: "Phone Number",
    value: "+91 98765 43210",
  },
  {
    icon: <FaEnvelope />,
    title: "Email Address",
    value: "support@yourwebsite.com",
  },
  {
    icon: <FaClock />,
    title: "Working Hours",
    value: "Mon - Sat : 9:00 AM - 7:00 PM\nSunday : 10:00 AM - 4:00 PM",
  },
];

const ContactInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-3xl shadow-2xl p-8 mt-10"
          >
      {/* Heading */}

      <p className="uppercase tracking-[3px] text-green-700 text-sm font-semibold">
        CONTACT US
      </p>

      <h2 className="text-4xl font-bold text-gray-800 mt-2 leading-tight">
        We're Here To Help
        <br />
        You Every Step
        <span className="text-green-700"> of the Way</span>
      </h2>

      <p className="text-gray-500 mt-5 leading-7">
        Have questions about properties, partnerships, or anything else?
        Our team is ready to assist you.
      </p>

      {/* Contact Cards */}

      <div className="space-y-5 mt-8">
        {contactData.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{
              scale: 1.03,
              x: 6,
            }}
            transition={{ duration: 0.3 }}
            className="flex gap-5 bg-[#f8faf8] p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl"
          >
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl">
              {item.icon}
            </div>

            <div>
              <h4 className="font-semibold text-gray-800">
                {item.title}
              </h4>

              <p className="text-gray-500 whitespace-pre-line mt-1 text-sm leading-6">
                {item.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Help Box */}

      <motion.div
        whileHover={{
          scale: 1.02,
        }}
        className="mt-8 bg-gradient-to-r from-green-900 to-green-700 rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex justify-between items-center flex-wrap gap-5">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <FaHeadset className="text-2xl" />
            </div>

            <div>
              <h3 className="font-bold text-lg">
                Need Immediate Help?
              </h3>

              <p className="text-green-100 text-sm mt-1">
                Our support team is available 24/7.
              </p>
            </div>

          </div>

          <button className="flex items-center gap-2 bg-white text-green-800 font-semibold px-6 py-3 rounded-full hover:bg-green-100 transition">
            <FaComments />
            Chat With Us
          </button>

        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactInfo;