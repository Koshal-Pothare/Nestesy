import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Bath,
  Ruler,
  Calendar,
  ShieldCheck,
  Phone,
  Mail,
  User,
  Star,
  Clock,
  IndianRupee,
  CheckCircle,
  XCircle,
  Key,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import BookVisitModal from "../Ui/BookVisitModal";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80";

/* ---------- helpers ---------- */

const getImageUrl = (image) => {
  if (typeof image === "string") {
    return image.startsWith("blob:") ? FALLBACK_IMAGE : image;
  }
  if (image && typeof image === "object") {
    const url = image.url || image.secure_url;
    return url && !url.startsWith("blob:") ? url : FALLBACK_IMAGE;
  }
  return FALLBACK_IMAGE;
};

const toNumber = (v, f = 0) => {
  if (v === null || v === undefined || v === "") return f;
  const n = Number(v);
  return Number.isFinite(n) ? n : f;
};

const cleanImages = (arr) =>
  Array.isArray(arr)
    ? arr.filter((img) => typeof img === "string" && img.trim() !== "" && !img.startsWith("blob:"))
    : [];

const uniqueImages = (arr) => [...new Set(arr)];

const normalizeStatus = (v) => String(v || "pending").trim().toLowerCase();

const normalizeProperty = (property = {}) => {
  if (!property || typeof property !== "object") return null;
  const id = property._id || property.id || property.propertyId;
  if (!id) return null;

  const price = toNumber(property.price ?? property.rent ?? property.monthlyRent, 0);
  const bedrooms = toNumber(property.bedrooms ?? property.bhk, 0);
  const bathrooms = toNumber(property.bathrooms ?? property.bath, 0);
  const area = toNumber(property.area ?? property.squareFeet ?? property.size, 0);

  const images = cleanImages(property.images);
  const outerImages = cleanImages(property.outerImages);
  const livingRoomImages = cleanImages(property.livingRoomImages);
  const bedroomImages = cleanImages(property.bedroomImages);
  const kitchenImages = cleanImages(property.kitchenImages);
  const bathroomImages = cleanImages(property.bathroomImages);
  const balconyImages = cleanImages(property.balconyImages);

  const allImages = uniqueImages([
    ...outerImages,
    ...images,
    ...livingRoomImages,
    ...bedroomImages,
    ...kitchenImages,
    ...bathroomImages,
    ...balconyImages,
  ]);

  const generatedLocation = [property.locality, property.city, property.state]
    .filter(Boolean)
    .join(", ");

  const location =
    typeof property.location === "string" && property.location.trim()
      ? property.location
      : generatedLocation ||
        property.address ||
        property.verification?.propertyAddress ||
        "Location not available";

  const verification = property.verification || {};

  return {
    ...property,
    id: String(id),
    _id: String(id),
    title: property.title || property.name || "Untitled Property",
    description: property.description || property.details || "",
    location,
    city: property.city || "",
    locality: property.locality || "",
    state: property.state || "",
    address: property.address || verification.propertyAddress || "",
    price,
    rent: price,
    bedrooms,
    bhk: bedrooms,
    bathrooms,
    area,
    squareFeet: area,
    propertyType: property.propertyType || property.type || "Property",
    type: property.type || property.propertyType || "Property",
    furnishing: property.furnishing || property.furnished || "Not specified",
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    idealFor: Array.isArray(property.idealFor) ? property.idealFor : [],
    securityDeposit: toNumber(property.securityDeposit ?? property.deposit, 0),
    maintenance: toNumber(property.maintenance, 0),
    images: allImages,
    outerImages,
    livingRoomImages,
    bedroomImages,
    kitchenImages,
    bathroomImages,
    balconyImages,
    allImages,
    status: normalizeStatus(property.status || property.approvalStatus),
    availability: property.availability !== false,
    createdAt: property.createdAt || null,
    rating: property.rating || 0,
    reviews: property.reviews || 0,
    ownerName: verification.ownerName || property.ownerName || "",
    ownerEmail: verification.ownerEmail || property.ownerEmail || "",
    ownerPhone: verification.ownerPhone || property.ownerPhone || "",
    host: verification.ownerName || property.ownerName || "Host",
    hostEmail: verification.ownerEmail || property.ownerEmail || "",
    hostPhone: verification.ownerPhone || property.ownerPhone || "",
  };
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [openBookModal, setOpenBookModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    setError("");

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    if (!isValidObjectId) {
      setError("Invalid property ID.");
      setProperty(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || `Failed to load property (${response.status})`);
      }

      const rawProperty = data?.property || data?.data?.property || data?.data || null;

      if (!rawProperty) {
        throw new Error("Property not found.");
      }

      const normalized = normalizeProperty(rawProperty);
      setProperty(normalized);
    } catch (err) {
      console.error("Error loading property:", err);
      setError(err?.message || "Unable to load property.");
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  /* Auto image slider */
  useEffect(() => {
    if (!property?.images?.length) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % property.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [property]);

  useEffect(() => {
    setCurrentImage(0);
  }, [id]);

  const nextImage = () => {
    if (!property?.images?.length) return;
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const previousImage = () => {
    if (!property?.images?.length) return;
    setCurrentImage((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  /* Status badge */
  const getStatusBadge = () => {
    if (!property) return null;
    const status = String(property.status || "active").toLowerCase();

    if (status === "rented")
      return {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <Key className="w-5 h-5" />,
        label: "Rented",
      };
    if (status === "active" || status === "approved")
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle className="w-5 h-5" />,
        label: "Verified",
      };
    if (status === "pending")
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <Clock className="w-5 h-5" />,
        label: "Pending Verification",
      };
    if (status === "inactive" || status === "rejected")
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle className="w-5 h-5" />,
        label: "Rejected",
      };
    return {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Active",
    };
  };

  const statusBadge = getStatusBadge();
  const propertyStatus = String(property?.status || "active").toLowerCase();
  const isApprovedProperty =
    propertyStatus === "active" || propertyStatus === "approved";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md">
          <div className="w-16 h-16 text-gray-300 mx-auto mb-4">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700">
            {error || "Property not found"}
          </h3>
          <p className="text-gray-400 mt-2">
            The property you're looking for doesn't exist or is not available.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate("/explore")}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700"
            >
              Back to Explore
            </button>
            <button
              type="button"
              onClick={loadProperty}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* IMAGE GALLERY */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-auto lg:h-[420px]"
        >
          {/* Main Carousel */}
          <div className="relative h-[320px] sm:h-[320px] lg:h-full overflow-hidden rounded-3xl group">
            <motion.img
              key={currentImage}
              src={getImageUrl(property.images?.[currentImage])}
              alt={property.title || "Property"}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

            {property.images?.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previousImage}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {property.images?.length > 1 && (
              <div className="absolute bottom-5 left-5 flex gap-2">
                {property.images.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentImage === index ? "w-7 bg-white" : "w-2 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="absolute top-5 left-5 rounded-full bg-black/40 backdrop-blur-md px-4 py-2 text-sm text-white">
              {currentImage + 1} / {property.images?.length || 0}
            </div>

            {statusBadge && (
              <div className="absolute top-5 right-5">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 ${statusBadge.bg} ${statusBadge.text}`}
                >
                  {statusBadge.icon}
                  {statusBadge.label}
                </span>
              </div>
            )}
          </div>

          {/* Static Images */}
          <div className="grid grid-cols-2 gap-3 h-[320px] sm:h-[420px] lg:h-full">
            {property.images?.slice(1, 5).map((image, index) => {
              const imgSrc = getImageUrl(image);
              if (!imgSrc) return null;
              return (
                <motion.div
                  key={`${imgSrc}-${index}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="overflow-hidden rounded-2xl"
                >
                  <img
                    src={imgSrc}
                    alt={`${property.title || "Property"} ${index + 2}`}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="min-w-0 lg:mt-20">
            {/* Title section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                      {property.propertyType || property.type || "Property"}
                    </span>
                    {statusBadge && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}
                      >
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    )}
                  </div>

                  <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    {property.title || "Untitled Property"}
                  </h1>

                  <div className="mt-2 flex items-center gap-2 text-gray-500">
                    <MapPin size={18} className="shrink-0 text-primary-600" />
                    <span>{property.location || "Location not available"}</span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className="text-2xl sm:text-3xl font-bold text-primary-600">
                      ₹{Number(property.price || 0).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>

                  <div className="mt-2 flex items-center gap-1 sm:justify-end">
                    <Star size={16} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{property.rating || 0}</span>
                    <span className="text-gray-500">({property.reviews || 0} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <Bath className="text-primary-600" size={21} />
                  <p className="mt-2 text-xs text-gray-500">Bathrooms</p>
                  <p className="font-semibold text-gray-800">{property.bathrooms ?? 0}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <Ruler className="text-primary-600" size={21} />
                  <p className="mt-2 text-xs text-gray-500">Area</p>
                  <p className="font-semibold text-gray-800">{property.area || 0} sq.ft</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <span className="text-primary-600 text-xl">🛋️</span>
                  <p className="mt-2 text-xs text-gray-500">Furnishing</p>
                  <p className="font-semibold text-gray-800">
                    {property.furnishing || "Furnished"}
                  </p>
                </div>
              </div>

              {isApprovedProperty && (
                <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                  <ShieldCheck size={18} className="text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    ✅ Verified Property
                  </span>
                </div>
              )}
            </motion.section>

            {/* Description */}
            <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">About this property</h2>
              <p className="mt-3 text-sm sm:text-base leading-7 text-gray-600">
                {property.description || "No description provided."}
              </p>

              {Array.isArray(property.idealFor) && property.idealFor.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900">Best For</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {property.idealFor.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Amenities */}
            {Array.isArray(property.amenities) && property.amenities.length > 0 && (
              <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
                <h2 className="text-xl font-bold text-gray-900">Amenities</h2>
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {property.amenities.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 rounded-2xl border border-primary-100 bg-primary-50 p-3 text-sm font-medium text-gray-700"
                    >
                      <ShieldCheck size={17} className="text-primary-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Host Details */}
            <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">Host Details</h2>
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700">
                  <User size={30} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">
                    {property.host || property.ownerName || "Host"}
                  </h3>
                  <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-5 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Phone size={15} />
                      {property.hostPhone || property.ownerPhone || "Not provided"}
                    </span>
                    <span className="flex items-center gap-2 break-all">
                      <Mail size={15} />
                      {property.hostEmail || property.ownerEmail || "Not provided"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  <ShieldCheck size={17} />
                  {isApprovedProperty ? "Verified Host" : "Host"}
                </div>
              </div>
            </section>

            {/* Security & Maintenance */}
            <section className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 sm:p-6">
                <ShieldCheck className="text-primary-600" size={25} />
                <h3 className="mt-3 font-bold text-gray-900">Security Deposit</h3>
                <p className="mt-1 text-gray-600">
                  ₹{Number(property.securityDeposit || 0).toLocaleString()}
                </p>
              </div>
              <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 sm:p-6">
                <IndianRupee className="text-primary-600" size={25} />
                <h3 className="mt-3 font-bold text-gray-900">Maintenance</h3>
                <p className="mt-1 text-gray-600">
                  ₹{Number(property.maintenance || 0).toLocaleString()} / month
                </p>
              </div>
            </section>
          </div>

          {/* RIGHT CARD */}
          <aside className="lg:sticky lg:top-24 h-fit lg:mt-20">
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-lg p-5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Monthly Rent</p>
                  <h2 className="text-2xl font-bold text-primary-600">
                    ₹{Number(property.price || 0).toLocaleString()}
                  </h2>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {property.rating || 0}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-primary-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Availability</p>
                    <p className="font-semibold text-gray-800">
                      {property.availability ? "Available" : "Not Available"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <Clock className="text-primary-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Visiting Hours</p>
                    <p className="font-semibold text-gray-800">10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Security Deposit</span>
                  <span className="font-semibold">
                    ₹{Number(property.securityDeposit || 0).toLocaleString()}
                  </span>
                </div>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-gray-500">Maintenance</span>
                  <span className="font-semibold">
                    ₹{Number(property.maintenance || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setOpenBookModal(true)}
                  className="w-full rounded-2xl bg-primary-600 py-3.5 font-semibold text-white hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
                >
                  Book Visit
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={15} className="text-green-500" />
                Your information is secure
              </div>
            </motion.div>
          </aside>
        </div>
      </main>

      <BookVisitModal
        property={property}
        open={openBookModal}
        onClose={() => setOpenBookModal(false)}
      />
    </div>
  );
};

export default PropertyDetails;