import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Eye,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Square,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter,
  Grid,
  List,
  ChevronDown,
  Building2,
  Heart,
  X,
  RefreshCw,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useNavigate } from "react-router-dom";

import PropertyCard from "../Ui/PropertyCard";

const API_URL =
  "http://localhost:5000/api/owners/properties";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80";

const toNumber = (value, fallback = 0) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

const toArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const cleanImages = (images) => {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .filter(
      (image) =>
        typeof image === "string" &&
        image.trim() !== "" &&
        !image.startsWith("blob:")
    )
    .map((image) => image.trim());
};

const uniqueImages = (images) => {
  return [...new Set(images)];
};

const getDateValue = (property) => {
  const date =
    property?.createdAt ||
    property?.listedDate ||
    property?.updatedAt ||
    null;

  if (!date) {
    return 0;
  }

  const timestamp = new Date(date).getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : 0;
};

const normalizeStatus = (status) => {
  const value = String(status || "pending")
    .trim()
    .toLowerCase();

  switch (value) {
    case "approved":
    case "verified":
    case "accepted":
      return "approved";

    case "active":
      return "active";

    case "pending":
    case "waiting":
    case "waiting for verification":
    case "under review":
    case "submitted":
      return "pending";

    case "rejected":
    case "declined":
      return "rejected";

    case "inactive":
      return "inactive";

    case "rented":
    case "rent":
      return "rented";

    default:
      return "pending";
  }
};

