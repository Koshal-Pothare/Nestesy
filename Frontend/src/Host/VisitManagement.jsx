import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CalendarDays,
  Clock,
  MapPin,
  User,
  Check,
  X,
  CheckCircle2,
  Filter,
} from "lucide-react";

const HostVisitManagement = () => {
  // =========================================================
  // STATES
  // =========================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [visits, setVisits] = useState([
    {
      id: 1,
      visitorName: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9876543210",
      propertyName: "Luxury 2 BHK Apartment",
      location: "Baner, Pune",
      visitDate: "2026-08-10",
      visitTime: "10:00 AM - 11:00 AM",
      status: "pending",
    },
    {
      id: 2,
      visitorName: "Priya Patil",
      email: "priya@gmail.com",
      phone: "9876543211",
      propertyName: "Modern 3 BHK Villa",
      location: "Wakad, Pune",
      visitDate: "2026-08-11",
      visitTime: "12:00 PM - 01:00 PM",
      status: "approved",
    },
    {
      id: 3,
      visitorName: "Amit Joshi",
      email: "amit@gmail.com",
      phone: "9876543212",
      propertyName: "Premium 1 BHK Flat",
      location: "Kothrud, Pune",
      visitDate: "2026-08-12",
      visitTime: "03:00 PM - 04:00 PM",
      status: "completed",
    },
    {
      id: 4,
      visitorName: "Sneha Kulkarni",
      email: "sneha@gmail.com",
      phone: "9876543213",
      propertyName: "Spacious 2 BHK Home",
      location: "Aundh, Pune",
      visitDate: "2026-08-13",
      visitTime: "11:00 AM - 12:00 PM",
      status: "rejected",
    },
    {
      id: 5,
      visitorName: "Vishal More",
      email: "vishal@gmail.com",
      phone: "9876543214",
      propertyName: "Elegant 3 BHK Apartment",
      location: "Hinjewadi, Pune",
      visitDate: "2026-08-14",
      visitTime: "05:00 PM - 06:00 PM",
      status: "pending",
    },
  ]);

  // =========================================================
  // HELPERS
  // =========================================================

  const getVisitId = (visit) => {
    return visit?._id || visit?.id;
  };

  const getVisitorName = (visit) => {
    return (
      visit?.visitorName ||
      visit?.tenantName ||
      visit?.tenant?.name ||
      "Unknown Visitor"
    );
  };

  const getVisitorEmail = (visit) => {
    return (
      visit?.email ||
      visit?.tenantEmail ||
      visit?.tenant?.email ||
      "No email"
    );
  };

  const getPropertyName = (visit) => {
    return (
      visit?.propertyName ||
      visit?.property?.title ||
      visit?.property?.name ||
      "Property"
    );
  };

  const getLocation = (visit) => {
    return (
      visit?.location ||
      visit?.property?.location ||
      "Location not available"
    );
  };

  const getVisitDate = (visit) => {
    return visit?.visitDate || visit?.date || "Date not available";
  };

  const getVisitTime = (visit) => {
    return visit?.visitTime || visit?.time || "Time not available";
  };

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  const updateVisitStatus = (id, status) => {
    setVisits((prevVisits) =>
      prevVisits.map((visit) => {
        const visitId = getVisitId(visit);

        if (String(visitId) === String(id)) {
          return {
            ...visit,
            status,
          };
        }

        return visit;
      })
    );
  };

  // =========================================================
  // FILTER VISITS
  // =========================================================

  const filteredVisits = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return visits.filter((visit) => {
      const visitorName = getVisitorName(visit).toLowerCase();
      const email = getVisitorEmail(visit).toLowerCase();
      const propertyName = getPropertyName(visit).toLowerCase();
      const location = getLocation(visit).toLowerCase();

      const matchesSearch =
        visitorName.includes(search) ||
        email.includes(search) ||
        propertyName.includes(search) ||
        location.includes(search);

      const matchesStatus =
        statusFilter === "all" || visit.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [visits, searchTerm, statusFilter]);

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-600 border-amber-200";

      case "approved":
        return "bg-blue-50 text-blue-600 border-blue-200";

      case "completed":
        return "bg-green-50 text-green-600 border-green-200";

      case "rejected":
        return "bg-red-50 text-red-600 border-red-200";

      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="rounded-2xl border border-gray-100 bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary-500" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading visit requests...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                Visit Management
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Manage property visit requests and keep track of scheduled
                visits.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <CalendarDays
                size={20}
                className="text-primary-500"
              />

              <div>
                <p className="text-xs text-gray-400">
                  Total Visits
                </p>

                <p className="font-bold text-gray-800">
                  {visits.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{errorMessage}</span>

            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* STATISTICS */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">

          {/* Pending */}
          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Clock size={21} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Pending
                </p>

                <p className="text-xl font-bold text-gray-800">
                  {
                    visits.filter(
                      (visit) => visit.status === "pending"
                    ).length
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Approved */}
          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <Check size={21} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Approved
                </p>

                <p className="text-xl font-bold text-gray-800">
                  {
                    visits.filter(
                      (visit) => visit.status === "approved"
                    ).length
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Completed */}
          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-500">
                <CheckCircle2 size={21} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Completed
                </p>

                <p className="text-xl font-bold text-gray-800">
                  {
                    visits.filter(
                      (visit) => visit.status === "completed"
                    ).length
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Rejected */}
          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <X size={21} />
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Rejected
                </p>

                <p className="text-xl font-bold text-gray-800">
                  {
                    visits.filter(
                      (visit) => visit.status === "rejected"
                    ).length
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SEARCH + FILTER */}
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
                placeholder="Search visitor, property or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
              />
            </div>

            {/* Filter */}
            <div className="relative sm:w-52">
              <Filter
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-9 text-sm font-medium text-gray-700 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Visitor
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Property
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Visit Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Time
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                <AnimatePresence mode="popLayout">
                  {filteredVisits.map((visit) => {
                    const id = getVisitId(visit);

                    return (
                      <motion.tr
                        key={id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="transition hover:bg-gray-50/70"
                      >

                        {/* Visitor */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                              <User size={19} />
                            </div>

                            <div>
                              <p className="font-semibold text-gray-800">
                                {getVisitorName(visit)}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                {getVisitorEmail(visit)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Property */}
                        <td className="px-6 py-5">
                          <p className="font-semibold text-gray-800">
                            {getPropertyName(visit)}
                          </p>

                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                            <MapPin size={13} />
                            {getLocation(visit)}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <CalendarDays
                              size={16}
                              className="text-primary-500"
                            />

                            {getVisitDate(visit)}
                          </div>
                        </td>

                        {/* Time */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock
                              size={16}
                              className="text-primary-500"
                            />

                            {getVisitTime(visit)}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                              visit.status
                            )}`}
                          >
                            {formatStatus(visit.status)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">

                            {visit.status === "pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateVisitStatus(id, "approved")
                                  }
                                  className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-600"
                                >
                                  <Check size={14} />
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateVisitStatus(id, "rejected")
                                  }
                                  className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600"
                                >
                                  <X size={14} />
                                  Reject
                                </button>
                              </>
                            )}

                            {visit.status === "approved" && (
                              <button
                                type="button"
                                onClick={() =>
                                  updateVisitStatus(id, "completed")
                                }
                                className="flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-600"
                              >
                                <CheckCircle2 size={14} />
                                Mark Done
                              </button>
                            )}

                            {visit.status === "completed" && (
                              <span className="text-xs font-semibold text-green-600">
                                Visit Completed
                              </span>
                            )}

                            {visit.status === "rejected" && (
                              <span className="text-xs font-semibold text-red-500">
                                Visit Rejected
                              </span>
                            )}

                          </div>
                        </td>
                      </motion.tr>
                    )
                  )};
                </AnimatePresence>

              </tbody>
            </table>
          </div>

          {/* Desktop Empty State */}
          {filteredVisits.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <CalendarDays size={28} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-700">
                No visits found
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Try changing your search or status filter.
              </p>
            </div>
          )}
        </div>

        {/* MOBILE CARDS */}
        <div className="space-y-4 lg:hidden">

          {filteredVisits.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <CalendarDays size={28} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-700">
                No visits found
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">

              {filteredVisits.map((visit) => {
                const id = getVisitId(visit);

                return (
                  <motion.div
                    key={id}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -15,
                    }}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >

                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                          <User size={19} />
                        </div>

                        <div>
                          <h3 className="font-bold text-gray-800">
                            {getVisitorName(visit)}
                          </h3>

                          <p className="text-xs text-gray-400">
                            {getVisitorEmail(visit)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                          visit.status
                        )}`}
                      >
                        {formatStatus(visit.status)}
                      </span>
                    </div>

                    {/* Property */}
                    <div className="mt-4 rounded-xl bg-gray-50 p-3">
                      <p className="text-sm font-bold text-gray-800">
                        {getPropertyName(visit)}
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={13} />
                        {getLocation(visit)}
                      </div>
                    </div>

                    {/* Visit Info */}
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                          <CalendarDays size={16} />
                        </div>

                        <div>
                          <p className="text-[10px] text-gray-400">
                            Visit Date
                          </p>

                          <p className="text-xs font-semibold text-gray-700">
                            {getVisitDate(visit)}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                          <Clock size={16} />
                        </div>

                        <div>
                          <p className="text-[10px] text-gray-400">
                            Visit Time
                          </p>

                          <p className="text-xs font-semibold text-gray-700">
                            {getVisitTime(visit)}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">

                      {/* Pending */}
                      {visit.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              updateVisitStatus(id, "approved")
                            }
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500 py-2.5 text-xs font-bold text-white transition hover:bg-green-600"
                          >
                            <Check size={15} />
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateVisitStatus(id, "rejected")
                            }
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white transition hover:bg-red-600"
                          >
                            <X size={15} />
                            Reject
                          </button>
                        </>
                      )}

                      {/* Approved */}
                      {visit.status === "approved" && (
                        <button
                          type="button"
                          onClick={() =>
                            updateVisitStatus(id, "completed")
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-2.5 text-xs font-bold text-white transition hover:bg-primary-600"
                        >
                          <CheckCircle2 size={15} />
                          Mark Visit as Done
                        </button>
                      )}

                      {/* Completed */}
                      {visit.status === "completed" && (
                        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 py-2.5 text-xs font-bold text-green-600">
                          <CheckCircle2 size={15} />
                          Visit Completed
                        </div>
                      )}

                      {/* Rejected */}
                      {visit.status === "rejected" && (
                        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-xs font-bold text-red-500">
                          <X size={15} />
                          Visit Rejected
                        </div>
                      )}

                    </div>
                  </motion.div>
                );
              })}

            </AnimatePresence>
          )}

        </div>
      </div>
    </div>
  );
};

export default HostVisitManagement;