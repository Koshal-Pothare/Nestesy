import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
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
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
 
// import PropertyVerification from "./PropertyVerification";

const AVAILABLE_AMENITIES = [
  "Parking",
  "Pool",
  "Gym",
  "Garden",
  "Security",
  "Lift",
  "Power Backup",
  "Terrace",
  "Balcony",
  "Furnished",
  "AC",
  "WiFi",
  "Pet Friendly",
  "Playground",
  "CCTV",
];

const BHK_OPTIONS = [
  { value: "1", label: "1 BHK" },
  { value: "2", label: "2 BHK" },
  { value: "3", label: "3 BHK" },
  { value: "4", label: "4 BHK" },
  { value: "5", label: "5 BHK" },
];

const FURNISHING_OPTIONS = [
  "Fully Furnished",
  "Semi Furnished",
  "Unfurnished",
];

const IDEAL_FOR_OPTIONS = [
  "Students",
  "Working Professionals",
  "Families",
  "Couples",
];

const PROPERTY_TYPES = [
  "Apartment",
  "Flat",
  "Penthouse",
  "House",
  "Studio",
  "Duplex",
  "Farmhouse",
];

const createInitialFormData = () => ({
  title: "",
  location: "",
  price: "",
  type: "Apartment",
  bhk: "",
  bathrooms: "",
  area: "",
  furnishing: "",
  idealFor: [],
  securityDeposit: "",
  maintenance: "",
  description: "",
  amenities: [],
  outerImages: [],
  livingRoomImages: [],
  bathroomImages: [],
  balconyImages: [],
  kitchenImages: [],
  bedroomImages: [], 


  // ownerName: "",
  // ownerEmail: "",
  // ownerPhone: "",
  // propertyAddress: "",
  // verificationDocs: {},
  // additionalNotes: "",
});

const ImagePreview = ({ file, alt = "Property preview" }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!file) {
      setSrc("");
      return undefined;
    }

    if (typeof file === "string") {
      setSrc(file);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setSrc(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <ImageIcon className="w-8 h-8 text-gray-300" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
    />
  );
};

