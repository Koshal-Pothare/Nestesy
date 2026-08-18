import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

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
  Check
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadProperty = useCallback(() => {
    setLoading(true);
    setError("");

    try {
      const stored = localStorage.getItem('hostProperties');
      console.log('=== DEBUG: PROPERTY DETAILS ===');
      console.log('Raw stored data:', stored);
      
      if (stored) {
        const allProperties = JSON.parse(stored);
        setAllProperties(allProperties);
        console.log('All properties count:', allProperties.length);
        console.log('All properties:', allProperties);
        console.log('Looking for property with ID:', id);
        console.log('ID type:', typeof id);
        
        // Try multiple ways to find the property
        let foundProperty = null;
        
        // Method 1: String comparison
        foundProperty = allProperties.find(p => String(p.id) === String(id));
        
        // Method 2: Number comparison (if Method 1 fails)
        if (!foundProperty) {
          console.log('Method 1 failed, trying number comparison');
          foundProperty = allProperties.find(p => Number(p.id) === Number(id));
        }
        
        // Method 3: Check if property exists in the list
        if (!foundProperty) {
          console.log('Property not found. Available IDs:', allProperties.map(p => ({ id: p.id, title: p.title })));
        }
        
        console.log('Found property:', foundProperty);
        
        if (foundProperty) {
          // Ensure property has a verification object
          if (!foundProperty.verification) {
            console.warn('Property has no verification object. Adding default.');
            foundProperty.verification = {
              ownerName: 'Not provided',
              ownerEmail: 'Not provided',
              ownerPhone: 'Not provided',
              propertyAddress: foundProperty.location || 'Not provided',
              submittedAt: new Date().toISOString(),
              verified: false,
              status: 'pending'
            };
          }
          setProperty(foundProperty);
        } else {
          setError(`Property with ID "${id}" not found. Please check the property ID.`);
          console.error('Property with ID', id, 'not found.');
        }
      } else {
        setError('No properties found. Please add a property first.');
        console.error('No properties in localStorage');
      }
    } catch (error) {
      console.error('Error loading property:', error);
      setError('Failed to load property details: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  // Auto-slide images
  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  const handleDelete = async () => {
    if (deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this property?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteProperty(id);

      alert("Property deleted successfully.");

      navigate("/host/my-properties", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Error deleting property:",
        err.response?.data || err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("ownerToken");
        navigate("/login");
        return;
      }
    }
  };

  // Handle status update (Active / Rented)
  const handleStatusUpdate = (newStatus) => {
    if (!property || updatingStatus) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to mark this property as "${newStatus}"?`
    );

    if (!confirmed) return;

    try {
      setUpdatingStatus(true);
      const stored = localStorage.getItem('hostProperties');
      if (stored) {
        const allProperties = JSON.parse(stored);
        const updatedProperties = allProperties.map(p => {
          if (String(p.id) === String(id)) {
            return {
              ...p,
              status: newStatus,
              statusUpdatedAt: new Date().toISOString()
            };
          }
          return p;
        });
        localStorage.setItem('hostProperties', JSON.stringify(updatedProperties));
        // Update the current property state
        setProperty(prev => ({
          ...prev,
          status: newStatus,
          statusUpdatedAt: new Date().toISOString()
        }));
        setTimeout(() => {
          setUpdatingStatus(false);
          alert(`Property marked as "${newStatus}" successfully!`);
        }, 500);
      }
    }
  };

  const getStatusBadge = () => {
    if (!property) {
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <Key className="w-5 h-5" />,
        label: 'Rented 🔑',
        border: 'border-blue-300'
      };
    }

    const status = property.status || "Pending";
    const verified = property.verification?.verified === true;

    if (status === "Rented") {
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Verified ✓',
        border: 'border-green-300'
      };
    }

    if (status === "Active" && verified) {
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Verified",
        border: "border-green-300",
      };
    }

    if (
      status === "Inactive" ||
      property.verification?.status === "rejected"
    ) {
      return {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle className="w-4 h-4" />,
        label: "Rejected",
        border: "border-red-300",
      };
    }
    // Default fallback - return Pending instead of Unknown
    return {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: <Clock className="w-4 h-4" />,
      label: "Pending Verification",
      border: "border-yellow-300",
    };
  };

  const getVerificationStatus = () => {
    if (!property?.verification) {
      return {
        label: "Verification Pending",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
      };
    }

    const verification = property.verification;

    if (verification.verified === true) {
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
  };

  // Debug: Show all properties if not found
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl w-full">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">{error || 'Property not found'}</h3>
          <p className="text-gray-400 mt-2">The property you're looking for doesn't exist or has been removed.</p>
          
          {/* Debug info - show available properties */}
          {allProperties.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
              <p className="text-sm font-semibold text-gray-700">
                Available Properties ({allProperties.length}):
              </p>

              <div className="mt-2 max-h-48 overflow-y-auto">
                {allProperties.map((p) => (
                  <div
                    key={p.id}
                    className="text-sm text-gray-600 py-2 border-b border-gray-100 flex justify-between items-center gap-2"
                  >
                    <span>
                      <span className="font-medium">
                        ID: {p.id}
                      </span>

                      {" - "}

                      {p.title ||
                        p.name ||
                        "Untitled Property"}
                    </span>

                    <button
                      onClick={() =>
                        navigate(`/host/property/${p.id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 bg-blue-50 rounded shrink-0"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => navigate('/host/my-properties')}
              className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Properties
            </button>
            <button
              onClick={loadProperty}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">
            Property not found
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate("/host/my-properties")
            }
            className="mt-5 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to My Properties
          </button>
        </div>
      </div>
    );
  }

  const images =
    Array.isArray(property.outerImages)
      ? property.outerImages
      : Array.isArray(property.images)
      ? property.images
      : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {property.title ||
                property.name ||
                "Property Details"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {property.location ||
                property.address ||
                "Location not available"}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/host/my-properties")
            }
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Properties
          </button>
        </div>

        {error && property && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {images.slice(0, 4).map((image, index) => {
                const imageUrl =
                  typeof image === "string"
                    ? image
                    : image?.url ||
                      image?.secure_url;

                if (!imageUrl) return null;

                return (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`${property.title || "Property"} ${
                      index + 1
                    }`}
                    className="h-64 w-full object-cover"
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center bg-gray-100 text-gray-400">
              No property images available
            </div>
          </div>

          {/* Static Images */}
          <div className="grid grid-cols-2 gap-3 h-[320px] sm:h-[420px] lg:h-full">
            {property.images?.slice(1, 5).map((image, index) => (
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="overflow-hidden rounded-2xl"
              >
                <img
                  src={image}
                  alt={`${property.title} ${index + 2}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="min-w-0">
            {/* Title & Basic Info */}
            <motion.section
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                      {property.type ||
                        property.propertyType ||
                        "Property"}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}
                    >
                      {statusBadge.icon}
                      {statusBadge.label}
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    {property.title ||
                      property.name ||
                      "Property"}
                  </h2>

                  <div className="mt-2 flex items-center gap-2 text-gray-500">
                    <MapPin
                      size={18}
                      className="shrink-0 text-primary-600"
                    />

                    <span>
                      {property.location ||
                        property.address ||
                        "Location not available"}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className="text-2xl sm:text-3xl font-bold text-primary-600">
                      ₹
                      {Number(
                        property.price || 0
                      ).toLocaleString("en-IN")}
                    </span>

                    <span className="text-sm text-gray-500">
                      /month
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-1 sm:justify-end text-sm text-gray-500">
                    <Calendar size={16} />

                    <span>
                      Listed:{" "}
                      {property.listedDate ||
                        "Not available"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <BedDouble
                    className="text-primary-600"
                    size={21}
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Bedrooms
                  </p>

                  <p className="font-semibold text-gray-800">
                    {property.bedrooms ?? 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <Bath
                    className="text-primary-600"
                    size={21}
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Bathrooms
                  </p>

                  <p className="font-semibold text-gray-800">
                    {property.bathrooms ?? 0}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <Ruler
                    className="text-primary-600"
                    size={21}
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Area
                  </p>

                  <p className="font-semibold text-gray-800">
                    {property.area ?? 0} sq.ft
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <Home
                    className="text-primary-600"
                    size={21}
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Property ID
                  </p>

                  <p className="font-semibold text-gray-800 text-sm break-all">
                    #{property.id}
                  </p>
                </div>
              </div>
            </motion.section>

            <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                About this property
              </h2>

              <p className="mt-3 text-sm sm:text-base leading-7 text-gray-600">
                {property.description ||
                  "No description provided."}
              </p>
            </section>

            {Array.isArray(property.amenities) &&
              property.amenities.length > 0 && (
                <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
                  <h2 className="text-xl font-bold text-gray-900">
                    Amenities
                  </h2>

                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {property.amenities.map(
                      (item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="flex items-center gap-2 rounded-2xl border border-primary-100 bg-primary-50 p-3 text-sm font-medium text-gray-700"
                        >
                          <ShieldCheck
                            size={17}
                            className="text-primary-600 shrink-0"
                          />

                          <span>{item}</span>
                        </div>
                      )
                    )}
                  </div>
                </section>
              )}

            {property.verification && (
              <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck
                    className="text-blue-600"
                    size={24}
                  />
                  Verification Details
                </h2>

                <div
                  className={`mt-5 p-4 rounded-xl border ${verificationStatus.border} ${verificationStatus.bg}`}
                >
                  <div className="flex items-center gap-2">
                    {property.verification.verified ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : property.verification.status ===
                      "rejected" ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}

                    <span
                      className={`font-semibold ${verificationStatus.color}`}
                    >
                      {verificationStatus.label}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">
                        Owner Name
                      </p>

                      <p className="font-medium text-gray-800">
                        {property.verification.ownerName ||
                          "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        Email
                      </p>

                      <p className="font-medium text-gray-800 break-all">
                        {property.verification.ownerEmail ||
                          "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        Phone
                      </p>

                      <p className="font-medium text-gray-800">
                        {property.verification.ownerPhone ||
                          "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        Property Address
                      </p>

                      <p className="font-medium text-gray-800">
                        {property.verification.propertyAddress ||
                          "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500">
                        Submitted At
                      </p>

                      <p className="font-medium text-gray-800">
                        {property.verification.submittedAt
                          ? new Date(
                              property.verification.submittedAt
                            ).toLocaleString()
                          : "Not available"}
                      </p>
                    </div>

                    {property.verification.verifiedAt && (
                      <div>
                        <p className="text-gray-500">
                          Verified At
                        </p>

                        <p
                          className={`font-medium ${
                            property.verification.status ===
                            "approved"
                              ? "text-green-600"
                              : property.verification.status ===
                                "rejected"
                              ? "text-red-600"
                              : "text-gray-800"
                          }`}
                        >
                          {new Date(
                            property.verification.verifiedAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {property.verification.adminNotes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-500 text-sm">
                        Admin Notes
                      </p>

                      <p
                        className={`mt-1 p-3 rounded-lg text-sm ${
                          property.verification.status ===
                          "approved"
                            ? "bg-green-50 text-green-700"
                            : property.verification.status ===
                              "rejected"
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {property.verification.adminNotes}
                      </p>
                    </div>
                  )}
                </div>

                {property.verification.documents &&
                  Object.keys(
                    property.verification.documents
                  ).length > 0 && (
                    <div className="mt-5">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Uploaded Documents
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Object.entries(
                          property.verification.documents
                        ).map(([docType, docUrl]) => {
                          if (!docUrl) {
                            return null;
                          }

                          return (
                            <div
                              key={docType}
                              className="relative group"
                            >
                              <img
                                src={docUrl}
                                alt={docType}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() =>
                                  window.open(
                                    docUrl,
                                    "_blank",
                                    "noopener,noreferrer"
                                  )
                                }
                              />

                              <p className="text-xs text-gray-500 mt-1 text-center capitalize">
                                {docType
                                  .replace(
                                    /([A-Z])/g,
                                    " $1"
                                  )
                                  .trim()}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </section>
            )}

            <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Eye
                  className="text-purple-600"
                  size={24}
                />
                Property Stats
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-purple-700">{property.inquiries || 0}</p>
                  <p className="text-xs text-purple-600">Total Inquiries</p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-lg font-bold text-green-700">
                    {property.listedDate || "N/A"}
                  </p>

                  <p className="text-xs text-green-600">
                    Listed Date
                  </p>
                </div>
              </div>
            </section>

            {/* Visitors List */}
            <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="text-blue-600" size={24} />
                  Visitors ({visitors.length})
                </h2>
                {visitors.length > 3 && (
                  <button
                    onClick={() => setShowAllVisitors(!showAllVisitors)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {showAllVisitors ? 'Show Less' : 'View All'}
                  </button>
                )}
              </div>

          {/* Right Sticky Card */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="bg-white rounded-3xl border border-gray-100 shadow-lg p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">
                    Monthly Rent
                  </p>

                  <h2 className="text-2xl font-bold text-primary-600">
                    ₹
                    {Number(
                      property.price || 0
                    ).toLocaleString("en-IN")}
                  </h2>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}
                >
                  {statusBadge.icon}
                  {statusBadge.label}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Bathrooms
                </p>

                <p className="mt-1 font-bold text-gray-800">
                  {property.bathrooms ?? 0}
                </p>
              </div>
            </div>

              {/* Status Management Buttons - Only show when verified */}
              {isVerified && (
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Manage Status
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        handleStatusUpdate("Active")
                      }
                      disabled={
                        updatingStatus ||
                        currentStatus === "Active"
                      }
                      className={`py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1 transition-all ${
                        currentStatus === "Active"
                          ? "bg-green-100 text-green-700 border-2 border-green-500 cursor-default"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      <Check size={14} />
                      Active
                    </button>

                    <button
                      onClick={() =>
                        handleStatusUpdate("Rented")
                      }
                      disabled={
                        updatingStatus ||
                        currentStatus === "Rented"
                      }
                      className={`py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1 transition-all ${
                        currentStatus === "Rented"
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-500 cursor-default"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <Key size={14} />
                      Rented
                    </button>
                  </div>

                  {currentStatus === "Active" && (
                    <p className="text-xs text-green-600 text-center">
                      ✓ Property is currently active and available
                    </p>
                  )}

                  {currentStatus === "Rented" && (
                    <p className="text-xs text-blue-600 text-center">
                      🔑 Property has been rented out
                    </p>
                  )}

                  {updatingStatus && (
                    <p className="text-xs text-blue-600 text-center">
                      Updating status...
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-xs text-yellow-700 text-center">
                     Status management available after verification
                  </p>
                </div>
              )}

              <div className="mt-6 grid grid-cols-1 gap-3">
                <button
                  onClick={() =>
                    navigate("/host/my-properties")
                  }
                  className="rounded-2xl border border-gray-300 py-3.5 font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Back to Properties
                </button>

                <button
                  onClick={() => navigate(`/host/edit-property/${property.id}`)}
                  className="rounded-2xl bg-primary-600 py-3.5 font-semibold text-white hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  Edit Property
                </button>

                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-2xl bg-red-500 py-3.5 font-semibold text-white hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Trash2 size={18} />

                  {deleting
                    ? "Deleting..."
                    : "Delete Property"}
                </button>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck
                  size={15}
                  className="text-green-500"
                />
                Your property is secure
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
};

// Refresh icon component
const Refresh = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default HostPropertyDetails;