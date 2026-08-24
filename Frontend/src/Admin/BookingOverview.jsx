import React, { useMemo, useState, useEffect } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Home,
  Search,
  Users,
  XCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BookingOverview = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('/api/admin/bookings?limit=100', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.bookings)) {
          setBookingList(data.bookings);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('Booking fetch error:', err);
        setLoading(false);
      });
  }, []);

  const bookingsPerPage = 5;

  // Mock booking data fallback
  const defaultBookings = [
    {
      id: 1,
      user: "Rahul Sharma",
      email: "rahul@gmail.com",
      property: "Luxury 2BHK Apartment",
      location: "Baner, Pune",
      date: "15 Aug 2026",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      user: "Priya Patil",
      email: "priya@gmail.com",
      property: "Modern 1BHK Flat",
      location: "Kharadi, Pune",
      date: "16 Aug 2026",
      time: "12:00 PM",
      status: "pending",
    },
    {
      id: 3,
      user: "Amit Verma",
      email: "amit@gmail.com",
      property: "Premium 3BHK Villa",
      location: "Wakad, Pune",
      date: "10 Aug 2026",
      time: "11:00 AM",
      status: "completed",
    },
    {
      id: 4,
      user: "Sneha Joshi",
      email: "sneha@gmail.com",
      property: "Cozy 2BHK Home",
      location: "Viman Nagar, Pune",
      date: "18 Aug 2026",
      time: "4:00 PM",
      status: "confirmed",
    },
    {
      id: 5,
      user: "Rohan Kulkarni",
      email: "rohan@gmail.com",
      property: "Spacious 2BHK Apartment",
      location: "Hinjewadi, Pune",
      date: "19 Aug 2026",
      time: "2:00 PM",
      status: "pending",
    },
    {
      id: 6,
      user: "Neha Singh",
      email: "neha@gmail.com",
      property: "Elegant 3BHK Apartment",
      location: "Aundh, Pune",
      date: "08 Aug 2026",
      time: "10:30 AM",
      status: "completed",
    },
    {
      id: 7,
      user: "Vikas Shah",
      email: "vikas@gmail.com",
      property: "Premium 2BHK Flat",
      location: "Kothrud, Pune",
      date: "20 Aug 2026",
      time: "5:00 PM",
      status: "confirmed",
    },
    {
      id: 8,
      user: "Anjali Mehta",
      email: "anjali@gmail.com",
      property: "Garden View Apartment",
      location: "Magarpatta, Pune",
      date: "21 Aug 2026",
      time: "1:00 PM",
      status: "pending",
    },
  ];

  const activeBookings = bookingList || defaultBookings;

  // Rented properties count
  const rentedProperties = 12;

  // Stats
  const totalVisits = activeBookings.length;

  const visitConfirmed = activeBookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const visitPending = activeBookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const visitCompleted = activeBookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  /*
    Total bookings = total visits + rented properties
  */
  const totalBookings = totalVisits + rentedProperties;

  // Search + Filter
  const filteredBookings = useMemo(() => {
    return activeBookings.filter((booking) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        booking.user.toLowerCase().includes(searchValue) ||
        booking.email.toLowerCase().includes(searchValue) ||
        booking.property.toLowerCase().includes(searchValue) ||
        booking.location.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, activeBookings]);

  // Pagination
  const totalPages = Math.ceil(
    filteredBookings.length / bookingsPerPage
  );

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;

  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "rented":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Visit Confirmed";

      case "pending":
        return "Visit Pending";

      case "completed":
        return "Visit Completed";

      case "rented":
        return "Rented";

      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-7">
         

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Booking Overview
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage property visits, confirmations and rental activity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

          {/* Total Bookings */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                  Total Bookings
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {totalBookings}
                </h2>
 <p className="mt-1 text-xs text-gray-500">Visit + Rented</p>
               
              </div>

              <div className="rounded-xl bg-primary-100 p-3 mt-4 text-primary-600">
                <CalendarDays size={22} />
              </div>
            </div>
          </div>

          {/* Total Visits */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                   Visits
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {totalVisits}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  All visits
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Users size={22} />
              </div>
            </div>
          </div>

          {/* Visit Confirmed */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                   Confirmed
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {visitConfirmed}
                </h2>

                <p className="mt-1 text-xs text-green-600 font-semibold">
                  Approved visits
                </p>
              </div>

              <div className="rounded-xl bg-green-100 p-3 text-green-600">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          {/* Visit Pending */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                   Pending
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {visitPending}
                </h2>

                <p className="mt-1 text-xs text-amber-600 font-semibold">
                  Awaiting approval
                </p>
              </div>

              <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                <Clock3 size={22} />
              </div>
            </div>
          </div>

          {/* Visit Completed */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                   Completed
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {visitCompleted}
                </h2>

                <p className="mt-1 text-xs text-blue-600 font-semibold">
                  Completed visits
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          {/* Rented */}
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                  Rented
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {rentedProperties}
                </h2>

                <p className="mt-1 text-xs text-purple-600 font-semibold">
                  Rented properties
                </p>
              </div>

              <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                <Home size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mt-7 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">

            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by user, email, property or location..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary-500 focus:bg-white"
              />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => handleFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 outline-none focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Visit Pending</option>
              <option value="confirmed">Visit Confirmed</option>
              <option value="completed">Visit Completed</option>
            </select>
          </div>
        </div>

        {/* Booking Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900">
              Booking Records
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View and monitor all property visit bookings.
            </p>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Property
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Location
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Visit Date
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Time
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {currentBookings.length > 0 ? (
                  currentBookings.map((booking) => (

                    <tr
                      key={booking.id}
                      className="border-b border-gray-100 last:border-0 transition hover:bg-gray-50"
                    >

                      {/* User */}
                      <td className="px-5 py-4">

                        <div>
                          <p className="font-semibold text-gray-800">
                            {booking.user}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {booking.email}
                          </p>
                        </div>

                      </td>

                      {/* Property */}
                      <td className="px-5 py-4">

                        <p className="max-w-[200px] truncate text-sm font-semibold text-gray-700">
                          {booking.property}
                        </p>

                      </td>

                      {/* Location */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin
                            size={15}
                            className="shrink-0 text-primary-500"
                          />

                          {booking.location}
                        </div>

                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {booking.date}
                      </td>

                      {/* Time */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {booking.time}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {getStatusText(booking.status)}
                        </span>

                      </td>

                    </tr>

                  ))
                ) : (

                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-16 text-center"
                    >
                      <XCircle
                        size={40}
                        className="mx-auto text-gray-300"
                      />

                      <h3 className="mt-3 font-semibold text-gray-700">
                        No bookings found
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        Try changing your search or filter.
                      </p>
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {indexOfFirstBooking + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-700">
                  {Math.min(
                    indexOfLastBooking,
                    filteredBookings.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {filteredBookings.length}
                </span>{" "}
                bookings
              </p>

              <div className="flex items-center gap-2">

                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => prev - 1)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (

                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-primary-600 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>

                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => prev + 1)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={17} />
                </button>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default BookingOverview;