import React, { useState ,useEffect} from 'react'
import { Home, Users, IndianRupee, Mail, Eye, EyeOff, Lock,User,Phone ,ShieldCheck} from 'lucide-react'
import { Benifits, HostSteps } from '../Data/Data.js'
import { motion,AnimatePresence } from "framer-motion";
import BecomeHostHeroImage from '../assets/BecomeHost/BecomeHost2.png'
import Host from '../assets/BecomeHost/Host.png'
import formImage from '../assets/BecomeHost/formImage.png'
import HostLogin from '../Host/HostLogin.jsx'
import HostRegister from '../Host/HostRegister.jsx';

const BecomeHost = () => {


  const[openHostLogin, setOpenHostLogin] = useState(false);

  useEffect(() => {
  document.body.style.overflow = openHostLogin ? "hidden" : "auto";

  return () => {
    document.body.style.overflow = "auto";
  };
}, [openHostLogin]);


const scrollToRegister = () => {
  document.getElementById("Host-Login")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };


  const CardContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const card = {
  hidden: { opacity: 0, y: 70, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

  const stats = [
    { icon: Home, value: "15K+", label: "Properties" },
    { icon: Users, value: "50K+", label: "Verified Tenants" },
    { icon: IndianRupee, value: "₹2L+", label: "Avg. Earnings" },
  ];

  return (
    <>
      <section >
        {/*hero section */}

        <div
          className="relative h-[720px] w-full bg-cover bg-center bg-no-repeat flex items-center justify-around p-10"
          style={{
            backgroundImage: `url(${BecomeHostHeroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-primary-900 via-primary-900/50 to-black/40"></div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative z-10 max-w-2xl px-6 md:px-10 py-16 lg:py-18 "
          >


            {/* Heading */}
            <motion.h1
              variants={item}
              className="text-4xl md:text-6xl font-serif font-bold text-gray-100 leading-tight mt-10"
            >
              Become a Host.
            </motion.h1>

            <motion.h1
              variants={item}
              className="text-4xl md:text-6xl font-serif font-bold  mt-2"
            >
              <span className="text-green-600">Earn More.</span>
              <span className="text-gray-100">Worry Less.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={item}
              className="max-w-xl mt-8 text-gray-200 leading-tight text-base md:text-lg font-semibold"
            >
              Join thousands of property owners earning a steady income by listing
              their homes on NESTESY. We connect you with verified tenants while
              handling the hard work for you.
            </motion.p>

             <div className="flex flex-wrap items-center gap-3">
            <motion.button
              variants={item}
              whileHover={{
                scale: 1.05,
                y: -3,
              }}
              whileTap={{
                scale: 0.96,
              }}
           
                onClick={scrollToRegister}
              className="mt-10 px-10 py-4 bg-tranparent backdrop-blur-sm border border-white  text-white rounded-2xl font-semibold text-lg shadow-xl transition-all duration-300 hover:bg-white hover:text-primary-800"
            >
              Register as Host
            </motion.button>

            <motion.button
              variants={item}
              whileHover={{
                scale: 1.05,
                y: -3,
              }}
              whileTap={{
                scale: 0.96,
              }}
              className="mt-10 px-10 py-4  bg-primary-600 hover:bg-primary-700 border border-primary-600 text-white rounded-2xl font-semibold text-lg shadow-xl"
            >
              Add Property 
            </motion.button>

            </div>

            {/* Glassmorphism Stats */}
            <motion.div variants={item} className="mt-10 max-w-4xl hidden md:flex">
              <div className=" w-full flex rounded-xl bg-transparent backdrop-blur-sm border border-white/30 shadow-xl overflow-hidden">
                {stats.map(({ icon: Icon, value, label }, i) => (
                  <div
                    key={label}
                    className={`flex-1 flex items-center gap-3 px-5 py-4 ${i !== stats.length - 1 ? "border-r border-white/20" : ""
                      }`}
                  >
                    <div className="h-12 w-12 rounded-full bg-white/60 flex items-center justify-center">
                      <Icon className="text-primary-600" size={20} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-100 leading-none">
                        {value}
                      </h2>
                      <p className="text-xs text-gray-300 mt-1">
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>


          </motion.div>

          <div className="hidden md:flex mt-20  h-full z-10 ">
            <img src={Host} className='bg-cover w-full h-full' />
          </div>
        </div>




        {/* Benefits */}


        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 ">

          <h4 className="text-primary-500 tracking-widest text-center font-bold mb-5">BENEFITS</h4>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-primary-900">
              Why Host on{" "}
              <span className="text-primary-500 tracking-wider">
                NESTESY
              </span>
              ?
            </h1>

            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Everything you need to rent your property confidently and connect with
              trusted tenants.
            </p>
          </motion.div>

          {/* Cards */}
       <motion.div
  variants={CardContainer}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.2 }}
  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mt-14"
>
 {Benifits.map(({ title, description, icons: Icon }, index) => (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -12, scale: 1.03 }}
      className="group relative overflow-hidden rounded-3xl border border-primary-200/60 bg-white p-7 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 shadow-md transition-all duration-500 group-hover:bg-white group-hover:rotate-6 group-hover:scale-110">
          <Icon size={30} strokeWidth={2.2} />
        </div>

        <h3 className="mt-6 text-xl font-semibold text-primary-900 transition-colors duration-300 group-hover:text-white">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-500 transition-colors duration-300 group-hover:text-primary-100">
          {description}
        </p>

        <div className="mt-6 h-1 w-10 rounded-full bg-primary-500 transition-all duration-500 group-hover:w-20 group-hover:bg-white"></div>
      </div>

      <div className="absolute -top-14 -right-14 h-36 w-36 rounded-full bg-primary-100 blur-3xl opacity-60 group-hover:bg-white/20"></div>
    </motion.div>
  ))}
</motion.div>
        </div>

        {/* steps */}
        <div className="bg-primary-100 w-full">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 ">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center"

            >
              <h4 className=" text-primary-600 tracking-wide font-bold mb-5">HOW IT WORKS</h4>
              <h1 className=" text-3xl md:text-4xl font-serif font-semibold ">Hosting made simple in <span className="text-primary-500">4</span>  easy steps</h1>
            </motion.div>


            <div className="relative mt-16">

              {/* Desktop Timeline */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[3px] -translate-y-1/2 bg-primary-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true ,amount:0.5}}
                  transition={{ duration: 3 }}
                  className="h-full bg-primary-500"
                />
              </div>

              {/* Mobile Timeline */}
              <div className="lg:hidden absolute left-7 top-0 bottom-0 w-[3px] bg-primary-200 overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2 }}
                  className="w-full bg-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

                {HostSteps.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{
                        opacity: 0,
                        x: window.innerWidth >= 1024 ? -80 : 0,
                        y: window.innerWidth < 1024 ? 80 : 0,
                      }}
                      whileInView={{
                        opacity: 1,
                        x: 0,
                        y: 0,
                      }}
                      viewport={{ once: true,amount:0.9 }}
                      transition={{
                        delay: index * 0.50,
                        duration: 0.7,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        y: -8,
                        scale: 1.03,
                      }}
                      className="relative bg-white rounded-3xl border border-primary-200 shadow-lg hover:shadow-2xl p-8 z-10"
                    >

                      {/* Step Number */}
                      <div className="absolute top-10 right-5 h-9 w-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>

                      {/* Icon INSIDE card */}
                      <div className="h-16 w-16 rounded-2xl bg-primary-500 text-white flex items-center justify-center mb-6">
                        <Icon size={30} />
                      </div>

                      <h3 className="text-xl font-semibold text-primary-800">
                        {item.title}
                      </h3>

                      <p className="mt-4 text-gray-500 leading-7">
                        {item.desc}
                      </p>

                    </motion.div>
                  );
                })}

              </div>

            </div>

          </div>
        </div>

  {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full px-6 py-20"
        >
          <div className="relative overflow-hidden max-w-7xl mx-auto rounded-[32px] bg-primary-600 px-8 py-10 md:px-12 md:py-12">

            {/* Background Glow */}
            <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-primary-500/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">

              {/* Left Content */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">

                <motion.div
                  whileHover={{
                    rotate: 8,
                    scale: 1.08,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 shadow-lg"
                >
                  <Home size={42} className="text-white" />
                </motion.div>

                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white">
                    Ready to List Your Property?
                  </h2>

                  <p className="mt-3 text-primary-100 text-base md:text-lg max-w-xl leading-7">
                    Join <span className="font-semibold">NESTESY</span> today and
                    connect with verified tenants looking for their next home.
                  </p>
                </div>

              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                onClick={scrollToRegister}
                className="bg-white text-primary-800 px-10 py-4 rounded-2xl font-semibold text-lg shadow-xl transition-colors hover:bg-primary-50"
              >
                Become a Host
              </motion.button>

            </div>

          </div>
        </motion.div>

        {/* Host register form */}

        <div className="w-full p-8" id="Host-Login">
          <div className=" h-auto grid  grid-cosl-1 md:grid-cols-5  rounded-3xl">
            <div className="hidden md:block col-span-2 p-5">
              <div className="h-full relative   bg-cover rounded-2xl p-2 shadow-2xl "
                style={{
                  backgroundImage: `url(${formImage})`,
                }} >
                 <div className="absolute inset-0 bg-primary-500/20 rounded-2xl"></div>
               <div className="bg-white flex gap-5 w-75  p-5 absolute rounded-2xl bottom-5 right-5 z-20">
                <div className=" h-15 w-17 p-3 rounded-full bg-primary-100 flex items-center justify-center text-primary-500"><ShieldCheck  size={35}/></div>
                <div>
                  <h1 className='font-semibold leading-tight text-xl mb-5'>Join 5000+ <br/>
                  Happy Host</h1>
                  <p className="text-gray-700 text-[14px]">Start hosting today and grow your earnings</p>
                </div>
               </div>
              </div>
            </div>

            
            <div className="h-full col-span-3 bg-gray-50 p-8 rounded-3xl">
              <h3 className="text-primary-600 font-semibold tracking-wider">HOST REGISTRATOIN</h3>
              <h2 className="text-3xl font-semibold" >Start your hosting journey</h2>
              <p className="text-gray-600">Create your host account in few minutes</p>

            <HostRegister/>


              <p className="text-gray-600 font-semibold text-md text-center mt-4">Already have an account ?
                 <button 
              onClick={()=>setOpenHostLogin(true)}
              className="text-primary-500 font-bold cursor-pointer">Login</button></p>
           
        
           
            </div>

          </div>

        </div>


      
<AnimatePresence>
  {openHostLogin && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setOpenHostLogin(false)}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative"
      >
        {/* Close Button */}
        <button
          onClick={() => setOpenHostLogin(false)}
          className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:rotate-90 transition"
        >
          ✕
        </button>

        <HostLogin />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
      </section>

    </>
  )
}

export default BecomeHost