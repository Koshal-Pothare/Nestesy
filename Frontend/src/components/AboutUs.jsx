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
  Quote,
  User,
} from "lucide-react";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";

import {
  heroData,
  aboutData,
  servicesData,
  statsData,
  whyChooseData,
  testimonialsData,
  ctaData,
} from "../Data/Data";

import heroBg from "../assets/about-hero-bg.png";
import ctaHomeImg from "../assets/About/cta-home.png";

// ---------- icon maps ----------
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

// simple fade-up reveal variant reused across the page
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

// ============================================================
// Hero Section
// ============================================================
const Hero = () => {
  return (
    <section
      className="relative h-[90vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#07130d]/95 via-[#07130d]/70 to-transparent"></div>

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-10">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary-300/40 bg-white/5 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary-300 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary-300"></span>
            {heroData.badge}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-5 font-serif text-5xl font-bold leading-tight text-white md:text-7xl"
          >
            Find Your
            <br />
            <span className="text-primary-300">Perfect Home</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 max-w-xl text-lg leading-8 text-gray-200"
          >
            {heroData.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 flex flex-wrap gap-8"
          >
            {heroData.features.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/40 text-2xl text-white transition duration-300 hover:scale-110 hover:border-primary-300">
                  {heroIcons[item.icon]}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="text-sm text-gray-300">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-12 flex flex-wrap gap-5"
          >
            <button className="flex items-center gap-3 rounded-xl bg-primary-500 px-8 py-4 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-900/40">
              <FaSearch />
              {heroData.buttons[0].text}
            </button>

            <button className="flex items-center gap-3 rounded-xl border border-white px-8 py-4 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-primary-600">
              <FaHome />
              {heroData.buttons[1].text}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// Mission & Vision Section
// ============================================================
const MissionVision = () => {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:px-10">
        {aboutData.map((item, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-border bg-section p-9 shadow-sm transition-shadow duration-300 hover:shadow-xl"
          >
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100"
            >
              {aboutIcons[item.icon]}
            </motion.div>

            <h3 className="mt-6 text-2xl font-bold text-heading">
              {item.title}
            </h3>
            <div className="mt-2 h-1 w-10 rounded-full bg-primary-500"></div>

            <p className="mt-4 leading-7 text-muted">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ============================================================
// Our Services Section
// ============================================================
const Services = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
            {servicesData.tag}
          </p>
          <h2 className="mt-2 text-4xl font-bold text-heading">
            {servicesData.title}
          </h2>
          <p className="mt-3 text-muted">{servicesData.subtitle}</p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {servicesData.items.map((item, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              whileHover={{ y: -8, scale: 1.03 }}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <motion.div
                whileHover={{ rotate: -8, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100"
              >
                {serviceIcons[item.icon]}
              </motion.div>
              <h4 className="mt-5 font-semibold text-heading">
                {item.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-muted">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// Animated Counter (used inside Stats)
// ============================================================
const Counter = ({ text }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(text.replace(/[0-9.]/g, (c) => (c ? "0" : c)));

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
    const decimals = match[0].includes(".") ? match[0].split(".")[1].length : 0;

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

// ============================================================
// Stats Section — placed below "Our Services"
// ============================================================
const Stats = () => {
  return (
    <section className="bg-primary-700">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4 lg:px-10">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-4"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10">
              {statIcons[stat.icon]}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                <Counter text={stat.number} />
              </h3>
              <p className="text-sm text-primary-100">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ============================================================
// Why Choose Us  +  Testimonials Carousel (Tenant / Owner)
// ============================================================
const avatarColors = [
  "bg-primary-500",
  "bg-secondary-500",
  "bg-primary-700",
];

const WhyChooseAndTestimonials = () => {
  const [audience, setAudience] = useState("tenant"); // "tenant" | "owner"
  const [highlight, setHighlight] = useState(0); // which of the 3 cards is subtly highlighted

  const list = testimonialsData[audience];

  // Slowly auto-cycle the highlighted card for a light carousel feel,
  // even though all 3 testimonials stay visible.
  useEffect(() => {
    setHighlight(0);
    const timer = setInterval(() => {
      setHighlight((prev) => (prev + 1) % list.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [audience, list.length]);

  const handleAudienceChange = (value) => {
    setAudience(value);
    setHighlight(0);
  };

  return (
    <section className="bg-section py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:px-10">
        {/* ---- Why Choose Nestesy ---- */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
            {whyChooseData.tag}
          </p>
          <h2 className="mt-2 text-3xl font-bold leading-tight text-heading md:text-4xl">
            {whyChooseData.title}
          </h2>

          <ul className="mt-8 space-y-4">
            {whyChooseData.points.map((point, i) => (
              <motion.li
                key={i}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.5 }}
                variants={fadeUp}
                className="flex items-center gap-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-500">
                  <Check size={14} className="text-white" />
                </span>
                <span className="text-text">{point}</span>
              </motion.li>
            ))}
          </ul>

          <motion.button
            whileHover={{ scale: 1.04, x: 4 }}
            whileTap={{ scale: 0.97 }}
            className="mt-10 flex items-center gap-2 rounded-xl bg-primary-500 px-7 py-3.5 font-semibold text-white shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-primary-900/30"
          >
            {whyChooseData.button.text}
            <span aria-hidden="true">→</span>
          </motion.button>
        </motion.div>

        {/* ---- Testimonials (all 3 shown together, carousel-style highlight) ---- */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-500">
                {testimonialsData.tag}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-heading md:text-3xl">
                {testimonialsData.title}
              </h2>
            </div>

            {/* Tenant / Owner dropdown toggle */}
            <div className="relative shrink-0">
              <select
                value={audience}
                onChange={(e) => handleAudienceChange(e.target.value)}
                className="appearance-none rounded-xl border border-border-dark bg-card py-2.5 pl-4 pr-10 text-sm font-semibold text-heading outline-none transition focus:ring-2 focus:ring-primary-400 cursor-pointer"
              >
                <option value="tenant">Tenant</option>
                <option value="owner">Owner</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          {/* All 3 testimonials, with a slow auto-cycling highlight for a subtle carousel feel */}
          <div className="relative mt-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={audience}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-3"
              >
                {list.map((item, i) => (
                  <motion.div
                    key={item.id}
                    animate={{
                      scale: highlight === i ? 1.04 : 1,
                      y: highlight === i ? -6 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                    className={`rounded-2xl border p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl ${
                      highlight === i
                        ? "border-primary-400 shadow-lg shadow-primary-900/10"
                        : "border-border"
                    } bg-card`}
                  >
                    <Quote size={20} className="text-primary-300" />

                    <p className="mt-3 min-h-[92px] text-sm leading-6 text-text">
                      {item.review}
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${
                          avatarColors[i % avatarColors.length]
                        }`}
                      >
                        <User size={20} />
                      </div>
                      <div>
                        <h5 className="font-semibold text-heading">
                          {item.name}
                        </h5>
                        <p className="text-xs text-muted">{item.city}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-0.5">
                      {Array.from({ length: item.rating }).map((_, r) => (
                        <Star
                          key={r}
                          size={14}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Dots — click to highlight a testimonial, auto-cycles every few seconds */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {list.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setHighlight(i)}
                  aria-label={`Highlight testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === highlight
                      ? "w-6 bg-primary-500"
                      : "w-2 bg-border-dark hover:bg-primary-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================================
// Call To Action Section
// ============================================================
const CTA = () => {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center py-24"
      style={{ backgroundImage: `url(${ctaHomeImg})` }}
    >
      {/* Dark overlay so text stays readable over the photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/80 to-primary-700/60"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 text-center lg:flex-row lg:px-10 lg:text-left"
      >
        <div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {ctaData.title}
          </h2>
          <p className="mt-3 max-w-xl text-primary-100">
            {ctaData.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap justify-center gap-4">
          {ctaData.buttons.map((btn, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={
                btn.type === "primary"
                  ? "rounded-xl bg-white px-7 py-3.5 font-semibold text-primary-600 shadow-sm transition-shadow duration-300 hover:shadow-lg"
                  : "rounded-xl border border-white px-7 py-3.5 font-semibold text-white transition duration-300 hover:bg-white hover:text-primary-600"
              }
            >
              {btn.text}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

// ============================================================
// About Us Page
// ============================================================
const AboutUs = () => {
  return (
    <>
      <Hero />
      <MissionVision />
      <Services />
      <Stats />
      <WhyChooseAndTestimonials />
      <CTA />
    </>
  );
};

export default AboutUs;
