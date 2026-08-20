import React, { useState, useEffect } from "react";
import DesktopHero from "../assets/Explore/DesktopHero2.png";
import { motion } from "framer-motion";
import ExploreSkeleton from "../components/ExploreSkeleton";

import {
  ShieldCheck,
  User,
  Headset,
  IndianRupee,
  MapPin,
  Building2,
  Wallet2,
  Home,
} from "lucide-react";

import ExploreSidebar from "../components/ExploreSidebar";
import CTA from "../assets/Explore/CTA.png";
import PropertyCard from "../Ui/PropertyCard";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import SortBy from "../Ui/SortBy";
import { Properties as staticDefaultProperties } from "../Data/Data";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------- helpers (same shape as Home.jsx) ---------- */

const normalizeStatus = (v) => String(v || "pending").trim().toLowerCase();

const isApprovedProperty = (property) => {
  const status = normalizeStatus(
    property?.status || property?.approvalStatus || property?.verification?.status
  );
  return ["approved", "active"].includes(status);
};

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const cleanImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .filter((img) => typeof img === "string" && img.trim() !== "" && !img.startsWith("blob:"))
    .map((img) => img.trim());
};

const uniqueImages = (arr) => [...new Set(arr)];

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
    (typeof property.location === "string" && property.location.trim())
      ? property.location
      : generatedLocation ||
        property.address ||
        property.verification?.propertyAddress ||
        "Location not available";

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
    images,
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
    ownerId: property.ownerId || property.owner?._id || property.owner || null,
  };
};

