import React, { useState, useRef } from 'react';
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
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropertyVerification from './PropertyVerification';

const AddProperty = () => {
  const navigate = useNavigate();
  const verificationRef = useRef(null);

  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableAmenities = [
    'Parking',
    'Pool',
    'Gym',
    'Garden',
    'Security',
    'Lift',
    'Power Backup',
    'Terrace',
    'Balcony',
    'Furnished',
    'AC',
    'WiFi',
    'Pet Friendly',
    'Playground',
    'CCTV'
  ];

  const bhkOptions = [
    { value: '1', label: '1 BHK' },
    { value: '2', label: '2 BHK' },
    { value: '3', label: '3 BHK' },
    { value: '4', label: '4 BHK' },
    { value: '5', label: '5 BHK' }
  ];

  const propertyTypes = [
    'Apartment',
    'Flat',
    'Penthouse',
    'House',
    'Studio',
    'Duplex',
    'Farmhouse'
  ];

  const initialFormData = {
    title: '',
    location: '',
    price: '',
    type: 'Apartment',
    bhk: '',
    bathrooms: '',
    area: '',
    description: '',
    amenities: [],
    outerImages: [],
    livingRoomImages: [],
    bathroomImages: [],
    balconyImages: [],
    kitchenImages: [],
    bedroomImages: [],
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    propertyAddress: '',
    verificationDocs: {},
    additionalNotes: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value
      };

      if (name === 'bhk') {
        updated.bedroomImages = [];
      }

      return updated;
    });
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const createImageUrls = (files) => {
    return files
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => URL.createObjectURL(file));
  };

  const handleImageUpload = (
    e,
    field,
    maxImages
  ) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    setFormData((prev) => {
      const currentImages = prev[field] || [];
      const remainingSlots = maxImages - currentImages.length;

      if (remainingSlots <= 0) {
        return prev;
      }

      const selectedFiles = files.slice(0, remainingSlots);
      const imageUrls = createImageUrls(selectedFiles);

      return {
        ...prev,
        [field]: [...currentImages, ...imageUrls]
      };
    });

    e.target.value = '';
  };

  const handleOuterUpload = (e) => {
    handleImageUpload(e, 'outerImages', 5);
  };

  const handleLivingRoomUpload = (e) => {
    handleImageUpload(e, 'livingRoomImages', 2);
  };

  const handleBathroomUpload = (e) => {
    handleImageUpload(e, 'bathroomImages', 2);
  };

  const handleBalconyUpload = (e) => {
    handleImageUpload(e, 'balconyImages', 2);
  };

  const handleKitchenUpload = (e) => {
    handleImageUpload(e, 'kitchenImages', 2);
  };

  const handleBedroomUpload = (e, bedroomIndex) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    setFormData((prev) => {
      const updatedBedroomImages = [...prev.bedroomImages];

      const currentImages =
        updatedBedroomImages[bedroomIndex] || [];

      const remainingSlots = 2 - currentImages.length;

      if (remainingSlots <= 0) {
        return prev;
      }

      const selectedFiles = files.slice(0, remainingSlots);
      const imageUrls = createImageUrls(selectedFiles);

      updatedBedroomImages[bedroomIndex] = [
        ...currentImages,
        ...imageUrls
      ];

      return {
        ...prev,
        bedroomImages: updatedBedroomImages
      };
    });

    e.target.value = '';
  };

  const revokeImageUrl = (url) => {
    if (
      typeof url === 'string' &&
      url.startsWith('blob:')
    ) {
      URL.revokeObjectURL(url);
    }
  };

  const removeImage = (field, index) => {
    setFormData((prev) => {
      const images = [...prev[field]];

      const removedImage = images[index];

      revokeImageUrl(removedImage);

      images.splice(index, 1);

      return {
        ...prev,
        [field]: images
      };
    });
  };

  const removeOuterImage = (index) => {
    removeImage('outerImages', index);
  };

  const removeLivingRoomImage = (index) => {
    removeImage('livingRoomImages', index);
  };

  const removeBathroomImage = (index) => {
    removeImage('bathroomImages', index);
  };

  const removeBalconyImage = (index) => {
    removeImage('balconyImages', index);
  };

  const removeKitchenImage = (index) => {
    removeImage('kitchenImages', index);
  };

  const removeBedroomImage = (
    bedroomIndex,
    imageIndex
  ) => {
    setFormData((prev) => {
      const updatedBedroomImages = [...prev.bedroomImages];

      if (!updatedBedroomImages[bedroomIndex]) {
        return prev;
      }

      const images = [
        ...updatedBedroomImages[bedroomIndex]
      ];

      const removedImage = images[imageIndex];

      revokeImageUrl(removedImage);

      images.splice(imageIndex, 1);

      updatedBedroomImages[bedroomIndex] =
        images;

      return {
        ...prev,
        bedroomImages: updatedBedroomImages
      };
    });
  };

  const validateImages = () => {
    if (formData.outerImages.length < 3) {
      showNotification(
        'Please upload at least 3 outer images',
        'error'
      );
      return false;
    }

    if (formData.outerImages.length > 5) {
      showNotification(
        'Maximum 5 outer images are allowed',
        'error'
      );
      return false;
    }

    if (formData.livingRoomImages.length < 1) {
      showNotification(
        'Please upload at least one living room image',
        'error'
      );
      return false;
    }

    if (formData.bathroomImages.length < 1) {
      showNotification(
        'Please upload at least one bathroom image',
        'error'
      );
      return false;
    }

    if (formData.balconyImages.length < 1) {
      showNotification(
        'Please upload at least one balcony image',
        'error'
      );
      return false;
    }

    if (formData.kitchenImages.length < 1) {
      showNotification(
        'Please upload at least one kitchen image',
        'error'
      );
      return false;
    }

    const bhkCount = Number(formData.bhk);

    for (let i = 0; i < bhkCount; i++) {
      const bedroomImages =
        formData.bedroomImages[i] || [];

      if (bedroomImages.length < 1) {
        showNotification(
          `Please upload at least 1 image for Bedroom ${i + 1}`,
          'error'
        );
        return false;
      }

      if (bedroomImages.length > 2) {
        showNotification(
          `Maximum 2 images allowed for Bedroom ${i + 1}`,
          'error'
        );
        return false;
      }
    }

    return true;
  };

  const validateBasicFields = () => {
    const requiredFields = [
      'title',
      'location',
      'price',
      'bhk',
      'bathrooms',
      'area'
    ];

    const hasEmptyField = requiredFields.some(
      (field) =>
        !String(formData[field] || '').trim()
    );

    if (hasEmptyField) {
      showNotification(
        'Please fill in all required fields',
        'error'
      );
      return false;
    }

    if (Number(formData.price) < 1000) {
      showNotification(
        'Price must be at least ₹1,000',
        'error'
      );
      return false;
    }

    if (Number(formData.bathrooms) < 1) {
      showNotification(
        'At least 1 bathroom is required',
        'error'
      );
      return false;
    }

    if (Number(formData.area) < 100) {
      showNotification(
        'Area must be at least 100 sq.ft',
        'error'
      );
      return false;
    }

    return true;
  };

  const validateVerification = () => {
    if (
      verificationRef.current &&
      typeof verificationRef.current.validate === 'function'
    ) {
      return verificationRef.current.validate();
    }

    return true;
  };

  const getStoredProperties = () => {
    try {
      const storedProperties =
        localStorage.getItem('hostProperties');

      if (!storedProperties) {
        return [];
      }

      const parsed =
        JSON.parse(storedProperties);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.error(
        'Error reading hostProperties:',
        error
      );

      return [];
    }
  };

  const saveProperty = (newProperty) => {
    const existingProperties =
      getStoredProperties();

    const updatedProperties = [
      newProperty,
      ...existingProperties
    ];

    localStorage.setItem(
      'hostProperties',
      JSON.stringify(updatedProperties)
    );

    window.dispatchEvent(
      new CustomEvent('propertyAdded', {
        detail: newProperty
      })
    );

    window.dispatchEvent(
      new Event('hostPropertiesUpdated')
    );

    return updatedProperties;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      const verificationValid =
        validateVerification();

      if (!verificationValid) {
        showNotification(
          'Please complete all verification fields',
          'error'
        );
        return;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );

      const allImages = [
        ...formData.outerImages,
        ...formData.livingRoomImages,
        ...formData.bathroomImages,
        ...formData.balconyImages,
        ...formData.kitchenImages,
        ...formData.bedroomImages
          .filter(Array.isArray)
          .flat()
      ].filter(Boolean);

      const newProperty = {
        id: Date.now(),
        title: formData.title.trim(),
        location: formData.location.trim(),
        price: Number(formData.price),
        type: formData.type,
        bedrooms: Number(formData.bhk),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        status: 'Pending',
        images: allImages,
        outerImages: formData.outerImages,
        livingRoomImages:
          formData.livingRoomImages,
        bathroomImages:
          formData.bathroomImages,
        balconyImages:
          formData.balconyImages,
        kitchenImages:
          formData.kitchenImages,
        bedroomImages:
          formData.bedroomImages,
        listedDate:
          new Date()
            .toISOString()
            .split('T')[0],
        inquiries: 0,
        amenities: formData.amenities,
        description:
          formData.description.trim(),
        verification: {
          ownerName:
            formData.ownerName,
          ownerEmail:
            formData.ownerEmail,
          ownerPhone:
            formData.ownerPhone,
          propertyAddress:
            formData.propertyAddress,
          documents:
            formData.verificationDocs,
          additionalNotes:
            formData.additionalNotes,
          verified: false,
          status: 'pending',
          submittedAt:
            new Date().toISOString()
        }
      };

      saveProperty(newProperty);

      console.log(
        'Property submitted for verification:',
        newProperty
      );

      showNotification(
        'Property submitted for verification successfully!',
        'success'
      );

      setTimeout(() => {
        resetForm();
        navigate('/host/my-properties');
      }, 1200);
    } catch (error) {
      console.error(
        'Error submitting property:',
        error
      );

      showNotification(
        'Failed to save property. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    Object.values(formData).forEach((value) => {
      if (Array.isArray(value)) {
        if (
          value.every(
            (item) => typeof item === 'string'
          )
        ) {
          value.forEach(revokeImageUrl);
        }

        if (
          value.some(Array.isArray)
        ) {
          value
            .filter(Array.isArray)
            .flat()
            .forEach(revokeImageUrl);
        }
      }
    });

    setFormData({
      ...initialFormData,
      amenities: [],
      outerImages: [],
      livingRoomImages: [],
      bathroomImages: [],
      balconyImages: [],
      kitchenImages: [],
      bedroomImages: [],
      verificationDocs: {}
    });
  };

  const renderUploadBox = ({
    id,
    onChange,
    icon,
    text,
    requiredText,
    disabled
  }) => {
    return (
      <div
        className={`border-2 border-dashed border-gray-300 rounded-xl p-4 text-center transition-colors max-w-md ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:border-green-500 cursor-pointer'
        }`}
        onClick={() => {
          if (!disabled) {
            document
              .getElementById(id)
              ?.click();
          }
        }}
      >
        <input
          type="file"
          id={id}
          onChange={onChange}
          multiple
          accept="image/*"
          className="hidden"
          disabled={disabled}
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
  };

  const renderImageGrid = ({
    images,
    maxImages,
    onRemove,
    label,
    shortLabel,
    borderClass = 'border-gray-200'
  }) => {
    return (
      <div className="flex flex-wrap gap-3">
        {images.map((image, index) => (
          <div
            key={`${label}-${index}`}
            className={`relative w-32 h-32 rounded-lg overflow-hidden border-2 ${borderClass} group`}
          >
            <img
              src={image}
              alt={`${label} ${index + 1}`}
              className="w-full h-full object-cover"
            />

            <button
              type="button"
              onClick={() =>
                onRemove(index)
              }
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
          length: Math.max(
            0,
            maxImages - images.length
          )
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
  };

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
    borderClass
  }) => {
    const remaining =
      maxImages - images.length;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {title}{' '}
          <span className="text-red-500">
            *
          </span>
          <span className="text-gray-400 text-xs ml-2">
            (Min {minImages}, Max {maxImages}{' '}
            images)
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
                  ? `Upload ${remaining} image${
                      remaining > 1
                        ? 's'
                        : ''
                    } for ${title}`
                  : `Upload 1 more image for ${title}`,
              requiredText:
                images.length < minImages
                  ? `* Minimum ${minImages} image${
                      minImages > 1
                        ? 's'
                        : ''
                    } required`
                  : null,
              disabled:
                images.length >= maxImages
            })}

          {renderImageGrid({
            images,
            maxImages,
            onRemove: removeHandler,
            label: title,
            shortLabel,
            borderClass
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{
              opacity: 0,
              y: -50
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -50
            }}
            className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 ${
              notification.type === 'success'
                ? 'bg-green-500'
                : notification.type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
            } text-white`}
          >
            {notification.type === 'success' ? (
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
              navigate('/host/my-properties')
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

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Verification Required
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-green-600" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Property Title{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="e.g., Luxury Villa with Garden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Location{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="e.g., Pune, Maharashtra"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price (per month){' '}
                  <span className="text-red-500">
                    *
                  </span>
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
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="e.g., 65000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Property Type{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                >
                  {propertyTypes.map(
                    (type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Property Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  BHK{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <Bed className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <select
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all appearance-none"
                  >
                    <option value="">
                      Select BHK
                    </option>

                    {bhkOptions.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Bathrooms{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <Bath className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="e.g., 4"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Area (sq.ft){' '}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <Square className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                    min="100"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="e.g., 2200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Description
            </h2>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
              placeholder="Describe your property in detail..."
            />
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-600" />
              Property Images
            </h2>

            <div className="space-y-6">
              {renderImageSection({
                title: 'Outer Images',
                images: formData.outerImages,
                maxImages: 5,
                minImages: 3,
                uploadId: 'outer-upload',
                uploadHandler:
                  handleOuterUpload,
                removeHandler:
                  removeOuterImage,
                icon: (
                  <Upload className="w-5 h-5 text-gray-400" />
                ),
                shortLabel: 'Outer',
                borderClass:
                  'border-green-500'
              })}

              {renderImageSection({
                title: 'Living Room Images',
                images:
                  formData.livingRoomImages,
                maxImages: 2,
                minImages: 1,
                uploadId:
                  'livingroom-upload',
                uploadHandler:
                  handleLivingRoomUpload,
                removeHandler:
                  removeLivingRoomImage,
                icon: (
                  <Sofa className="w-5 h-5 text-gray-400" />
                ),
                shortLabel: 'LR',
                borderClass:
                  'border-gray-200'
              })}

              {renderImageSection({
                title: 'Bathroom Images',
                images:
                  formData.bathroomImages,
                maxImages: 2,
                minImages: 1,
                uploadId:
                  'bathroom-upload',
                uploadHandler:
                  handleBathroomUpload,
                removeHandler:
                  removeBathroomImage,
                icon: (
                  <Bath className="w-5 h-5 text-gray-400" />
                ),
                shortLabel: 'Bath',
                borderClass:
                  'border-cyan-500'
              })}

              {renderImageSection({
                title: 'Balcony Images',
                images:
                  formData.balconyImages,
                maxImages: 2,
                minImages: 1,
                uploadId:
                  'balcony-upload',
                uploadHandler:
                  handleBalconyUpload,
                removeHandler:
                  removeBalconyImage,
                icon: (
                  <Grid3x3 className="w-5 h-5 text-gray-400" />
                ),
                shortLabel: 'Balcony',
                borderClass:
                  'border-blue-500'
              })}

              {renderImageSection({
                title: 'Kitchen Images',
                images:
                  formData.kitchenImages,
                maxImages: 2,
                minImages: 1,
                uploadId:
                  'kitchen-upload',
                uploadHandler:
                  handleKitchenUpload,
                removeHandler:
                  removeKitchenImage,
                icon: (
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                ),
                shortLabel: 'Kitchen',
                borderClass:
                  'border-yellow-500'
              })}

              {formData.bhk && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Bedroom Images{' '}
                    <span className="text-red-500">
                      *
                    </span>
                    <span className="text-gray-400 text-xs ml-2">
                      (Min 1, Max 2 images
                      per bedroom)
                    </span>
                  </label>

                  {Array.from({
                    length: Number(
                      formData.bhk
                    )
                  }).map(
                    (_, bedroomIndex) => {
                      const currentImages =
                        formData
                          .bedroomImages[
                          bedroomIndex
                        ] || [];

                      const isComplete =
                        currentImages.length >=
                        1;

                      return (
                        <div
                          key={bedroomIndex}
                          className={`mb-6 p-4 rounded-xl border-2 ${
                            isComplete
                              ? 'border-green-200 bg-green-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <Bed className="w-4 h-4 text-orange-500" />

                              Bedroom{' '}
                              {bedroomIndex +
                                1}{' '}
                              Images

                              {isComplete ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              )}
                            </h3>

                            <span
                              className={`text-xs font-medium ${
                                isComplete
                                  ? 'text-green-600'
                                  : 'text-red-500'
                              }`}
                            >
                              {
                                currentImages.length
                              }
                              /2 (Min 1)
                            </span>
                          </div>

                          <div className="space-y-3">
                            {currentImages.length <
                              2 &&
                              renderUploadBox({
                                id: `bedroom-upload-${bedroomIndex}`,
                                onChange: (
                                  e
                                ) =>
                                  handleBedroomUpload(
                                    e,
                                    bedroomIndex
                                  ),
                                icon: (
                                  <Upload className="w-5 h-5 text-gray-400" />
                                ),
                                text:
                                  currentImages.length ===
                                  0
                                    ? `Upload 1 or 2 images for Bedroom ${
                                        bedroomIndex +
                                        1
                                      }`
                                    : `Upload 1 more image for Bedroom ${
                                        bedroomIndex +
                                        1
                                      }`,
                                requiredText:
                                  currentImages.length ===
                                  0
                                    ? '* Minimum 1 image required'
                                    : null,
                                disabled:
                                  currentImages.length >=
                                  2
                              })}

                            <div className="flex flex-wrap gap-3">
                              {currentImages.map(
                                (
                                  image,
                                  imageIndex
                                ) => (
                                  <div
                                    key={
                                      imageIndex
                                    }
                                    className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-orange-500 group"
                                  >
                                    <img
                                      src={image}
                                      alt={`Bedroom ${
                                        bedroomIndex +
                                        1
                                      } - ${
                                        imageIndex +
                                        1
                                      }`}
                                      className="w-full h-full object-cover"
                                    />

                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeBedroomImage(
                                          bedroomIndex,
                                          imageIndex
                                        )
                                      }
                                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>

                                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                                      BR{' '}
                                      {bedroomIndex +
                                        1}{' '}
                                      -{' '}
                                      {imageIndex +
                                        1}
                                    </div>

                                    {imageIndex ===
                                      0 && (
                                      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">
                                        Required
                                      </div>
                                    )}
                                  </div>
                                )
                              )}

                              {Array.from({
                                length:
                                  2 -
                                  currentImages.length
                              }).map(
                                (_, index) => (
                                  <div
                                    key={`bedroom-empty-${bedroomIndex}-${index}`}
                                    className="w-32 h-32 rounded-lg border-2 border-dashed border-red-300 flex items-center justify-center bg-red-50"
                                  >
                                    <span className="text-xs text-red-400 text-center px-2">
                                      Slot{' '}
                                      {currentImages.length +
                                        index +
                                        1}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle
                  className={`w-4 h-4 ${
                    formData.outerImages
                      .length >= 3
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                />
                Outer:{' '}
                {formData.outerImages.length}
                /5 (Min 3)
              </span>

              <span className="flex items-center gap-1">
                <CheckCircle
                  className={`w-4 h-4 ${
                    formData.livingRoomImages
                      .length >= 1
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                />
                Living Room:{' '}
                {
                  formData
                    .livingRoomImages
                    .length
                }
                /2 (Min 1)
              </span>

              <span className="flex items-center gap-1">
                <CheckCircle
                  className={`w-4 h-4 ${
                    formData.bathroomImages
                      .length >= 1
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                />
                Bathroom:{' '}
                {
                  formData.bathroomImages
                    .length
                }
                /2 (Min 1)
              </span>

              <span className="flex items-center gap-1">
                <CheckCircle
                  className={`w-4 h-4 ${
                    formData.balconyImages
                      .length >= 1
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                />
                Balcony:{' '}
                {
                  formData.balconyImages
                    .length
                }
                /2 (Min 1)
              </span>

              <span className="flex items-center gap-1">
                <CheckCircle
                  className={`w-4 h-4 ${
                    formData.kitchenImages
                      .length >= 1
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                />
                Kitchen:{' '}
                {
                  formData.kitchenImages
                    .length
                }
                /2 (Min 1)
              </span>

              {formData.bhk && (
                <span className="flex items-center gap-1">
                  <CheckCircle
                    className={`w-4 h-4 ${
                      Array.from({
                        length: Number(
                          formData.bhk
                        )
                      }).every(
                        (_, index) =>
                          Array.isArray(
                            formData
                              .bedroomImages[
                              index
                            ]
                          ) &&
                          formData
                            .bedroomImages[
                            index
                          ].length >= 1
                      )
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  />

                  Bedrooms:{' '}
                  {
                    formData.bedroomImages.filter(
                      (images) =>
                        Array.isArray(
                          images
                        ) &&
                        images.length >=
                          1
                    ).length
                  }
                  /{Number(formData.bhk)}
                  {' '}(
                  Min 1 each)
                </span>
              )}
            </div>
          </div>

          <PropertyVerification
            ref={verificationRef}
            formData={formData}
            setFormData={setFormData}
          />

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Amenities
            </h2>

            <div className="flex flex-wrap gap-2">
              {availableAmenities.map(
                (amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() =>
                      toggleAmenity(
                        amenity
                      )
                    }
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      formData.amenities.includes(
                        amenity
                      )
                        ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {amenity}
                  </button>
                )
              )}
            </div>

            {formData.amenities.length >
              0 && (
              <p className="text-xs text-gray-500 mt-2">
                Selected:{' '}
                {formData.amenities.length}{' '}
                amenities
              </p>
            )}
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting for Verification...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Submit for Verification
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={() =>
                navigate('/host/my-properties')
              }
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
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