import React, { useState } from "react";

import {
  FileText,
  House,
  User,
  Building2,
  CalendarDays,
  ShieldCheck,
  Ban,
  AlertTriangle,
  Scale,
  RefreshCw,
  Gavel,
  Mail,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

import { termsData } from "../Data/Data";
import termsHero from "../assets/terms-hero.png";


// ==========================================================
// ICON MAPPING
// ==========================================================

const iconMap = {
  FileText,
  House,
  User,
  Building2,
  CalendarDays,
  ShieldCheck,
  Ban,
  AlertTriangle,
  Scale,
  RefreshCw,
  Gavel,
  Mail,
};


// ==========================================================
// HERO SECTION
// ==========================================================

const TermsHero = () => {
  return (
    <section
      className="relative h-[340px] overflow-hidden bg-cover bg-center sm:h-[400px] md:h-[450px]"
      style={{
        backgroundImage: `url(${termsHero})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#071b11]/75" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-5 text-center">
        <div className="max-w-4xl">

          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#315c3d]/70 px-5 py-2 text-sm font-medium text-[#c9f3ce] backdrop-blur-sm">

            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#8bd48b] text-[#174126]">
              <FileText size={14} />
            </div>

            <span>
              {termsData.hero.badge}
            </span>

          </div>

          {/* Title */}
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
            {termsData.hero.title}
          </h1>

          {/* Description */}
          <p className="mt-5 text-sm leading-6 text-white/90 sm:text-base">
            {termsData.hero.description}

            <br />

            {termsData.hero.subDescription}
          </p>

        </div>
      </div>
    </section>
  );
};


// ==========================================================
// SIDEBAR / TABLE OF CONTENTS
// ==========================================================

const TermsSidebar = ({
  openSection,
  scrollToSection,
}) => {
  return (
    <aside className="h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">

      {/* Heading */}
      <h2 className="mb-5 px-1 text-lg font-semibold text-[#123d28]">
        In This Page
      </h2>

      {/* Menu */}
      <div className="space-y-1">

        {termsData.contents.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left transition-all ${
              openSection === item.id
                ? "bg-[#e9f7e6]"
                : "hover:bg-[#f3f9f1]"
            }`}
          >

            {/* Number */}
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#91d87f] text-[11px] font-semibold text-white">
              {String(item.id).padStart(2, "0")}
            </span>

            {/* Title */}
            <span className="text-[13px] font-medium text-[#17452e]">
              {item.title}
            </span>

          </button>
        ))}

      </div>
    </aside>
  );
};


// ==========================================================
// TERMS SECTIONS
// ==========================================================

const TermsSections = ({
  openSection,
  toggleSection,
}) => {
  return (
    <div className="space-y-3">

      {termsData.sections.map((section) => {

        const Icon = iconMap[section.icon];

        const isOpen =
          openSection === section.id;

        return (
          <div
            key={section.id}
            id={`term-${section.id}`}
            className="scroll-mt-28"
          >

            <div
              className={`overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                isOpen
                  ? "border-[#b7dcb3] shadow-md"
                  : "border-gray-200 shadow-sm"
              }`}
            >

              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center gap-5 px-5 py-5 text-left sm:px-6"
              >

                {/* Icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#eaf7e7] text-[#174b30]">
                  <Icon
                    size={26}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">

                  <h3 className="text-base font-semibold text-[#15462f] sm:text-lg">
                    {section.id}. {section.title}
                  </h3>

                  {/* Preview */}
                  {!isOpen && (
                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-700">
                      {section.content}
                    </p>
                  )}

                </div>

                {/* Arrow */}
                <ChevronDown
                  size={22}
                  className={`shrink-0 text-[#174b30] transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />

              </button>

              {/* Expanded Content */}
              {isOpen && (
                <div className="border-t border-gray-100 px-5 pb-6 sm:px-6">

                  <p className="pt-4 text-sm leading-7 text-gray-600">
                    {section.content}
                  </p>

                </div>
              )}

            </div>
          </div>
        );
      })}

    </div>
  );
};


// ==========================================================
// IMPORTANT NOTE
// ==========================================================

const ImportantNote = () => {
  return (
    <div className="mt-6 flex flex-col gap-5 rounded-xl bg-[#f2faef] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

      {/* Left Side */}
      <div className="flex items-center gap-4">

        {/* Icon */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e4f5df] text-[#174b30]">
          <ShieldCheck
            size={27}
            strokeWidth={1.8}
          />
        </div>

        {/* Text */}
        <div>

          <h3 className="text-base font-semibold text-[#17452e]">
            {termsData.importantNote.title}
          </h3>

          <p className="mt-1 text-sm text-gray-700">
            {termsData.importantNote.text}

            <br />

            {termsData.importantNote.subText}
          </p>

        </div>
      </div>

      {/* Button */}
      <button
        type="button"
        onClick={() => {
          window.location.href = "/";
        }}
        className="inline-flex shrink-0 items-center justify-center gap-3 rounded-lg bg-[#155638] px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#10462d] hover:shadow-lg"
      >

        {termsData.importantNote.buttonText}

        <ArrowRight size={18} />

      </button>

    </div>
  );
};


// ==========================================================
// MAIN CONTENT
// ==========================================================

const TermsContent = () => {

  const [openSection, setOpenSection] = useState(null);

  // Open / Close Section
  const toggleSection = (id) => {
    setOpenSection(
      openSection === id
        ? null
        : id
    );
  };

  // Scroll to Section
  const scrollToSection = (id) => {

    const element = document.getElementById(
      `term-${id}`
    );

    if (element) {

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setOpenSection(id);
    }
  };

  return (
    <section className="bg-white px-5 py-10 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-7xl">

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[255px_1fr]">

          {/* LEFT SIDEBAR */}

          <TermsSidebar
            openSection={openSection}
            scrollToSection={scrollToSection}
          />

          {/* RIGHT CONTENT */}

          <div>

            <TermsSections
              openSection={openSection}
              toggleSection={toggleSection}
            />

            <ImportantNote />

          </div>

        </div>

      </div>

    </section>
  );
};


// ==========================================================
// MAIN TERMS & CONDITIONS PAGE
// ==========================================================

const TermsConditions = () => {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <TermsHero />

      {/* Terms Content */}
      <TermsContent />

    </main>
  );
};


export default TermsConditions;