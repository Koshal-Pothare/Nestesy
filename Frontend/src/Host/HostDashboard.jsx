import React, { useState, useEffect } from "react";
import {
  Home,
  Plus,
  Eye,
  Search,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Square,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Star,
  Award,
  X,
  Building2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  getMyProperties,
} from "../services/ownerService";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800";

const normalizeStatus = (status) => {
  const s = String(status || "").toLowerCase().trim();
  if (s === "active" || s === "approved") return "Active";
  if (s === "pending") return "Pending";
  if (s === "inactive" || s === "rejected") return "Inactive";
  return "Active";
};

const normalizeProperty = (p) => {
  const images = [
    ...(Array.isArray(p.allImages) ? p.allImages : []),
    ...(Array.isArray(p.images) ? p.images : []),
    ...(Array.isArray(p.outerImages) ? p.outerImages : []),
    ...(Array.isArray(p.livingRoomImages) ? p.livingRoomImages : []),
    ...(Array.isArray(p.bedroomImages) ? p.bedroomImages : []),
  ].filter((img) => typeof img === "string" && img.trim() !== "");

  const image = images.length > 0 ? images[0] : (p.image || FALLBACK_IMAGE);

  const location =
    p.location ||
    [p.locality, p.city, p.state].filter(Boolean).join(", ") ||
    p.address ||
    p.verification?.propertyAddress ||
    "Location not specified";

  return {
    ...p,
    id: p._id || p.id,
    _id: p._id || p.id,
    title: p.title || p.name || "Untitled Property",
    location,
    city: p.city || "",
    locality: p.locality || "",
    price: Number(p.price || p.rent || p.monthlyRent || 0),
    deposit: Number(p.deposit || p.securityDeposit || 0),
    bedrooms: Number(p.bedrooms || p.bhk || 0),
    bathrooms: Number(p.bathrooms || 0),
    area: Number(p.area || p.squareFeet || 0),
    status: normalizeStatus(p.status || p.approvalStatus),
    image,
    images: images.length > 0 ? images : [FALLBACK_IMAGE],
    type: p.propertyType || p.type || "Apartment",
    description: p.description || p.details || "",
    amenities: Array.isArray(p.amenities) ? p.amenities : [],
    views: Number(p.views || 0),
    inquiries: Number(p.inquiries || 0),
    createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Recently",
  };
};

