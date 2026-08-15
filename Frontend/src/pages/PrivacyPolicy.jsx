import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  ChevronDown,
  CalendarDays,
  ShieldCheck,
  Send,
} from "lucide-react";

import {
  privacyPolicyHeroData,
  privacyPolicyData,
  privacyPolicyCTAData,
} from "../data/data";

import privacyBg from "../assets/privacy-bg.jpg";
import { useNavigate } from "react-router-dom";

// Hero Section

const HeroSection = () => {
  return (
    <section className="relative min-h-[500px] overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${privacyBg})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f8f9f5]/80 via-[#f8f9f5]/45 to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-[500px] max-w-7xl items-center px-5 py-20 sm:px-8 lg:px-10">

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl"
        >

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e9efe2] px-4 py-2 text-sm font-medium text-[#245b31]"
          >
            <ShieldCheck size={15} />
            {privacyPolicyHeroData.badge}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-5xl font-normal tracking-tight text-[#10251b] sm:text-6xl"
          >
            {privacyPolicyHeroData.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-lg font-sans text-base leading-7 text-gray-700 sm:text-lg"
          >
            {privacyPolicyHeroData.description}
          </motion.p>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-7 flex items-center gap-2 font-sans text-sm font-medium text-[#10251b]"
          >
            <CalendarDays size={18} />
            {privacyPolicyHeroData.lastUpdated}
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
};


// Privacy Content

const PrivacyContent = () => {
  const [openId, setOpenId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="px-5 py-16 sm:px-8 lg:px-10">

      <div className="mx-auto max-w-6xl">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >

          <h2 className="text-3xl font-semibold tracking-tight text-[#10251b] sm:text-4xl">
            How We Protect Your Information
          </h2>

          <div className="mx-auto mt-3 h-1 w-7 rounded-full bg-[#286637]" />

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            This Privacy Policy explains how Nestesy collects, uses, shares,
            and protects your personal information when you use our platform
            and services.
          </p>

        </motion.div>


        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {privacyPolicyData.map((item, index) => {

              const Icon = item.icon;
              const isOpen = openId === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.04,
                  }}
                  className="border-b border-gray-200 lg:[&:nth-child(odd)]:border-r"
                >

                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id)}
                    className="flex w-full items-center gap-5 p-6 text-left transition hover:bg-[#fafcf8] sm:p-7"
                  >

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eef2e8] text-[#286637]">
                      <Icon
                        size={26}
                        strokeWidth={1.8}
                      />
                    </div>


                    <div className="min-w-0 flex-1">

                      <h3 className="text-base font-semibold text-[#10251b] sm:text-lg">
                        {item.id}. {item.title}
                      </h3>


                      <AnimatePresence initial={false}>

                        {isOpen ? (

                          <motion.p
                            key={`open-${item.id}`}
                            initial={{
                              opacity: 0,
                              height: 0,
                            }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                            }}
                            transition={{
                              duration: 0.25,
                            }}
                            className="mt-3 overflow-hidden text-sm leading-6 text-gray-600"
                          >
                            {item.description}
                          </motion.p>

                        ) : (

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                            {item.description}
                          </p>

                        )}

                      </AnimatePresence>

                    </div>


                    <motion.div
                      animate={{
                        rotate: isOpen ? 180 : 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="shrink-0 text-gray-600"
                    >
                      <ChevronDown size={21} />
                    </motion.div>

                  </button>

                </motion.div>
              );
            })}

          </div>

        </div>


        {/* CTA */}
        <CTASection />

      </div>

    </section>
  );
};



// CTA Section

const CTASection = () => {

  const navigate = useNavigate()
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 35,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      className="mt-8 rounded-2xl bg-[#eef1e5] px-7 py-8 sm:px-10"
    >

      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

        {/* CTA Text */}
        <div className="flex items-center gap-5">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e1e8d8] text-[#245b31]">
            <ShieldCheck size={28} />
          </div>

          <div>

            <h3 className="text-xl font-semibold text-[#10251b]">
              {privacyPolicyCTAData.title}
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              {privacyPolicyCTAData.description}
            </p>

          </div>

        </div>


        <motion.button
          type="button"
          whileHover={{
            scale: 1.04,
          }}
          whileTap={{
            scale: 0.97,
          }}
          onClick={()=>navigate("/contact")}
          className="flex items-center gap-2 rounded-lg bg-[#195b2b] px-8 py-3 text-sm font-semibold text-white"
        >
          {privacyPolicyCTAData.buttonText}

          <Send size={16} />
        </motion.button>

      </div>

    </motion.div>
  );
};


// Main Privacy Policy Page

const PrivacyPolicy = () => {
  return (
    <div>

      <HeroSection />

      <PrivacyContent />

    </div>
  );
};

export default PrivacyPolicy;