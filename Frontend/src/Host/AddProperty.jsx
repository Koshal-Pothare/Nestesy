import React, { useState, useRef } from 'react';
import {
  Home,
  Plus,
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
  Image,
  Grid3x3,
  Sofa,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropertyVerification from './PropertyVerification';

const AddProperty = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const verificationRef = useRef(null);

  // Available amenities list
  const availableAmenities = [
    'Parking', 'Pool', 'Gym', 'Garden', 'Security', 
    'Lift', 'Power Backup', 'Terrace', 'Balcony', 
    'Furnished', 'AC', 'WiFi', 'Pet Friendly', 'Playground', 'CCTV', 
  ];

  // BHK options (up to 5 BHK)
  const bhkOptions = [
    { value: '1', label: '1 BHK' },
    { value: '2', label: '2 BHK' },
    { value: '3', label: '3 BHK' },
    { value: '4', label: '4 BHK' },
    { value: '5', label: '5 BHK' }
  ];

  // Form state
  const [formData, setFormData] = useState({
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
    // Verification fields
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    propertyAddress: '',
    verificationDocs: {},
    additionalNotes: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'bhk') {
      setFormData(prev => ({
        ...prev,
        bedroomImages: []
      }));
    }
  };

  // Handle amenities toggle
  const toggleAmenity = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Handle outer images upload (min 3, max 5)
  const handleOuterUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - formData.outerImages.length;
    const selectedFiles = files.slice(0, remainingSlots);
    
    const imageUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      outerImages: [...prev.outerImages, ...imageUrls]
    }));
  };

  // Handle living room images upload (min 1, max 2)
  const handleLivingRoomUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 2 - formData.livingRoomImages.length;
    const selectedFiles = files.slice(0, remainingSlots);
    
    const imageUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      livingRoomImages: [...prev.livingRoomImages, ...imageUrls]
    }));
  };

  // Handle bathroom images upload (min 1, max 2)
  const handleBathroomUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 2 - formData.bathroomImages.length;
    const selectedFiles = files.slice(0, remainingSlots);
    
    const imageUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      bathroomImages: [...prev.bathroomImages, ...imageUrls]
    }));
  };

  // Handle balcony images upload (min 1, max 2)
  const handleBalconyUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 2 - formData.balconyImages.length;
    const selectedFiles = files.slice(0, remainingSlots);
    
    const imageUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      balconyImages: [...prev.balconyImages, ...imageUrls]
    }));
  };

  // Handle kitchen images upload (min 1, max 2)
  const handleKitchenUpload = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 2 - formData.kitchenImages.length;
    const selectedFiles = files.slice(0, remainingSlots);
    
    const imageUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      kitchenImages: [...prev.kitchenImages, ...imageUrls]
    }));
  };

  // Handle bedroom images upload (min 1, max 2)
  const handleBedroomUpload = (e, bedroomIndex) => {
    const files = Array.from(e.target.files);
    const maxImages = 2;
    const currentBedroom = formData.bedroomImages[bedroomIndex] || [];
    const remainingSlots = maxImages - currentBedroom.length;
    const selectedFiles = files.slice(0, remainingSlots);
    
    const imageUrls = selectedFiles.map(file => URL.createObjectURL(file));
    
    setFormData(prev => {
      const updatedBedroomImages = [...prev.bedroomImages];
      if (!updatedBedroomImages[bedroomIndex]) {
        updatedBedroomImages[bedroomIndex] = [];
      }
      updatedBedroomImages[bedroomIndex] = [...updatedBedroomImages[bedroomIndex], ...imageUrls];
      return { ...prev, bedroomImages: updatedBedroomImages };
    });
  };

  // Remove outer image
  const removeOuterImage = (index) => {
    setFormData(prev => ({
      ...prev,
      outerImages: prev.outerImages.filter((_, i) => i !== index)
    }));
  };

  // Remove living room image
  const removeLivingRoomImage = (index) => {
    setFormData(prev => ({
      ...prev,
      livingRoomImages: prev.livingRoomImages.filter((_, i) => i !== index)
    }));
  };

  // Remove bathroom image
  const removeBathroomImage = (index) => {
    setFormData(prev => ({
      ...prev,
      bathroomImages: prev.bathroomImages.filter((_, i) => i !== index)
    }));
  };

  // Remove balcony image
  const removeBalconyImage = (index) => {
    setFormData(prev => ({
      ...prev,
      balconyImages: prev.balconyImages.filter((_, i) => i !== index)
    }));
  };

  // Remove kitchen image
  const removeKitchenImage = (index) => {
    setFormData(prev => ({
      ...prev,
      kitchenImages: prev.kitchenImages.filter((_, i) => i !== index)
    }));
  };

  // Remove bedroom image
  const removeBedroomImage = (bedroomIndex, imageIndex) => {
    setFormData(prev => {
      const updatedBedroomImages = [...prev.bedroomImages];
      updatedBedroomImages[bedroomIndex] = updatedBedroomImages[bedroomIndex].filter((_, i) => i !== imageIndex);
      if (updatedBedroomImages[bedroomIndex].length === 0) {
        updatedBedroomImages[bedroomIndex] = null;
      }
      return { ...prev, bedroomImages: updatedBedroomImages };
    });
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate basic fields
    if (!formData.title || !formData.location || !formData.price || 
        !formData.bhk || !formData.bathrooms || !formData.area) {
      showNotification('Please fill in all required fields', 'error');
      setIsSubmitting(false);
      return;
    }

    // Validate images
    if (formData.outerImages.length < 3) {
      showNotification('Please upload at least 3 outer images', 'error');
      setIsSubmitting(false);
      return;
    }

    if (formData.livingRoomImages.length < 1) {
      showNotification('Please upload at least one living room image', 'error');
      setIsSubmitting(false);
      return;
    }

    if (formData.bathroomImages.length < 1) {
      showNotification('Please upload at least one bathroom image', 'error');
      setIsSubmitting(false);
      return;
    }

    if (formData.balconyImages.length === 0) {
      showNotification('Please upload at least one balcony image', 'error');
      setIsSubmitting(false);
      return;
    }

    if (formData.kitchenImages.length === 0) {
      showNotification('Please upload at least one kitchen image', 'error');
      setIsSubmitting(false);
      return;
    }

    const bhkCount = parseInt(formData.bhk);
    for (let i = 0; i < bhkCount; i++) {
      const bedroomImgs = formData.bedroomImages[i] || [];
      if (bedroomImgs.length < 1) {
        showNotification(`Please upload at least 1 image for Bedroom ${i + 1}`, 'error');
        setIsSubmitting(false);
        return;
      }
      if (bedroomImgs.length > 2) {
        showNotification(`Maximum 2 images allowed for Bedroom ${i + 1}`, 'error');
        setIsSubmitting(false);
        return;
      }
    }

    // Validate verification section using the ref
    if (verificationRef.current) {
      const isValid = verificationRef.current.validate();
      if (!isValid) {
        showNotification('Please complete all verification fields', 'error');
        setIsSubmitting(false);
        return;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Combine all images into a single array for the property card
    const allImages = [
      ...formData.outerImages,
      ...formData.livingRoomImages,
      ...formData.bathroomImages,
      ...formData.balconyImages,
      ...formData.kitchenImages,
      ...formData.bedroomImages.flat()
    ];

    const newProperty = {
      id: Date.now(),
      title: formData.title,
      location: formData.location,
      price: parseFloat(formData.price),
      type: formData.type,
      bedrooms: parseInt(formData.bhk),  
      bathrooms: parseInt(formData.bathrooms),
      area: parseInt(formData.area),
      status: 'Pending',
      images: allImages,
      listedDate: new Date().toISOString().split('T')[0],
      inquiries: 0,
      amenities: formData.amenities,
      description: formData.description,
      verification: {
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone,
        propertyAddress: formData.propertyAddress,
        documents: formData.verificationDocs,
        additionalNotes: formData.additionalNotes,
        verified: false,
        status: 'pending',
        submittedAt: new Date().toISOString()
      }
    };

    // Save to localStorage
    try {
      // Get existing properties
      const storedProperties = localStorage.getItem('hostProperties');
      let existingProperties = [];
      
      if (storedProperties) {
        existingProperties = JSON.parse(storedProperties);
      }
      
      // Add new property at the beginning
      const updatedProperties = [newProperty, ...existingProperties];
      
      // Save back to localStorage
      localStorage.setItem('hostProperties', JSON.stringify(updatedProperties));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('propertyAdded', { 
        detail: newProperty 
      }));
      
      // Dispatch storage event for cross-tab communication
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'hostProperties',
        newValue: JSON.stringify(updatedProperties),
        oldValue: storedProperties,
      }));
      
      console.log('Property submitted for verification:', newProperty);
      showNotification('Property submitted for verification successfully!', 'success');
      
      setIsSubmitting(false);
      
      // ✅ FIXED: Navigate to /host/my-properties
      setTimeout(() => {
        resetForm();
        navigate('/host/my-properties');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving property:', error);
      showNotification('Failed to save property. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
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
    });
  };

  // Property types
  const propertyTypes = [
    'Apartment', 'Flat', 'Penthouse', 'House', 'Studio', 'Duplex', 'Farmhouse'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-green-500' : 
              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            } text-white`}
          >
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/host/my-properties')}  // ✅ FIXED
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Add New Property</h1>
            <p className="text-sm text-gray-500 mt-1">Fill in the details to list your property</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Verification Required
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
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
                  Location <span className="text-red-500">*</span>
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
                  Price (per month) <span className="text-red-500">*</span>
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
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                >
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="border-t border-gray-100 pt-6">
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
                    name="bhk"
                    value={formData.bhk}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all appearance-none"
                  >
                    <option value="">Select BHK</option>
                    {bhkOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
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
                  Area (sq.ft) <span className="text-red-500">*</span>
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

          {/* Description */}
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Description</h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none"
              placeholder="Describe your property in detail..."
            />
          </div>

          {/* Property Images Section */}
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-purple-600" />
              Property Images
            </h2>
            
            <div className="space-y-6">
              {/* Outer Images - Min 3, Max 5 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outer Images <span className="text-red-500">*</span>
                  <span className="text-gray-400 text-xs ml-2">(Min 3, Max 5 images)</span>
                </label>
                <div className="space-y-3">
                  {formData.outerImages.length < 5 && (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 transition-colors cursor-pointer max-w-md"
                      onClick={() => document.getElementById('outer-upload').click()}
                    >
                      <input
                        type="file"
                        id="outer-upload"
                        onChange={handleOuterUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {formData.outerImages.length < 3 ? (
                            `Upload ${5 - formData.outerImages.length} more image${5 - formData.outerImages.length > 1 ? 's' : ''} (Min 3 required)`
                          ) : (
                            `Upload ${5 - formData.outerImages.length} more image${5 - formData.outerImages.length > 1 ? 's' : ''}`
                          )}
                        </span>
                      </div>
                      {formData.outerImages.length < 3 && (
                        <p className="text-xs text-red-400 mt-1">* Minimum 3 images required</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {formData.outerImages.map((image, index) => (
                      <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-green-500 group">
                        <img src={image} alt={`Outer ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeOuterImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                          Outer {index + 1}
                        </div>
                        {index < 3 && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">
                            Required
                          </div>
                        )}
                      </div>
                    ))}

                    {Array.from({ length: Math.max(0, 5 - formData.outerImages.length) }).map((_, index) => (
                      <div 
                        key={`outer-empty-${index}`}
                        className="w-32 h-32 rounded-lg border-2 border-dashed border-red-300 flex items-center justify-center bg-red-50"
                      >
                        <span className="text-xs text-red-400 text-center px-2">
                          Slot {formData.outerImages.length + index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Living Room Images - Min 1, Max 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Living Room Images <span className="text-red-500">*</span>
                  <span className="text-gray-400 text-xs ml-2">(Min 1, Max 2 images)</span>
                </label>
                <div className="space-y-3">
                  {formData.livingRoomImages.length < 2 && (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 transition-colors cursor-pointer max-w-md"
                      onClick={() => document.getElementById('livingroom-upload').click()}
                    >
                      <input
                        type="file"
                        id="livingroom-upload"
                        onChange={handleLivingRoomUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <Sofa className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {formData.livingRoomImages.length === 0 ? (
                            `Upload ${2 - formData.livingRoomImages.length} image${2 - formData.livingRoomImages.length > 1 ? 's' : ''} for Living Room`
                          ) : (
                            `Upload ${1} more image for Living Room`
                          )}
                        </span>
                      </div>
                      {formData.livingRoomImages.length === 0 && (
                        <p className="text-xs text-red-400 mt-1">* Minimum 1 image required</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {formData.livingRoomImages.map((image, index) => (
                      <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 group">
                        <img src={image} alt={`Living Room ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeLivingRoomImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                          LR {index + 1}
                        </div>
                        {index === 0 && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">
                            Required
                          </div>
                        )}
                      </div>
                    ))}

                    {Array.from({ length: 2 - formData.livingRoomImages.length }).map((_, index) => (
                      <div 
                        key={`livingroom-empty-${index}`}
                        className="w-32 h-32 rounded-lg border-2 border-dashed border-red-300 flex items-center justify-center bg-red-50"
                      >
                        <span className="text-xs text-red-400 text-center px-2">
                          Slot {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bathroom Images - Min 1, Max 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathroom Images <span className="text-red-500">*</span>
                  <span className="text-gray-400 text-xs ml-2">(Min 1, Max 2 images)</span>
                </label>
                <div className="space-y-3">
                  {formData.bathroomImages.length < 2 && (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 transition-colors cursor-pointer max-w-md"
                      onClick={() => document.getElementById('bathroom-upload').click()}
                    >
                      <input
                        type="file"
                        id="bathroom-upload"
                        onChange={handleBathroomUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <Bath className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {formData.bathroomImages.length === 0 ? (
                            `Upload ${2 - formData.bathroomImages.length} image${2 - formData.bathroomImages.length > 1 ? 's' : ''} for Bathroom`
                          ) : (
                            `Upload ${1} more image for Bathroom`
                          )}
                        </span>
                      </div>
                      {formData.bathroomImages.length === 0 && (
                        <p className="text-xs text-red-400 mt-1">* Minimum 1 image required</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {formData.bathroomImages.map((image, index) => (
                      <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-cyan-500 group">
                        <img src={image} alt={`Bathroom ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeBathroomImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                          Bath {index + 1}
                        </div>
                        {index === 0 && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">
                            Required
                          </div>
                        )}
                      </div>
                    ))}

                    {Array.from({ length: 2 - formData.bathroomImages.length }).map((_, index) => (
                      <div 
                        key={`bathroom-empty-${index}`}
                        className="w-32 h-32 rounded-lg border-2 border-dashed border-red-300 flex items-center justify-center bg-red-50"
                      >
                        <span className="text-xs text-red-400 text-center px-2">
                          Slot {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Balcony Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Balcony Images <span className="text-red-500">*</span>
                  <span className="text-gray-400 text-xs ml-2">(Min 1, Max 2 images)</span>
                </label>
                <div className="space-y-3">
                  {formData.balconyImages.length < 2 && (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 transition-colors cursor-pointer max-w-md"
                      onClick={() => document.getElementById('balcony-upload').click()}
                    >
                      <input
                        type="file"
                        id="balcony-upload"
                        onChange={handleBalconyUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <Grid3x3 className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {formData.balconyImages.length === 0 ? (
                            `Upload ${2 - formData.balconyImages.length} image${2 - formData.balconyImages.length > 1 ? 's' : ''} for Balcony`
                          ) : (
                            `Upload ${1} more image for Balcony`
                          )}
                        </span>
                      </div>
                      {formData.balconyImages.length === 0 && (
                        <p className="text-xs text-red-400 mt-1">* Minimum 1 image required</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {formData.balconyImages.map((image, index) => (
                      <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-blue-500 group">
                        <img src={image} alt={`Balcony ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeBalconyImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                          Balcony {index + 1}
                        </div>
                        {index === 0 && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">
                            Required
                          </div>
                        )}
                      </div>
                    ))}

                    {Array.from({ length: 2 - formData.balconyImages.length }).map((_, index) => (
                      <div 
                        key={`balcony-empty-${index}`}
                        className="w-32 h-32 rounded-lg border-2 border-dashed border-red-300 flex items-center justify-center bg-red-50"
                      >
                        <span className="text-xs text-red-400 text-center px-2">
                          Slot {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kitchen Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kitchen Images <span className="text-red-500">*</span>
                  <span className="text-gray-400 text-xs ml-2">(Min 1, Max 2 images)</span>
                </label>
                <div className="space-y-3">
                  {formData.kitchenImages.length < 2 && (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 transition-colors cursor-pointer max-w-md"
                      onClick={() => document.getElementById('kitchen-upload').click()}
                    >
                      <input
                        type="file"
                        id="kitchen-upload"
                        onChange={handleKitchenUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2">
                        <Image className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {formData.kitchenImages.length === 0 ? (
                            `Upload ${2 - formData.kitchenImages.length} image${2 - formData.kitchenImages.length > 1 ? 's' : ''} for Kitchen`
                          ) : (
                            `Upload ${1} more image for Kitchen`
                          )}
                        </span>
                      </div>
                      {formData.kitchenImages.length === 0 && (
                        <p className="text-xs text-red-400 mt-1">* Minimum 1 image required</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {formData.kitchenImages.map((image, index) => (
                      <div key={index} className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-yellow-500 group">
                        <img src={image} alt={`Kitchen ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeKitchenImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                          Kitchen {index + 1}
                        </div>
                        {index === 0 && (
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">
                            Required
                          </div>
                        )}
                      </div>
                    ))}

                    {Array.from({ length: 2 - formData.kitchenImages.length }).map((_, index) => (
                      <div 
                        key={`kitchen-empty-${index}`}
                        className="w-32 h-32 rounded-lg border-2 border-dashed border-red-300 flex items-center justify-center bg-red-50"
                      >
                        <span className="text-xs text-red-400 text-center px-2">
                          Slot {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bedroom Images */}
              {formData.bhk && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Bedroom Images <span className="text-red-500">*</span>
                    <span className="text-gray-400 text-xs ml-2">
                      (Min 1, Max 2 images per bedroom)
                    </span>
                  </label>
                  {Array.from({ length: parseInt(formData.bhk) }).map((_, bedroomIndex) => {
                    const currentImages = formData.bedroomImages[bedroomIndex] || [];
                    const isComplete = currentImages.length >= 1;
                    
                    return (
                      <div key={bedroomIndex} className={`mb-6 p-4 rounded-xl border-2 ${isComplete ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Bed className="w-4 h-4 text-orange-500" />
                            Bedroom {bedroomIndex + 1} Images
                            {isComplete ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                          </h3>
                          <span className={`text-xs font-medium ${isComplete ? 'text-green-600' : 'text-red-500'}`}>
                            {currentImages.length}/2 (Min 1)
                          </span>
                        </div>

                        <div className="space-y-3">
                          {currentImages.length < 2 && (
                            <div
                              className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 transition-colors cursor-pointer"
                              onClick={() => document.getElementById(`bedroom-upload-${bedroomIndex}`).click()}
                            >
                              <input
                                type="file"
                                id={`bedroom-upload-${bedroomIndex}`}
                                onChange={(e) => handleBedroomUpload(e, bedroomIndex)}
                                multiple
                                accept="image/*"
                                className="hidden"
                              />
                              <div className="flex items-center justify-center gap-2">
                                <Upload className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  {currentImages.length === 0 ? (
                                    `Upload ${2 - currentImages.length} image${2 - currentImages.length > 1 ? 's' : ''} for Bedroom ${bedroomIndex + 1}`
                                  ) : (
                                    `Upload ${1} more image for Bedroom ${bedroomIndex + 1}`
                                  )}
                                </span>
                              </div>
                              {currentImages.length === 0 && (
                                <p className="text-xs text-red-400 mt-1">* Minimum 1 image required</p>
                              )}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-3">
                            {currentImages.map((image, imageIndex) => (
                              <div key={imageIndex} className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-orange-500 group">
                                <img 
                                  src={image} 
                                  alt={`Bedroom ${bedroomIndex + 1} - ${imageIndex + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeBedroomImage(bedroomIndex, imageIndex)}
                                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                                  BR {bedroomIndex + 1} - {imageIndex + 1}
                                </div>
                                {imageIndex === 0 && (
                                  <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-green-600 text-white text-xs rounded">
                                    Required
                                  </div>
                                )}
                              </div>
                            ))}

                            {Array.from({ length: 2 - currentImages.length }).map((_, index) => (
                              <div 
                                key={`bedroom-empty-${bedroomIndex}-${index}`}
                                className="w-32 h-32 rounded-lg border-2 border-dashed border-red-300 flex items-center justify-center bg-red-50"
                              >
                                <span className="text-xs text-red-400 text-center px-2">
                                  Slot {index + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Image summary */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className={`w-4 h-4 ${formData.outerImages.length >= 3 ? 'text-green-500' : 'text-red-500'}`} />
                Outer: {formData.outerImages.length}/5 (Min 3)
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className={`w-4 h-4 ${formData.livingRoomImages.length >= 1 ? 'text-green-500' : 'text-red-500'}`} />
                Living Room: {formData.livingRoomImages.length}/2 (Min 1)
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className={`w-4 h-4 ${formData.bathroomImages.length >= 1 ? 'text-green-500' : 'text-red-500'}`} />
                Bathroom: {formData.bathroomImages.length}/2 (Min 1)
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className={`w-4 h-4 ${formData.balconyImages.length >= 1 ? 'text-green-500' : 'text-red-500'}`} />
                Balcony: {formData.balconyImages.length}/2 (Min 1)
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className={`w-4 h-4 ${formData.kitchenImages.length >= 1 ? 'text-green-500' : 'text-red-500'}`} />
                Kitchen: {formData.kitchenImages.length}/2 (Min 1)
              </span>
              {formData.bhk && (
                <span className="flex items-center gap-1">
                  <CheckCircle className={`w-4 h-4 ${
                    formData.bedroomImages.every(imgs => imgs && imgs.length >= 1) 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`} />
                  Bedrooms: {formData.bedroomImages.filter(imgs => imgs && imgs.length >= 1).length}/{parseInt(formData.bhk)} 
                  (Min 1 each)
                </span>
              )}
            </div>
          </div>

          {/* Property Verification Component */}
          <PropertyVerification 
            ref={verificationRef}
            formData={formData}
            setFormData={setFormData}
          />

          {/* Amenities */}
          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {availableAmenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    formData.amenities.includes(amenity)
                      ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
          </div>

          {/* Form Actions */}
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
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => navigate('/host/my-properties')}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
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