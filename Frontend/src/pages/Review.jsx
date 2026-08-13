import React, { useState } from "react";
import { Star, ChevronDown, ChevronUp, ShieldCheck, Send, Home, MessageSquare, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import review from '../assets/Faq/review.png';

const FILTERS = [
    { id: "all", label: "All Reviews" },
    { id: "guests", label: "Guests" },
    { id: "hosts", label: "Hosts" },
    { id: "verified", label: "Verified Stays" },
];

const REVIEWS = [
    {
        id: 1,
        name: "Sonu",
        handle: "atharv",
        rating: 5,
        text: "Awesome experience end to end.",
        tag: "guests",
        initial: "A",
        color: "bg-emerald-600",
    },
    {
        id: 2,
        name: "Muskan",
        handle: "verified guest",
        rating: 3,
        text: "Clean, well-located apartment with quick host responses — a comfortable stay overall for a short work trip.",
        tag: "verified",
        initial: "V",
        color: "bg-violet-600",
    },
    {
        id: 3,
        name: "Joy",
        handle: "host · Sector 27",
        rating: 5,
        text: "Hosting on Nestesy has been smooth — verified guests, on-time payouts, and a dashboard that's genuinely easy to use.",
        tag: "hosts",
        initial: "T",
        color: "bg-orange-500",
    },
    {
        id: 4,
        name: "Tannu",
        handle: "verified guest",
        rating: 5,
        text: "Booked a weekend stay through Nestesy — the listing matched the photos exactly, and check-in took less than five minutes.",
        tag: "verified",
        initial: "T",
        color: "bg-orange-500",
    },
    {
        id: 5,
        name: "Tamana",
        handle: "guest",
        rating: 5,
        text: "Great communication from the host and a spotless apartment. Would book through Nestesy again without hesitation.",
        tag: "guests",
        initial: "T",
        color: "bg-violet-600",
    },
    {
        id: 6,
        name: "Rohan",
        handle: "host · Bandra",
        rating: 4,
        text: "The host dashboard makes it simple to track bookings and payouts. A couple of UI tweaks would make it even smoother.",
        tag: "hosts",
        initial: "M",
        color: "bg-orange-500",
    },
    {
        id: 7,
        name: "Manish",
        handle: "guest",
        rating: 5,
        text: "Comfortable stay, friendly host, exactly as described.",
        tag: "guests",
        initial: "M",
        color: "bg-pink-600",
    },
    {
        id: 8,
        name: "Meenu",
        handle: "verified guest",
        rating: 5,
        text: "One of the best stays we've had on Nestesy — beautiful balcony view and a thoughtful welcome note from the host.",
        tag: "verified",
        initial: "M",
        color: "bg-emerald-600",
    },
    {
        id: 9,
        name: "Rohit",
        handle: "guest",
        rating: 4,
        text: "Great stay overall, interiors matched the photos exactly. Wifi was a little slow in the evenings, otherwise no complaints.",
        tag: "guests",
        initial: "R",
        color: "bg-pink-600",
    },
];

const PROMPTS = [
    {
        icon: Home,
        title: "Property & Comfort",
        text: "Tell us how the space matched the listing — cleanliness, amenities, and overall comfort.",
    },
    {
        icon: MessageSquare,
        title: "Host Communication",
        text: "Share how responsive and helpful your host was, before and during your stay.",
    },
    {
        icon: Award,
        title: "Value & Trust",
        text: "Let us know if the pricing, verification, and support felt fair and reliable.",
    },
];

function Stars({ rating, size = 14 }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
                <Star
                    key={n}
                    size={size}
                    className={n <= rating ? "fill-amber-400 text-amber-400" : "text-emerald-800/40"}
                />
            ))}
        </div>
    );
}

