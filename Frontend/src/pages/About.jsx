import React, { useState, useEffect, useRef } from "react";
import {
  FaShieldAlt,
  FaCalendarAlt,
  FaHeadset,
  FaSearch,
  FaHome,
} from "react-icons/fa";
import {
  Target,
  Eye,
  Binoculars,
  Users,
  Wallet,
  Headphones,
  SearchCheck,
  Building2,
  MapPin,
  Star,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Quote,
  User,
} from "lucide-react";
import { motion, useInView, animate } from "framer-motion";
import whyChooseImage from "../assets/About/why-choose.png";
import {
  heroData,
  aboutData,
  servicesData,
  statsData,
  whyChooseData,
  testimonialsData,
  ctaData,
} from "../Data/Data";

import sofaImage from "../assets/About/mission-vision.png";
import cityImage from "../assets/About/mission-city.png";

import heroBg from "../assets/About/about-hero-bg.jpg";
import ctaHomeImg from "../assets/About/cta-home.png";


const heroIcons = {
  shield: <FaShieldAlt />,
  calendar: <FaCalendarAlt />,
  headset: <FaHeadset />,
};

const aboutIcons = {
  target: <Target size={26} className="text-primary-500" />,
  binoculars: <Binoculars size={26} className="text-primary-500" />,
};

const serviceIcons = {
  "search-home": <SearchCheck size={26} className="text-primary-500" />,
  users: <Users size={26} className="text-primary-500" />,
  search: <FaSearch size={22} className="text-primary-500" />,
  wallet: <Wallet size={26} className="text-primary-500" />,
  headset: <Headphones size={26} className="text-primary-500" />,
};