const HostDashboard = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    pendingApprovals: 0,
    totalVisits: 0,
    approvedVisits: 0,
    pendingVisits: 0,
    totalEarnings: 0,
    totalViews: 0,
    totalInquiries: 0,
    rating: 4.8,
    responseRate: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("ownerToken");
      if (!token) {
        navigate("/host/login");
        return;
      }

      const [statsRes, propsRes] = await Promise.all([
        getDashboardStats().catch((err) => {
          console.warn("Stats API warning:", err?.response?.data || err);
          return { data: { stats: {} } };
        }),
        getMyProperties().catch((err) => {
          console.warn("Properties API warning:", err?.response?.data || err);
          return { data: { properties: [] } };
        }),
      ]);

      // Parse real stats
      const rawStats =
        statsRes.data?.stats ||
        statsRes.data?.data ||
        statsRes.data ||
        {};

      // Parse real properties
      const rawProperties =
        propsRes.data?.properties ||
        propsRes.data?.data ||
        (Array.isArray(propsRes.data) ? propsRes.data : []);

      const normalizedProps = (rawProperties || []).map(normalizeProperty);

      setProperties(normalizedProps);

      const propCount = normalizedProps.length;
      const activeCount = normalizedProps.filter((p) => p.status === "Active").length;
      const pendingCount = normalizedProps.filter((p) => p.status === "Pending").length;

      setStats({
        totalProperties: Number(rawStats.totalProperties ?? propCount),
        activeListings: Number(rawStats.activeListings ?? activeCount),
        pendingApprovals: Number(rawStats.pendingApprovals ?? pendingCount),
        totalVisits: Number(rawStats.totalVisits ?? 0),
        approvedVisits: Number(rawStats.approvedVisits ?? 0),
        pendingVisits: Number(rawStats.pendingVisits ?? 0),
        totalEarnings: Number(rawStats.totalEarnings ?? 0),
        totalViews: Number(rawStats.totalViews ?? 0),
        totalInquiries: Number(rawStats.totalInquiries ?? 0),
        rating: Number(rawStats.rating || 4.8),
        responseRate: Number(rawStats.responseRate ?? (propCount > 0 ? 95 : 0)),
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      showNotification("Could not refresh dashboard data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  const handleAddProperty = () => {
    navigate("/host/add-property");
  };

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !search ||
      property.title.toLowerCase().includes(search) ||
      property.location.toLowerCase().includes(search);

    const matchesFilter =
      filterStatus === "all" || property.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Inactive":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-green-500"
                : notification.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            } text-white`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Properties</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.totalProperties}
              </h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-green-600 font-medium">
              {stats.activeListings} Active
            </span>
            <span className="text-xs text-gray-400">· {stats.pendingApprovals} Pending</span>
          </div>
        </motion.div>

        {/* Total Visits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Visits</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.totalVisits}
              </h3>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-green-600 font-medium">
              {stats.approvedVisits} Approved
            </span>
            <span className="text-xs text-gray-400">visits scheduled</span>
          </div>
        </motion.div>

        {/* Approved Visits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Approved Visits</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.approvedVisits}
              </h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-emerald-600 font-medium">
              Ready for viewing
            </span>
          </div>
        </motion.div>

        {/* Pending Visits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Visits</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {stats.pendingVisits}
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-yellow-600 font-medium">
              ⏳ Awaiting your review
            </span>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Inquiries</p>
            <p className="text-lg font-bold text-gray-800">{stats.totalInquiries}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Rating</p>
            <p className="text-lg font-bold text-gray-800">{stats.rating} ★</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
            <Award className="w-5 h-5 text-teal-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Response Rate</p>
            <p className="text-lg font-bold text-gray-800">{stats.responseRate}%</p>
          </div>
        </div>
      </div>

      {/* Search, Filter, and Add Property Action */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search your properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm font-medium text-gray-700"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={fetchDashboardData}
            title="Refresh Data"
            className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition cursor-pointer"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-green-600" : ""}`} />
          </button>

          <button
            onClick={handleAddProperty}
            className="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center gap-2 font-semibold text-sm shadow-lg shadow-green-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="min-h-[250px] flex items-center justify-center bg-white rounded-3xl border border-gray-100 p-12 text-center">
          <div>
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 font-medium text-sm">Loading your properties...</p>
          </div>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Home className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            {properties.length === 0 ? "No Properties Added Yet" : "No Matching Properties"}
          </h3>
          <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
            {properties.length === 0
              ? "You haven't listed any properties yet. Click the button below to add your first property listing."
              : "Try adjusting your search query or status filter to find what you're looking for."}
          </p>
          {properties.length === 0 && (
            <button
              onClick={handleAddProperty}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold shadow-lg shadow-green-600/20 transition cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Add Your First Property
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Card Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK_IMAGE) {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }
                  }}
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm backdrop-blur-sm ${getStatusBadge(
                    property.status
                  )}`}
                >
                  {getStatusIcon(property.status)}
                  {property.status}
                </span>
                <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[11px] font-semibold text-white">
                  {property.type}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-gray-800 text-base line-clamp-1 mb-1">
                    {property.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-gray-100 text-xs text-gray-600 mb-3">
                    <span className="flex items-center gap-1 truncate">
                      <Bed className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      {property.bedrooms} Beds
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <Bath className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      {property.bathrooms} Baths
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <Square className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      {property.area} sq.ft
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs text-gray-400">Rent</span>
                    <div className="flex items-center font-extrabold text-green-700 text-lg">
                      <IndianRupee className="w-4 h-4" />
                      {Number(property.price || 0).toLocaleString("en-IN")}
                      <span className="text-xs font-normal text-gray-400 ml-0.5">/mo</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewDetails(property)}
                    className="p-2.5 bg-gray-50 hover:bg-green-50 text-gray-600 hover:text-green-700 rounded-xl transition cursor-pointer"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Property Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 bg-gray-100">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    if (e.currentTarget.src !== FALLBACK_IMAGE) {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowDetailModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full hover:bg-white text-gray-700 transition shadow-sm cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <span
                  className={`absolute bottom-4 right-4 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-md ${getStatusBadge(
                    selectedProperty.status
                  )}`}
                >
                  {getStatusIcon(selectedProperty.status)}
                  {selectedProperty.status}
                </span>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-xs uppercase font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                      {selectedProperty.type}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-800 mt-2">
                      {selectedProperty.title}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-400">Monthly Rent</span>
                    <div className="flex items-center text-2xl font-extrabold text-green-700">
                      <IndianRupee className="w-5 h-5" />
                      {Number(selectedProperty.price || 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-6">
                  <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                  {selectedProperty.location}
                </div>

                {/* Key Specs */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-gray-50 text-center mb-6">
                  <div>
                    <p className="text-xs text-gray-400">Bedrooms</p>
                    <p className="text-base font-bold text-gray-800 mt-0.5">
                      {selectedProperty.bedrooms} BHK
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Bathrooms</p>
                    <p className="text-base font-bold text-gray-800 mt-0.5">
                      {selectedProperty.bathrooms}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Area</p>
                    <p className="text-base font-bold text-gray-800 mt-0.5">
                      {selectedProperty.area} sq.ft
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedProperty.description && (
                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="font-bold text-gray-800 text-sm mb-2">Description</h4>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {selectedProperty.description}
                    </p>
                  </div>
                )}

                {/* Amenities */}
                {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <h4 className="font-bold text-gray-800 text-sm mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-50 text-green-800 rounded-xl text-xs font-medium"
                        >
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                <div className="border-t border-gray-100 pt-4 flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
                  <span>Listed on: {selectedProperty.createdAt}</span>
                  {selectedProperty.deposit > 0 && (
                    <span>Security Deposit: ₹{Number(selectedProperty.deposit).toLocaleString("en-IN")}</span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HostDashboard;