import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ArrowUpRight,
  BedDouble,
  Bath,
  Ruler,
  User,
  Phone,
  X,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BookingService } from "../services/UserServices";

const getHostDisplayName = (host) => {
  if (!host) return "Verified Host";
  const str = String(host).trim();
  if (/^[0-9a-fA-F]{24}$/.test(str)) {
    return "Verified Host";
  }
  return str;
};

const UpcomingVisits = () => {
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const data = await BookingService.getUpcomingVisits();
        setVisits(data.bookings || []);
      } catch (error) {
        toast.error("Failed to load upcoming visits");
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  const handleCancelVisit = async (id) => {
    try {
      await BookingService.cancelBooking(id);
      setVisits((prev) => prev.filter((v) => v._id !== id));
      toast.success("Visit cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel visit");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <CalendarDays size={19} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
                  My Visits
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Upcoming Visits
              </h1>
              <p className="mt-1.5 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                Keep track of your scheduled property visits and never miss
                an opportunity to find your perfect home.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <CalendarDays size={18} />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                  Scheduled
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {visits.length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        {visits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-5 text-center shadow-sm"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-50 text-primary-600"
            >
              <CalendarDays size={38} />
            </motion.div>
            <h2 className="mt-6 text-xl font-bold text-gray-800 sm:text-2xl">
              No Upcoming Visits
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              You don't have any property visits scheduled yet. Explore
              available properties and book a visit when you find a place
              you like.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/explore")}
              className="mt-6 flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700"
            >
              Explore Properties
              <ArrowUpRight size={17} />
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Next Visit */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 overflow-hidden rounded-3xl bg-primary-700 shadow-xl"
            >
              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                {/* Image */}
                <div className="relative h-64 overflow-hidden sm:h-80 lg:h-[360px]">
                  <img
                    src={visits[0].images?.[0]}
                    alt={visits[0].title}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-primary-700 shadow-lg sm:left-6 sm:top-6">
                    Next Visit
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6">
                    <p className="mb-1 text-xs font-medium text-white/80">
                      Your upcoming property visit
                    </p>
                    <h2 className="line-clamp-2 text-xl font-bold text-white sm:text-2xl lg:text-3xl">
                      {visits[0].title}
                    </h2>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                      <MapPin size={15} />
                      <span className="truncate">
                        {visits[0].location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Next Visit Info */}
                <div className="flex flex-col justify-between p-5 sm:p-7 lg:p-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-100">
                      Scheduled Visit
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                      Your visit is <span className="uppercase tracking-wider">{visits[0].status}</span>
                    </h3>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                        <CalendarDays size={20} className="text-primary-100" />
                        <p className="mt-3 text-[10px] uppercase tracking-wide text-white/50">Date</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {visits[0].visitDate}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                        <Clock3 size={20} className="text-primary-100" />
                        <p className="mt-3 text-[10px] uppercase tracking-wide text-white/50">Time</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {visits[0].visitTime}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-white/50">Host</p>
                          <p className="text-sm font-semibold text-white">
                            {getHostDisplayName(visits[0].host)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => navigate(`/property/${visits[0].propertyId || visits[0]._id}`)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
                    >
                      View Property
                      <ArrowUpRight size={16} />
                    </button>
                    <button
                      onClick={() => handleCancelVisit(visits[0]._id)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* All Visits */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                    All Upcoming Visits
                  </h2>
                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Your scheduled property visits
                  </p>
                </div>
                <span className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">
                  {visits.length} {visits.length === 1 ? "Visit" : "Visits"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {visits.map((visit, index) => (
                  <motion.div
                    key={visit._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={{ y: -3 }}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-4"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Image */}
                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-36">
                        <img
                          src={visit.images?.[0]}
                          alt={visit.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2 py-1 text-[8px] font-bold text-primary-700 shadow-sm">
                         {visits[0].status}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-gray-800 sm:text-base">
                              {visit.title}
                            </h3>
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500 sm:text-xs">
                              <MapPin size={12} className="shrink-0 text-primary-600" />
                              <span className="truncate">{visit.location}</span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ x: 3, y: -2 }}
                            onClick={() => navigate(`/property/${visit.propertyId || visit._id}`)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition hover:bg-primary-50 hover:text-primary-600"
                          >
                            <ChevronRight size={17} />
                          </motion.button>
                        </div>

                        {/* Property Details */}
                        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-500 sm:text-xs">
                          <span className="flex items-center gap-1">
                            <BedDouble size={12} />
                            {visit.bedrooms} Beds
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath size={12} />
                            {visit.bathrooms} Bath
                          </span>
                          <span className="flex items-center gap-1">
                            <Ruler size={12} />
                            {visit.area} sq.ft
                          </span>
                        </div>

                        {/* Date + Time */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="flex items-center gap-1.5 rounded-lg bg-primary-50 px-2 py-1.5 text-[9px] font-semibold text-primary-700 sm:text-[10px]">
                            <CalendarDays size={11} />
                            {visit.visitDate}
                          </span>
                          <span className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-2 py-1.5 text-[9px] font-medium text-gray-600 sm:text-[10px]">
                            <Clock3 size={11} />
                            {visit.visitTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                      <div>
                        <p className="text-[9px] text-gray-400">Monthly Rent</p>
                        <p className="text-sm font-bold text-primary-700">
                          ₹{Number(visit.price || 0).toLocaleString()}
                          <span className="ml-1 text-[9px] font-normal text-gray-400">/month</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${visit.hostPhone}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-600"
                        >
                          <Phone size={14} />
                        </a>
                        <button
                          onClick={() => handleCancelVisit(visit._id)}
                          className="rounded-lg border border-red-100 px-3 py-2 text-[10px] font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          Cancel Visit
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default UpcomingVisits;