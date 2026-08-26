import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";

import Hero from "../assets/Home/Hero.png";
import CardLogo from "../assets/Home/CardLogo.png";
import CTA from "../assets/Home/CTA.png";
import PropertyCard from "../Ui/PropertyCard";

import {
  Search,
  MapPin,
  Home as HomeIcon,
  IndianRupee,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Tag,
  Headset,
  Shield,
  CreditCard,
  Building2,
  House,
} from "lucide-react";

import {
  cities,
  propertyTypes,
  budgets,
} from "../Data/Data";

/* =========================================================
   CONSTANTS
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const APPROVED_STATUSES = ["approved", "active"];

const normalizeStatus = (value) =>
  String(value || "pending").trim().toLowerCase();

const isApprovedProperty = (property) => {
  const status = normalizeStatus(
    property?.status || property?.approvalStatus || property?.verification?.status
  );
  return APPROVED_STATUSES.includes(status);
};

const toNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const cleanImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .filter(
      (img) =>
        typeof img === "string" &&
        img.trim() !== "" &&
        !img.startsWith("blob:")
    )
    .map((img) => img.trim());
};

const uniqueImages = (images) => [...new Set(images)];

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
    createdAt: property.createdAt || null,
    ownerId: property.ownerId || property.owner?._id || property.owner || null,
  };
};

/* =========================================================
   TYPING TEXT
========================================================= */

const TypingText = memo(
  ({ text, className = "", delay = 0.2 }) => {
    const [displayText, setDisplayText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
      let timeoutId;
      let index = 0;

      setDisplayText("");
      setIsComplete(false);

      const typeCharacter = () => {
        if (index < text.length) {
          setDisplayText((previous) => previous + text[index]);
          index += 1;
          timeoutId = setTimeout(typeCharacter, 30);
        } else {
          setIsComplete(true);
        }
      };

      const startTimeout = setTimeout(typeCharacter, delay * 1000);

      return () => {
        clearTimeout(startTimeout);
        clearTimeout(timeoutId);
      };
    }, [text, delay]);

    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={className}
      >
        {displayText}
        {!isComplete && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block w-0.5 h-5 bg-primary-500 ml-0.5 align-middle"
          />
        )}
      </motion.p>
    );
  }
);

/* =========================================================
   COUNTER HOOK
========================================================= */

const useCounter = (targetValue, duration = 2000, startDelay = 0) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const numericValue = useMemo(() => {
    const match = String(targetValue).match(/[\d.]+/);
    return match ? Number(match[0]) : 0;
  }, [targetValue]);

  const suffix = useMemo(
    () => String(targetValue).replace(/[\d.]/g, ""),
    [targetValue]
  );

  useEffect(() => {
    if (!isInView) return;

    let animationFrame;
    let startTime = null;
    let delayStart = null;

    const animate = (timestamp) => {
      if (delayStart === null) delayStart = timestamp;
      const elapsedDelay = timestamp - delayStart;
      if (elapsedDelay < startDelay) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setCount(numericValue * easedProgress);
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isInView, numericValue, duration, startDelay]);

  const formattedCount = String(targetValue).includes(".")
    ? count.toFixed(1)
    : Math.round(count);

  return { count: formattedCount, suffix, ref };
};

/* =========================================================
   FEATURE CARD
========================================================= */

const FeatureCard = memo(({ feature }) => {
  const Icon = feature.icon;
  return (
    <div
      className="bg-white rounded-[28px] px-6 py-8 text-center border border-white/50 shadow-[0_20px_35px_-10px_rgba(0,20,50,0.08),0_8px_18px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_50px_-12px_rgba(0,40,100,0.15)] hover:-translate-y-2 hover:border-green-200/30 transition-all duration-300 flex flex-col items-center backdrop-blur-sm group"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#eef5ff] to-[#e1ebff] flex items-center justify-center mb-5 group-hover:from-[#dce8ff] group-hover:to-[#c5d9ff] transition-all duration-200">
        <Icon size={42} className="text-green-600" />
      </div>
      <h3 className="text-xl md:text-2xl font-semibold text-primary-700 mb-2 tracking-tight font-[PlayfairDisplay]">
        {feature.title}
      </h3>
      <p className="text-[#3f4e62] text-base leading-relaxed max-w-[22ch] mx-auto">
        {feature.description}
      </p>
    </div>
  );
});

/* =========================================================
   HOME COMPONENT
========================================================= */

