import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  MapPin,
  CalendarCheck,
  Clock,
  BedDouble,
  Bath,
  Ruler,
  Search,
  CheckCircle2,
  ArrowRight,
  User,
  Star,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BookingService } from "../services/UserServices";
import { getVisit } from "../utils/bookVisit";

const BookingHistory = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCompletedVisits = async () => {
    try {
      setLoading(true);
      const res = await BookingService.getBookings("completed").catch((err) => {
        console.warn("API load bookings error:", err);
        return { bookings: [] };
      });

      const apiBookings = Array.isArray(res?.bookings)
        ? res.bookings
        : Array.isArray(res?.data?.bookings)
        ? res.data.bookings
        : [];

      // Also check local storage visits for any completed items
      const localVisits = getVisit();
      const localCompleted = Array.isArray(localVisits)
        ? localVisits.filter(
            (v) => String(v.status || "").toLowerCase() === "completed"
          )
        : [];

      // Merge unique by ID/title+date
      const mergedMap = new Map();

      apiBookings.forEach((b) => {
        const id = b._id || b.id;
        if (id) mergedMap.set(String(id), b);
      });

      localCompleted.forEach((v) => {
        const id = v.id || v._id;
        if (id && !mergedMap.has(String(id))) {
          mergedMap.set(String(id), v);
        }
      });

      const finalCompleted = Array.from(mergedMap.values()).filter(
        (item) => String(item.status || "").toLowerCase() === "completed"
      );

      setHistory(finalCompleted);
    } catch (error) {
      console.error("Failed to load completed visits history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedVisits();
  }, []);

  // Filter completed visits by search term
  const filteredHistory = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return history.filter((booking) => {
      if (!search) return true;
      const title = String(booking.title || "").toLowerCase();
      const location = String(booking.location || "").toLowerCase();
      const host = String(booking.host || "").toLowerCase();

      return (
        title.includes(search) ||
        location.includes(search) ||
        host.includes(search)
      );
    });
  }, [history, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <CheckCircle2 size={21} />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                  Completed Visits
                </span>
              </div>

              <h1 className="text-2xl font-serif font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Completed Visits History
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                View all your completed property visits and track past viewings.
              </p>
            </div>

            {/* Total Completed */}
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <CalendarCheck size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-400">Completed Visits</p>

                <p className="text-lg font-bold text-gray-800">
                  {history.length}{" "}
                  <span className="text-sm font-medium text-gray-400">
                    Visit{history.length !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search completed property or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              onClick={fetchCompletedVisits}
              title="Refresh Visits"
              className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-green-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* Content State */}
        {loading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-12 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600 mb-4" />
            <p className="text-sm font-medium text-gray-500">
              Loading completed visits...
            </p>
          </div>
        ) : history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 size={38} />
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-800 sm:text-2xl">
              No Completed Visits Yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              Once you complete a scheduled visit with a host, it will appear here in your visit history.
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/explore")}
              className="mt-6 flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 cursor-pointer"
            >
              Explore Properties
              <ArrowRight size={17} />
            </motion.button>
          </motion.div>
        ) : filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Search size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-800">
              No completed visits match your search
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search query.
            </p>
          </motion.div>
        ) : (
          /* Completed Visits List */
          <div className="space-y-5">
            <AnimatePresence mode="popLayout">
              {filteredHistory.map((booking, index) => (
                <motion.div
                  key={`${booking.id || booking._id}-${booking.visitDate}`}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
                    {/* Property Image */}
                    <div className="relative h-52 overflow-hidden sm:h-60 lg:h-full lg:min-h-[260px] bg-gray-100">
                      <img
                        src={
                          booking.images?.[0] ||
                          booking.image ||
                          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
                        }
                        alt={booking.title}
                        className="h-full w-full object-cover"
                      />

                      {/* Status */}
                      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-green-200 bg-green-500 text-white px-3 py-1 text-xs font-bold shadow-md">
                        <CheckCircle2 size={14} />
                        Completed
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 lg:p-7 flex flex-col justify-between">
                      <div>
                        {/* Property Header */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                              {booking.title}
                            </h2>

                            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                              <MapPin size={16} className="shrink-0 text-green-600" />
                              <span>{booking.location}</span>
                            </div>
                          </div>

                          {booking.price ? (
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-bold text-green-700">
                                ₹{Number(booking.price).toLocaleString("en-IN")}
                              </span>
                              <span className="text-xs text-gray-400">/month</span>
                            </div>
                          ) : null}
                        </div>

                        {/* Specs */}
                        <div className="mt-4 grid grid-cols-3 gap-3 py-3 border-y border-gray-100 text-xs text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <BedDouble size={16} className="text-green-600" />
                            {booking.bedrooms || 0} BHK
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Bath size={16} className="text-green-600" />
                            {booking.bathrooms || 0} Baths
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Ruler size={16} className="text-green-600" />
                            {booking.area || 0} sq.ft
                          </span>
                        </div>

                        {/* Visit Date + Host Info */}
                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5 bg-green-50 text-green-800 px-3 py-1.5 rounded-xl font-semibold">
                            <CalendarCheck size={14} />
                            <span>Visited on: {booking.visitDate}</span>
                          </div>

                          <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl font-medium">
                            <Clock size={14} />
                            <span>{booking.visitTime}</span>
                          </div>

                          {booking.host && (
                            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl font-medium">
                              <User size={14} />
                              <span>
                                Host: {/^[0-9a-fA-F]{24}$/.test(booking.host) ? "Verified Host" : booking.host}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() =>
                            navigate(`/property/${booking.propertyId || booking._id || booking.id}`)
                          }
                          className="flex items-center gap-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 text-xs font-semibold transition cursor-pointer"
                        >
                          View Property
                          <ArrowRight size={14} />
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/review?propertyId=${booking.propertyId || booking._id || booking.id}`)
                          }
                          className="flex items-center gap-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 text-xs font-semibold shadow-md shadow-green-600/20 transition cursor-pointer"
                        >
                          <Star size={14} />
                          Write a Review
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;