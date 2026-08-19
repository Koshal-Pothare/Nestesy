import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, Clock, MapPin, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BookingService } from "../services/UserServices"; // Import the real API service

const BookVisitModal = ({ property, open, onClose }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBookVisit = async () => {
    // 1. Check if user is logged in via JWT token
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first to book a visit.",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect them to login, and bring them back to this property after
          navigate(`/login?redirect=/property/${property._id || property.id}`);
        }
      });
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a visit date");
      return;
    }

    try {
      setLoading(true);

      // 2. Send booking request to the backend database
      await BookingService.createBooking({
        propertyId: property._id || property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        images: property.images,
        visitDate: selectedDate,
        visitTime: property.visitTime || "10:00 AM - 6:00 PM",
      });

      // 3. Show success message and redirect to upcoming visits
      toast.success("Visit booked successfully! 🎉");
      setSelectedDate("");
      
      setTimeout(() => {
        onClose();
        navigate("/user/upcoming-visits");
      }, 500);

    } catch (error) {
      console.error("Booking error:", error);
      
      // Extract exact error message from backend (e.g., "Already booked")
      const backendMessage = error?.response?.data?.message || "Failed to book visit. Please try again.";
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  // Render null if no property is passed (prevents UI crashes)
  if (!property) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed left-1/2 top-1/2 z-[110] w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary-600 px-6 py-5 text-white">
              <div>
                <h2 className="text-xl font-semibold">
                  Book a Property Visit
                </h2>
                <p className="mt-1 text-sm text-primary-100">
                  Schedule your visit to this property
                </p>
              </div>

              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Property */}
              <div className="flex gap-4 rounded-2xl bg-gray-50 p-3">
                <img
                  src={property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"}
                  alt={property.title}
                  className="h-20 w-24 rounded-xl object-cover"
                />

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-gray-800">
                    {property.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={14} className="text-primary-600" />
                    <span className="truncate">
                      {property.location}
                    </span>
                  </div>

                  <p className="mt-1 font-semibold text-primary-600">
                    ₹{Number(property.price || 0).toLocaleString()}
                    <span className="ml-1 text-xs font-normal text-gray-400">
                      / month
                    </span>
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Select Visit Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600"
                  />

                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              {/* Fixed Time */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Visiting Hours
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                    <Clock size={20} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Available Time
                    </p>

                    <p className="font-semibold text-gray-800">
                      {property.visitTime || "10:00 AM - 6:00 PM"}
                    </p>
                  </div>

                  <CheckCircle
                    size={20}
                    className="ml-auto text-primary-600"
                  />
                </div>

                <p className="mt-2 text-xs text-gray-400">
                  Visiting hours are fixed by the property host.
                </p>
              </div>

              {/* Selected Date Preview */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-xl bg-gray-50 p-4"
                >
                  <p className="text-xs text-gray-500">
                    Your visit
                  </p>

                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-semibold text-gray-800">
                      {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>

                    <span className="text-sm font-medium text-primary-600">
                      {property.visitTime || "10:00 AM - 6:00 PM"}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="mt-7 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-gray-200 py-3 font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  onClick={handleBookVisit}
                  disabled={loading}
                  className={`flex-1 rounded-xl bg-primary-600 py-3 font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700 ${
                    loading ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {loading ? "Booking..." : "Book Visit"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookVisitModal;