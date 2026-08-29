
import ContactForm from "../components/ContactForm";


import { motion } from "framer-motion";
import { FaPhoneAlt, FaHeadset, FaArrowRight, FaEnvelope, FaMapMarkerAlt, FaDirections, FaClock } from "react-icons/fa";
import heroImage from "../assets/contact-hero.png";

const Contact = () => {

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Our Office",
      value: "123 Green Street, Eco City,\nNew Delhi - 110001",
    },
    {
      icon: <FaPhoneAlt />,
      title: "Phone Number",
      value: "+91 98765 43210",
    },
    {
      icon: <FaEnvelope />,
      title: "Email Address",
      value: "support@realestate.com",
    },
    {
      icon: <FaClock />,
      title: "Working Hours",
      value: "Mon - Sat : 9 AM - 7 PM",
    },
  ];



  return (
    <main className="bg-[#F8F6F2] overflow-x-hidden">

      {/* Hero */}
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

      {/* Contact Form + Info */}
      <section className="relative z-20 -mt-2 lg:-mt-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* LEFT CARD */}

            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: .8 }}
              className="bg-white rounded-[30px] shadow-xl p-8"
            >

              <span className="text-green-700 uppercase tracking-[3px] font-semibold text-sm">
                CONTACT US
              </span>

              <h2 className="text-4xl font-bold mt-3 text-gray-800 leading-tight">
                We're Here To Help
                <br />
                You Every Step
                <span className="text-green-700"> Of The Way</span>
              </h2>

              <p className="text-gray-500 mt-5 leading-8">
                Have questions about buying, selling,
                renting or partnerships?
                We'd love to hear from you.
              </p>

              <div className="space-y-5 mt-10">

                {contactInfo.map((item, index) => (

                  <motion.div
                    key={index}
                    whileHover={{
                      x: 8,
                      scale: 1.02,
                    }}
                    className="flex gap-5 bg-[#F8F8F8] rounded-2xl p-5 border border-gray-100"
                  >

                    <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl">
                      {item.icon}
                    </div>

                    <div>

                      <h3 className="font-semibold text-gray-800">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 whitespace-pre-line mt-2">
                        {item.value}
                      </p>

                    </div>

                  </motion.div>

                ))}

              </div>

            </motion.div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </section>

      {/* CTA */}
     <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
  <div className="max-w-7xl mx-auto">
    <section className="w-full pb-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] bg-gradient-to-r from-green-900 via-green-800 to-green-700 shadow-2xl"
      >
        {/* Background Blur */}
        <div className="absolute -top-16 -left-16 w-40 h-40 sm:w-56 sm:h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-10 w-44 h-44 sm:w-60 sm:h-60 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10 px-5 py-7 sm:px-8 sm:py-8 lg:px-10">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:flex-1 text-center lg:text-left"
          >
            <span className="uppercase tracking-[2px] sm:tracking-[3px] text-green-200 text-[10px] sm:text-xs font-semibold">
              24 / 7 CUSTOMER SUPPORT
            </span>

            <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 sm:mt-3 leading-tight">
              Need Help?
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              Our Experts Are Always Ready.
            </h2>

            <p className="text-green-100 mt-3 leading-5 sm:leading-6 max-w-xl mx-auto lg:mx-0 text-xs sm:text-sm">
              Whether you have questions about services, pricing or support,
              our dedicated team is always available to help you.
            </p>
          </motion.div>

          {/* BUTTONS */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-auto flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto min-w-[140px] bg-white text-green-800 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg text-xs sm:text-sm"
            >
              <FaPhoneAlt />
              Call Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto min-w-[140px] border border-white text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white hover:text-green-800 transition text-xs sm:text-sm"
            >
              <FaEnvelope />
              Email Us
            </motion.button>
          </motion.div>

        </div>
      </motion.div>
    </section>
  </div>
</section>

    </main>
  );
};

export default Contact;