const normalizeProperty = (property = {}) => {
  const owner =
    property?.owner &&
    typeof property.owner === "object"
      ? property.owner
      : {};

  const propertyId =
    property?._id ||
    property?.id ||
    property?.propertyId ||
    "";

  const price = toNumber(
    property?.price ??
      property?.rent ??
      property?.monthlyRent,
    0
  );

  const bedrooms = toNumber(
    property?.bedrooms ??
      property?.bhk,
    0
  );

  const bathrooms = toNumber(
    property?.bathrooms ??
      property?.bath,
    0
  );

  const area = toNumber(
    property?.area ??
      property?.squareFeet ??
      property?.size,
    0
  );

  const images = cleanImages(
    property?.images
  );

  const outerImages = cleanImages(
    property?.outerImages
  );

  const livingRoomImages = cleanImages(
    property?.livingRoomImages
  );

  const bedroomImages = cleanImages(
    property?.bedroomImages
  );

  const kitchenImages = cleanImages(
    property?.kitchenImages
  );

  const bathroomImages = cleanImages(
    property?.bathroomImages
  );

  const balconyImages = cleanImages(
    property?.balconyImages
  );

  const allImages = uniqueImages([
    ...outerImages,
    ...images,
    ...livingRoomImages,
    ...bedroomImages,
    ...kitchenImages,
    ...bathroomImages,
    ...balconyImages,
  ]);

  const generatedLocation = [
    property?.locality,
    property?.city,
    property?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const location =
    typeof property?.location === "string"
      ? property.location
      : property?.location &&
        typeof property.location === "object"
      ? [
          property.location?.address,
          property.location?.locality,
          property.location?.city,
          property.location?.state,
        ]
          .filter(Boolean)
          .join(", ")
      : generatedLocation ||
        property?.address ||
        // property?.verification
        //   ?.propertyAddress ||
        "Location not available";

  const normalizedStatus = normalizeStatus(
    property?.status ||
      property?.approvalStatus
      // property?.verification?.status
  );

  return {
    ...property,

    id: String(propertyId),

    _id:
      property?._id ||
      propertyId,

    title:
      property?.title ||
      property?.name ||
      "Untitled Property",

    description:
      property?.description ||
      property?.details ||
      "",

    location,

    address:
      property?.address ||
      // property?.verification
      //   ?.propertyAddress ||
      "",

    locality:
      property?.locality || "",

    city:
      property?.city || "",

    state:
      property?.state || "",

    country:
      property?.country ||
      "India",

    pincode:
      property?.pincode ||
      property?.pinCode ||
      property?.zipCode ||
      "",

    price,

    rent: price,

    monthlyRent: toNumber(
      property?.monthlyRent ??
        property?.rent ??
        property?.price,
      0
    ),

    maintenance: toNumber(
      property?.maintenance,
      0
    ),

    securityDeposit: toNumber(
      property?.securityDeposit ??
        property?.deposit,
      0
    ),

    deposit: toNumber(
      property?.deposit ??
        property?.securityDeposit,
      0
    ),

    type:
      property?.type ||
      property?.propertyType ||
      "Property",

    propertyType:
      property?.propertyType ||
      property?.type ||
      "Property",

    bedrooms,

    bhk: bedrooms,

    bathrooms,

    kitchens: toNumber(
      property?.kitchens ??
        property?.kitchen,
      0
    ),

    area,

    squareFeet: area,

    furnishing:
      property?.furnishing ||
      "Not specified",

    idealFor: toArray(
      property?.idealFor
    ),

    amenities: toArray(
      property?.amenities
    ),

    status: normalizedStatus,

    approvalStatus:
      normalizedStatus,

    // verification:
    //   property?.verification ||
    //   null,

    inquiries: toNumber(
      property?.inquiries,
      0
    ),

    views: toNumber(
      property?.views,
      0
    ),

    favorites: toNumber(
      property?.favorites ??
        property?.likes,
      0
    ),

    images,
    outerImages,
    livingRoomImages,
    bedroomImages,
    kitchenImages,
    bathroomImages,
    balconyImages,
    allImages,

    createdAt:
      property?.createdAt ||
      null,

    updatedAt:
      property?.updatedAt ||
      null,

    listedDate:
      property?.listedDate ||
      null,

    owner,

    ownerId:
      property?.ownerId ||
      owner?._id ||
      owner?.id ||
      null,
  };
};

const MyProperties = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState(null);
  const [showDetailModal, setShowDetailModal] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadProperties = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const token =
          localStorage.getItem("ownerToken") ||
          localStorage.getItem("token");

        if (!token) {
          navigate("/login", {
            replace: true,
          });
          return;
        }

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        let data = {};

        const contentType =
          response.headers.get("content-type") ||
          "";

        if (
          contentType.includes(
            "application/json"
          )
        ) {
          try {
            data = await response.json();
          } catch {
            data = {};
          }
        }

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          localStorage.removeItem(
            "ownerToken"
          );

          localStorage.removeItem("token");

          navigate("/login", {
            replace: true,
          });

          return;
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              `Failed to load properties. Status: ${response.status}`
          );
        }

        let propertyData = [];

        if (Array.isArray(data)) {
          propertyData = data;
        } else if (
          Array.isArray(data?.properties)
        ) {
          propertyData = data.properties;
        } else if (
          Array.isArray(data?.data)
        ) {
          propertyData = data.data;
        } else if (
          Array.isArray(
            data?.data?.properties
          )
        ) {
          propertyData =
            data.data.properties;
        } else if (
          Array.isArray(
            data?.data?.data
          )
        ) {
          propertyData =
            data.data.data;
        }

        const normalizedProperties =
          propertyData
            .filter(
              (property) =>
                property &&
                typeof property ===
                  "object"
            )
            .map(normalizeProperty)
            .filter(
              (property) =>
                property.id &&
                property.id !==
                  "undefined" &&
                property.id !== "null"
            );

        setProperties(
          normalizedProperties
        );
      } catch (err) {
        console.error(
          "Error loading properties:",
          err
        );

        setError(
          err?.message ||
            "Unable to load your properties."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  useEffect(() => {
    const handleFocus = () => {
      loadProperties(true);
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, [loadProperties]);

  const propertyTypes = useMemo(() => {
    const types = properties
      .map(
        (property) =>
          property.propertyType
      )
      .filter(Boolean);

    return [
      "all",
      ...new Set(types),
    ];
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return [...properties]
      .filter((property) => {
        const matchesStatus =
          filterStatus === "all" ||
          property.status ===
            filterStatus;

        const matchesType =
          filterType === "all" ||
          property.propertyType ===
            filterType;

        return (
          matchesStatus &&
          matchesType
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-high") {
          return b.price - a.price;
        }

        if (sortBy === "price-low") {
          return a.price - b.price;
        }

        if (sortBy === "oldest") {
          return (
            getDateValue(a) -
            getDateValue(b)
          );
        }

        return (
          getDateValue(b) -
          getDateValue(a)
        );
      });
  }, [
    properties,
    filterStatus,
    filterType,
    sortBy,
  ]);

  const stats = useMemo(() => {
    return {
      total: properties.length,

      approved: properties.filter(
        (property) =>
          property.status ===
            "approved" ||
          property.status === "active"
      ).length,

      pending: properties.filter(
        (property) =>
          property.status === "pending"
      ).length,

      rejected: properties.filter(
        (property) =>
          property.status === "rejected"
      ).length,

      rented: properties.filter(
        (property) =>
          property.status === "rented"
      ).length,
    };
  }, [properties]);

  const getStatusLabel = (status) => {
    switch (status) {
      case "approved":
        return "Approved";

      case "active":
        return "Active";

      case "pending":
        return "Waiting for Verification";

      case "rejected":
        return "Rejected";

      case "inactive":
        return "Inactive";

      case "rented":
        return "Rented";

      default:
        return "Waiting for Verification";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
      case "active":
        return "bg-green-100 text-green-800 border-green-200";

      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";

      case "rejected":
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";

      case "rented":
        return "bg-blue-100 text-blue-800 border-blue-200";

      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
      case "active":
      case "rented":
        return (
          <CheckCircle className="w-4 h-4" />
        );

      case "pending":
        return (
          <Clock className="w-4 h-4" />
        );

      case "rejected":
      case "inactive":
      default:
        return (
          <AlertCircle className="w-4 h-4" />
        );
    }
  };

  const getPropertyImage = (property) => {
    const image =
      property?.allImages?.find(
        (item) =>
          typeof item === "string" &&
          item.trim() !== "" &&
          !item.startsWith("blob:")
      );

    return image || FALLBACK_IMAGE;
  };

  const handleAddProperty = () => {
    navigate("/host/add-property");
  };

  const handlePropertyClick = (id) => {
    if (!id) {
      return;
    }

    navigate(`/host/property/${id}`);
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProperty(null);
  };

  const handleDeleteProperty = async (
    propertyId
  ) => {
    if (!propertyId) {
      throw new Error(
        "Property ID is missing."
      );
    }

    const token =
      localStorage.getItem("ownerToken") ||
      localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      throw new Error(
        "Please login again."
      );
    }

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(
          propertyId
        )}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let data = {};

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        try {
          data = await response.json();
        } catch {
          data = {};
        }
      }

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem(
          "ownerToken"
        );

        localStorage.removeItem("token");

        navigate("/login", {
          replace: true,
        });

        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Failed to delete property. Status: ${response.status}`
        );
      }

      setProperties(
        (previousProperties) =>
          previousProperties.filter(
            (property) =>
              String(property.id) !==
              String(propertyId)
          )
      );

      if (
        selectedProperty &&
        String(selectedProperty.id) ===
          String(propertyId)
      ) {
        setSelectedProperty(null);
        setShowDetailModal(false);
      }

      return data;
    } catch (err) {
      console.error(
        "Error deleting property:",
        err
      );

      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-500">
            Loading your properties...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />

          <h2 className="text-xl font-bold text-red-700">
            Unable to Load Properties
          </h2>

          <p className="text-red-600 mt-2">
            {error}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={() =>
                loadProperties()
              }
              className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/host/dashboard"
                )
              }
              className="px-5 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Properties
          </h1>

          <p className="text-gray-500 mt-1">
            Manage and monitor your property listings
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              loadProperties(true)
            }
            disabled={refreshing}
            className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-5 h-5 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={handleAddProperty}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
          >
            <Plus className="w-5 h-5" />
            List New Property
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total"
          value={stats.total}
          text="Properties"
        />

        <StatCard
          label="Approved"
          value={stats.approved}
          text="Listings"
          color="green"
        />

        <StatCard
          label="Pending"
          value={stats.pending}
          text="Approvals"
          color="yellow"
        />

        <StatCard
          label="Rejected"
          value={stats.rejected}
          text="Listings"
          color="red"
        />

        <StatCard
          label="Rented"
          value={stats.rented}
          text="Properties"
          color="blue"
        />
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            type="button"
            onClick={() =>
              setShowFilters(
                (previous) =>
                  !previous
              )
            }
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition w-fit"
          >
            <Filter className="w-4 h-4" />

            Filters

            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200 w-fit">
            <button
              type="button"
              onClick={() =>
                setViewMode("grid")
              }
              className={`p-2 rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-green-600"
                  : "text-gray-500"
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                setViewMode("list")
              }
              className={`p-2 rounded-lg transition ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-green-600"
                  : "text-gray-500"
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-4 border-t">
                <div>
                  <label
                    htmlFor="status-filter"
                    className="block text-sm font-medium mb-1 text-gray-700"
                  >
                    Status
                  </label>

                  <select
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">
                      All Status
                    </option>

                    <option value="approved">
                      Approved
                    </option>

                    <option value="active">
                      Active
                    </option>

                    <option value="pending">
                      Pending
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>

                    <option value="rented">
                      Rented
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="type-filter"
                    className="block text-sm font-medium mb-1 text-gray-700"
                  >
                    Property Type
                  </label>

                  <select
                    id="type-filter"
                    value={filterType}
                    onChange={(e) =>
                      setFilterType(
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {propertyTypes.map(
                      (type) => (
                        <option
                          key={type}
                          value={type}
                        >
                          {type === "all"
                            ? "All Types"
                            : type}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sort-filter"
                    className="block text-sm font-medium mb-1 text-gray-700"
                  >
                    Sort By
                  </label>

                  <select
                    id="sort-filter"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="latest">
                      Latest First
                    </option>

                    <option value="oldest">
                      Oldest First
                    </option>

                    <option value="price-high">
                      Price: High to Low
                    </option>

                    <option value="price-low">
                      Price: Low to High
                    </option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <strong className="text-gray-800">
            {filteredProperties.length}
          </strong>{" "}
          properties
        </p>

        {properties.length > 0 && (
          <p className="text-xs text-gray-400">
            Your submitted properties
          </p>
        )}
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />

          <h3 className="text-xl font-semibold text-gray-600">
            {properties.length === 0
              ? "No properties listed yet"
              : "No properties match your filters"}
          </h3>

          <p className="text-gray-400 mt-2">
            {properties.length === 0
              ? "Start by listing your first property."
              : "Try changing your filters."}
          </p>

          {properties.length === 0 && (
            <button
              type="button"
              onClick={handleAddProperty}
              className="mt-5 px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              List New Property
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(
            (property, index) => (
              <motion.div
                key={property.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="relative"
              >
                <PropertyCard
                  property={property}
                  index={index}
                  variant="owner"
                  onClick={() =>
                    handlePropertyClick(
                      property.id
                    )
                  }
                  onDelete={
                    handleDeleteProperty
                  }
                />
              </motion.div>
            )
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map(
            (property, index) => (
              <motion.div
                key={property.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                onClick={() =>
                  handlePropertyClick(
                    property.id
                  )
                }
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-xl transition"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-52 relative flex-shrink-0">
                    <img
                      src={getPropertyImage(
                        property
                      )}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        if (
                          event.currentTarget
                            .src !==
                          FALLBACK_IMAGE
                        ) {
                          event.currentTarget.src =
                            FALLBACK_IMAGE;
                        }
                      }}
                    />

                    <div className="absolute top-3 left-3">
                      <StatusBadge
                        status={property.status}
                        getStatusBadge={
                          getStatusBadge
                        }
                        getStatusIcon={
                          getStatusIcon
                        }
                        getStatusLabel={
                          getStatusLabel
                        }
                      />
                    </div>
                  </div>

                  <div className="flex-1 p-5">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {property.title}
                        </h3>

                        <div className="flex items-center gap-2 text-gray-500 mt-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />

                          <span>
                            {property.location}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();

                          handleViewDetails(
                            property
                          );
                        }}
                        className="p-2 h-fit hover:bg-gray-100 rounded-lg transition"
                        title="View details"
                      >
                        <Eye className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-5 mt-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {property.bhk || 0} BHK
                      </span>

                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {property.bathrooms || 0}{" "}
                        Baths
                      </span>

                      <span className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        {property.area || 0} sq.ft
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                      {property.description ||
                        "No description available."}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t mt-4 pt-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">
                          ₹
                          {Number(
                            property.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        <span className="text-gray-500">
                          /month
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Heart className="w-4 h-4" />

                        {property.inquiries}{" "}
                        inquiries
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </div>
      )}

      <AnimatePresence>
        {showDetailModal &&
          selectedProperty && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={closeDetailModal}
            >
              <motion.div
                initial={{
                  scale: 0.95,
                  y: 20,
                }}
                animate={{
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  scale: 0.95,
                  y: 20,
                }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div className="relative h-64">
                  <img
                    src={getPropertyImage(
                      selectedProperty
                    )}
                    alt={
                      selectedProperty.title
                    }
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      if (
                        event.currentTarget
                          .src !==
                        FALLBACK_IMAGE
                      ) {
                        event.currentTarget.src =
                          FALLBACK_IMAGE;
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={
                      closeDetailModal
                    }
                    className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow hover:bg-gray-100 transition"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 left-4">
                    <StatusBadge
                      status={
                        selectedProperty.status
                      }
                      getStatusBadge={
                        getStatusBadge
                      }
                      getStatusIcon={
                        getStatusIcon
                      }
                      getStatusLabel={
                        getStatusLabel
                      }
                    />
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {
                      selectedProperty.title
                    }
                  </h2>

                  <div className="flex items-center gap-2 text-gray-500 mt-2">
                    <MapPin className="w-4 h-4" />

                    {
                      selectedProperty.location
                    }
                  </div>

                  <div className="flex flex-wrap gap-6 mt-5">
                    <span className="flex items-center gap-2">
                      <Bed className="w-5 h-5" />
                      {
                        selectedProperty.bhk
                      }{" "}
                      BHK
                    </span>

                    <span className="flex items-center gap-2">
                      <Bath className="w-5 h-5" />
                      {
                        selectedProperty.bathrooms
                      }{" "}
                      Baths
                    </span>

                    <span className="flex items-center gap-2">
                      <Square className="w-5 h-5" />
                      {
                        selectedProperty.area
                      }{" "}
                      sq.ft
                    </span>
                  </div>

                  <div className="flex items-center mt-6">
                    <IndianRupee className="w-7 h-7 text-green-600" />

                    <span className="text-3xl font-bold">
                      {Number(
                        selectedProperty.price
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    <span className="text-gray-500 ml-2">
                      /month
                    </span>
                  </div>

                  {selectedProperty.status ===
                    "pending" && (
                    <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex gap-3">
                        <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />

                        <div>
                          <h3 className="font-semibold text-yellow-800">
                            Waiting for Verification
                          </h3>

                          <p className="text-sm text-yellow-700 mt-1">
                            Your property has been submitted successfully and is waiting for admin verification.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t mt-6 pt-5">
                    <h3 className="font-semibold text-lg">
                      Description
                    </h3>

                    <p className="text-gray-600 mt-2">
                      {selectedProperty.description ||
                        "No description available."}
                    </p>
                  </div>

                  <div className="border-t mt-6 pt-5">
                    <h3 className="font-semibold text-lg mb-4">
                      Property Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <InfoItem
                        label="Property Type"
                        value={
                          selectedProperty.propertyType
                        }
                      />

                      <InfoItem
                        label="Furnishing"
                        value={
                          selectedProperty.furnishing
                        }
                      />

                      <InfoItem
                        label="Maintenance"
                        value={`₹${Number(
                          selectedProperty.maintenance
                        ).toLocaleString(
                          "en-IN"
                        )}`}
                      />

                      <InfoItem
                        label="Security Deposit"
                        value={`₹${Number(
                          selectedProperty.securityDeposit
                        ).toLocaleString(
                          "en-IN"
                        )}`}
                      />

                      <InfoItem
                        label="City"
                        value={
                          selectedProperty.city
                        }
                      />

                      <InfoItem
                        label="Pincode"
                        value={
                          selectedProperty.pincode
                        }
                      />
                    </div>
                  </div>

                  {selectedProperty.amenities
                    ?.length > 0 && (
                    <div className="border-t mt-6 pt-5">
                      <h3 className="font-semibold text-lg mb-3">
                        Amenities
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {selectedProperty.amenities.map(
                          (
                            amenity,
                            index
                          ) => (
                            <span
                              key={`${amenity}-${index}`}
                              className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700"
                            >
                              {amenity}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {selectedProperty.idealFor
                    ?.length > 0 && (
                    <div className="border-t mt-6 pt-5">
                      <h3 className="font-semibold text-lg mb-3">
                        Ideal For
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {selectedProperty.idealFor.map(
                          (
                            item,
                            index
                          ) => (
                            <span
                              key={`${item}-${index}`}
                              className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm"
                            >
                              {item}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="border-t mt-6 pt-5 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={
                        closeDetailModal
                      }
                      className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                    >
                      Close
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const id =
                          selectedProperty.id;

                        closeDetailModal();

                        handlePropertyClick(
                          id
                        );
                      }}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Full Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

const StatusBadge = ({
  status,
  getStatusBadge,
  getStatusIcon,
  getStatusLabel,
}) => {
  return (
    <span
      className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusBadge(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {getStatusLabel(status)}
    </span>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="font-medium text-gray-800 mt-1 break-words">
        {value || "Not specified"}
      </p>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  text,
  color = "gray",
}) => {
  const styles = {
    gray: {
      border: "border-gray-100",
      label: "text-gray-500",
      value: "text-gray-900",
      text: "text-gray-400",
    },
    green: {
      border: "border-green-100",
      label: "text-green-600",
      value: "text-green-700",
      text: "text-green-500",
    },
    yellow: {
      border: "border-yellow-100",
      label: "text-yellow-600",
      value: "text-yellow-700",
      text: "text-yellow-500",
    },
    red: {
      border: "border-red-100",
      label: "text-red-600",
      value: "text-red-700",
      text: "text-red-500",
    },
    blue: {
      border: "border-blue-100",
      label: "text-blue-600",
      value: "text-blue-700",
      text: "text-blue-500",
    },
  };

  const style =
    styles[color] || styles.gray;

  return (
    <div
      className={`bg-white rounded-xl p-4 border ${style.border} shadow-sm`}
    >
      <p
        className={`text-xs ${style.label}`}
      >
        {label}
      </p>

      <p
        className={`text-2xl font-bold ${style.value}`}
      >
        {value}
      </p>

      <p
        className={`text-xs ${style.text}`}
      >
        {text}
      </p>
    </div>
  );
};

export default MyProperties;