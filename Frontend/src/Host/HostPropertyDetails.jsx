import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Calendar,
  ShieldCheck,
  Clock,
  Home,
  CheckCircle,
  XCircle,
  FileText,
  Edit,
  Eye,
  Building2,
  Trash2,
  Key,
  Check,
  Users,
  ArrowLeft,
} from "lucide-react";

const API_URL = `${import.meta.env.VITE_API_URL}/owners/properties`;
const VISITS_API_URL = `${import.meta.env.VITE_API_URL}/owners/visits`;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80";

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const cleanImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .filter(
      (image) =>
        typeof image === "string" &&
        image.trim() !== "" &&
        !image.startsWith("blob:")
    )
    .map((image) => image.trim());
};

const uniqueImages = (images) => [...new Set(images)];

const normalizeStatus = (status) => {
  const value = String(status || "pending").trim().toLowerCase();
  switch (value) {
    case "approved":
    case "verified":
    case "accepted":
      return "approved";
    case "active":
      return "active";
    case "pending":
    case "waiting":
    case "submitted":
      return "pending";
    case "rejected":
    case "declined":
      return "rejected";
    case "inactive":
      return "inactive";
    case "rented":
      return "rented";
    default:
      return "pending";
  }
};

const normalizeProperty = (property = {}) => {
  const owner =
    property?.owner && typeof property.owner === "object" ? property.owner : {};

  const propertyId = property?._id || property?.id || property?.propertyId || "";

  const price = toNumber(property?.price ?? property?.rent ?? property?.monthlyRent, 0);
  const bedrooms = toNumber(property?.bedrooms ?? property?.bhk, 0);
  const bathrooms = toNumber(property?.bathrooms ?? property?.bath, 0);
  const area = toNumber(property?.area ?? property?.squareFeet ?? property?.size, 0);

  const images = cleanImages(property?.images);
  const outerImages = cleanImages(property?.outerImages);
  const livingRoomImages = cleanImages(property?.livingRoomImages);
  const bedroomImages = cleanImages(property?.bedroomImages);
  const kitchenImages = cleanImages(property?.kitchenImages);
  const bathroomImages = cleanImages(property?.bathroomImages);
  const balconyImages = cleanImages(property?.balconyImages);

  const allImages = uniqueImages([
    ...outerImages,
    ...images,
    ...livingRoomImages,
    ...bedroomImages,
    ...kitchenImages,
    ...bathroomImages,
    ...balconyImages,
  ]);

  const generatedLocation = [property?.locality, property?.city, property?.state]
    .filter(Boolean)
    .join(", ");

  const location =
    typeof property?.location === "string"
      ? property.location
      : generatedLocation ||
        property?.address ||
        // property?.verification?.propertyAddress || // COMMENTED: Verification
        "Location not available";

  const normalizedStatus = normalizeStatus(
    property?.status || property?.approvalStatus // || property?.verification?.status // COMMENTED: Verification
  );

  return {
    ...property,
    id: String(propertyId),
    _id: property?._id || propertyId,
    title: property?.title || property?.name || "Untitled Property",
    description: property?.description || property?.details || "",
    location,
    address: property?.address /* || property?.verification?.propertyAddress */, // COMMENTED: Verification
    locality: property?.locality || "",
    city: property?.city || "",
    state: property?.state || "",
    price,
    rent: price,
    bedrooms,
    bhk: bedrooms,
    bathrooms,
    area,
    squareFeet: area,
    propertyType: property?.propertyType || property?.type || "Property",
    status: normalizedStatus,
    approvalStatus: normalizedStatus,
    // verification: property?.verification || null, // COMMENTED: Verification
    inquiries: toNumber(property?.inquiries, 0),
    views: toNumber(property?.views, 0),
    images,
    outerImages,
    livingRoomImages,
    bedroomImages,
    kitchenImages,
    bathroomImages,
    balconyImages,
    allImages,
    createdAt: property?.createdAt || null,
    owner,
    ownerId: property?.ownerId || owner?._id || owner?.id || null,
  };
};

const HostPropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showAllVisitors, setShowAllVisitors] = useState(false);

  const getToken = () =>
    localStorage.getItem("ownerToken") || localStorage.getItem("token");

  const loadProperty = useCallback(async () => {
    setLoading(true);
    setError("");

    const token = getToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type") || "";

      let data = {};
      if (contentType.includes("application/json")) {
        try {
          data = await response.json();
        } catch {
          data = {};
        }
      }

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("ownerToken");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || `Failed to load property. Status: ${response.status}`
        );
      }

      const propertyData = data?.property || data?.data?.property || data?.data || data;

      if (!propertyData) {
        throw new Error("Property not found.");
      }

      const normalized = normalizeProperty(propertyData);
      setProperty(normalized);
    } catch (err) {
      console.error("Error loading property:", err);
      setError(err?.message || "Unable to load property details.");
      setProperty(null);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const loadVisitors = useCallback(async () => {
    if (!id) return;
    
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${VISITS_API_URL}?propertyId=${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      setVisitors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching visitors:", err);
    }
  }, [id]);

  useEffect(() => {
    loadProperty();
    loadVisitors();
  }, [loadProperty, loadVisitors]);

  const handleDelete = async () => {
    if (deleting || !property) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this property?"
    );
    if (!confirmed) return;

    const token = getToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(property.id)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("ownerToken");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.message || `Failed to delete property. Status: ${response.status}`
        );
      }

      window.alert("Property deleted successfully.");
      navigate("/host/my-properties", { replace: true });
    } catch (err) {
      console.error("Error deleting property:", err);
      setError(err?.message || "Failed to delete property. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!property || updatingStatus) return;

    const apiStatus = newStatus.toLowerCase();

    if (apiStatus !== "active" && apiStatus !== "rented") return;
    if (property.status === apiStatus) return;

    const confirmed = window.confirm(
      `Are you sure you want to mark this property as "${newStatus}"?`
    );
    if (!confirmed) return;

    const token = getToken();
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(property.id)}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: apiStatus }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("ownerToken");
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message || `Failed to update status. Status: ${response.status}`
        );
      }

      const updated = data?.property ? normalizeProperty(data.property) : null;
      if (updated) {
        setProperty(updated);
      } else {
        setProperty((prev) => ({
          ...prev,
          status: apiStatus,
          approvalStatus: apiStatus,
        }));
      }

      window.alert(`Property marked as "${newStatus}" successfully!`);
    } catch (err) {
      console.error("Error updating property status:", err);
      setError(
        err?.message || "Failed to update property status. Please try again."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusBadge = useMemo(() => {
    if (!property) {
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: <Clock className="h-4 w-4" />,
        label: "Pending Verification",
      };
    }

    const status = property.status || "pending";
    // const verificationStatus = property?.verification?.status; 
    // const verified = property?.verification?.verified === true;  

    if (status === "rented") {
      return {
        bg: "bg-blue-100",
        text: "text-blue-800",
        icon: <Key className="h-4 w-4" />,
        label: "Rented",
      };
    }

    if (status === "active" || status === "approved" /* && verified */) {  
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle className="h-4 w-4" />,
        label: "Verified",
      };
    }

    if (status === "rejected" || status === "inactive" /* || verificationStatus === "rejected" */) {  
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle className="h-4 w-4" />,
        label: "Rejected",
      };
    }

    return {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <Clock className="h-4 w-4" />,
      label: "Pending Verification",
    };
  }, [property]);
 
  /*
  const verificationStatus = useMemo(() => {
    if (!property?.verification) {
      return {
        label: "Verification Pending",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
      };
    }

    const verification = property.verification;

    if (verification.verified === true || verification.status === "approved") {
      return {
        label: "Verified ✓",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
      };
    }

    if (verification.status === "rejected") {
      return {
        label: "Rejected ✗",
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      };
    }

    return {
      label: "Pending Review ⏳",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
    };
  }, [property]);
  */

  const images = useMemo(() => {
    if (!property) return [];
    return property.allImages && property.allImages.length > 0
      ? property.allImages
      : property.outerImages || property.images || [];
  }, [property]);

  const currentStatus = property?.status || "pending";
  const isVerified =
    property?.verification?.verified === true || //  Verification
    property?.verification?.status === "approved" || // Verification
    currentStatus === "approved" ||
    currentStatus === "active";

  const getSafeImageSrc = (image) => {
    if (typeof image === "string") {
      return image.startsWith("blob:") ? FALLBACK_IMAGE : image;
    }
    if (image && typeof image === "object") {
      const url = image.url || image.secure_url;
      return url && !url.startsWith("blob:") ? url : FALLBACK_IMAGE;
    }
    return FALLBACK_IMAGE;
  };

  const formatDate = (date) => {
    if (!date) return "Not available";
    try {
      return new Date(date).toLocaleString();
    } catch {
      return "Not available";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <Building2 className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700">
            {error || "Property not found"}
          </h3>
          <p className="mt-2 text-gray-400">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => navigate("/host/my-properties")}
              className="mx-auto flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Properties
            </button>
            <button
              type="button"
              onClick={loadProperty}
              className="mx-auto rounded-xl bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {property.title || "Property Details"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {property.location || "Location not available"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/host/my-properties")}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Properties
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {images.slice(0, 4).map((image, index) => {
                const imageUrl = getSafeImageSrc(image);
                return (
                  <img
                    key={`${imageUrl}-${index}`}
                    src={imageUrl}
                    alt={`${property.title || "Property"} ${index + 1}`}
                    className="h-64 w-full object-cover"
                    onError={(e) => {
                      if (e.currentTarget.src !== FALLBACK_IMAGE) {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center bg-gray-100 text-gray-400">
              No property images available
            </div>
          )}
        </div>

        <main className="mx-auto px-0 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_350px]">
            <div className="min-w-0">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                        {property.propertyType || "Property"}
                      </span>
                      <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                      >
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </div>

                    <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                      {property.title || "Property"}
                    </h2>

                    <div className="mt-2 flex items-center gap-2 text-gray-500">
                      <MapPin size={18} className="shrink-0 text-primary-600" />
                      <span>{property.location}</span>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="flex items-baseline gap-1 sm:justify-end">
                      <span className="text-2xl font-bold text-primary-600 sm:text-3xl">
                        ₹{Number(property.price || 0).toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-500 sm:justify-end">
                      <Calendar size={16} />
                      <span>Listed: {formatDate(property.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <BedDouble className="text-primary-600" size={21} />
                    <p className="mt-2 text-xs text-gray-500">Bedrooms</p>
                    <p className="font-semibold text-gray-800">
                      {property.bedrooms ?? 0}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <Bath className="text-primary-600" size={21} />
                    <p className="mt-2 text-xs text-gray-500">Bathrooms</p>
                    <p className="font-semibold text-gray-800">
                      {property.bathrooms ?? 0}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <Ruler className="text-primary-600" size={21} />
                    <p className="mt-2 text-xs text-gray-500">Area</p>
                    <p className="font-semibold text-gray-800">
                      {property.area ?? 0} sq.ft
                    </p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <Home className="text-primary-600" size={21} />
                    <p className="mt-2 text-xs text-gray-500">Property ID</p>
                    <p className="break-all text-sm font-semibold text-gray-800">
                      #{property.id}
                    </p>
                  </div>
                </div>
              </motion.section>

              <section className="mt-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                <h2 className="text-xl font-bold text-gray-900">About this property</h2>
                <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                  {property.description || "No description provided."}
                </p>
              </section>

              {Array.isArray(property.amenities) && property.amenities.length > 0 && (
                <section className="mt-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                  <h2 className="text-xl font-bold text-gray-900">Amenities</h2>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {property.amenities.map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="flex items-center gap-2 rounded-2xl border border-primary-100 bg-primary-50 p-3 text-sm font-medium text-gray-700"
                      >
                        <ShieldCheck size={17} className="shrink-0 text-primary-600" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
 
              {/*
              {property.verification && (
                <section className="mt-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <ShieldCheck className="text-blue-600" size={24} />
                    Verification Details
                  </h2>

                  <div
                    className={`mt-5 rounded-xl border p-4 ${verificationStatus.border} ${verificationStatus.bg}`}
                  >
                    <div className="flex items-center gap-2">
                      {property.verification.verified ||
                      property.verification.status === "approved" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : property.verification.status === "rejected" ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                      <span className={`font-semibold ${verificationStatus.color}`}>
                        {verificationStatus.label}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                      <div>
                        <p className="text-gray-500">Owner Name</p>
                        <p className="font-medium text-gray-800">
                          {property.verification.ownerName || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="break-all font-medium text-gray-800">
                          {property.verification.ownerEmail || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium text-gray-800">
                          {property.verification.ownerPhone || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Property Address</p>
                        <p className="font-medium text-gray-800">
                          {property.verification.propertyAddress || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Submitted At</p>
                        <p className="font-medium text-gray-800">
                          {formatDate(property.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {property.verification.documents &&
                    typeof property.verification.documents === "object" &&
                    Object.keys(property.verification.documents).length > 0 && (
                      <div className="mt-5">
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-800">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Uploaded Documents
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {Object.entries(property.verification.documents).map(
                            ([docType, docUrl]) => {
                              if (!docUrl) return null;
                              const safeUrl = docUrl.startsWith("blob:")
                                ? FALLBACK_IMAGE
                                : docUrl;
                              return (
                                <div key={docType} className="group relative">
                                  <img
                                    src={safeUrl}
                                    alt={docType}
                                    className="h-32 w-full cursor-pointer rounded-lg border border-gray-200 object-cover transition-opacity hover:opacity-90"
                                    onClick={() => window.open(safeUrl, "_blank", "noopener,noreferrer")}
                                    onError={(e) => {
                                      if (e.currentTarget.src !== FALLBACK_IMAGE) {
                                        e.currentTarget.src = FALLBACK_IMAGE;
                                      }
                                    }}
                                  />
                                  <p className="mt-1 text-center text-xs capitalize text-gray-500">
                                    {docType.replace(/([A-Z])/g, " $1").trim()}
                                  </p>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                </section>
              )}
              */}

              <section className="mt-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <Eye className="text-purple-600" size={24} />
                  Property Stats
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-purple-50 p-4">
                    <p className="text-2xl font-bold text-purple-700">
                      {property.inquiries || 0}
                    </p>
                    <p className="text-xs text-purple-600">Total Inquiries</p>
                  </div>
                  <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-lg font-bold text-green-700">
                      {formatDate(property.createdAt)}
                    </p>
                    <p className="text-xs text-green-600">Listed Date</p>
                  </div>
                </div>
              </section>

              <section className="mt-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <Users className="text-blue-600" size={24} />
                    Visitors ({visitors.length})
                  </h2>
                  {visitors.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setShowAllVisitors((prev) => !prev)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {showAllVisitors ? "Show Less" : "View All"}
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {(showAllVisitors ? visitors : visitors.slice(0, 3)).map(
                    (visitor, index) => {
                      const visitorName = visitor?.tenant?.name || visitor?.visitorName || "Unknown Visitor";
                      const visitorEmail = visitor?.tenant?.email || visitor?.email || "No email";
                      const visitDate = visitor?.visitDate || "Not scheduled";
                      const visitStatus = visitor?.status || "Pending";

                      return (
                        <div
                          key={visitor?._id || index}
                          className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-3"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {visitorName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {visitorEmail} • Visiting on: {visitDate}
                            </p>
                          </div>
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium capitalize text-blue-700">
                            {visitStatus}
                          </span>
                        </div>
                      );
                    }
                  )}
                  {visitors.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No visitors have booked a visit for this property yet.
                    </p>
                  )}
                </div>
              </section>
            </div>

            <aside className="h-fit lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-gray-100 bg-white p-5 shadow-lg sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Monthly Rent</p>
                    <h2 className="text-2xl font-bold text-primary-600">
                      ₹{Number(property.price || 0).toLocaleString("en-IN")}
                    </h2>
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}
                  >
                    {statusBadge.icon}
                    {statusBadge.label}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs text-gray-400">Bathrooms</p>
                  <p className="mt-1 font-bold text-gray-800">
                    {property.bathrooms ?? 0}
                  </p>
                </div>

                {isVerified ? (
                  <div className="mt-6 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Manage Status
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate("Active")}
                        disabled={updatingStatus || currentStatus === "active"}
                        className={`flex items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-medium transition-all ${
                          currentStatus === "active"
                            ? "cursor-default border-2 border-green-500 bg-green-100 text-green-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        <Check size={14} />
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate("Rented")}
                        disabled={updatingStatus || currentStatus === "rented"}
                        className={`flex items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-medium transition-all ${
                          currentStatus === "rented"
                            ? "cursor-default border-2 border-blue-500 bg-blue-100 text-blue-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        <Key size={14} />
                        Rented
                      </button>
                    </div>
                    {updatingStatus && (
                      <p className="text-center text-xs text-blue-600">
                        Updating status...
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-3">
                    <p className="text-center text-xs text-yellow-700">
                      Status management available after verification
                    </p>
                  </div>
                )}

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/host/my-properties")}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-gray-300 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <ArrowLeft size={18} />
                    Back to Properties
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/host/edit-property/${property.id}`)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-primary-600 py-3.5 font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700"
                  >
                    <Edit size={18} />
                    Edit Property
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-red-500 py-3.5 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={18} />
                    {deleting ? "Deleting..." : "Delete Property"}
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck size={15} className="text-green-500" />
                  Your property is secure
                </div>
              </motion.div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HostPropertyDetails;