const Home = () => {
  const navigate = useNavigate();

  /* ----- HERO ----- */
  const curveRef = useRef(null);
  const isCurveVisible = useInView(curveRef, { once: true, amount: 0.5 });

  const heroText = "Find Your Perfect Home";
  const heroLetters = useMemo(() => heroText.split(""), []);
  const heroWords = useMemo(() => "Spaces that feel like".split(" "), []);

  /* ----- COUNTERS ----- */
  const counter1 = useCounter("12K+", 2000, 900);
  const counter2 = useCounter("8K+", 2000, 1000);
  const counter3 = useCounter("150+", 2000, 700);
  const counter4 = useCounter("4.9★", 2000, 800);

  /* ----- SEARCH ----- */
  const [searchCity, setSearchCity] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");

  const handleSearch = useCallback(
    (event) => {
      event.preventDefault();
      const params = new URLSearchParams();
      if (searchCity.trim()) params.set("city", searchCity.trim());
      if (selectedPropertyType) params.set("type", selectedPropertyType);
      if (selectedBudget) params.set("budget", selectedBudget);
      const queryString = params.toString();
      navigate(queryString ? `/explore?${queryString}` : "/explore");
    },
    [navigate, searchCity, selectedPropertyType, selectedBudget]
  );

  /* ----- CITIES CAROUSEL ----- */
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  const getCitiesPerRow = useCallback(() => {
    if (typeof window === "undefined") return 6;
    if (window.innerWidth < 640) return 2;
    if (window.innerWidth < 1024) return 4;
    return 6;
  }, []);

  const [citiesPerRow, setCitiesPerRow] = useState(getCitiesPerRow);

  useEffect(() => {
    const handleResize = () => setCitiesPerRow(getCitiesPerRow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getCitiesPerRow]);

  const duplicatedCities = useMemo(() => {
    if (!Array.isArray(cities)) return [];
    return [...cities, ...cities];
  }, []);

  const cityRows = useMemo(() => {
    if (!duplicatedCities.length) return [];
    const rows = [];
    for (let i = 0; i < duplicatedCities.length; i += citiesPerRow) {
      rows.push(duplicatedCities.slice(i, i + citiesPerRow));
    }
    return rows;
  }, [duplicatedCities, citiesPerRow]);

  useEffect(() => {
    if (isPaused || !trackRef.current || !containerRef.current) return;

    let animationFrame;
    const speed = 0.9;

    const animate = () => {
      if (!trackRef.current) return;
      scrollPositionRef.current += speed;
      const halfWidth = trackRef.current.scrollWidth / 2;
      if (halfWidth > 0 && scrollPositionRef.current >= halfWidth) {
        scrollPositionRef.current = 0;
      }
      trackRef.current.style.transform = `translate3d(-${scrollPositionRef.current}px, 0, 0)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, citiesPerRow, duplicatedCities]);

  const handleCityClick = useCallback(
    (city) => {
      const cityName = city?.name || "";
      if (!cityName) return;
      navigate(`/explore?city=${encodeURIComponent(cityName)}`);
    },
    [navigate]
  );

  /* ----- FEATURES ----- */
  const features = useMemo(
    () => [
      {
        id: 1,
        icon: ShieldCheck,
        title: "Verified Properties",
        description: "All listings are verified for your safety and peace of mind.",
      },
      {
        id: 2,
        icon: UserCheck,
        title: "Trusted Hosts",
        description: "Connect with genuine hosts and enjoy a hassle-free experience.",
      },
      {
        id: 3,
        icon: Tag,
        title: "Best Prices",
        description: "Find the best deals that fit your budget and need.",
      },
      {
        id: 4,
        icon: Headset,
        title: "24/7 Support",
        description: "We're here to help you anytime, anywhere you need.",
      },
    ],
    []
  );

  const propertyTypeOptions = useMemo(
    () =>
      Array.isArray(propertyTypes)
        ? propertyTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))
        : [],
    []
  );

  const budgetOptions = useMemo(
    () =>
      Array.isArray(budgets)
        ? budgets.map((budget) => (
            <option key={budget.value} value={budget.value}>
              {budget.label}
            </option>
          ))
        : [],
    []
  );

  /* -------------------------------------------------------
     LIVE PROPERTIES (only owner-created, approved)
  ------------------------------------------------------- */

  const [liveProperties, setLiveProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const extractPropertiesArray = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.properties)) return data.properties;
      if (Array.isArray(data.data)) return data.data;
      if (data.data && Array.isArray(data.data.properties)) return data.data.properties;
      if (data.data && Array.isArray(data.data.data)) return data.data.data;
      return [];
    };

    const fetchProperties = async () => {
      try {
        setPropertiesLoading(true);
        setPropertiesError("");

        // Try several endpoint shapes — your backend should expose a public
        // route that returns only approved/active properties.
        const endpoints = [
          `${API_BASE_URL}/properties/approved`,
          `${API_BASE_URL}/properties?status=approved`,
          `${API_BASE_URL}/properties`,
        ];

        let payload = null;
        let lastError = null;

        for (const url of endpoints) {
          try {
            const res = await fetch(url);
            if (!res.ok) {
              lastError = new Error(`HTTP ${res.status}`);
              continue;
            }
            const data = await res.json();
            const arr = extractPropertiesArray(data);
            if (arr.length > 0) {
              payload = arr;
              break;
            }
            // Save empty result so we can show the proper empty state
            if (!payload) payload = [];
          } catch (err) {
            lastError = err;
          }
        }

        if (!isMounted) return;

        const raw = Array.isArray(payload) ? payload : [];

        // Normalize + keep only approved/active ones
        const approved = raw
          .map(normalizeProperty)
          .filter(Boolean)
          .filter(isApprovedProperty);

        setLiveProperties(approved);
      } catch (error) {
        console.error("Error fetching properties for Home:", error);
        if (isMounted) {
          setPropertiesError(error?.message || "Unable to load properties.");
          setLiveProperties([]);
        }
      } finally {
        if (isMounted) setPropertiesLoading(false);
      }
    };

    fetchProperties();
    return () => {
      isMounted = false;
    };
  }, []);

  /* ----- PROPERTY CARDS (featured 6 approved owner-created properties) ----- */

  const featuredProperties = useMemo(() => {
    return liveProperties.slice(0, 6);
  }, [liveProperties]);

  const propertyCards = useMemo(() => {
    return featuredProperties.map((property, index) => (
      <PropertyCard
        key={property._id || property.id || `property-${index}`}
        property={property}
        index={index}
      />
    ));
  }, [featuredProperties]);

  /* ----- CITY CARDS ----- */

  const cityCards = useMemo(() => {
    return cityRows.map((row, rowIndex) => (
      <div
        key={`city-row-${rowIndex}`}
        className="flex-shrink-0 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 p-2 gap-4"
        style={{ width: "100%" }}
      >
        {row.map((city, index) => (
          <motion.div
            key={`${city.id || city.name}-${rowIndex}-${index}`}
            onClick={() => handleCityClick(city)}
            className="bg-card border border-border rounded-2xl p-5 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group overflow-hidden relative min-h-[250px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
              style={{ backgroundImage: `url(${city.image})` }}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
            <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-white/50 border backdrop-blur-md border-white/30 z-10 flex items-center justify-center">
              <img src={CardLogo} alt="Property" className="w-8 h-8 object-contain" />
            </div>
            <div className="relative z-10 flex flex-col h-full text-left">
              <h3 className="font-bold text-white text-lg mt-auto">{city.name}</h3>
              <p className="text-sm text-white/90 font-semibold">
                {city.properties || 0} properties
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    ));
  }, [cityRows, handleCityClick]);

  /* -------------------------------------------------------
     RENDER
  ------------------------------------------------------- */

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${Hero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/20 to-black/50" />
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-green-500/20 blur-3xl" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl">
            <motion.p
              className="text-green-400 font-medium text-sm sm:text-base tracking-wider uppercase mb-3 font-[Roboto]"
            >
              {heroLetters.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </motion.p>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-white font-[PlayfairDisplay]"
            >
              <motion.span className="inline-flex flex-wrap">
                {heroWords.map((word, index) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3, ease: "easeOut" }}
                    className="mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.span>

              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-300 mt-2 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut", type: "spring", stiffness: 100 }}
              >
                Home
                <svg
                  className="w-10 h-10 mb-2 ml-2 sm:w-12 sm:h-12 md:w-14 md:h-14 text-green-600 inline-block"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                >
                  <path
                    strokeLinecap="round" strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <div ref={curveRef} className="absolute -bottom-5 right-4 w-full">
                  <svg viewBox="0 0 500 120" className="w-48 sm:w-56 md:w-64 lg:w-72" style={{ transform: "translateY(10px)" }}>
                    <defs>
                      <linearGradient id="greenCurve" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#86efac" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M30 80 C120 60, 260 55, 450 75"
                      fill="none" stroke="url(#greenCurve)" strokeWidth="5" strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: isCurveVisible ? 1 : 0, opacity: isCurveVisible ? 1 : 0 }}
                      transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
                    />
                  </svg>
                </div>
              </motion.span>
            </motion.h1>

            <motion.p
              className="mt-7 text-gray-100 text-base sm:text-lg max-w-2xl font-[Roboto]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              Discover verified flats and houses for rent.
              <span className="block sm:inline"> Trusted hosts. Secure stays. Better living.</span>
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-6 sm:gap-10"
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div ref={counter1.ref} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{counter1.count}{counter1.suffix}</span>
                <span className="text-gray-100 text-sm font-semibold">Properties</span>
              </div>
              <div ref={counter2.ref} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{counter2.count}{counter2.suffix}</span>
                <span className="text-gray-100 text-sm font-semibold">Happy Clients</span>
              </div>
              <div ref={counter3.ref} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{counter3.count}{counter3.suffix}</span>
                <span className="text-gray-100 text-sm font-semibold">Cities</span>
              </div>
              <div ref={counter4.ref} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{counter4.count}{counter4.suffix}</span>
                <span className="text-gray-100 text-sm font-semibold">Rating</span>
              </div>
            </motion.div>
            
          </div>
    <motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
  className="mt-5 md:mt-10 flex flex-col md:flex-row w-full md:max-w-xl items-center gap-3 md:gap-10"
>
  <motion.button
    whileHover={{ scale: 1.04, y: -2 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => navigate("/explore")}
    className="w-full bg-primary-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg whitespace-nowrap transition-all duration-300 hover:bg-green-800"
  >
    Explore Properties
  </motion.button>

  <motion.button
    whileHover={{ scale: 1.04, y: -2 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => navigate("/become-a-host")}
    className="w-full bg-white/10 backdrop-blur-sm border border-white text-white font-semibold py-3.5 px-8 rounded-2xl shadow-lg whitespace-nowrap transition-all duration-300 hover:bg-white hover:text-primary-700 flex items-center justify-center gap-2"
  >
    <House size={20} />
    Become Host
  </motion.button>
</motion.div>
        </div>
        
      </section>

    

      {/* ============ SEARCH FORM ============ */}
      {/* <div className=" hidden md:flex relative z-20 -mt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative lg:col-span-2">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
                <input
                  type="text" value={searchCity}
                  onChange={(event) => setSearchCity(event.target.value)}
                  placeholder="Search city or locality"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                />
                <label className="absolute -top-2 left-3 px-1 text-xs text-primary-500 bg-white rounded">Where</label>
              </div>

              <div className="relative lg:col-span-1">
                <HomeIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none" />
                <select
                  value={selectedPropertyType}
                  onChange={(event) => setSelectedPropertyType(event.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-700 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="">Property Type</option>
                  {propertyTypeOptions}
                </select>
                <label className="absolute -top-2 left-3 px-1 text-xs text-primary-500 bg-white rounded">Property Type</label>
              </div>

              <div className="relative lg:col-span-1">
                <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none" />
                <select
                  value={selectedBudget}
                  onChange={(event) => setSelectedBudget(event.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-700 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="">Budget</option>
                  {budgetOptions}
                </select>
                <label className="absolute -top-2 left-3 px-1 text-xs text-primary-500 bg-white rounded">Budget</label>
              </div>

              <button
                type="submit"
                className="lg:col-span-1 w-full bg-primary-500 hover:bg-green-700 transition-all duration-300 rounded-xl text-white font-semibold py-3.5 flex justify-center items-center gap-2 shadow-lg shadow-green-600/30 hover:shadow-green-600/40 hover:-translate-y-0.5"
              >
                <Search size={20} /> Search
              </button>
            </div>
          </motion.form>
        </div>
      </div> */}

      {/* ============ POPULAR CITIES ============ */}
      <section className="relative z-10 -mt-18 bg-white rounded-t-[70px] pt-24 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <div>
              <p className="text-primary-600 font-semibold uppercase tracking-wider text-xl font-[Roboto]">
                Popular Cities
              </p>
              <h2 className="text-4xl font-bold text-heading mb-2">
                Explore <span className="text-primary-500">Homes</span> in Top Locations
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/explore")}
              className="flex items-center gap-2 text-primary-500 font-semibold hover:text-green-700 transition-colors group whitespace-nowrap font-[Roboto]"
            >
              View all cities
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <div
            ref={containerRef}
            className="relative overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div ref={trackRef} className="flex w-max will-change-transform">
              {cityCards}
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </section>

      {/* ============ FEATURED PROPERTIES (owner-created) ============ */}
      <section className="relative z-10 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <p className="text-primary-500 font-bold font-[Roboto] uppercase tracking-wider">
              Featured Properties
            </p>
            <div className="relative inline-block mt-2">
              <h2 className="text-4xl font-bold text-heading relative font-[PlayfairDisplay]">
                Discover Your Next <span className="text-primary-500">Home</span>
                <motion.span
                  className="absolute -bottom-3 left-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full shadow-lg shadow-primary-500/30"
                  initial={{ width: "0%" }} whileInView={{ width: "100%" }}
                  viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
                />
              </h2>
            </div>
            <p className="text-muted mt-4 max-w-2xl mx-auto">
              Browse genuine homes listed by verified owners. No mock data — every property here is created by a real host.
            </p>
          </motion.div>

          {/* Loading skeleton */}
          {propertiesLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[400px] rounded-2xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!propertiesLoading && liveProperties.length === 0 && (
            <div className="mt-12 text-center bg-gray-50 rounded-2xl py-16 px-6 border border-dashed border-gray-200">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">
                No properties available yet
              </h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                {propertiesError
                  ? `Error: ${propertiesError}`
                  : "Once hosts list their properties and get verified by admin, they will appear here."}
              </p>
              <button
                type="button"
                onClick={() => navigate("/become-a-host")}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition"
              >
                Become a Host
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* All approved owner-created properties */}
          {!propertiesLoading && liveProperties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {propertyCards}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={() => navigate("/explore")}
              className="px-8 py-4 bg-primary-500 text-white rounded-full font-semibold text-lg hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center"
            >
              View All Properties
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#f8faff] to-[#eef2f7]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <p className="text-primary-500 font-bold font-[Roboto] uppercase tracking-wider">
              Why Choose Us
            </p>
            <div className="relative inline-block mt-2">
              <h2 className="text-4xl font-bold text-heading relative font-[PlayfairDisplay]">
                We Make It <span className="text-primary-500">Easy</span> for You
                <motion.span
                  className="absolute -bottom-3 left-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full shadow-lg shadow-primary-500/30"
                  initial={{ width: "0%" }} whileInView={{ width: "100%" }}
                  viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
                />
              </h2>
            </div>
            <p className="text-muted mt-4 max-w-2xl mx-auto">
              Discover why thousands of users trust us for their property needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>

          <div className="text-center mt-14">
            <p className="text-sm text-[#3f4e62] mt-3">
              Join thousands of happy users. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* ============ CTA / HOST SECTION ============ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${CTA})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/80 to-primary-900/90" />

          <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              <div className="flex-1 space-y-4">
                <span className="inline-block text-primary-300 text-sm font-semibold tracking-wider uppercase bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                  Become a Host
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Earn More by <br className="hidden sm:block" />
                  <span className="relative inline-block">
                    Hosting Your Property
                    <svg className="absolute -bottom-1 left-0 w-full h-2 text-secondary-300/70" viewBox="0 0 200 8" fill="currentColor">
                      <path
                        d="M0 4 Q 25 0, 50 4 T 100 4 T 150 4 T 200 4"
                        stroke="currentColor" strokeWidth="3" fill="none"
                      />
                    </svg>
                  </span>
                </h2>
                <p className="text-white/80 text-base sm:text-lg max-w-xl">
                  List your property, connect with genuine tenants and earn more with zero hassle.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/host/register")}
                    className="group inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-95"
                  >
                    List Your Property
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4 sm:gap-5">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-500/30 rounded-xl">
                      <HomeIcon className="w-5 h-5 text-secondary-300" />
                    </div>
                    <span className="text-white font-medium text-sm sm:text-base">Easy Listing</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-500/30 rounded-xl">
                      <UserCheck className="w-5 h-5 text-secondary-300" />
                    </div>
                    <span className="text-white font-medium text-sm sm:text-base">Verified Tenants</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-500/30 rounded-xl">
                      <Shield className="w-5 h-5 text-secondary-300" />
                    </div>
                    <span className="text-white font-medium text-sm sm:text-base">Secure Payments</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-500/30 rounded-xl">
                      <CreditCard className="w-5 h-5 text-secondary-300" />
                    </div>
                    <span className="text-white font-medium text-sm sm:text-base">Zero Brokerage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;