const Explore = () => {
  /* =========================================================
     FILTER STATE
  ========================================================= */
  const [filter, setFilter] = useState({
    location: "",
    propertyType: "Any",
    budget: "Any",
    priceRange: 15000,
    bedroom: "",
    furnishing: "",
    amenities: [],
    availability: "",
    idealFor: "",
  });

  /* =========================================================
     PAGE / PROPERTY STATE
  ========================================================= */
  const [rotate, setRotate] = useState(0);
  const [sortBy, setSortBy] = useState("newest");

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);

  const [propertyLoading, setPropertyLoading] = useState(false);
  const [propertyError, setPropertyError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* =========================================================
     FETCH PROPERTIES FROM PUBLIC API
  ========================================================= */
  const loadProperties = async () => {
    setPropertyLoading(true);
    setPropertyError("");

    try {
      // Try several endpoint shapes — your backend now exposes /api/properties
      // and /api/properties/approved (both return approved only).
      const endpoints = [
        `${API_BASE_URL}/properties/approved`,
        `${API_BASE_URL}/properties`,
      ];

      let payload = null;

      for (const url of endpoints) {
        try {
          const response = await fetch(url);
          if (!response.ok) continue;
          const data = await response.json();
          const arr = Array.isArray(data?.properties)
            ? data.properties
            : Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : [];
          payload = arr;
          if (arr.length > 0) break;
        } catch (err) {
          console.warn("Fetch failed for", url, err);
        }
      }

      const raw = Array.isArray(payload) ? payload : [];

      const normalized = raw
        .map(normalizeProperty)
        .filter(Boolean)
        .filter(isApprovedProperty);

      const defaultNormalized = (staticDefaultProperties || [])
        .map(normalizeProperty)
        .filter(Boolean);

      const finalProperties =
        normalized.length > 0 ? normalized : defaultNormalized;

      setAllProperties(finalProperties);
      setFilteredProperties(finalProperties);
    } catch (error) {
      console.error("Error loading properties:", error);
      setPropertyError(error?.message || "Unable to load properties.");

      const defaultNormalized = (staticDefaultProperties || [])
        .map(normalizeProperty)
        .filter(Boolean);

      setAllProperties(defaultNormalized);
      setFilteredProperties(defaultNormalized);
    } finally {
      setPropertyLoading(false);
    }
  };

  /* =========================================================
     INITIAL API LOAD
  ========================================================= */
  useEffect(() => {
    loadProperties();
  }, []);
 
  // =========================================================
  // AUTO-REFRESH WHEN PAGE BECOMES VISIBLE
  // =========================================================
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadProperties();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // =========================================================
  // SCROLL TO PROPERTY SECTION
  // ========================================================= 
  /* =========================================================
     SCROLL TO PROPERTY SECTION
  ========================================================= */ 
  const scrollToProperty = () => {
    document.getElementById("properties")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* =========================================================
     HANDLE FILTER INPUT CHANGES
  ========================================================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================================================
     SEARCH / FILTER PROPERTIES
  ========================================================= */
  const handleSearch = () => {
    let result = [...allProperties];

    if (filter.location.trim()) {
      const q = filter.location.trim().toLowerCase();
      result = result.filter((p) =>
        String(p.location || "").toLowerCase().includes(q)
      );
    }

    if (filter.propertyType !== "Any") {
      result = result.filter(
        (p) =>
          String(p.propertyType || p.type || "").toLowerCase() ===
          String(filter.propertyType).toLowerCase()
      );
    }

    if (filter.budget !== "Any") {
      const [min, max] = filter.budget.split("-").map(Number);
      result = result.filter((p) => {
        const price = Number(p.price) || 0;
        return price >= min && price <= max;
      });
    }

    if (filter.idealFor) {
      result = result.filter(
        (p) => Array.isArray(p.idealFor) && p.idealFor.includes(filter.idealFor)
      );
    }

    if (filter.amenities.length > 0) {
      result = result.filter(
        (p) =>
          Array.isArray(p.amenities) &&
          filter.amenities.every((a) => p.amenities.includes(a))
      );
    }

    if (filter.bedroom) {
      result = result.filter(
        (p) => Number(p.bedrooms) === Number(filter.bedroom)
      );
    }

    if (filter.furnishing) {
      result = result.filter(
        (p) => String(p.furnishing || "").toLowerCase() === filter.furnishing.toLowerCase()
      );
    }

    setFilteredProperties(result);
    setCurrentPage(1);
    scrollToProperty();
  };

  /* =========================================================
     HANDLE AMENITY FILTER
  ========================================================= */
  const handleAmenity = (amenity) => {
    setFilter((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((item) => item !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  /* =========================================================
     SORTING LOGIC
  ========================================================= */
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "priceLow":
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      case "priceHigh":
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  /* =========================================================
     RESET FILTERS
  ========================================================= */
  const resetFilters = () => {
    setFilter({
      location: "",
      propertyType: "Any",
      budget: "Any",
      priceRange: 15000,
      bedroom: "",
      furnishing: "",
      amenities: [],
      availability: "",
      idealFor: "",
    });
    setSortBy("newest");
    setRotate((prev) => prev + 360);
    setFilteredProperties(allProperties);
    setCurrentPage(1);
  };

  /* =========================================================
     PAGINATION
  ========================================================= */
  const propertiesPerPage = 9;
  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const navigate = useNavigate();

  /* =========================================================
     FRAMER MOTION
  ========================================================= */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18 } },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  /* =========================================================
     STATS
  ========================================================= */
  const stats = [
    { icon: ShieldCheck, label: "Verified Property" },
    { icon: User, label: "Trusted Host" },
    { icon: IndianRupee, label: "Pocket Friendly" },
    { icon: Headset, label: "24/7 Support" },
  ];

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <section>
      {/* HERO SECTION */}
      <div className="relative">
        <div
          className="relative h-[600px] w-full bg-cover bg-center bg-no-repeat flex items-center text-center md:text-left p-10"
          style={{ backgroundImage: `url(${DesktopHero})` }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-primary-900 via-primary-900/50 to-black/20" />

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative z-10 max-w-2xl px-6 md:px-10 py-16 lg:py-18"
          >
            <motion.h1
              variants={item}
              className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mt-5"
            >
              Find a place
            </motion.h1>

            <motion.h1 variants={item} className="text-4xl md:text-6xl font-serif font-bold mt-4">
              <span className="text-white">you'll</span>
              <span className="text-white"> love</span>
              <span className="text-green-400"> to live.</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-xl mt-12 text-gray-200 leading-6 text-base md:text-xl font-semibold"
            >
              Explore thousands of verified flats and houses.
              <br />
              Trusted Host. Secure Stay. Better Living
            </motion.p>

            <motion.div variants={item} className="mt-10 max-w-2xl hidden md:flex">
              <div className="flex rounded-xl">
                {stats.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex-1 flex items-center py-3">
                    <div className="p-3 rounded-full flex items-center justify-center">
                      <Icon className="text-white" size={30} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-200 mt-1 leading-5">
                        {label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* SEARCH BAR */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute hidden md:flex left-1/2 -bottom-10 -translate-x-1/2 z-30 w-[95%] max-w-6xl border border-primary-500 rounded-3xl"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 flex items-center gap-2">
                <MapPin size={30} className="text-primary-600" />
                <div>
                  <label className="text-sm font-semibold text-gray-500">Location</label>
                  <input
                    placeholder="Search city or locality"
                    className="w-full outline-none text-lg"
                    type="text"
                    name="location"
                    value={filter.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Building2 size={30} className="text-primary-600" />
                <div>
                  <label className="text-sm font-semibold text-gray-500">Property</label>
                  <select
                    className="w-full outline-none bg-transparent"
                    name="propertyType"
                    value={filter.propertyType}
                    onChange={handleChange}
                  >
                    <option value="Any">Any</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Flat">Flat</option>
                    <option value="PG">PG</option>
                    <option value="Single Room">Single Room</option>
                    <option value="Independent House">Independent House</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wallet2 size={30} className="text-primary-600" />
                <div>
                  <label className="text-sm font-semibold text-gray-500">Budget</label>
                  <select
                    name="budget"
                    value={filter.budget}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                  >
                    <option value="Any">Any</option>
                    <option value="0-10000">Below ₹10k</option>
                    <option value="10000-20000">₹10k - ₹20k</option>
                    <option value="20000-50000">₹20k - ₹50k</option>
                    <option value="50000-1000000">Above ₹50k</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="rounded-2xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition"
              >
                Search
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* PROPERTY SECTION */}
      <div className="py-20 w-full p-10">
        {propertyLoading ? (
          <ExploreSkeleton />
        ) : (
          <>
            <div className="p-5">
              <h2 className="font-semibold text-4xl">Explore Homes</h2>
              <p className="mt-2 font-semibold text-gray-700">
                Find your perfect place from {allProperties.length} verified properties
              </p>
            </div>

            <div
              className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start"
              id="properties"
            >
              <ExploreSidebar
                filter={filter}
                setFilter={setFilter}
                handleChange={handleChange}
                reset={resetFilters}
                search={handleSearch}
                handleAmenity={handleAmenity}
                rotate={rotate}
                setRotate={setRotate}
              />

              <div className="lg:col-span-3">
                <div className="w-full flex justify-between items-center mb-5">
                  <p className="text-sm text-gray-500">
                    Showing {currentProperties.length} of {sortedProperties.length} properties
                  </p>
                  <SortBy sortBy={sortBy} setSortBy={setSortBy} />
                </div>

                {currentProperties.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">
                      {propertyError ? "Error loading properties" : "No properties found"}
                    </h3>
                    <p className="text-gray-400 mt-2">
                      {propertyError
                        ? propertyError
                        : "Try adjusting your filters, or check back once hosts list more properties."}
                    </p>
                    <button
                      type="button"
                      onClick={loadProperties}
                      className="mt-6 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={container}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {currentProperties.map((property, index) => (
                      <PropertyCard
                        property={property}
                        index={index}
                        key={property._id || property.id || `property-${index}`}
                      />
                    ))}
                  </motion.div>
                )}

                {sortedProperties.length > propertiesPerPage && (
                  <div className="flex justify-end items-center gap-3 mt-12">
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      totalItems={sortedProperties.length}
                      itemsPerPage={propertiesPerPage}
                      scrollTo={700}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* CTA SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="w-full px-6 py-20"
      >
        <div
          style={{ backgroundImage: `url(${CTA})` }}
          className="relative overflow-hidden bg-cover bg-center max-w-7xl mx-auto h-[400px] rounded-[32px] px-8 py-10 md:px-12 md:py-12"
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-start gap-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left py-10">
              <motion.div
                whileHover={{ rotate: 8, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 shadow-lg"
              >
                <Home size={42} className="text-white" />
              </motion.div>

              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white">
                  You've Saved the Best. Now Choose One.
                </h2>
                <p className="mt-3 text-primary-100 text-base md:text-lg max-w-xl leading-7">
                  Explore your wishlist and schedule a visit for the properties that caught your eye.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/wishlist")}
                  className="bg-transparent backdrop-blur-xl mt-10 text-white border border-white/20 px-10 py-4 rounded-2xl font-semibold text-lg shadow-xl transition-colors hover:bg-primary-50 hover:text-primary-700"
                >
                  Explore Wishlist
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Explore;