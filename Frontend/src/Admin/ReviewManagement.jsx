import React, { useMemo, useState, useEffect } from "react";
import {
  Search,
  Star,
  Trash2,
  MessageSquareText,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const mockReviews = [
  {
    id: 1,
    reviewer: "Rahul Sharma",
    type: "Tenant",
    property: "Modern 2BHK Apartment",
    host: "Amit Patil",
    rating: 5,
    review:
      "The property was exactly as shown in the pictures. The host was very helpful and responsive.",
    date: "18 Aug 2026",
  },
  {
    id: 2,
    reviewer: "Priya Singh",
    type: "Tenant",
    property: "Luxury Studio Apartment",
    host: "Neha Joshi",
    rating: 4,
    review:
      "Great location and beautiful property. The overall experience was really good.",
    date: "16 Aug 2026",
  },
  {
    id: 3,
    reviewer: "Amit Patil",
    type: "Host",
    property: "Green Valley House",
    host: "Amit Patil",
    rating: 5,
    review:
      "The tenant was respectful and maintained the property properly. Great experience.",
    date: "14 Aug 2026",
  },
  {
    id: 4,
    reviewer: "Sneha Kulkarni",
    type: "Tenant",
    property: "Premium 3BHK Villa",
    host: "Rohit Shah",
    rating: 3,
    review:
      "The property was good, but there were some maintenance issues during the visit.",
    date: "12 Aug 2026",
  },
  {
    id: 5,
    reviewer: "Rohit Shah",
    type: "Tenant",
    property: "Premium 3BHK Villa",
    host: "Rohit Shah",
    rating: 4,
    review:
      "The tenant communicated well and completed the booking process smoothly.",
    date: "10 Aug 2026",
  },
  {
    id: 6,
    reviewer: "Arjun Kumar",
    type: "Host",
    property: "Cozy 1BHK Flat",
    host: "Vikram Mehta",
    rating: 5,
    review:
      "Amazing property and excellent host. I would definitely recommend this place.",
    date: "08 Aug 2026",
  },
];

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { setLoading(false); return; }

    fetch('/api/admin/reviews', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews)) {
          const mapped = data.reviews.map((r) => ({
            id: String(r._id || r.id),
            reviewer: r.tenant?.name || 'Anonymous',
            type: 'Tenant',
            property: r.property?.title || r.title || 'Property',
            host: r.property?.location || 'N/A',
            rating: r.rating || 0,
            review: r.comment || r.description || '',
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
          }));
          setReviews(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('Reviews fetch error:', err);
        setLoading(false);
      });
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        review.reviewer.toLowerCase().includes(searchText) ||
        review.property.toLowerCase().includes(searchText) ||
        review.host.toLowerCase().includes(searchText) ||
        review.review.toLowerCase().includes(searchText);

      const matchesType =
        typeFilter === "all" ||
        review.type.toLowerCase() === typeFilter.toLowerCase();

      const matchesRating =
        ratingFilter === "all" ||
        review.rating === Number(ratingFilter);

      return matchesSearch && matchesType && matchesRating;
    });
  }, [reviews, search, typeFilter, ratingFilter]);

  const totalReviews = reviews.length;

  const userReviews = reviews.filter(
    (review) => review.type === "Tenant"
  ).length;

  const hostReviews = reviews.filter(
    (review) => review.type === "Host"
  ).length;

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const deleteReview = async (id) => {
    const result = await Swal.fire({
      title: "Delete Review?",
      text: "This review will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      setReviews((prev) => prev.filter((review) => review.id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "The review has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#16a34a",
      });
    }
  };

  const stats = [
    {
      title: "Total Reviews",
      value: totalReviews,
      description: "All platform reviews",
      icon: MessageSquareText,
    },
    {
      title: "User Reviews",
      value: userReviews,
      description: "Reviews from users",
      icon: Users,
    },
    {
      title: "Host Reviews",
      value: hostReviews,
      description: "Reviews from hosts",
      icon: UserRound,
    },
    {
      title: "Average Rating",
      value: averageRating,
      description: "Overall platform rating",
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-7">
         

          <h1 className=" text-2xl font-bold text-gray-900 sm:text-3xl">
            Reviews & Ratings
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Monitor reviews shared by users and hosts across the Nestesy
            platform.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">
                      {stat.title}
                    </p>

                    <motion.h2
                      key={stat.value}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="mt-1 text-2xl font-bold text-gray-900"
                    >
                      {stat.value}
                    </motion.h2>

                    <p className="mt-1 text-xs font-medium text-gray-400">
                      {stat.description}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon size={22} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search reviewer, property or review..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-10 text-sm outline-none transition focus:border-primary-500 focus:bg-white"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 outline-none focus:border-primary-500"
              >
                <option value="all">All Reviewers</option>
                <option value="tenant">Tenants</option>
                <option value="host">Hosts</option>
              </select>

              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 outline-none focus:border-primary-500"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Review Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="flex flex-col gap-1 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Customer Reviews
              </h2>

              <p className="text-sm text-gray-500">
                {filteredReviews.length} reviews found
              </p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-5 py-4 text-xs font-bold uppercase text-gray-500">
                    Reviewer
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-gray-500">
                    Property
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-gray-500">
                    Rating
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-gray-500">
                    Review
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {filteredReviews.map((review) => (
                    <motion.tr
                      key={review.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      {/* Reviewer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
                            {review.reviewer.charAt(0)}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {review.reviewer}
                            </p>

                            <span
                              className={`text-xs font-semibold ${
                                review.type === "Host"
                                  ? "text-blue-600"
                                  : "text-primary-600"
                              }`}
                            >
                              {review.type}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Property */}
                      <td className="px-5 py-4">
                        <p className="max-w-[180px] text-sm font-semibold text-gray-700">
                          {review.property}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Host: {review.host}
                        </p>
                      </td>

                      {/* Rating */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Star
                            size={16}
                            className="fill-amber-400 text-amber-400"
                          />

                          <span className="font-bold text-gray-700">
                            {review.rating}.0
                          </span>
                        </div>
                      </td>

                      {/* Review */}
                      <td className="px-5 py-4">
                        <p className="max-w-[300px] text-sm leading-6 text-gray-600">
                          {review.review}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                        {review.date}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => deleteReview(review.id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-gray-100 md:hidden">
            <AnimatePresence>
              {filteredReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
                        {review.reviewer.charAt(0)}
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800">
                          {review.reviewer}
                        </h3>

                        <span className="text-xs font-semibold text-primary-600">
                          {review.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star
                        size={15}
                        className="fill-amber-400 text-amber-400"
                      />

                      <span className="text-sm font-bold">
                        {review.rating}.0
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-gray-50 p-3">
                    <p className="text-xs font-semibold text-gray-400">
                      Property
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                      {review.property}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    "{review.review}"
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {review.date}
                    </span>

                    <button
                      onClick={() => deleteReview(review.id)}
                      className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredReviews.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <MessageSquareText size={25} />
              </div>

              <h3 className="mt-4 font-bold text-gray-700">
                No reviews found
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewManagement;