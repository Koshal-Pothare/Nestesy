import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
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

import api from "../services/api";

const HostVisitManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        setLoading(true);

        const response = await api.get("/owners/visits");

        setVisits(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Fetch owner visits error:", error);

        toast.error(
          error.response?.data?.message || "Failed to load visits"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  const getVisitId = (visit) => {
    return visit?._id || visit?.id;
  };

  const getVisitorName = (visit) => {
    return (
      visit?.tenant?.name ||
      visit?.tenant?.fullName ||
      visit?.visitorName ||
      visit?.tenantName ||
      "Unknown Visitor"
    );
  };

  const getVisitorEmail = (visit) => {
    return (
      visit?.tenant?.email ||
      visit?.email ||
      visit?.tenantEmail ||
      "No email"
    );
  };

  const getVisitorPhone = (visit) => {
    return (
      visit?.tenant?.phone ||
      visit?.phone ||
      visit?.tenantPhone ||
      "No phone"
    );
  };

  const getPropertyName = (visit) => {
    return (
      visit?.property?.title ||
      visit?.property?.name ||
      visit?.propertyName ||
      visit?.title ||
      "Property"
    );
  };

  const getLocation = (visit) => {
    if (typeof visit?.property?.location === "string") {
      return visit.property.location;
    }

    if (typeof visit?.location === "string") {
      return visit.location;
    }

    if (typeof visit?.property?.address === "string") {
      return visit.property.address;
    }

    return "Location not available";
  };

  const getVisitDate = (visit) => {
    return (
      visit?.visitDate ||
      visit?.date ||
      visit?.bookingDate ||
      "Date not available"
    );
  };

  const getVisitTime = (visit) => {
    return (
      visit?.visitTime ||
      visit?.time ||
      visit?.bookingTime ||
      "Time not available"
    );
  };

  const formatDate = (date) => {
    if (!date || date === "Date not available") {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const updateVisitStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const response = await api.put(
        `/owners/visits/${id}/status`,
        {
          status,
        }
      );

      const updatedVisit = response.data;

      setVisits((currentVisits) =>
        currentVisits.map((visit) =>
          String(getVisitId(visit)) === String(id)
            ? {
                ...visit,
                ...updatedVisit,
                status: updatedVisit?.status || status,
              }
            : visit
        )
      );

      const messages = {
        approved: "Visit approved successfully",
        rejected: "Visit rejected successfully",
        completed: "Visit marked as completed",
        cancelled: "Visit cancelled successfully",
      };

      toast.success(messages[status] || "Visit status updated");
    } catch (error) {
      console.error("Update visit status error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update visit status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredVisits = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return visits.filter((visit) => {
      const visitorName = getVisitorName(visit).toLowerCase();
      const email = getVisitorEmail(visit).toLowerCase();
      const phone = getVisitorPhone(visit).toLowerCase();
      const propertyName = getPropertyName(visit).toLowerCase();
      const location = getLocation(visit).toLowerCase();

      const matchesSearch =
        !search ||
        visitorName.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        propertyName.includes(search) ||
        location.includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        visit?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [visits, searchTerm, statusFilter]);

  const pendingCount = visits.filter(
    (visit) => visit?.status === "pending"
  ).length;

  const approvedCount = visits.filter(
    (visit) => visit?.status === "approved"
  ).length;

  const completedCount = visits.filter(
    (visit) => visit?.status === "completed"
  ).length;

  const rejectedCount = visits.filter(
    (visit) => visit?.status === "rejected"
  ).length;

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

      case "cancelled":
        return "bg-gray-100 text-gray-600 border-gray-200";

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

  const renderActions = (visit, mobile = false) => {
    const id = getVisitId(visit);
    const isUpdating = String(updatingId) === String(id);

    if (visit?.status === "pending") {
      return (
        <>
          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              updateVisitStatus(id, "approved")
            }
            className={
              mobile
                ? "flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-green-500 py-2.5 text-xs font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                : "flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            }
          >
            <Check size={mobile ? 15 : 14} />
            {isUpdating ? "Updating..." : "Approve"}
          </button>

          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              updateVisitStatus(id, "rejected")
            }
            className={
              mobile
                ? "flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                : "flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            }
          >
            <X size={mobile ? 15 : 14} />
            {isUpdating ? "Updating..." : "Reject"}
          </button>
        </>
      );
    }

    if (visit?.status === "approved") {
      return (
        <button
          type="button"
          disabled={isUpdating}
          onClick={() =>
            updateVisitStatus(id, "completed")
          }
          className={
            mobile
              ? "flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-2.5 text-xs font-bold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
              : "flex items-center gap-1.5 rounded-lg bg-primary-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          }
        >
          <CheckCircle2 size={mobile ? 15 : 14} />
          {isUpdating
            ? "Updating..."
            : mobile
            ? "Mark Visit as Done"
            : "Mark Done"}
        </button>
      );
    }

    if (visit?.status === "completed") {
      return (
        <span
          className={
            mobile
              ? "flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 py-2.5 text-xs font-bold text-green-600"
              : "flex items-center gap-1.5 text-xs font-semibold text-green-600"
          }
        >
          <CheckCircle2 size={mobile ? 15 : 14} />
          Visit Completed
        </span>
      );
    }

    if (visit?.status === "rejected") {
      return (
        <span
          className={
            mobile
              ? "flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-xs font-bold text-red-500"
              : "flex items-center gap-1.5 text-xs font-semibold text-red-500"
          }
        >
          <X size={mobile ? 15 : 14} />
          Visit Rejected
        </span>
      );
    }

    if (visit?.status === "cancelled") {
      return (
        <span
          className={
            mobile
              ? "flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 text-xs font-bold text-gray-500"
              : "flex items-center gap-1.5 text-xs font-semibold text-gray-500"
          }
        >
          <X size={mobile ? 15 : 14} />
          Visit Cancelled
        </span>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Visit Management
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Manage property visit requests and keep track of scheduled visits.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
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

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
                  {pendingCount}
                </p>
              </div>
            </div>
          </motion.div>

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
                  {approvedCount}
                </p>
              </div>
            </div>
          </motion.div>

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
                  {completedCount}
                </p>
              </div>
            </div>
          </motion.div>

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
                  {rejectedCount}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search visitor, property or location..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100"
              />
            </div>

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
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                ▼
              </span>
            </div>
          </div>
        </div>

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

                              <p className="mt-0.5 text-xs text-gray-400">
                                {getVisitorPhone(visit)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-semibold text-gray-800">
                            {getPropertyName(visit)}
                          </p>

                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                            <MapPin size={13} />
                            {getLocation(visit)}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <CalendarDays
                              size={16}
                              className="text-primary-500"
                            />

                            {formatDate(
                              getVisitDate(visit)
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock
                              size={16}
                              className="text-primary-500"
                            />

                            {getVisitTime(visit)}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                              visit?.status
                            )}`}
                          >
                            {formatStatus(visit?.status)}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">
                            {renderActions(visit)}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredVisits.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <CalendarDays size={28} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-gray-700">
                No visits found
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                No tenant visit bookings are available.
              </p>
            </div>
          )}
        </div>

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
                No tenant visit bookings are available.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredVisits.map((visit) => {
                const id = getVisitId(visit);

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
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

                          <p className="text-xs text-gray-400">
                            {getVisitorPhone(visit)}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                          visit?.status
                        )}`}
                      >
                        {formatStatus(visit?.status)}
                      </span>
                    </div>

                    <div className="mt-4 rounded-xl bg-gray-50 p-3">
                      <p className="text-sm font-bold text-gray-800">
                        {getPropertyName(visit)}
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={13} />
                        {getLocation(visit)}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
                          <CalendarDays size={16} />
                        </div>

                        <div>
                          <p className="text-[10px] text-gray-400">
                            Visit Date
                          </p>

                          <p className="text-xs font-semibold text-gray-700">
                            {formatDate(
                              getVisitDate(visit)
                            )}
                          </p>
                        </div>
                      </div>

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

                    <div className="mt-4 flex gap-2">
                      {renderActions(visit, true)}
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