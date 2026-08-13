import React from 'react'
import { useState } from 'react';
import { Search, Plus, SlidersHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import FAQItem from '../components/FAQItem';
import { motion, animate, useInView } from 'framer-motion';
export default function Help_center() {
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const [selected, setSelected] = useState('contact');
  const [showFilters, setShowFilters] = useState(false);

  const CATEGORIES = [
    { id: "all", label: "All Questions" },
    { id: "general", label: "General" },
    { id: "booking", label: "Booking & Payments" },
    { id: "hosting", label: "For Hosts" },
    { id: "trust", label: "Trust & Safety" },
  ];
  const term = search.trim().toLowerCase();
  const FAQ_GROUPS = [
    {
      cat: "general",
      title: "General",
      items: [
        {
          q: "What is Nestesy?",
          a: "Nestesy is a platform for finding and booking verified homes — from cozy city apartments to full countryside properties — directly from independent hosts, with transparent pricing and no hidden fees.",
        },
        {
          q: "Do I need an account to browse listings?",
          a: "No — you can explore homes, filter by location, property type, and budget without signing up. You'll only need an account when you're ready to save a favorite, message a host, or book.",
        },
        {
          q: "Which cities does Nestesy cover?",
          a: "We're live in most major metro areas and steadily expanding into smaller towns as new hosts join. Use the location search on the Explore page to check availability in your area.",
        },
      ],
    },
    {
      cat: "booking",
      title: "Booking & Payments",
      items: [
        {
          q: "How do I book a home?",
          a: "Pick your dates on a listing page, review the total price, and confirm your booking. Some hosts approve requests instantly, others review them first — you'll always see which before you request to book.",
        },
        {
          q: "What payment methods are accepted?",
          a: "We accept major debit and credit cards, along with popular digital wallets. Payment is processed securely at the time of booking and only released to your host per our payout schedule.",
        },
        {
          q: "Can I cancel or reschedule my booking?",
          a: "Yes. Every listing has its own cancellation policy, shown before you book. Go to your trip in Bookings, then choose Cancel or Change Dates — any refund is calculated automatically based on that policy.",
        },
        {
          q: "Are there any hidden fees?",
          a: "No. The price you see at checkout — nightly rate, cleaning fee, and service fee — is the full amount you'll pay. Nothing is added afterward.",
        },
      ],
    },
    {
      cat: "hosting",
      title: "For Hosts",
      items: [
        {
          q: "How do I list my property?",
          a: 'Select "Become Host" from the menu, add photos, set your availability and nightly rate, and publish. Our team reviews new listings for quality before they go live.',
        },
        {
          q: "When and how do I get paid?",
          a: "Payouts are released 24 hours after your guest checks in, straight to your linked bank account. You can track every payout from your Host Dashboard.",
        },
        {
          q: "What does Nestesy charge hosts?",
          a: "A small service fee is deducted from each booking to cover payment processing and platform support. The exact rate is shown in your Host Dashboard before you publish a listing.",
        },
      ],
    },
    {
      cat: "trust",
      title: "Trust & Safety",
      items: [
        {
          q: "How are listings and hosts verified?",
          a: 'Every host completes identity verification, and listings marked "Verified" have had their photos, address, and amenities checked by our team before going live.',
        },
        {
          q: "What if something goes wrong during my stay?",
          a: "Message your host first through the app — most issues are resolved quickly. If you need a hand, our support team is reachable from your trip page around the clock.",
        },
        {
          q: "Is my personal information kept private?",
          a: "Yes. Your contact details stay private until a booking is confirmed, and are only ever shared with your host or guest to coordinate the stay.",
        },
      ],
    },
  ];

  const visibleGroups = FAQ_GROUPS.filter(
    (g) => activeCat === "all" || g.cat === activeCat
  )
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (item) =>
          term === "" ||
          item.q.toLowerCase().includes(term) ||
          item.a.toLowerCase().includes(term)
      ),
    }))
    .filter((g) => g.items.length > 0);

  const hasResults = visibleGroups.length > 0;



  return (
    <>

      <div className="min-h-screen bg-[#fbfaf6] font-sans ">

        <section className="relative w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className=" inset-0 h-[500px] md:h-[600px]  w-full overflow-hidden bg-cover bg-center bg-no-repeat
            "
            style={{ backgroundImage: "url('/help_center.png')" }}
          >

              <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/20 to-black/50" />

            <div className="relative max-w-6xl mx-auto px-6 h-full flex flex-col justify-center">
              <div className="max-w-xl">
                <h1 className="font-serif font-bold text-4xl md:text-5xl leading-tight text-white mb-4">
                  Questions, <em className="italic text-emerald-700">answered</em>.
                  <br />
                  Before you book, or host.
                </h1>
                <p className="text-white/80 text-xl leading-relaxed">
                  Everything you need to know about finding a home, booking a
                  stay, and hosting on Nestesy.
                </p>
              </div>
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hidden md:block relative max-w-xl mx-auto px-6 md:px-0 -mt-8 z-10"
          >
            <motion.div initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="bg-white border border-stone-200 rounded-full pl-6 pr-2 py-2 flex items-center gap-3 shadow-xl shadow-emerald-950/20">
              <Search size={20} className="text-stone-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search a question — e.g. cancellation, deposit, verification…"
                className="flex-1 bg-transparent outline-none text-stone-900 placeholder:text-stone-400 py-2.5 z-10"
              />
            </motion.div>
          </motion.div>
        </section>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="md:hidden max-w-xl mx-auto px-6 mt-4 flex items-start gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 bg-white border border-stone-200 rounded-full pl-5 pr-3 py-2.5 flex items-center gap-2 shadow-lg shadow-emerald-950/10"
          >
            <Search size={18} className="text-stone-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a question…"
              className="flex-1 min-w-0 bg-transparent outline-none text-stone-900 placeholder:text-stone-400 text-sm"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.30, ease: "easeOut" }}
            className="relative shrink-0">
            <motion.button initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}

              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-2 border border-stone-200 bg-white px-4 py-3 rounded-full text-sm font-semibold text-stone-700 shadow-lg shadow-emerald-950/10"
            >
              <SlidersHorizontal size={16} className="text-emerald-800" />
              {showFilters ? (
                <ChevronUp size={16} className="text-stone-500" />
              ) : (
                <ChevronDown size={16} className="text-stone-500" />
              )}
            </motion.button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-2xl p-2 shadow-lg shadow-emerald-950/10 z-20 flex flex-col">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCat(c.id);
                      setShowFilters(false);
                    }}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeCat === c.id
                      ? "bg-emerald-800 text-white"
                      : "text-stone-600 hover:bg-stone-50"
                      }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

       
        <div className="hidden md:flex max-w-5xl mx-auto px-6 flex-wrap justify-center gap-3 mt-8">
          {CATEGORIES.map((c) => (
            <motion.button initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${activeCat === c.id
                ? "bg-emerald-800 border-emerald-800 text-white"
                : "bg-white border-stone-200 text-stone-500 hover:border-emerald-800 hover:text-emerald-800"
                }`}
            >
              {c.label}
            </motion.button>
          ))}
        </div>

       
        <div className="max-w-3xl mx-auto px-6 pt-14 pb-24">
          {hasResults ? (
            visibleGroups.map((group) => (
              <div key={group.cat} className="mb-12">
                <motion.h2 initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6,  }}
                  className="flex items-center gap-3 font-serif font-bold text-2xl text-emerald-900 mb-5">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  {group.title}
                </motion.h2>
                {group.items.map((item, i) => {
                  const key = `${group.cat}-${item.q}`;
                  return (
                    <FAQItem
                      key={key}
                      q={item.q}
                      a={item.a}
                      isOpen={openKey === key}
                      onToggle={() => setOpenKey(openKey === key ? null : key)}
                      index={i}
                    />
                  );
                })}
              </div>
            ))
          ) : (
            <p className="text-center text-stone-500 py-10">
              No questions match your search. Try a different word, or{" "}
              <a href="#" className="text-emerald-800 font-semibold">
                contact support
              </a>
              .
            </p>
          )}
        </div>

        {/* CTA band */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}

          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto px-6 pb-20">
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 to-emerald-800 rounded-3xl px-8 py-14 text-center text-white">
            <div className="absolute w-80 h-80 rounded-full bg-white/5 -top-32 -right-24" />
            <motion.h2
               className="relative font-serif font-bold text-3xl mb-3">
              Still have a question?
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 30 }}

              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }} className="relative max-w-md mx-auto text-white/75 mb-7 leading-relaxed">
              Our support team typically replies within a few hours — reach out
              and we'll sort it out together.
            </motion.p>


            <div className="relative flex flex-wrap justify-center gap-3">
              <motion.button initial={{ opacity: 0, y: 30 }}

                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
                onClick={() => setSelected('contact')}
                className={`cursor-pointer font-bold px-7 py-3.5 rounded-full transition-colors ${selected === 'contact'
                  ? 'bg-white text-emerald-900'
                  : 'border border-white/40 text-white font-semibold'
                  }`}
              >
                Contact Support
              </motion.button>

              <motion.button initial={{ opacity: 0, y: 30 }}

                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
                onClick={() => setSelected('host')}
                className={`cursor-pointer font-bold px-7 py-3.5 rounded-full transition-colors ${selected === 'host'
                  ? 'bg-white text-emerald-900'
                  : 'border border-white/40 text-white font-semibold'
                  }`}
              >
                Become a Host
              </motion.button>
            </div>
          </div>
        </motion.div>
        {/* </div> */}
      </div>
    </>
  )
}