export default function TestimonialsPage() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [expanded, setExpanded] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [rating, setRating] = useState(0);

    const filtered = REVIEWS.filter(
        (r) => activeFilter === "all" || r.tag === activeFilter
    );
    const visible = expanded ? filtered : filtered.slice(0, 6);

    return (
        <div className="min-h-screen bg-[#fbfaf6] font-sans overflow-hidden">
            {/* Hero Section */}
            <section className="relative  overflow-hidden">
               <motion.div
                           initial={{ opacity: 0, y: 30 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true, amount: 0.3 }}
                           transition={{ duration: 0.7 }}
                           className="relative h-[420px] md:h-[480px] overflow-hidden bg-cover bg-bottom
                           "
                           style={{ backgroundImage: "url(./review.png)" }}
                         >
               
                             <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/20 to-black/50" />
                    <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="font-serif font-extrabold text-4xl md:text-5xl text-white mb-3"
                        >
                            Guest <span className="text-emerald-400">Stories</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                            className="text-white max-w-xl mx-auto mb-12"
                        >
                            See how guests and hosts across the country experience finding,
                            booking, and living in homes on Nestesy.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                            className="flex flex-wrap justify-center gap-10 md:gap-16"
                        >
                            <div>
                                <p className="font-serif font-bold text-3xl md:text-4xl text-emerald-400">10K+</p>
                                <p className="text-white text-xs tracking-wide uppercase mt-1">Happy Guests</p>
                            </div>
                            <div className="w-px bg-white/10 hidden md:block" />
                            <div>
                                <p className="font-serif font-bold text-3xl md:text-4xl text-emerald-400">2,500+</p>
                                <p className="text-white text-xs tracking-wide uppercase mt-1">Verified Hosts</p>
                            </div>
                            <div className="w-px bg-white/10 hidden md:block" />
                            <div>
                                <p className="font-serif font-bold text-3xl md:text-4xl text-emerald-400">4.8</p>
                                <p className="text-white text-xs tracking-wide uppercase mt-1">Average Rating</p>
                            </div>
                        </motion.div>
                        </div>
                    </motion.div>
            </section>

            {/* Reviews Section */}
            <section className="max-w-6xl mx-auto px-6 pt-16 pb-8 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5 }}
                    className="font-serif font-extrabold text-3xl md:text-4xl text-stone-900 mb-3"
                >
                    What They <span className="text-emerald-700">Say</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-stone-500 max-w-lg mx-auto mb-8"
                >
                    Unbiased reviews from guests, hosts, and everyone who's found a
                    place through Nestesy.
                </motion.p>

                {/* Filter Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex md:flex-wrap md:justify-center gap-3 mb-10 overflow-x-auto thin-scrollbar  md:px-0 md:mx-0"
                >
                    {FILTERS.map((f) => (
                        <button
                            key={f.id}
                            onClick={() => {
                                setActiveFilter(f.id);
                                setExpanded(false);
                            }}
                            className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors whitespace-nowrap ${activeFilter === f.id
                                    ? "bg-emerald-800 border-emerald-800 text-white"
                                    : "bg-white border-stone-200 text-stone-500 hover:border-emerald-800 hover:text-emerald-800"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </motion.div>

                {/* Review Grid with Animations */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 text-left">
                    <AnimatePresence mode="popLayout">
                        {visible.map((r, i) => (
                            <motion.div
                                key={r.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.35, delay: i * 0.04 }}
                                className="bg-emerald-950 rounded-2xl p-6 relative overflow-hidden"
                            >
                                <span className="absolute top-4 right-5 text-emerald-800 text-4xl font-serif select-none">
                                    "
                                </span>
                                <Stars rating={r.rating} />
                                <p className="text-white/80 text-sm leading-relaxed mt-4 mb-6 relative z-10">
                                    "{r.text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-9 h-9 rounded-full ${r.color} text-white flex items-center justify-center font-semibold text-sm shrink-0`}
                                    >
                                        {r.initial}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{r.name}</p>
                                        <p className="text-white/40 text-xs">{r.handle}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filtered.length > 6 && (
                    <button
                        onClick={() => setExpanded((v) => !v)}
                        className="mt-10 inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm px-7 py-3.5 rounded-full transition-colors cursor-pointer"
                    >
                        {expanded ? "SHOW LESS" : "LOAD MORE"}
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                )}
            </section>

            {/* Info & Form Section */}
            <section className="bg-stone-50 border-t border-stone-200 mt-16">
                <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
                    {/* Left Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <span className="inline-flex items-center gap-2 text-emerald-800 font-semibold text-xs tracking-wide uppercase mb-4">
                            <ShieldCheck size={16} />
                            Verified Reviews
                        </span>
                        <h2 className="font-serif font-extrabold text-3xl md:text-4xl text-stone-900 leading-tight mb-4">
                            Loved your stay?
                            <br />
                            <span className="text-emerald-700">Share your story.</span>
                        </h2>
                        <p className="text-stone-500 leading-relaxed mb-8 max-w-md">
                            Your feedback helps other travelers choose with confidence, and
                            helps hosts keep improving. We read every review before it goes
                            live.
                        </p>

                        <div className="space-y-4">
                            {PROMPTS.map((p, i) => (
                                <motion.div
                                    key={p.title}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.4 }}
                                    transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                                    className="flex items-start gap-4 bg-white border border-stone-200 rounded-2xl p-4"
                                >
                                    <div className="w-9 h-9 rounded-full bg-emerald-800/10 text-emerald-800 flex items-center justify-center shrink-0">
                                        <p.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-stone-900 text-sm">{p.title}</p>
                                        <p className="text-stone-500 text-sm mt-0.5">{p.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm"
                    >
                        <h3 className="font-serif font-bold text-2xl text-stone-900 mb-1">
                            Write a Review
                        </h3>
                        <p className="text-stone-500 text-sm mb-6">
                            Share your experience staying or hosting with Nestesy.
                        </p>

                        <div className="space-y-5">
                            <div>
                                <label className="text-xs font-semibold tracking-wide uppercase text-stone-500">
                                    Full Name <span className="text-emerald-700">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full mt-2 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-800 text-stone-800"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold tracking-wide uppercase text-stone-500">
                                    Property / Trip
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sunlit 2BHK, Delhi"
                                    className="w-full mt-2 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-800 text-stone-800"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold tracking-wide uppercase text-stone-500">
                                    Star Rating <span className="text-emerald-700">*</span>
                                </label>
                                <div className="flex gap-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                            key={n}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(n)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(n)}
                                        >
                                            <Star
                                                size={26}
                                                className={
                                                    n <= (hoverRating || rating)
                                                        ? "fill-amber-500 text-amber-500"
                                                        : "text-stone-300"
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold tracking-wide uppercase text-stone-500">
                                    Your Feedback <span className="text-emerald-700">*</span>
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your stay, host communication, or overall experience…"
                                    className="w-full mt-2 border border-stone-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-800 text-stone-800 resize-none"
                                />
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3.5 rounded-full transition-colors cursor-pointer">
                                <Send size={16} />
                                Submit Review
                            </button>

                            <p className="text-xs text-stone-400 text-center leading-relaxed">
                                By submitting, you agree your feedback will be reviewed by our
                                team before going live.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}