const AddProperty = () => {
  const navigate = useNavigate();

  //   Verification ref 
  // const verificationRef = useRef(null);

  const [formData, setFormData] = useState(createInitialFormData);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = useCallback(
    (message, type = "success") => {
      setNotification({
        message,
        type,
      });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    },
    []
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      if (name === "bhk") {
        updated.bedroomImages = [];
      }

      return updated;
    });
  };

  const toggleAmenity = (amenity) => {
    setFormData((previous) => ({
      ...previous,
      amenities: previous.amenities.includes(amenity)
        ? previous.amenities.filter((item) => item !== amenity)
        : [...previous.amenities, amenity],
    }));
  };

  const toggleIdealFor = (value) => {
    setFormData((previous) => ({
      ...previous,
      idealFor: previous.idealFor.includes(value)
        ? previous.idealFor.filter((item) => item !== value)
        : [...previous.idealFor, value],
    }));
  };

  const addImages = (field, files, maxImages) => {
    const selectedFiles = Array.from(files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (selectedFiles.length === 0) {
      return;
    }

    setFormData((previous) => {
      const currentImages = previous[field] || [];
      const remainingSlots = maxImages - currentImages.length;

      if (remainingSlots <= 0) {
        return previous;
      }

      const selected = selectedFiles.slice(0, remainingSlots);

      return {
        ...previous,
        [field]: [...currentImages, ...selected],
      };
    });
  };

  const handleOuterUpload = (event) => {
    addImages("outerImages", event.target.files, 5);
    event.target.value = "";
  };

  const handleLivingRoomUpload = (event) => {
    addImages("livingRoomImages", event.target.files, 2);
    event.target.value = "";
  };

  const handleBathroomUpload = (event) => {
    addImages("bathroomImages", event.target.files, 2);
    event.target.value = "";
  };

  const handleBalconyUpload = (event) => {
    addImages("balconyImages", event.target.files, 2);
    event.target.value = "";
  };

  const handleKitchenUpload = (event) => {
    addImages("kitchenImages", event.target.files, 2);
    event.target.value = "";
  };

  const handleBedroomUpload = (event, bedroomIndex) => {
    const files = Array.from(event.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (files.length === 0) {
      return;
    }

    setFormData((previous) => {
      const bedroomImages = [...previous.bedroomImages];
      const currentImages = bedroomImages[bedroomIndex] || [];
      const remainingSlots = 2 - currentImages.length;

      if (remainingSlots <= 0) {
        return previous;
      }

      const selectedFiles = files.slice(0, remainingSlots);

      bedroomImages[bedroomIndex] = [
        ...currentImages,
        ...selectedFiles,
      ];

      return {
        ...previous,
        bedroomImages,
      };
    });

    event.target.value = "";
  };

  const removeImage = (field, index) => {
    setFormData((previous) => {
      const images = [...(previous[field] || [])];

      images.splice(index, 1);

      return {
        ...previous,
        [field]: images,
      };
    });
  };

  const removeBedroomImage = (bedroomIndex, imageIndex) => {
    setFormData((previous) => {
      const bedroomImages = [...previous.bedroomImages];

      if (!bedroomImages[bedroomIndex]) {
        return previous;
      }

      const images = [...bedroomImages[bedroomIndex]];

      images.splice(imageIndex, 1);

      bedroomImages[bedroomIndex] = images;

      return {
        ...previous,
        bedroomImages,
      };
    });
  };

  const validateBasicFields = () => {
    const requiredFields = [
      "title",
      "location",
      "price",
      "bhk",
      "bathrooms",
      "area",
    ];

    const hasEmptyField = requiredFields.some(
      (field) => !String(formData[field] ?? "").trim()
    );

    if (hasEmptyField) {
      showNotification(
        "Please fill in all required fields.",
        "error"
      );

      return false;
    }

    const price = Number(formData.price);
    const bathrooms = Number(formData.bathrooms);
    const area = Number(formData.area);

    if (!Number.isFinite(price) || price < 1000) {
      showNotification(
        "Price must be at least ₹1,000.",
        "error"
      );

      return false;
    }

    if (!Number.isFinite(bathrooms) || bathrooms < 1) {
      showNotification(
        "At least 1 bathroom is required.",
        "error"
      );

      return false;
    }

    if (!Number.isFinite(area) || area < 100) {
      showNotification(
        "Area must be at least 100 sq.ft.",
        "error"
      );

      return false;
    }

    return true;
  };

  const validateImages = () => {
    if (formData.outerImages.length < 3) {
      showNotification(
        "Please upload at least 3 outer images.",
        "error"
      );

      return false;
    }

    if (formData.livingRoomImages.length < 1) {
      showNotification(
        "Please upload at least 1 living room image.",
        "error"
      );

      return false;
    }

    if (formData.bathroomImages.length < 1) {
      showNotification(
        "Please upload at least 1 bathroom image.",
        "error"
      );

      return false;
    }

    if (formData.balconyImages.length < 1) {
      showNotification(
        "Please upload at least 1 balcony image.",
        "error"
      );

      return false;
    }

    if (formData.kitchenImages.length < 1) {
      showNotification(
        "Please upload at least 1 kitchen image.",
        "error"
      );

      return false;
    }

    const bhkCount = Number(formData.bhk);

    for (let index = 0; index < bhkCount; index += 1) {
      const images = formData.bedroomImages[index] || [];

      if (images.length < 1) {
        showNotification(
          `Please upload at least 1 image for Bedroom ${
            index + 1
          }.`,
          "error"
        );

        return false;
      }

      if (images.length > 2) {
        showNotification(
          `Maximum 2 images are allowed for Bedroom ${
            index + 1
          }.`,
          "error"
        );

        return false;
      }
    }

    return true;
  };

  //  Verification validation
  /*
  const validateVerification = () => {
    if (
      verificationRef.current &&
      typeof verificationRef.current.validate === "function"
    ) {
      return verificationRef.current.validate();
    }

    return true;
  };
  */

  const appendValue = (target, key, value) => {
    if (value !== undefined && value !== null) {
      target.append(key, String(value));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (!validateBasicFields()) {
        return;
      }

      if (!validateImages()) {
        return;
      }

      //  Verification validation
      /*
      if (!validateVerification()) {
        showNotification(
          "Please complete all verification fields.",
          "error"
        );

        return;
      }
      */

      const formDataToSend = new FormData();

      appendValue(formDataToSend, "title", formData.title.trim());
      appendValue(
        formDataToSend,
        "location",
        formData.location.trim()
      );
      appendValue(formDataToSend, "price", formData.price);
      appendValue(formDataToSend, "type", formData.type);
      appendValue(formDataToSend, "bhk", formData.bhk);
      appendValue(
        formDataToSend,
        "bathrooms",
        formData.bathrooms
      );
      appendValue(formDataToSend, "area", formData.area);
      appendValue(
        formDataToSend,
        "description",
        formData.description.trim()
      );
      appendValue(
        formDataToSend,
        "furnishing",
        formData.furnishing
      );
      appendValue(
        formDataToSend,
        "deposit",
        formData.securityDeposit || 0
      );
      appendValue(
        formDataToSend,
        "securityDeposit",
        formData.securityDeposit || 0
      );
      appendValue(
        formDataToSend,
        "maintenance",
        formData.maintenance || 0
      );

      formDataToSend.append(
        "amenities",
        JSON.stringify(formData.amenities)
      );

      formDataToSend.append(
        "idealFor",
        JSON.stringify(formData.idealFor)
      );

      //  Verification fields
      /*
      appendValue(
        formDataToSend,
        "ownerName",
        formData.ownerName
      );

      appendValue(
        formDataToSend,
        "ownerEmail",
        formData.ownerEmail
      );

      appendValue(
        formDataToSend,
        "ownerPhone",
        formData.ownerPhone
      );

      appendValue(
        formDataToSend,
        "propertyAddress",
        formData.propertyAddress
      );

      appendValue(
        formDataToSend,
        "additionalNotes",
        formData.additionalNotes
      );

      if (
        formData.verificationDocs &&
        Object.keys(formData.verificationDocs).length > 0
      ) {
        formDataToSend.append(
          "verificationDocs",
          JSON.stringify(formData.verificationDocs)
        );
      }
      */

      formData.outerImages.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("outerImages", file);
        }
      });

      formData.livingRoomImages.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("livingRoomImages", file);
        }
      });

      formData.bathroomImages.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("bathroomImages", file);
        }
      });

      formData.balconyImages.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("balconyImages", file);
        }
      });

      formData.kitchenImages.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("kitchenImages", file);
        }
      });

      formData.bedroomImages.forEach((files, index) => {
        if (!Array.isArray(files)) {
          return;
        }

        files.forEach((file) => {
          if (file instanceof File) {
            formDataToSend.append(
              `bedroomImages_${index}`,
              file
            );
          }
        });
      });

      const token =
        localStorage.getItem("ownerToken") ||
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Owner authentication token not found. Please login again."
        );
      }

      // Using the public properties endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/properties`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Failed to submit property. Server returned ${response.status}.`
        );
      }

      showNotification(
        "Property listed successfully!",
        "success"
      );

      setTimeout(() => {
        resetForm();
        navigate("/explore");
      }, 1200);
    } catch (error) {
      console.error("Error submitting property:", error);

      showNotification(
        error?.message ||
          "Failed to list property. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(createInitialFormData());
  };

  const renderUploadBox = ({
    id,
    onChange,
    icon,
    text,
    requiredText,
    disabled = false,
  }) => (
    <div
      className={`border-2 border-dashed border-gray-300 rounded-xl p-4 text-center max-w-md transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:border-green-500 cursor-pointer"
      }`}
      onClick={() => {
        if (!disabled) {
          document.getElementById(id)?.click();
        }
      }}
    >
      <input
        id={id}
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        disabled={disabled}
        className="hidden"
      />

      <div className="flex items-center justify-center gap-2">
        {icon}

        <span className="text-sm text-gray-500">
          {text}
        </span>
      </div>

      {requiredText && (
        <p className="text-xs text-red-400 mt-1">
          {requiredText}
        </p>
      )}
    </div>
  );

  const renderImageGrid = ({
    images,
    maxImages,
    onRemove,
    label,
    shortLabel,
    borderClass = "border-gray-200",
  }) => (
    <div className="flex flex-wrap gap-3">
      {images.map((image, index) => (
        <div
          key={`${label}-${index}`}
          className={`relative w-32 h-32 rounded-lg overflow-hidden border-2 ${borderClass} group`}
        >
          <ImagePreview
            file={image}
            alt={`${label} ${index + 1}`}
          />

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

          {index === 0 && (
            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">
              Required
            </div>
          )}
        </div>
      ))}

      {Array.from({
        length: Math.max(0, maxImages - images.length),
      }).map((_, index) => (
        <div
          key={`${label}-empty-${index}`}
          className="w-32 h-32 rounded-lg border-2 border-dashed border-red-300 flex items-center justify-center bg-red-50"
        >
          <span className="text-xs text-red-400 text-center px-2">
            Slot {images.length + index + 1}
          </span>
        </div>
      ))}
    </div>
  );

  const renderImageSection = ({
    title,
    images,
    maxImages,
    minImages,
    uploadId,
    uploadHandler,
    removeHandler,
    icon,
    shortLabel,
    borderClass,
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title} <span className="text-red-500">*</span>

        <span className="text-gray-400 text-xs ml-2">
          (Min {minImages}, Max {maxImages} images)
        </span>
      </label>

      <div className="space-y-3">
        {images.length < maxImages &&
          renderUploadBox({
            id: uploadId,
            onChange: uploadHandler,
            icon,
            text:
              images.length === 0
                ? `Upload ${maxImages} images for ${title}`
                : `Upload ${
                    maxImages - images.length
                  } more image${
                    maxImages - images.length > 1
                      ? "s"
                      : ""
                  }`,
            requiredText:
              images.length < minImages
                ? `* Minimum ${minImages} image${
                    minImages > 1 ? "s" : ""
                  } required`
                : null,
          })}

        {renderImageGrid({
          images,
          maxImages,
          onRemove: removeHandler,
          label: title,
          shortLabel,
          borderClass,
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
              notification.type === "success"
                ? "bg-green-500"
                : notification.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}

            <span className="font-medium">
              {notification.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              navigate("/host/my-properties")
            }
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Add New Property
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Fill in the details to list your property
            </p>
          </div>
        </div>

        {/*  Verification badge */}
        {/*
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Verification Required
        </span>
        */}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-green-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Property Title{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="e.g. Luxury Villa with Garden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Location{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="e.g. Pune, Maharashtra"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price (per month){" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <IndianRupee className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="1000"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="25000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Property Type{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Property Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  BHK{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Bed className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <select
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="">
                      Select BHK
                    </option>

                    {BHK_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Bathrooms{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Bath className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Area (sq.ft){" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Square className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    min="100"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="1200"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sofa className="w-5 h-5 text-orange-600" />
              Furnishing & Ideal For
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Furnishing Status
                  <span className="text-gray-400 text-xs ml-2">
                    (Optional)
                  </span>
                </label>

                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">
                    Select Furnishing
                  </option>

                  {FURNISHING_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ideal For
                  <span className="text-gray-400 text-xs ml-2">
                    (Select all that apply)
                  </span>
                </label>

                <div className="flex flex-wrap gap-2">
                  {IDEAL_FOR_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        toggleIdealFor(option)
                      }
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        formData.idealFor.includes(option)
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Security & Maintenance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Security Deposit
                  <span className="text-gray-400 text-xs ml-2">
                    (Optional)
                  </span>
                </label>

                <div className="relative">
                  <IndianRupee className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="20000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Maintenance (per month)
                  <span className="text-gray-400 text-xs ml-2">
                    (Optional)
                  </span>
                </label>

                <div className="relative">
                  <Wallet className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="number"
                    name="maintenance"
                    value={formData.maintenance}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="2000"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Description
            </h2>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
              placeholder="Describe your property in detail..."
            />
          </section>

          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              Property Images
            </h2>

            <div className="space-y-8">
              {renderImageSection({
                title: "Outer Images",
                images: formData.outerImages,
                maxImages: 5,
                minImages: 3,
                uploadId: "outer-upload",
                uploadHandler: handleOuterUpload,
                removeHandler: (index) =>
                  removeImage("outerImages", index),
                icon: (
                  <Upload className="w-5 h-5 text-gray-400" />
                ),
                shortLabel: "Outer",
                borderClass: "border-green-500",
              })}

              {renderImageSection({
                title: "Living Room Images",
                images: formData.livingRoomImages,
                maxImages: 2,
                minImages: 1,
                uploadId: "livingroom-upload",
                uploadHandler: handleLivingRoomUpload,
                removeHandler: (index) =>
                  removeImage(
                    "livingRoomImages",
                    index
                  ),
                icon: (
                  <Sofa className="w-5 h-5 text-gray-400" />
                ),
                shortLabel: "LR",
              })}

              {renderImageSection({
                title: "Bathroom Images",
                images: formData.bathroomImages,
                maxImages: 2,
                minImages: 1,
                uploadId: "bathroom-upload",
                uploadHandler: handleBathroomUpload,
                removeHandler: (index) =>
                  removeImage(
                    "bathroomImages",
                    index
                  ),
                icon: (
                  <Bath className="w-5 h-5 text-gray-400" />
                ),
                shortLabel: "Bath",
                borderClass: "border-cyan-500",
              })}

              {renderImageSection({
                title: "Balcony Images",
                images: formData.balconyImages,
                maxImages: 2,
                minImages: 1,
                uploadId: "balcony-upload",
                uploadHandler: handleBalconyUpload,
                removeHandler: (index) =>
                  removeImage(
                    "balconyImages",
                    index                  ),
                icon: (
                  <Grid3x3 className="w-5 h-5 text-gray-400" />
                ),
                shortLabel: "Balcony",
                borderClass: "border-blue-500",
              })}

              {renderImageSection({
                title: "Kitchen Images",
                images: formData.kitchenImages,
                maxImages: 2,
                minImages: 1,
                uploadId: "kitchen-upload",
                uploadHandler: handleKitchenUpload,
                removeHandler: (index) =>
                  removeImage(
                    "kitchenImages",
                    index
                  ),
                icon: (
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                ),
                shortLabel: "Kitchen",
                borderClass: "border-yellow-500",
              })}

              {formData.bhk && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Bedroom Images{" "}
                    <span className="text-red-500">*</span>

                    <span className="text-gray-400 text-xs ml-2">
                      (Min 1, Max 2 per bedroom)
                    </span>
                  </label>

                  {Array.from({
                    length: Number(formData.bhk),
                  }).map((_, bedroomIndex) => {
                    const images =
                      formData.bedroomImages[
                        bedroomIndex
                      ] || [];

                    const complete =
                      images.length >= 1;

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
                              complete
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {images.length}/2
                          </span>
                        </div>

                        {images.length < 2 &&
                          renderUploadBox({
                            id: `bedroom-upload-${bedroomIndex}`,
                            onChange: (event) =>
                              handleBedroomUpload(
                                event,
                                bedroomIndex
                              ),
                            icon: (
                              <Upload className="w-5 h-5 text-gray-400" />
                            ),
                            text:
                              images.length === 0
                                ? `Upload 1 or 2 images for Bedroom ${
                                    bedroomIndex + 1
                                  }`
                                : `Upload 1 more image for Bedroom ${
                                    bedroomIndex + 1
                                  }`,
                            requiredText:
                              images.length === 0
                                ? "* Minimum 1 image required"
                                : null,
                          })}

                        <div className="flex flex-wrap gap-3 mt-3">
                          {images.map(
                            (image, imageIndex) => (
                              <div
                                key={imageIndex}
                                className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-orange-500 group"
                              >
                                <ImagePreview
                                  file={image}
                                  alt={`Bedroom ${
                                    bedroomIndex + 1
                                  }`}
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeBedroomImage(
                                      bedroomIndex,
                                      imageIndex
                                    )
                                  }
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100"
                                >
                                  <X className="w-3 h-3" />
                                </button>

                                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                                  BR {bedroomIndex + 1} -{" "}
                                  {imageIndex + 1}
                                </div>

                                {imageIndex === 0 && (
                                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">
                                    Required
                                  </div>
                                )}
                              </div>
                            )
                          )}

                          {Array.from({
                            length: 2 - images.length,
                          }).map((_, index) => (
                            <div
                              key={index}
                              className="w-32 h-32 rounded-lg border-2 border-dashed border-red-300 flex items-center justify-center bg-red-50"
                            >
                              <span className="text-xs text-red-400">
                                Slot{" "}
                                {images.length +
                                  index +
                                  1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
              <span>
                Outer: {formData.outerImages.length}/5
              </span>

              <span>
                Living Room:{" "}
                {formData.livingRoomImages.length}/2
              </span>

              <span>
                Bathroom:{" "}
                {formData.bathroomImages.length}/2
              </span>

              <span>
                Balcony:{" "}
                {formData.balconyImages.length}/2
              </span>

              <span>
                Kitchen:{" "}
                {formData.kitchenImages.length}/2
              </span>
            </div>
          </section>

          {/* COMMENTED OUT: PropertyVerification component */}
          {/* <PropertyVerification
            ref={verificationRef}
            formData={formData}
            setFormData={setFormData}
          /> */}

          <section className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Amenities
            </h2>

            <div className="flex flex-wrap gap-2">
              {AVAILABLE_AMENITIES.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() =>
                    toggleAmenity(amenity)
                  }
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
                Selected: {formData.amenities.length}{" "}
                amenities
              </p>
            )}
          </section>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Listing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  List Now
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50"
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/host/my-properties")
              }
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

export default AddProperty;