const statIcons = {
  building: <Building2 size={26} className="text-white" />,
  users: <Users size={26} className="text-white" />,
  location: <MapPin size={26} className="text-white" />,
  star: <Star size={26} className="text-white" />,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

// Hero Section

const Hero = () => {
  return (
    <div
      className="relative flex min-h-[90vh] items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#07130d]/95 via-[#07130d]/75 to-[#07130d]/30" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 md:px-10 lg:px-12">
        <div className="max-w-2xl pt-10">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-5 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Find Your
            <br />
            <span className="text-primary-400">Perfect Home</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="mt-5 max-w-xl text-sm leading-6 text-gray-200 sm:mt-6 sm:text-base sm:leading-7 md:text-lg md:leading-8"
          >
            {heroData.description}
          </motion.p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-3 sm:gap-6">
            {heroData.features.map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="flex items-center gap-3 sm:items-start"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/40 text-lg text-white sm:h-12 sm:w-12 sm:text-xl">
                  {heroIcons[item.icon]}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white sm:text-base">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-300 sm:text-sm">
                    {item.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: "easeOut" }}
            className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-primary-600 hover:shadow-lg sm:w-auto sm:px-8 sm:py-4 sm:text-base"
            >
              <FaSearch />
              {heroData.buttons[0].text}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white hover:text-primary-600 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
            >
              <FaHome />
              {heroData.buttons[1].text}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Mission & Vision Section

const MissionVision = () => {
  return (
    <section className="bg-[#faf9f5] px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[32px] bg-[#f4f1e8]"
        >

          <img
            src={cityImage}
            alt=""
            className="pointer-events-none absolute bottom-0 left-0 z-0 h-[180px] w-[65%] object-cover object-bottom opacity-30 sm:h-[210px] lg:h-[240px]"
          />

          <div className="relative z-10 grid min-h-[500px] lg:grid-cols-[58%_42%]">

            <div className="flex items-center px-7 py-12 sm:px-10 lg:px-14 lg:py-16">

              <div className="w-full">

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-[#a48443]"
                >
                  What Drives Us
                </motion.p>

                <div className="grid gap-10 md:grid-cols-2 md:gap-0">

                  <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="md:border-r md:border-[#d8d4c8] md:pr-10"
                  >

                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f5b3b] text-white">
                      <Target size={25} strokeWidth={1.8} />
                    </div>

                    <h3 className="font-serif text-3xl font-bold text-[#1f5b3b]">
                      Our Mission
                    </h3>

                    <div className="mt-4 h-[2px] w-10 bg-[#b99b55]"></div>

                    <p className="mt-5 max-w-sm text-[15px] leading-7 text-[#5c605b]">
                      To make renting simple and stress-free by providing
                      verified listings, secure communication, and exceptional
                      support.
                    </p>

                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="md:pl-10"
                  >

                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f5b3b] text-white">
                      <Eye size={25} strokeWidth={1.8} />
                    </div>

                    <h3 className="font-serif text-3xl font-bold text-[#1f5b3b]">
                      Our Vision
                    </h3>

                    <div className="mt-4 h-[2px] w-10 bg-[#b99b55]"></div>

                    <p className="mt-5 max-w-sm text-[15px] leading-7 text-[#5c605b]">
                      To be the most trusted rental platform that empowers
                      people to find, list, and manage homes with confidence.
                    </p>

                  </motion.div>

                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 1.03 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative min-h-[360px] overflow-hidden lg:min-h-[500px]"
            >

              <img
                src={sofaImage}
                alt="Beautiful modern living room"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Smooth blend between content and image */}
              <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#f4f1e8] to-transparent lg:w-40"></div>

              {/* Bottom soft blend */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f4f1e8]/30 to-transparent"></div>

            </motion.div>

          </div>

        </motion.div>
      </div>
    </section>
  );
};


// Our Services Section

const Services = () => {
  return (
    <section className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-500">
          {servicesData.tag}
        </p>

        <h2 className="mt-3 text-4xl font-bold text-heading">
          {servicesData.title}
        </h2>

        <p className="mt-4 text-lg text-muted">
          {servicesData.subtitle}
        </p>
      </motion.div>

      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {servicesData.items.map((item, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            whileHover={{
              y: -10,
              scale: 1.03,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 18,
            }}
            className="
              group
              rounded-2xl
              border border-primary-100
              bg-white
              p-7
              text-center
              shadow-[0_8px_25px_rgba(31,91,59,0.10)]
              transition-all
              duration-300
              hover:border-primary-500
              hover:bg-primary-600
              hover:shadow-[0_18px_40px_rgba(31,91,59,0.28)]
            "
          >
            {/* Icon */}
            <motion.div
              whileHover={{
                rotate: -8,
                scale: 1.12,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 12,
              }}
              className="
                mx-auto
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-primary-100
                text-2xl
                text-primary-600
                shadow-sm
                transition-all
                duration-300
                group-hover:bg-white
                group-hover:text-primary-600
                group-hover:shadow-md
              "
            >
              {serviceIcons[item.icon]}
            </motion.div>

            <h3
              className="
                mt-7
                text-lg
                font-semibold
                text-heading
                transition-colors
                duration-300
                group-hover:text-white
              "
            >
              {item.title}
            </h3>

            {/* Description */}
            <p
              className="
                mt-3
                text-sm
                leading-7
                text-muted
                transition-colors
                duration-300
                group-hover:text-primary-50
              "
            >
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
// Animated Counter (used inside Stats)

const Counter = ({ text }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(
    text.replace(/[0-9.]/g, (c) => (c ? "0" : c))
  );

  useEffect(() => {
    if (!isInView) return;

    const match = text.match(/[\d.]+/);
    if (!match) {
      setDisplay(text);
      return;
    }

    const numeric = parseFloat(match[0]);
    const prefix = text.slice(0, match.index);
    const suffix = text.slice(match.index + match[0].length);
    const decimals = match[0].includes(".")
      ? match[0].split(".")[1].length
      : 0;

    const controls = animate(0, numeric, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (value) => {
        setDisplay(`${prefix}${value.toFixed(decimals)}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [isInView, text]);

  return <span ref={ref}>{display}</span>;
};

// Stats Section — placed below "Our Services"

const Stats = () => {
  return (
    <section className="bg-[#faf9f5] px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-primary-600 px-6 py-8 shadow-sm sm:px-10 lg:px-14">
        <div className="rounded-2xl bg-primary-600 px-6 py-11 shadow-sm sm:px-10 lg:px-14">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center gap-3"
              >
                {statIcons[stat.icon]}

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    <Counter text={stat.number} />
                  </h3>

                  <p className="text-sm text-primary-100">
                    {stat.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

// Why Choose Us

const WhyChoose = () => {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-10">
        {/* LEFT SIDE - CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
            {whyChooseData.tag}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-heading md:text-4xl">
            {whyChooseData.title}
          </h2>

          <ul className="mt-8 space-y-2">
            {whyChooseData.points.map((point, i) => (
              <motion.li
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeUp}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors duration-300 hover:bg-card"
              >
                <motion.span
                  whileHover={{ rotate: -10, scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-500"
                >
                  <Check size={14} className="text-white" />
                </motion.span>

                <span className="text-text">{point}</span>
              </motion.li>
            ))}
          </ul>

          <motion.button
            whileHover={{ scale: 1.04, x: 4 }}
            whileTap={{ scale: 0.96 }}
            className="mt-10 flex items-center gap-2 rounded-xl bg-primary-500 px-7 py-3.5 font-semibold text-white shadow-sm transition duration-300 hover:bg-primary-600 hover:shadow-lg"
          >
            {whyChooseData.button.text}
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
            </motion.span>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <motion.img
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            src={whyChooseImage}
            alt="Comfortable home"
            className="h-[450px] w-full rounded-3xl object-cover shadow-lg"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="absolute -bottom-5 -left-5 rounded-2xl bg-primary-600 px-6 py-4 text-white shadow-lg"
          >
            <p className="text-sm">Trusted by</p>
            <p className="text-2xl font-bold">50,000+</p>
            <p className="text-sm">Happy Customers</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Testimonials (Tenant / Owner)

const avatarColors = ["bg-primary-500", "bg-secondary-500", "bg-primary-700"];

const Testimonials = () => {
  const [audience, setAudience] = useState("tenant");
  const [currentIndex, setCurrentIndex] = useState(0);

  const list = testimonialsData[audience];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % list.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  return (
    <section className="px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-500">
              {testimonialsData.tag}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-heading md:text-3xl">
              {testimonialsData.title}
            </h2>
          </div>

          <div className="relative shrink-0">
            <select
              value={audience}
              onChange={(e) => {
                setAudience(e.target.value);
                setCurrentIndex(0);
              }}
              className="w-32 cursor-pointer appearance-none rounded-xl border border-primary-200 bg-card px-4 py-3 pr-9 text-sm font-semibold text-heading shadow-sm outline-none transition hover:border-primary-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            >
              <option value="tenant">Tenant</option>
              <option value="owner">Owner</option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary-500"
            />
          </div>
        </motion.div>

        <div className="relative mt-8">

          <button
            onClick={prevSlide}
            className="absolute -left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-600 shadow-md transition hover:bg-primary-50"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="overflow-hidden px-1 py-2">
            <motion.div
              key={`${audience}-${currentIndex}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {Array.from({ length: Math.min(3, list.length) }).map(
                (_, index) => {
                  const item = list[(currentIndex + index) % list.length];

                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -6, scale: 1.02 }}
                      className="rounded-2xl border border-primary-100 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary-200 hover:shadow-[0_8px_25px_rgba(31,91,59,0.15)]"
                    >
                      <Quote size={20} className="text-primary-300" />

                      <p className="mt-3 min-h-[92px] text-sm leading-6 text-text">
                        {item.review}
                      </p>

                      <div className="mt-5 flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                          }}
                          className={`flex h-11 w-11 items-center justify-center rounded-full text-white ${
                            avatarColors[index % avatarColors.length]
                          }`}
                        >
                          <User size={20} />
                        </motion.div>

                        <div>
                          <h5 className="font-semibold text-heading">
                            {item.name}
                          </h5>

                          <p className="text-xs text-muted">
                            {item.city}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-0.5">
                        {Array.from({ length: item.rating }).map(
                          (_, i) => (
                            <motion.span
                              key={i}
                              whileHover={{
                                scale: 1.3,
                                rotate: 10,
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                              }}
                            >
                              <Star
                                size={14}
                                className="fill-yellow-400 text-yellow-400"
                              />
                            </motion.span>
                          )
                        )}
                      </div>
                    </motion.div>
                  );
                }
              )}
            </motion.div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-primary-100 bg-white text-primary-600 shadow-md transition hover:bg-primary-50"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>

        </div>

        <div className="mt-6 flex justify-center gap-2">
          {list.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 bg-primary-600"
                  : "w-2 bg-primary-200"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

// Call To Action Section

const CTA = () => {
  return (
    <section className="mt-20 mb-20 px-4 md:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto min-h-[450px] max-w-7xl overflow-hidden rounded-3xl bg-cover bg-center py-20 md:py-24"
        style={{ backgroundImage: `url(${ctaHomeImg})` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Main Content */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-center gap-12 px-8 lg:flex-row lg:items-center lg:px-10">

          {/* ================= LEFT SIDE ================= */}
          <div className="flex-1 text-center lg:text-left">

            <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {ctaData.title}
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-white/90 md:text-lg">
              {ctaData.description}
            </p>

            {/* Buttons */}
            <div className="mt-7 flex flex-wrap justify-center gap-4 lg:justify-start">
              {ctaData.buttons.map((btn, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  className={
                    btn.type === "primary"
                      ? "rounded-xl bg-white px-7 py-3.5 font-semibold text-primary-600 shadow-md transition hover:shadow-xl"
                      : "rounded-xl border border-white px-7 py-3.5 font-semibold text-white transition hover:bg-white hover:text-primary-600"
                  }
                >
                  {btn.text}
                </motion.button>
              ))}
            </div>
          </div>

          {/* ================= RIGHT SIDE STATS ================= */}
          <div className="grid w-full max-w-sm grid-cols-2 gap-4">

            {/* Stat 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-2xl bg-white/20 p-5 text-center backdrop-blur-md"
            >
              <h3 className="text-3xl font-bold text-white">
                10,000+
              </h3>

              <p className="mt-1 text-sm text-white/90">
                Verified Properties
              </p>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-2xl bg-white/20 p-5 text-center backdrop-blur-md"
            >
     
              <h3 className="text-3xl font-bold text-white">
                50,000+
              </h3>

              <p className="mt-1 text-sm text-white/90">
                Happy Customers
              </p>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-2xl bg-white/20 p-5 text-center backdrop-blur-md"
            >
              <h3 className="text-3xl font-bold text-white">
                500+
              </h3>

              <p className="mt-1 text-sm text-white/90">
                Trusted Hosts
              </p>
            </motion.div>

            {/* Stat 4 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="rounded-2xl bg-white/20 p-5 text-center backdrop-blur-md"
            >
              <h3 className="text-3xl font-bold text-white">
                24/7
              </h3>

              <p className="mt-1 text-sm text-white/90">
                Customer Support
              </p>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </section>
  );
};

// About Us Page

const About = () => {
  return (
    <>
      <Hero />
      <MissionVision />
      <Services />
      <Stats />
      <WhyChoose />
      <Testimonials />
      <CTA />
    </>
  );
};

export default About;
