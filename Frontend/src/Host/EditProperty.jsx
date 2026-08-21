import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Home,
  X,
  Upload,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Square,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Image as ImageIcon,
  Grid3x3,
  Sofa,
  Shield,
  ShieldCheck,
  Wallet,
  LoaderCircle,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/owners/properties";

const AVAILABLE_AMENITIES = [
  "Parking", "Pool", "Gym", "Garden", "Security", "Lift",
  "Power Backup", "Terrace", "Balcony", "Furnished", "AC",
  "WiFi", "Pet Friendly", "Playground", "CCTV",
];

const BHK_OPTIONS = [
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4 BHK" },
  { value: "5", label: "5 BHK" },
];

const FURNISHING_OPTIONS = ["Fully Furnished", "Semi Furnished", "Unfurnished"];

const IDEAL_FOR_OPTIONS = [
  "Students", "Working Professionals", "Families", "Couples",
];

const PROPERTY_TYPES = [
  "Apartment", "Flat", "Penthouse", "House", "Studio", "Duplex", "Farmhouse",
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80";

const safeArr = (v) => (Array.isArray(v) ? v : []);
const safeStr = (v) => (v == null ? "" : String(v));

// Distribute a flat array of existing bedroom image URLs into per-bedroom arrays (max 2 per bedroom)
const distributeBedroomImages = (flatImages, bhk) => {
  const flat = safeArr(flatImages).filter((img) => typeof img === "string" && img.trim() !== "");
  const result = Array.from({ length: Math.max(1, bhk) }, () => []);
  let bedroomIdx = 0;
  for (const img of flat) {
    if (bedroomIdx >= result.length) break;
    if (result[bedroomIdx].length >= 2) {
      bedroomIdx += 1;
      if (bedroomIdx >= result.length) break;
    }
    result[bedroomIdx].push(img);
  }
  return result;
};

const ImagePreview = ({ file, alt = "Property preview" }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!file) {
      setSrc("");
      return undefined;
    }
    if (typeof file === "string") {
      setSrc(file.startsWith("blob:") ? FALLBACK_IMAGE : file);
      return undefined;
    }
    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <ImageIcon className="w-8 h-8 text-gray-300" />
      </div>
    );
  }

  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
};

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const token =
          localStorage.getItem("ownerToken") || localStorage.getItem("token");
        if (!token) throw new Error("Authentication required. Please login again.");

        const response = await fetch(`${API_URL}/${id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.message || "Failed to load property.");

        const property = data?.property || data?.data || data;
        if (!property) throw new Error("Property not found.");

        const bhk = Number(property.bhk ?? property.bedrooms ?? 0);

        setFormData({
          title: safeStr(property.title),
          location: safeStr(property.location),
          price: safeStr(property.price ?? property.rent),
          type: safeStr(property.type || property.propertyType || "Apartment"),
          bhk: bhk ? String(bhk) : "",
          bathrooms: safeStr(property.bathrooms),
          area: safeStr(property.area),
          furnishing: safeStr(property.furnishing || property.furnished),
          idealFor: safeArr(property.idealFor),
          securityDeposit: safeStr(property.securityDeposit ?? property.deposit),
          maintenance: safeStr(property.maintenance),
          description: safeStr(property.description),
          amenities: safeArr(property.amenities),
          outerImages: safeArr(property.outerImages),
          livingRoomImages: safeArr(property.livingRoomImages),
          bathroomImages: safeArr(property.bathroomImages),
          balconyImages: safeArr(property.balconyImages),
          kitchenImages: safeArr(property.kitchenImages),
          bedroomImages: distributeBedroomImages(property.bedroomImages, bhk || 1),
          ownerName: safeStr(property.verification?.ownerName),
          ownerEmail: safeStr(property.verification?.ownerEmail),
          ownerPhone: safeStr(property.verification?.ownerPhone),
          propertyAddress: safeStr(property.verification?.propertyAddress),
          additionalNotes: safeStr(property.verification?.additionalNotes),
        });
        setError("");
      } catch (err) {
        console.error("Error loading property:", err);
        setError(err?.message || "Failed to load property.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "bhk") {
        const newBhk = Number(value) || 0;
        const current = [...(prev.bedroomImages || [])];
        if (newBhk > current.length) {
          for (let i = current.length; i < newBhk; i += 1) current.push([]);
        } else if (newBhk < current.length) {
          current.length = newBhk;
        }
        updated.bedroomImages = current;
      }
      return updated;
    });
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const toggleIdealFor = (value) => {
    setFormData((prev) => ({
      ...prev,
      idealFor: prev.idealFor.includes(value)
        ? prev.idealFor.filter((item) => item !== value)
        : [...prev.idealFor, value],
    }));
  };

  const addImages = (field, files, maxImages) => {
    const selectedFiles = Array.from(files || []).filter((file) =>
      file.type.startsWith("image/")
    );
    if (selectedFiles.length === 0) return;

    setFormData((prev) => {
      const currentImages = prev[field] || [];
      const remainingSlots = maxImages - currentImages.length;
      if (remainingSlots <= 0) return prev;
      const selected = selectedFiles.slice(0, remainingSlots);
      return { ...prev, [field]: [...currentImages, ...selected] };
    });
  };

  const handleOuterUpload = (e) => { addImages("outerImages", e.target.files, 5); e.target.value = ""; };
  const handleLivingRoomUpload = (e) => { addImages("livingRoomImages", e.target.files, 2); e.target.value = ""; };
  const handleBathroomUpload = (e) => { addImages("bathroomImages", e.target.files, 2); e.target.value = ""; };
  const handleBalconyUpload = (e) => { addImages("balconyImages", e.target.files, 2); e.target.value = ""; };
  const handleKitchenUpload = (e) => { addImages("kitchenImages", e.target.files, 2); e.target.value = ""; };

  const handleBedroomUpload = (event, bedroomIndex) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length === 0) return;

    setFormData((prev) => {
      const bedroomImages = [...(prev.bedroomImages || [])];
      while (bedroomImages.length <= bedroomIndex) bedroomImages.push([]);
      const currentImages = bedroomImages[bedroomIndex] || [];
      const remainingSlots = 2 - currentImages.length;
      if (remainingSlots <= 0) return prev;
      const selectedFiles = files.slice(0, remainingSlots);
      bedroomImages[bedroomIndex] = [...currentImages, ...selectedFiles];
      return { ...prev, bedroomImages };
    });
    event.target.value = "";
  };

  const removeImage = (field, index) => {
    setFormData((prev) => {
      const images = [...(prev[field] || [])];
      images.splice(index, 1);
      return { ...prev, [field]: images };
    });
  };

  const removeBedroomImage = (bedroomIndex, imageIndex) => {
    setFormData((prev) => {
      const bedroomImages = [...(prev.bedroomImages || [])];
      if (!bedroomImages[bedroomIndex]) return prev;
      const images = [...bedroomImages[bedroomIndex]];
      images.splice(imageIndex, 1);
      bedroomImages[bedroomIndex] = images;
      return { ...prev, bedroomImages };
    });
  };

  // Split an array into existing URL strings vs new File objects
  const splitImages = (arr) => {
    const list = safeArr(arr);
    return {
      existing: list.filter((item) => typeof item === "string"),
      fresh: list.filter((item) => item instanceof File),
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token =
        localStorage.getItem("ownerToken") || localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found. Please login again.");

      const fd = new FormData();

      fd.append("title", formData.title.trim());
      fd.append("location", formData.location.trim());
      fd.append("price", formData.price);
      fd.append("type", formData.type);
      fd.append("bhk", formData.bhk);
      fd.append("bathrooms", formData.bathrooms);
      fd.append("area", formData.area);
      fd.append("description", formData.description.trim());
      fd.append("furnishing", formData.furnishing);
      fd.append("deposit", formData.securityDeposit || 0);
      fd.append("securityDeposit", formData.securityDeposit || 0);
      fd.append("maintenance", formData.maintenance || 0);
      fd.append("amenities", JSON.stringify(formData.amenities));
      fd.append("idealFor", JSON.stringify(formData.idealFor));

      // Verification text fields
      // fd.append("ownerName", formData.ownerName);
      // fd.append("ownerEmail", formData.ownerEmail);
      // fd.append("ownerPhone", formData.ownerPhone);
      // fd.append("propertyAddress", formData.propertyAddress);
      // fd.append("additionalNotes", formData.additionalNotes);

      // Non-bedroom images: existing URLs as JSON + new files
      const outer = splitImages(formData.outerImages);
      fd.append("existingOuterImages", JSON.stringify(outer.existing));
      outer.fresh.forEach((file) => fd.append("outerImages", file));

      const livingRoom = splitImages(formData.livingRoomImages);
      fd.append("existingLivingRoomImages", JSON.stringify(livingRoom.existing));
      livingRoom.fresh.forEach((file) => fd.append("livingRoomImages", file));

      const bathroom = splitImages(formData.bathroomImages);
      fd.append("existingBathroomImages", JSON.stringify(bathroom.existing));
      bathroom.fresh.forEach((file) => fd.append("bathroomImages", file));

      const balcony = splitImages(formData.balconyImages);
      fd.append("existingBalconyImages", JSON.stringify(balcony.existing));
      balcony.fresh.forEach((file) => fd.append("balconyImages", file));

      const kitchen = splitImages(formData.kitchenImages);
      fd.append("existingKitchenImages", JSON.stringify(kitchen.existing));
      kitchen.fresh.forEach((file) => fd.append("kitchenImages", file));

      // Bedroom images: existing URLs flat + new files per bedroom index
      const allExistingBedroom = [];
      (formData.bedroomImages || []).forEach((files, index) => {
        if (!Array.isArray(files)) return;
        files.forEach((file) => {
          if (file instanceof File) {
            fd.append(`bedroomImages_${index}`, file);
          } else if (typeof file === "string") {
            allExistingBedroom.push(file);
          }
        });
      });
      fd.append("existingBedroomImages", JSON.stringify(allExistingBedroom));

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Failed to update property. Server returned ${response.status}.`
        );
      }

      showNotification("Property updated successfully!", "success");
      setTimeout(() => navigate("/host/my-properties"), 1200);
    } catch (err) {
      console.error("Error updating property:", err);
      showNotification(err?.message || "Failed to update property. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <LoaderCircle className="w-6 h-6 animate-spin" />
          Loading property...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-700">Unable to load property</h2>
          <p className="text-sm text-red-600 mt-2">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/host/my-properties")}
            className="mt-4 px-5 py-2.5 bg-gray-800 text-white rounded-lg"
          >
            Back to My Properties
          </button>
        </div>
      </div>
    );
  }

  if (!formData) return null;

  // ---------- Render helpers ----------
  const renderUploadBox = ({
    id, onChange, icon, text, requiredText, disabled = false,
  }) => (
    <div
      className={`border-2 border-dashed border-gray-300 rounded-xl p-4 text-center max-w-md transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:border-green-500 cursor-pointer"
      }`}
      onClick={() => { if (!disabled) document.getElementById(id)?.click(); }}
    >
      <input
        id={id} type="file" accept="image/*" multiple
        onChange={onChange} disabled={disabled} className="hidden"
      />
      <div className="flex items-center justify-center gap-2">
        {icon}
        <span className="text-sm text-gray-500">{text}</span>
      </div>
      {requiredText && <p className="text-xs text-red-400 mt-1">{requiredText}</p>}
    </div>
  );

  const renderImageGrid = ({
    images, maxImages, onRemove, label, shortLabel, borderClass = "border-gray-200",
  }) => (
    <div className="flex flex-wrap gap-3">
      {images.map((image, index) => (
        <div
          key={`${label}-${index}`}
          className={`relative w-32 h-32 rounded-lg overflow-hidden border-2 ${borderClass} group`}
        >
          <ImagePreview file={image} alt={`${label} ${index + 1}`} />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
            {shortLabel} {index + 1}
          </div>
          {typeof image === "string" && (
            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded">
              Existing
            </div>
          )}
        </div>
      ))}
      {Array.from({ length: Math.max(0, maxImages - images.length) }).map((_, index) => (
        <div
          key={`${label}-empty-${index}`}
          className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
        >
          <span className="text-xs text-gray-400 text-center px-2">
            Slot {images.length + index + 1}
          </span>
        </div>
      ))}
    </div>
  );

  const renderImageSection = ({
    title, images, maxImages, minImages, uploadId, uploadHandler, removeHandler,
    icon, shortLabel, borderClass,
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title}
        <span className="text-gray-400 text-xs ml-2">
          (Min {minImages}, Max {maxImages} images)
        </span>
      </label>
      <div className="space-y-3">
        {images.length < maxImages && renderUploadBox({
          id: uploadId, onChange: uploadHandler, icon,
          text: images.length === 0
            ? `Upload ${maxImages} images for ${title}`
            : `Upload ${maxImages - images.length} more image${maxImages - images.length > 1 ? "s" : ""}`,
          requiredText:
            images.length < minImages
              ? `* Minimum ${minImages} image${minImages > 1 ? "s" : ""} required`
              : null,
        })}
        {renderImageGrid({
          images, maxImages, onRemove: removeHandler, label: title, shortLabel, borderClass,
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 text-white ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
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

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/host/my-properties")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Property</h1>
            <p className="text-sm text-gray-500 mt-1">Update your property details</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Editing
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-green-600" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="title" value={formData.title}
                  onChange={handleInputChange} required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="e.g. Luxury Villa with Garden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text" name="location" value={formData.location}
                    onChange={handleInputChange} required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g. Pune, Maharashtra"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price (per month) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number" name="price" value={formData.price}
                    onChange={handleInputChange} required min="1000"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="25000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type" value={formData.type} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Property Details */}
          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  BHK <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Bed className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    name="bhk" value={formData.bhk} onChange={handleInputChange} required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="">Select BHK</option>
                    {BHK_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Bathrooms <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Bath className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number" name="bathrooms" value={formData.bathrooms}
                    onChange={handleInputChange} min="1" required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Area (sq.ft) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Square className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number" name="area" value={formData.area}
                    onChange={handleInputChange} min="100" required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="1200"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Furnishing & Ideal For */}
          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sofa className="w-5 h-5 text-orange-600" />
              Furnishing & Ideal For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Furnishing Status
                  <span className="text-gray-400 text-xs ml-2">(Optional)</span>
                </label>
                <select
                  name="furnishing" value={formData.furnishing} onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">Select Furnishing</option>
                  {FURNISHING_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ideal For
                  <span className="text-gray-400 text-xs ml-2">(Select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {IDEAL_FOR_OPTIONS.map((o) => (
                    <button
                      key={o} type="button"
                      onClick={() => toggleIdealFor(o)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        formData.idealFor.includes(o)
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Security & Maintenance */}
          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Security & Maintenance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Security Deposit
                  <span className="text-gray-400 text-xs ml-2">(Optional)</span>
                </label>
                <div className="relative">
                  <IndianRupee className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number" name="securityDeposit" value={formData.securityDeposit}
                    onChange={handleInputChange} min="0"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="20000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Maintenance (per month)
                  <span className="text-gray-400 text-xs ml-2">(Optional)</span>
                </label>
                <div className="relative">
                  <Wallet className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number" name="maintenance" value={formData.maintenance}
                    onChange={handleInputChange} min="0"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="2000"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
            <textarea
              name="description" value={formData.description}
              onChange={handleInputChange} rows={5}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
              placeholder="Describe your property in detail..."
            />
          </section>

          {/* Property Images */}
          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              Property Images
            </h2>
            <div className="space-y-8">
              {renderImageSection({
                title: "Outer Images", images: formData.outerImages,
                maxImages: 5, minImages: 3, uploadId: "outer-upload",
                uploadHandler: handleOuterUpload,
                removeHandler: (i) => removeImage("outerImages", i),
                icon: <Upload className="w-5 h-5 text-gray-400" />,
                shortLabel: "Outer", borderClass: "border-green-500",
              })}
              {renderImageSection({
                title: "Living Room Images", images: formData.livingRoomImages,
                maxImages: 2, minImages: 1, uploadId: "livingroom-upload",
                uploadHandler: handleLivingRoomUpload,
                removeHandler: (i) => removeImage("livingRoomImages", i),
                icon: <Sofa className="w-5 h-5 text-gray-400" />,
                shortLabel: "LR",
              })}
              {renderImageSection({
                title: "Bathroom Images", images: formData.bathroomImages,
                maxImages: 2, minImages: 1, uploadId: "bathroom-upload",
                uploadHandler: handleBathroomUpload,
                removeHandler: (i) => removeImage("bathroomImages", i),
                icon: <Bath className="w-5 h-5 text-gray-400" />,
                shortLabel: "Bath", borderClass: "border-cyan-500",
              })}
              {renderImageSection({
                title: "Balcony Images", images: formData.balconyImages,
                maxImages: 2, minImages: 1, uploadId: "balcony-upload",
                uploadHandler: handleBalconyUpload,
                removeHandler: (i) => removeImage("balconyImages", i),
                icon: <Grid3x3 className="w-5 h-5 text-gray-400" />,
                shortLabel: "Balcony", borderClass: "border-blue-500",
              })}
              {renderImageSection({
                title: "Kitchen Images", images: formData.kitchenImages,
                maxImages: 2, minImages: 1, uploadId: "kitchen-upload",
                uploadHandler: handleKitchenUpload,
                removeHandler: (i) => removeImage("kitchenImages", i),
                icon: <ImageIcon className="w-5 h-5 text-gray-400" />,
                shortLabel: "Kitchen", borderClass: "border-yellow-500",
              })}
            </div>
          </section>

          {/* Bedroom Images (per bedroom) */}
          {formData.bhk && Number(formData.bhk) > 0 && (
            <section className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Bedroom Images{" "}
                <span className="text-gray-400 text-xs ml-2">
                  (Min 1, Max 2 per bedroom)
                </span>
              </label>

              {Array.from({ length: Number(formData.bhk) }).map((_, bedroomIndex) => {
                const images = formData.bedroomImages[bedroomIndex] || [];
                const complete = images.length >= 1;

                return (
                  <div
                    key={bedroomIndex}
                    className={`mb-6 p-4 rounded-xl border-2 ${
                      complete
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Bed className="w-4 h-4 text-orange-500" />
                        Bedroom {bedroomIndex + 1}
                        {complete ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </h3>
                      <span
                        className={`text-xs font-medium ${
                          complete ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {images.length}/2
                      </span>
                    </div>

                    {images.length < 2 && renderUploadBox({
                      id: `bedroom-upload-${bedroomIndex}`,
                      onChange: (e) => handleBedroomUpload(e, bedroomIndex),
                      icon: <Upload className="w-5 h-5 text-gray-400" />,
                      text: images.length === 0
                        ? `Upload 1 or 2 images for Bedroom ${bedroomIndex + 1}`
                        : `Upload 1 more image for Bedroom ${bedroomIndex + 1}`,
                      requiredText: images.length === 0 ? "* Minimum 1 image required" : null,
                    })}

                    <div className="flex flex-wrap gap-3 mt-3">
                      {images.map((image, imageIndex) => (
                        <div
                          key={imageIndex}
                          className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-orange-500 group"
                        >
                          <ImagePreview file={image} alt={`Bedroom ${bedroomIndex + 1}`} />
                          <button
                            type="button"
                            onClick={() => removeBedroomImage(bedroomIndex, imageIndex)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                            BR {bedroomIndex + 1} - {imageIndex + 1}
                          </div>
                          {typeof image === "string" && (
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded">
                              Existing
                            </div>
                          )}
                        </div>
                      ))}
                      {Array.from({ length: 2 - images.length }).map((_, index) => (
                        <div
                          key={index}
                          className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50"
                        >
                          <span className="text-xs text-gray-400">
                            Slot {images.length + index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* Verification Details (text only — documents already uploaded) */}
          {/* <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Verification Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Owner Name
                </label>
                <input
                  type="text" name="ownerName" value={formData.ownerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Owner Email
                </label>
                <input
                  type="email" name="ownerEmail" value={formData.ownerEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Owner Phone
                </label>
                <input
                  type="text" name="ownerPhone" value={formData.ownerPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Property Address
                </label>
                <input
                  type="text" name="propertyAddress" value={formData.propertyAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes" rows={3} value={formData.additionalNotes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
                />
              </div>
            </div>
          </section> */}

          {/* Amenities */}
          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_AMENITIES.map((amenity) => (
                <button
                  key={amenity} type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.amenities.includes(amenity)
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
            {formData.amenities.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Selected: {formData.amenities.length} amenities
              </p>
            )}
          </section>

          {/* Submit buttons */}
          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="submit" disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Update Property
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/host/my-properties")}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;