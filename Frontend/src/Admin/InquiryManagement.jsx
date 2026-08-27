import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  CalendarDays,
  MessageSquare,
  User,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE } from '../Apitemp';
import AdminSkeleton  from '../components/AdminSkeleton'

const mockInquiries = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 9876543210",
    subject: "Unable to book property visit",
    message:
      "I am trying to book a visit for a property in Pune, but the booking is not getting confirmed. Please help me with this issue.",
    date: "12 Aug 2026",
    status: "pending",
  },
  {
    id: 2,
    name: "Priya Patil",
    email: "priya.patil@gmail.com",
    phone: "+91 9823456712",
    subject: "Property information",
    message:
      "I would like to know more information about the amenities and nearby facilities of the property I found on Nestesy.",
    date: "11 Aug 2026",
    status: "in progress",
  },
  {
    id: 3,
    name: "Amit Verma",
    email: "amit.verma@gmail.com",
    phone: "+91 9765432189",
    subject: "Payment related issue",
    message:
      "The payment was deducted from my account but my booking status is still showing pending. Kindly check this issue.",
    date: "10 Aug 2026",
    status: "resolved",
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    email: "sneha.kulkarni@gmail.com",
    phone: "+91 9812345678",
    subject: "Host registration query",
    message:
      "I want to register as a host on Nestesy. Could you please explain the process and required documents?",
    date: "09 Aug 2026",
    status: "pending",
  },
  {
    id: 5,
    name: "Vikas Joshi",
    email: "vikas.joshi@gmail.com",
    phone: "+91 9898765432",
    subject: "Request to update profile",
    message:
      "I recently changed my phone number and would like to update my profile information.",
    date: "08 Aug 2026",
    status: "in progress",
  },
  {
    id: 6,
    name: "Neha Deshmukh",
    email: "neha.deshmukh@gmail.com",
    phone: "+91 9876123450",
    subject: "Property listing issue",
    message:
      "My property listing is not appearing in the explore section even though it has been submitted successfully.",
    date: "07 Aug 2026",
    status: "resolved",
  },
];

const InquiryManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const inquiriesPerPage = 5;

  const fetchInquiries = async () => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API_BASE}/admin/inquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.log("Inquiry fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // ---------------- FILTER ----------------

  const filteredInquiries = inquiries.filter((inquiry) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      inquiry.name?.toLowerCase().includes(searchValue) ||
      inquiry.email?.toLowerCase().includes(searchValue) ||
      inquiry.subject?.toLowerCase().includes(searchValue) ||
      inquiry.message?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "all" || inquiry.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // ---------------- PAGINATION ----------------

  const totalPages = Math.ceil(
    filteredInquiries.length / inquiriesPerPage
  );

  const indexOfLastInquiry = currentPage * inquiriesPerPage;

  const indexOfFirstInquiry =
    indexOfLastInquiry - inquiriesPerPage;

  const currentInquiries = filteredInquiries.slice(
    indexOfFirstInquiry,
    indexOfLastInquiry
  );

  // ---------------- STATUS ----------------

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700";

      case "in progress":
        return "bg-blue-100 text-blue-700";

      case "resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock3 size={14} />;

      case "in progress":
        return <LoaderCircle size={14} />;

      case "resolved":
        return <CheckCircle2 size={14} />;

      default:
        return null;
    }
  };

  // ---------------- DELETE ----------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inquiry?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("adminToken");
    try {
      await fetch(`/api/admin/inquiries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Delete inquiry API error:", err);
    }

    setInquiries((prev) =>
      prev.filter((inquiry) => inquiry.id !== id && inquiry._id !== id)
    );

    if (selectedInquiry?.id === id || selectedInquiry?._id === id) {
      setSelectedInquiry(null);
    }
  };

  // ---------------- UPDATE STATUS ----------------

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem("adminToken");
    try {
      await fetch(`/api/admin/inquiries/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      console.error("Update status API error:", err);
    }

    setInquiries((prev) =>
      prev.map((inquiry) =>
        (inquiry.id === id || inquiry._id === id)
          ? { ...inquiry, status }
          : inquiry
      )
    );

    setSelectedInquiry((prev) =>
      prev
        ? {
            ...prev,
            status,
          }
        : prev
    );
  };

  // ---------------- SEARCH ----------------

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // ---------------- FILTER ----------------

  const handleFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">


 {loading ? (
        <AdminSkeleton />
      ) : (
        <>
        {/* HEADER */}

        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-500">
            Admin Panel
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Inquiry Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View and manage inquiries submitted by users and hosts.
          </p>
        </div>

        {/* STAT CARDS */}

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Inquiries
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {inquiries.length}
                </h2>
              </div>

              <div className="rounded-xl bg-primary-50 p-3 text-primary-600">
                <MessageSquare size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Pending
                </p>

                <h2 className="mt-1 text-2xl font-bold text-amber-600">
                  {
                    inquiries.filter(
                      (item) => item.status === "pending"
                    ).length
                  }
                </h2>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock3 size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  In Progress
                </p>

                <h2 className="mt-1 text-2xl font-bold text-blue-600">
                  {
                    inquiries.filter(
                      (item) => item.status === "in progress"
                    ).length
                  }
                </h2>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <LoaderCircle size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Resolved
                </p>

                <h2 className="mt-1 text-2xl font-bold text-green-600">
                  {
                    inquiries.filter(
                      (item) => item.status === "resolved"
                    ).length
                  }
                </h2>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

        </div>

        {/* SEARCH + FILTER */}

        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">

          {/* Search */}

          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name, email or subject..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary-400 focus:bg-white"
            />
          </div>

          {/* Filter */}

          <select
            value={statusFilter}
            onChange={(e) => handleFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 outline-none focus:border-primary-400"
          >
            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="in progress">
              In Progress
            </option>

            <option value="resolved">
              Resolved
            </option>
          </select>

        </div>

        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Subject
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {currentInquiries.length > 0 ? (

                  currentInquiries.map((inquiry) => (

                    <motion.tr
                      key={inquiry.id}
                      initial={{
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >

                      {/* USER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
                            {inquiry.name.charAt(0)}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {inquiry.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              {inquiry.email}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* SUBJECT */}

                      <td className="px-5 py-4">

                        <p className="max-w-xs truncate text-sm font-medium text-gray-700">
                          {inquiry.subject}
                        </p>

                      </td>

                      {/* DATE */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-500">

                          <CalendarDays size={16} />

                          {inquiry.date}

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                            inquiry.status
                          )}`}
                        >
                          {getStatusIcon(inquiry.status)}

                          {inquiry.status}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() =>
                              setSelectedInquiry(inquiry)
                            }
                            className="flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-2 text-xs font-semibold text-primary-600 transition hover:bg-primary-100"
                          >
                            <Eye size={15} />
                            View
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(inquiry.id)
                            }
                            className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </motion.tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-16 text-center"
                    >
                      <MessageSquare
                        size={40}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-3 font-semibold text-gray-500">
                        No inquiries found
                      </p>

                      <p className="mt-1 text-sm text-gray-400">
                        Try changing your search or filter.
                      </p>
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* PAGINATION */}

        {totalPages > 1 && (

          <div className="mt-6 flex items-center justify-center gap-3">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (

                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
                    currentPage === page
                      ? "bg-primary-600 text-white"
                      : "bg-white text-gray-600 hover:bg-primary-50"
                  }`}
                >
                  {page}
                </button>

              ))}

            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
              className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        )}
</>
      )}
      </div>

      {/* ================================================= */}
      {/* INQUIRY POPUP MODAL */}
      {/* ================================================= */}

      <AnimatePresence>

        {selectedInquiry && (

          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            {/* BACKDROP */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInquiry(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* MODAL */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
                y: 20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            >

              {/* MODAL HEADER */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-primary-500">
                    Inquiry Details
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    {selectedInquiry.subject}
                  </h2>

                </div>

                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="rounded-xl bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
                >
                  <X size={20} />
                </button>

              </div>

              {/* MODAL BODY */}

              <div className="space-y-6 p-5 sm:p-6">

                {/* USER */}

                <div className="rounded-2xl bg-gray-50 p-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
                      {selectedInquiry.name.charAt(0)}
                    </div>

                    <div>

                      <h3 className="font-bold text-gray-900">
                        {selectedInquiry.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Inquiry #{selectedInquiry.id}
                      </p>

                    </div>

                  </div>

                </div>

                {/* CONTACT DETAILS */}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">

                    <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
                      <Mail size={17} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs text-gray-400">
                        Email
                      </p>

                      <p className="truncate text-sm font-semibold text-gray-700">
                        {selectedInquiry.email}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">

                    <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
                      <Phone size={17} />
                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Phone
                      </p>

                      <p className="text-sm font-semibold text-gray-700">
                        {selectedInquiry.phone}
                      </p>

                    </div>

                  </div>

                </div>

                {/* DATE */}

                <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">

                  <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
                    <CalendarDays size={17} />
                  </div>

                  <div>

                    <p className="text-xs text-gray-400">
                      Submitted On
                    </p>

                    <p className="text-sm font-semibold text-gray-700">
                      {selectedInquiry.date}
                    </p>

                  </div>

                </div>

                {/* MESSAGE */}

                <div>

                  <div className="mb-2 flex items-center gap-2">

                    <MessageSquare
                      size={18}
                      className="text-primary-500"
                    />

                    <h3 className="font-bold text-gray-800">
                      Message
                    </h3>

                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 text-sm leading-7 text-gray-600">
                    {selectedInquiry.message}
                  </div>

                </div>

                {/* STATUS */}

                <div>

                  <h3 className="mb-3 text-sm font-bold text-gray-800">
                    Manage Inquiry Status
                  </h3>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">

                    <button
                      onClick={() =>
                        handleStatusChange(
                          selectedInquiry.id,
                          "pending"
                        )
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        selectedInquiry.status === "pending"
                          ? "border-amber-300 bg-amber-50 text-amber-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Pending
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(
                          selectedInquiry.id,
                          "in progress"
                        )
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        selectedInquiry.status === "in progress"
                          ? "border-blue-300 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      In Progress
                    </button>

                    <button
                      onClick={() =>
                        handleStatusChange(
                          selectedInquiry.id,
                          "resolved"
                        )
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        selectedInquiry.status === "resolved"
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Resolved
                    </button>

                  </div>

                </div>

                {/* DELETE */}

                <div className="flex justify-end border-t border-gray-100 pt-5">

                  <button
                    onClick={() =>
                      handleDelete(selectedInquiry.id)
                    }
                    className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 size={17} />
                    Delete Inquiry
                  </button>

                </div>

              </div>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

    </div>
  );
};

export default InquiryManagement;