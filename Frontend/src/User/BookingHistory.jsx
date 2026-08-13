import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  MapPin,
  CalendarCheck,
  Clock,
  BedDouble,
  Bath,
  Ruler,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookingHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = () => {
      const data = JSON.parse(localStorage.getItem("bookingHistory")) || [];
      setHistory(data);
    };

    loadHistory();

    window.addEventListener("storage", loadHistory);

    return () => {
      window.removeEventListener("storage", loadHistory);
    };
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-600 border-green-100";
      case "Cancelled":
        return "bg-red-50 text-red-500 border-red-100";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
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
              View your previous property visits and keep track of your rental
              journey with Nestesy.
            </p>
          </div>

          {/* Count */}
          <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
              <History size={20} />
            </div>

            <div>
              <p className="text-xs text-gray-400">Total History</p>
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
            Your completed and cancelled property visits will appear here.
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
      ) : (
        <div className="space-y-5">
          {history.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              whileHover={{ y: -3 }}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
                {/* Image */}
                <div className="relative h-52 overflow-hidden sm:h-60 lg:h-full lg:min-h-[290px]">
                  <img
                    src={booking.images?.[0]}
                    alt={booking.title}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  {/* Status */}
                  <div
                    className={`absolute left-4 top-4 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status === "Cancelled" ? (
                      <XCircle size={14} />
                    ) : (
                      <CheckCircle2 size={14} />
                    )}

                    {booking.status || "Completed"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 lg:p-7">
                  {/* Title */}
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
                        <span>{booking.location}</span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-primary-700">
                        ₹{booking.price?.toLocaleString()}
                      </span>

                      <span className="text-xs text-gray-400">/month</span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl bg-gray-50 p-3">
                      <BedDouble
                        size={18}
                        className="text-primary-600"
                      />
                      <p className="mt-2 text-xs text-gray-400">Bedrooms</p>
                      <p className="mt-0.5 text-sm font-semibold text-gray-800">
                        {booking.bedrooms}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3">
                      <Bath
                        size={18}
                        className="text-primary-600"
                      />
                      <p className="mt-2 text-xs text-gray-400">Bathrooms</p>
                      <p className="mt-0.5 text-sm font-semibold text-gray-800">
                        {booking.bathrooms}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3">
                      <Ruler
                        size={18}
                        className="text-primary-600"
                      />
                      <p className="mt-2 text-xs text-gray-400">Area</p>
                      <p className="mt-0.5 text-sm font-semibold text-gray-800">
                        {booking.area} sq.ft
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3">
                      <CalendarCheck
                        size={18}
                        className="text-primary-600"
                      />
                      <p className="mt-2 text-xs text-gray-400">Visit Date</p>
                      <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
                        {booking.visitDate || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Booking Information */}
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                        {booking.visitDate || "Not available"}
                      </p>
                    </div>

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
                        {booking.visitTime || "Not available"}
                      </p>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-5 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-gray-400">
                        Booking Status
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        {booking.status === "Cancelled" ? (
                          <XCircle size={16} className="text-red-500" />
                        ) : (
                          <CheckCircle2
                            size={16}
                            className="text-green-500"
                          />
                        )}

                        <span className="text-sm font-semibold text-gray-700">
                          {booking.status || "Completed"}
                        </span>
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                      {/* Review */}
                      {booking.status !== "Cancelled" && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            navigate(`/property/${booking.id}?review=true`)
                          }
                          className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-600 transition hover:bg-amber-50"
                        >
                          <Star size={16} />
                          Add Review
                        </motion.button>
                      )}

                      {/* View Property */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                          navigate(`/property/${booking.id}`)
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
                      >
                        View Property
                        <ArrowRight size={15} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;