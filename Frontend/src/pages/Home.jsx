import React, { useRef } from "react";
import { useState, useEffect } from "react";
import Hero from "../assets/Home/Hero.png";
import CardLogo from "../assets/Home/CardLogo.png";
import CTA from "../assets/Home/CTA.png";
import PropertyCard from "../Ui/PropertyCard";
import {
  Search,
  MapPin,
  Calendar,
  Home as HomeIcon,
  IndianRupee,
  Bed,
  Bath,
  Square,
  Heart,
  ArrowRight, 
  ShieldCheck,
  UserCheck,
  Tag,
  Headset,
  Shield,
  CreditCard,
} from "lucide-react";
import {
  Properties,
  cities,  
  propertyTypes, 
  budgets 
} from "../Data/Data";
import { motion, useInView } from 'framer-motion';

const Home = () => {
  // For the curved underline animation
  const curveRef = useRef(null);
  const isCurveVisible = useInView(curveRef, { once: true });

  // Split text into letters
  const text = "Find Your Perfect Home";
  const letters = text.split("");

  const words = "Spaces that feel like".split(" ");

  // Custom hook for counter animation
const useCounter = (targetValue, duration = 2000, startDelay = 0) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const isInView = useInView(elementRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);
      const startTime = Date.now() + startDelay;
      const target = parseFloat(targetValue.replace(/[^0-9.]/g, ''));
      const suffix = targetValue.replace(/[0-9.]/g, '');
      
      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        
        if (elapsed < 0) {
          requestAnimationFrame(animate);
          return;
        }
        
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = eased * target;
        
        if (progress < 1) {
          setCount(currentValue);
          requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, isVisible, targetValue, duration, startDelay]);

  const displayValue = targetValue.includes('.') 
    ? count.toFixed(1) 
    : Math.round(count);
  
  const suffix = targetValue.replace(/[0-9.]/g, '');

  return { count: displayValue, suffix, ref: elementRef };
};

 const counter1 = useCounter("12K+", 2000, 900);
 const counter2 = useCounter("8K+", 2000, 1000);
 const counter3 = useCounter("150+", 2000, 700);
 const counter4 = useCounter("4.9★", 2000, 800);

 // Continuous scrolling state for cities
 const [scrollPosition, setScrollPosition] = useState(0);
 const [isPaused, setIsPaused] = useState(false);
 const containerRef = useRef(null);
 const [duplicatedCities, setDuplicatedCities] = useState([]);

 //  infinite scroll effect
 useEffect(() => { 
   setDuplicatedCities([...cities, ...cities, ...cities]);
 }, []);
 
 useEffect(() => {
   if (isPaused || duplicatedCities.length === 0) return;

   const scrollSpeed = 1.5; // Pixels per frame - adjust for speed
   let animationId;
   let lastTime = 0;

   const animateScroll = (time) => {
     if (lastTime === 0) {
       lastTime = time;
       animationId = requestAnimationFrame(animateScroll);
       return;
     }

     const deltaTime = time - lastTime;
     lastTime = time;

     setScrollPosition((prev) => {
       let newPosition = prev + (scrollSpeed * deltaTime) / 16; // Normalize to 60fps
       
       // Get the width of one set of cities
       if (containerRef.current) {
         const containerWidth = containerRef.current.scrollWidth / 3; // Width of one set
         if (newPosition >= containerWidth) {
           newPosition = newPosition - containerWidth;
         }
       }
       
       return newPosition;
     });

     animationId = requestAnimationFrame(animateScroll);
   };

   animationId = requestAnimationFrame(animateScroll);

   return () => {
     if (animationId) {
       cancelAnimationFrame(animationId);
     }
   };
 }, [isPaused, duplicatedCities]);

 // Calculate responsive number of cities per row
 const getCitiesPerRow = () => {
   if (window.innerWidth < 640) return 2; // Mobile
   if (window.innerWidth < 1024) return 4; // Tablet
   return 6; // Desktop
 };

 const [citiesPerRow, setCitiesPerRow] = useState(getCitiesPerRow());

 // Update cities per row on resize
 useEffect(() => {
   const handleResize = () => {
     setCitiesPerRow(getCitiesPerRow());
   };
   window.addEventListener('resize', handleResize);
   return () => window.removeEventListener('resize', handleResize);
 }, []);

 // Split cities into rows for scrolling
 const getCityRows = (cityList) => {
   const rows = [];
   for (let i = 0; i < cityList.length; i += citiesPerRow) {
     rows.push(cityList.slice(i, i + citiesPerRow));
   }
   return rows;
 };

 const cityRows = getCityRows(duplicatedCities);
 
  const features = [
    {
      id: 1,
      icon: ShieldCheck,
      title: "Verified Properties",
      description:
        "All listings are verified for your safety and peace of mind.",
    },
    {
      id: 2,
      icon: UserCheck,
      title: "Trusted Hosts",
      description:
        "Connect with genuine hosts and enjoy a hassle-free experience.",
    },
    {
      id: 3,
      icon: Tag,
      title: "Best Prices",
      description: "Find the best deals that fit your budget and need.",
    },
    {
      id: 4,
      icon: Headset,
      title: "24/7 Support",
      description: "We're here to help you anytime, anywhere you need.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${Hero})` }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/20 to-black/50"></div>

        {/* Decorative Elements */}
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-green-500/20 blur-3xl"></div>
        {/* <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-green-500/10 blur-3xl"></div> */}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl">
            {/* Small Heading */}
            <motion.p className="text-green-400 font-medium text-sm sm:text-base tracking-wider uppercase mb-3 font-[Roboto]">
              {letters.map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: "easeOut",
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.p>

            {/* Main Heading */}
            <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-white font-[PlayfairDisplay]">
              <motion.span className="inline-flex flex-wrap">
                {words.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1 + 0.3,
                      ease: "easeOut",
                    }}
                    className="mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.span>

              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-300 mt-2 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.8,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100,
                }}
              >
                Home
                <svg
                  className="w-10 h-10 mb-2 ml-2 sm:w-12 sm:h-12 md:w-14 md:h-14 text-green-600 inline-block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {/* Curved Underline */}
                <div
                  ref={curveRef}
                  className="absolute -bottom-5 right-4 w-full"
                >
                  <svg
                    viewBox="0 0 500 120"
                    className="w-48 sm:w-56 md:w-64 lg:w-72"
                    style={{ transform: "translateY(10px)" }}
                  >
                    <defs>
                      <linearGradient
                        id="greenCurve"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" style={{ stopColor: "#4ade80" }} />
                        <stop offset="100%" style={{ stopColor: "#86efac" }} />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M30 80 C120 60, 260 55, 450 75"
                      fill="none"
                      stroke="url(#greenCurve)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      initial={{
                        pathLength: 0,
                        opacity: 0,
                      }}
                      animate={{
                        pathLength: isCurveVisible ? 1 : 0,
                        opacity: isCurveVisible ? 1 : 0,
                      }}
                      transition={{
                        delay: 0.5,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    />
                  </svg>
                </div>
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mt-7 text-gray-300 text-base sm:text-lg max-w-2xl font-[Roboto]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              Discover verified flats and houses for rent.
              <span className="block sm:inline">
                {" "}
                Trusted hosts. Secure stays. Better living.
              </span>
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              className="mt-8 flex flex-wrap gap-6 sm:gap-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div ref={counter1.ref} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {counter1.count}
                  {counter1.suffix}
                </span>
                <span className="text-gray-400 text-sm">Properties</span>
              </div>

              <div ref={counter2.ref} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {counter2.count}
                  {counter2.suffix}
                </span>
                <span className="text-gray-400 text-sm">Happy Clients</span>
              </div>

              <div ref={counter3.ref} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {counter3.count}
                  {counter3.suffix}
                </span>
                <span className="text-gray-400 text-sm">Cities</span>
              </div>

              <div ref={counter4.ref} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {counter4.count}
                  {counter4.suffix}
                </span>
                <span className="text-gray-400 text-sm">Rating</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search Form Card */}
      <div className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Location */}
              <div className="relative lg:col-span-1">
                <MapPin
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                />
                <input
                  type="text"
                  placeholder="Search city or locality"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
                <label className="absolute -top-2 left-3 px-1 text-xs text-primary-500 bg-white rounded">
                  Where
                </label>
              </div>

              {/* Move In Date */}
              <div className="relative lg:col-span-1">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                />
                <input
                  type="date"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
                <label className="absolute -top-2 left-3 px-1 text-xs text-primary-500 bg-white rounded">
                  Move In
                </label>
              </div>

              {/* Move Out Date */}
              <div className="relative lg:col-span-1">
                <Calendar
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                />
                <input
                  type="date"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
                <label className="absolute -top-2 left-3 px-1 text-xs text-primary-500 bg-white rounded">
                  Move Out
                </label>
              </div>

              {/* Property Type */}
              <div className="relative lg:col-span-1">
                <HomeIcon
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                />
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer">
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <label className="absolute -top-2 left-3 px-1 text-xs text-primary-500 bg-white rounded">
                  Property Type
                </label>
              </div>

              {/* Budget */}
              <div className="relative lg:col-span-1">
                <IndianRupee
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600"
                />
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer">
                  {budgets.map((budget) => (
                    <option key={budget.value} value={budget.value}>
                      {budget.label}
                    </option>
                  ))}
                </select>
                <label className="absolute -top-2 left-3 px-1 text-xs text-primary-500 bg-white rounded">
                  Budget
                </label>
              </div>

              {/* Search Button */}
              <button className="lg:col-span-1 w-full bg-primary-500 hover:bg-green-700 transition-all duration-300 rounded-xl text-white font-semibold py-3.5 flex justify-center items-center gap-2 shadow-lg shadow-green-600/30 hover:shadow-green-600/40 hover:-translate-y-0.5">
                <Search size={20} />
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Popular Cities Section */}
      <section className="relative z-10 bg-gray-50 pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 -mt-22 h-20 overflow-hidden pointer-events-none z-0">
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-white rounded-t-[250px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <p className="text-green-600 font-semibold uppercase tracking-wider text-sm">
                Popular Cities
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                Explore homes in top cities
              </h2>
            </div>
            <button className="flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors group whitespace-nowrap">
              View all cities
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>

          {/* Continuous Scrolling Container */}
          <div
            ref={containerRef}
            className="relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="flex transition-none"
              style={{
                transform: `translateX(-${scrollPosition}px)`,
              }}
            >
              {cityRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex-shrink-0 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 min-w-full"
                  style={{
                    width: `${100 / cityRows.length}%`,
                  }}
                >
                  {row.map((city, index) => (
                    <motion.div
                      key={`${city.id}-${rowIndex}-${index}`}
                      className="bg-card border border-border rounded-2xl p-5 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group overflow-hidden relative min-h-[250px]"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                    >
                      {/* Image from data file */}
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                        style={{ backgroundImage: `url(${city.image})` }}
                      ></div>

                      {/* Dark Overlay for text readability */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300"></div>

                      <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-white/50 border backdrop-blur-md border-white/30 z-10 flex items-center justify-center">
                        <img src={CardLogo} alt="Card Logo" />
                      </div>

                      <div className="relative z-10 flex flex-col h-full text-left ">
                        <h3 className="font-bold text-white text-lg mt-auto">
                          {city.name}
                        </h3>
                        <p className="text-sm text-white/90 font-semibold">
                          {city.properties} properties
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>

            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="relative z-10 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-green-600 font-semibold uppercase tracking-wider">
              Featured Properties
            </p>

            <h2 className="text-4xl font-bold text-gray-900 mt-2">
              Discover Your Next Home
            </h2>

            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Browse our handpicked premium homes with verified listings and
              trusted owners.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {Properties.slice(0, 6).map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
              />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <button className="px-8 py-4 bg-green-600 text-white rounded-full font-semibold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center">
              View All Properties
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us  */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#f8faff] to-[#eef2f7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-primary-400 font-semibold text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a1e2f] mt-2 mb-4 tracking-tight">
              We Make It <span className="text-primary-500">Easy</span> for You
            </h2>
            <p className="text-lg text-[#3f4e62] max-w-2xl mx-auto">
              Discover why thousands of users trust us for their property needs
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>

          <div className="text-center mt-14">
            <button className="px-10 py-4 bg-primary-600 text-white rounded-full font-semibold text-lg hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform">
              Get Started Now
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
            <p className="text-sm text-[#3f4e62] mt-3">
              Join thousands of happy users. No credit card required.
            </p>
          </div>
        </div>
      </section>

        {/* CTA Section */}
<section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
  <div className="relative overflow-hidden rounded-3xl shadow-2xl"> 
    <div 
      className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${CTA})` }}
    />
    
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/80 to-primary-900/90"></div>
    
    <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
        {/* Left content */}
        <div className="flex-1 space-y-4">
          <span className="inline-block text-primary-300 text-sm font-semibold tracking-wider uppercase bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
            Become a Host
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Earn More by <br className="hidden sm:block" />
            <span className="relative inline-block">
              Hosting Your Property
              <svg className="absolute -bottom-1 left-0 w-full h-2 text-secondary-300/70" viewBox="0 0 200 8" fill="currentColor">
                <path d="M0 4 Q 25 0, 50 4 T 100 4 T 150 4 T 200 4" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-white/80 text-base sm:text-lg max-w-xl">
            List your property, connect with genuine tenants and earn more with zero hassle.
          </p>
          
          {/* CTA Button */}
          <div className="pt-2">
            <button className="group inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-95">
              List Your Property →
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Right features grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 sm:gap-5">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/30 rounded-xl">
                <HomeIcon className="w-5 h-5 text-secondary-300" />
              </div>
              <span className="text-white font-medium text-sm sm:text-base">Easy Listing</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/30 rounded-xl">
                <UserCheck className="w-5 h-5 text-secondary-300" />
              </div>
              <span className="text-white font-medium text-sm sm:text-base">Verified Tenants</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/30 rounded-xl">
                <Shield className="w-5 h-5 text-secondary-300" />
              </div>
              <span className="text-white font-medium text-sm sm:text-base">Secure Payments</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/30 rounded-xl">
                <CreditCard className="w-5 h-5 text-secondary-300" />
              </div>
              <span className="text-white font-medium text-sm sm:text-base">Zero Brokerage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </>
  );  
};

const FeatureCard = ({ feature }) => {
  const Icon = feature.icon;

  return (
    <div className="bg-white rounded-[28px] px-6 py-8 text-center border border-white/50 shadow-[0_20px_35px_-10px_rgba(0,20,50,0.08),0_8px_18px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_50px_-12px_rgba(0,40,100,0.15)] hover:-translate-y-2 hover:border-green-200/30 transition-all duration-300 flex flex-col items-center backdrop-blur-sm group">

      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#eef5ff] to-[#e1ebff] flex items-center justify-center mb-5 group-hover:from-[#dce8ff] group-hover:to-[#c5d9ff] transition-all duration-200">
        <Icon size={42} className="text-green-600" />
      </div>

      <h3 className="text-xl md:text-2xl font-semibold text-primary-700 mb-2 tracking-tight font-[playfairDisplay]">
        {feature.title}
      </h3>

      <p className="text-[#3f4e62] text-base leading-relaxed max-w-[22ch] mx-auto">
        {feature.description}
      </p>
    </div>
  );
};


export default Home;