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
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getVisit } from "../utils/bookVisit";

const BookingHistory = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Get user's visits
  useEffect(() => {
    const loadHistory = () => {
      const data = getVisit();
      setHistory(data);
    };

    loadHistory();

    window.addEventListener("storage", loadHistory);

    return () => {
      window.removeEventListener("storage", loadHistory);
    };
  }, []);

  // Reload when user comes back to this page/tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setHistory(getVisit());
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  // Status style
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-200";

      case "approved":
        return "bg-blue-50 text-blue-600 border-blue-200";

      case "completed":
        return "bg-green-50 text-green-600 border-green-200";

      case "rejected":
        return "bg-red-50 text-red-500 border-red-200";

      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

  // Status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertCircle size={14} />;

      case "approved":
        return <CheckCircle2 size={14} />;

      case "completed":
        return <CheckCircle2 size={14} />;

      case "rejected":
        return <XCircle size={14} />;

      default:
        return <AlertCircle size={14} />;
    }
  };

  // Format status
  const formatStatus = (status) => {
    if (!status) return "Pending";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  // Filter bookings
  const filteredHistory = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return history.filter((booking) => {
      const matchesSearch =
        booking.title?.toLowerCase().includes(search) ||
        booking.location?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [history, searchTerm, statusFilter]);

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
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <History size={21} />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">
                  Your Activity
                </span>
              </div>

              <h1 className="text-2xl font-serif font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                Booking History
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                View all your property visit bookings and track
                their current status.
              </p>
            </div>

            {/* Total */}
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                <History size={20} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Total Bookings
                </p>

                <p className="text-lg font-bold text-gray-800">
                  {history.length}{" "}
                  <span className="text-sm font-medium text-gray-400">
                    Booking{history.length !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Search + Filter */}
        {history.length > 0 && (
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Search */}
              <div className="relative flex-1">

                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search property or location..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
                />

              </div>

              {/* Status Filter */}
              <div className="relative sm:w-52">

                <Filter
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-9 text-sm font-medium text-gray-700 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
                >
                  <option value="all">
                    All Status
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="approved">
                    Approved
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>
                </select>

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ▼
                </span>

              </div>

            </div>
          </div>
        )}

        {/* Empty State */}
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm"
          >

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <History size={38} />
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-800 sm:text-2xl">
              No Booking History
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              Your property visit bookings will appear here
              after you book a visit.
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/explore")}
              className="mt-6 flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700"
            >
              Explore Properties
              <ArrowRight size={17} />
            </motion.button>

          </motion.div>
        ) : filteredHistory.length === 0 ? (

          /* No Search Result */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm"
          >

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Search size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-800">
              No bookings found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or status filter.
            </p>

          </motion.div>

        ) : (

          /* Booking List */
          <div className="space-y-5">

            <AnimatePresence mode="popLayout">

              {filteredHistory.map((booking, index) => (

                <motion.div
                  key={`${booking.id}-${booking.visitDate}`}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -20,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                  }}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
                >

                  <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">

                    {/* Property Image */}
                    <div className="relative h-52 overflow-hidden sm:h-60 lg:h-full lg:min-h-[300px]">

                      <img
                        src={booking.images?.[0]}
                        alt={booking.title}
                        className="h-full w-full object-cover"
                      />

                      {/* Status */}
                      <div
                        className={`absolute left-4 top-4 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}

                        {formatStatus(
                          booking.status
                        )}
                      </div>

                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 lg:p-7">

                      {/* Property Header */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            {booking.title}
                          </h2>

                          <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">

                            <MapPin
                              size={16}
                              className="shrink-0 text-primary-600"
                            />

                            <span>
                              {booking.location}
                            </span>

                          </div>

                        </div>

                        <div className="flex items-baseline gap-1">

                          <span className="text-xl font-bold text-primary-700">
                            ₹
                            {booking.price?.toLocaleString()}
                          </span>

                          <span className="text-xs text-gray-400">
                            /month
                          </span>

                        </div>

                      </div>

                      {/* Property Details */}
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

                        {/* Bedrooms */}
                        <div className="rounded-2xl bg-gray-50 p-3">

                          <BedDouble
                            size={18}
                            className="text-primary-600"
                          />

                          <p className="mt-2 text-xs text-gray-400">
                            Bedrooms
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-gray-800">
                            {booking.bedrooms ?? "N/A"}
                          </p>

                        </div>

                        {/* Bathrooms */}
                        <div className="rounded-2xl bg-gray-50 p-3">

                          <Bath
                            size={18}
                            className="text-primary-600"
                          />

                          <p className="mt-2 text-xs text-gray-400">
                            Bathrooms
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-gray-800">
                            {booking.bathrooms ?? "N/A"}
                          </p>

                        </div>

                        {/* Area */}
                        <div className="rounded-2xl bg-gray-50 p-3">

                          <Ruler
                            size={18}
                            className="text-primary-600"
                          />

                          <p className="mt-2 text-xs text-gray-400">
                            Area
                          </p>

                          <p className="mt-0.5 text-sm font-semibold text-gray-800">
                            {booking.area
                              ? `${booking.area} sq.ft`
                              : "N/A"}
                          </p>

                        </div>

                        {/* Booking Date */}
                        <div className="rounded-2xl bg-gray-50 p-3">

                          <CalendarCheck
                            size={18}
                            className="text-primary-600"
                          />

                          <p className="mt-2 text-xs text-gray-400">
                            Booked On
                          </p>

                          <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
                            {booking.bookedAt
                              ? new Date(
                                  booking.bookedAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "N/A"}
                          </p>

                        </div>

                      </div>

                      {/* Visit Information */}
                      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                        {/* Visit Date */}
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">

                          <div className="flex items-center gap-2">

                            <CalendarCheck
                              size={17}
                              className="text-primary-600"
                            />

                            <p className="text-xs font-medium text-gray-400">
                              Visit Date
                            </p>

                          </div>

                          <p className="mt-2 text-sm font-bold text-gray-800">
                            {booking.visitDate ||
                              "Not available"}
                          </p>

                        </div>

                        {/* Visit Time */}
                        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">

                          <div className="flex items-center gap-2">

                            <Clock
                              size={17}
                              className="text-primary-600"
                            />

                            <p className="text-xs font-medium text-gray-400">
                              Visit Time
                            </p>

                          </div>

                          <p className="mt-2 text-sm font-bold text-gray-800">
                            {booking.visitTime ||
                              "Not available"}
                          </p>

                        </div>

                      </div>

                      {/* Status */}
                      <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                          <p className="text-xs text-gray-400">
                            Booking Status
                          </p>

                          <div className="mt-1 flex items-center gap-2">

                            {getStatusIcon(
                              booking.status
                            )}

                            <span className="text-sm font-semibold text-gray-700">
                              {formatStatus(
                                booking.status
                              )}
                            </span>

                          </div>

                        </div>

                        {/* Read-only Property Button */}
                        <button
                          onClick={() =>
                            navigate(
                              `/property/${booking.id}`
                            )
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 sm:w-auto"
                        >
                          View Property
                          <ArrowRight size={15} />
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