import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  BedDouble,
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
  Heart,
  Home,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Edit,
  ArrowLeft,
  Eye,
  Building2,
  Trash2,
  Key,
  Check
} from 'lucide-react';

const HostPropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = () => {
    setLoading(true);
    setError(null);
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
         
        let foundProperty = null;
        
        // Method 1: String comparison
        foundProperty = allProperties.find(p => String(p.id) === String(id));
        
        // Method 2: Number comparison 
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
  };

  useEffect(() => {
    if (!property?.images?.length) return;
    
    const timer = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % property.images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [property]);

  useEffect(() => {
    setCurrentImage(0);
  }, [id]);

  const nextImage = () => {
    setCurrentImage(prev => (prev + 1) % property.images.length);
  };

  const previousImage = () => {
    setCurrentImage(prev => prev === 0 ? property.images.length - 1 : prev - 1);
  };

  const handleDelete = () => {
    if (window.confirm('⚠️ Are you sure you want to permanently delete this property? This action cannot be undone!')) {
      const stored = localStorage.getItem('hostProperties');
      if (stored) {
        const allProperties = JSON.parse(stored);
        const updatedProperties = allProperties.filter(p => String(p.id) !== String(id));
        localStorage.setItem('hostProperties', JSON.stringify(updatedProperties));
        navigate('/host/my-properties');
      }
    }
  };

  // Handle status update (Active or Rented)
  const handleStatusUpdate = (newStatus) => {
    if (window.confirm(`Are you sure you want to mark this property as "${newStatus}"?`)) {
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
    if (!property) return null;
    
    const status = property.status || 'Pending';
    const verification = property.verification;
    
    if (status === 'Rented') {
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: <Key className="w-5 h-5" />,
        label: 'Rented ',
        border: 'border-blue-300'
      };
    }
    if (status === 'Active' && verification?.verified) {
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="w-5 h-5" />,
        label: 'Verified ',
        border: 'border-green-300'
      };
    }
    if (status === 'Pending' || !verification?.verified) {
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: <Clock className="w-5 h-5" />,
        label: 'Pending Verification',
        border: 'border-yellow-300'
      };
    }
    if (status === 'Inactive') {
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <XCircle className="w-5 h-5" />,
        label: 'Rejected',
        border: 'border-red-300'
      };
    }
    // Default fallbac 
    return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: <Clock className="w-5 h-5" />,
      label: 'Pending',
      border: 'border-yellow-300'
    };
  };

  const getVerificationStatus = () => {
    if (!property?.verification) {
      return { 
        label: 'Verification Pending', 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-50', 
        border: 'border-yellow-200' 
      };
    }
    
    const v = property.verification;
    if (v.verified) {
      return { label: 'Verified ✓', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    }
    if (v.status === 'rejected') {
      return { label: 'Rejected ✗', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    }
    return { label: 'Pending Review ⏳', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
  };
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-2xl">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">{error || 'Property not found'}</h3>
          <p className="text-gray-400 mt-2">The property you're looking for doesn't exist or has been removed.</p>
          
          {/*  show available properties */}
          {allProperties.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
              <p className="text-sm font-semibold text-gray-700">Available Properties ({allProperties.length}):</p>
              <div className="mt-2 max-h-40 overflow-y-auto">
                {allProperties.map(p => (
                  <div key={p.id} className="text-sm text-gray-600 py-1 border-b border-gray-100 flex justify-between items-center">
                    <span>
                      <span className="font-medium">ID: {p.id}</span> - {p.title}
                    </span>
                    <button 
                      onClick={() => navigate(`/host/property/${p.id}`)}
                      className="ml-2 text-blue-600 hover:text-blue-800 text-xs px-2 py-1 bg-blue-50 rounded"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 flex flex-col gap-2">
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
              <Refresh className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge();
  const verificationStatus = getVerificationStatus();
  const isVerified = property.verification?.verified || false;
  const currentStatus = property.status || 'Pending';

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/host/my-properties')}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to My Properties
        </button>
      </div>

      {/* Verification Status Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className={`rounded-2xl p-4 border ${statusBadge.border} ${statusBadge.bg}`}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              {statusBadge.icon}
              <span className={`font-semibold ${statusBadge.text}`}>
                Status: {statusBadge.label}
              </span>
            </div>
            {property.verification?.verifiedAt && (
              <span className="text-sm text-gray-600">
                • {property.verification.status === 'approved' ? 'Verified' : 'Reviewed'} on: {new Date(property.verification.verifiedAt).toLocaleDateString()}
              </span>
            )}
            {property.verification?.status === 'rejected' && property.verification?.adminNotes && (
              <span className="text-sm text-red-600">
                • Reason: {property.verification.adminNotes}
              </span>
            )}
            {!property.verification?.verified && property.status !== 'Inactive' && property.status !== 'Rented' && (
              <span className="text-sm text-yellow-600">
                • Awaiting admin verification
              </span>
            )}
            {property.status === 'Rented' && (
              <span className="text-sm text-blue-600">
                • This property has been rented out
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hero / Image Gallery */}
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
              src={property.images?.[currentImage] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
              alt={property.title}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

            <button
              onClick={previousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-5 left-5 flex gap-2">
              {property.images?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentImage === index ? 'w-7 bg-white' : 'w-2 bg-white/60'
                  }`}
                />
              ))}
            </div>

            <div className="absolute top-5 left-5 rounded-full bg-black/40 backdrop-blur-md px-4 py-2 text-sm text-white">
              {currentImage + 1} / {property.images?.length || 0}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          {/* Left Content */}
          <div className="min-w-0 mt-20">
            {/* Title */}
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
                      {property.type || property.propertyType || 'Property'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}>
                      {statusBadge.icon}
                      {statusBadge.label}
                    </span>
                  </div>

                  <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    {property.title}
                  </h1>

                  <div className="mt-2 flex items-center gap-2 text-gray-500">
                    <MapPin size={18} className="shrink-0 text-primary-600" />
                    <span>{property.location}</span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className="text-2xl sm:text-3xl font-bold text-primary-600">
                      ₹{property.price?.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>

                  <div className="mt-2 flex items-center gap-1 sm:justify-end text-sm text-gray-500">
                    <Calendar size={16} />
                    <span>Listed: {property.listedDate}</span>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <BedDouble className="text-primary-600" size={21} />
                  <p className="mt-2 text-xs text-gray-500">Bedrooms</p>
                  <p className="font-semibold text-gray-800">{property.bedrooms}</p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <Bath className="text-primary-600" size={21} />
                  <p className="mt-2 text-xs text-gray-500">Bathrooms</p>
                  <p className="font-semibold text-gray-800">{property.bathrooms}</p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <Ruler className="text-primary-600" size={21} />
                  <p className="mt-2 text-xs text-gray-500">Area</p>
                  <p className="font-semibold text-gray-800">{property.area} sq.ft</p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <Home className="text-primary-600" size={21} />
                  <p className="mt-2 text-xs text-gray-500">Property ID</p>
                  <p className="font-semibold text-gray-800 text-sm">#{property.id}</p>
                </div>
              </div>
            </motion.section>

            {/* Description */}
            <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">About this property</h2>
              <p className="mt-3 text-sm sm:text-base leading-7 text-gray-600">
                {property.description || 'No description provided.'}
              </p>
            </section>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
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

            {/* Verification Details */}
            {property.verification && (
              <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={24} />
                  Verification Details
                </h2>

                <div className={`mt-5 p-4 rounded-xl border ${verificationStatus.border} ${verificationStatus.bg}`}>
                  <div className="flex items-center gap-2">
                    {verificationStatus.label === 'Verified ✓' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : verificationStatus.label === 'Rejected ✗' ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className={`font-semibold ${verificationStatus.color}`}>
                      {verificationStatus.label}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Owner Name</p>
                      <p className="font-medium text-gray-800">{property.verification.ownerName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{property.verification.ownerEmail || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium text-gray-800">{property.verification.ownerPhone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Property Address</p>
                      <p className="font-medium text-gray-800">{property.verification.propertyAddress || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Submitted At</p>
                      <p className="font-medium text-gray-800">
                        {property.verification.submittedAt ? new Date(property.verification.submittedAt).toLocaleString() : 'Not available'}
                      </p>
                    </div>
                    {property.verification.verifiedAt && (
                      <div>
                        <p className="text-gray-500">Verified At</p>
                        <p className={`font-medium ${
                          property.verification.status === 'approved' ? 'text-green-600' :
                          property.verification.status === 'rejected' ? 'text-red-600' :
                          'text-gray-800'
                        }`}>
                          {new Date(property.verification.verifiedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {property.verification.adminNotes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-500 text-sm">Admin Notes</p>
                      <p className={`mt-1 p-3 rounded-lg text-sm ${
                        property.verification.status === 'approved' ? 'bg-green-50 text-green-700' :
                        property.verification.status === 'rejected' ? 'bg-red-50 text-red-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        {property.verification.adminNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Documents */}
                {property.verification.documents && Object.keys(property.verification.documents).length > 0 && (
                  <div className="mt-5">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Uploaded Documents
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(property.verification.documents).map(([docType, docUrl]) => (
                        <div key={docType} className="relative group">
                          <img 
                            src={docUrl} 
                            alt={docType}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(docUrl, '_blank')}
                          />
                          <p className="text-xs text-gray-500 mt-1 text-center capitalize">
                            {docType.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Property Stats */}
            <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Eye className="text-purple-600" size={24} />
                Property Stats
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-purple-700">{property.inquiries || 0}</p>
                  <p className="text-xs text-purple-600">Total visits</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-green-700">{property.listedDate}</p>
                  <p className="text-xs text-green-600">Listed Date</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Card */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-lg p-5 sm:p-6 mt-20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Monthly Rent</p>
                  <h2 className="text-2xl font-bold text-primary-600">
                    ₹{property.price?.toLocaleString()}
                  </h2>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}>
                  {statusBadge.icon}
                  {statusBadge.label}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-primary-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Listed Date</p>
                    <p className="font-semibold text-gray-800">{property.listedDate}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Clock className="text-primary-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Property ID</p>
                    <p className="font-semibold text-gray-800">#{property.id}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Bedrooms</span>
                  <span className="font-semibold">{property.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bathrooms</span>
                  <span className="font-semibold">{property.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Area</span>
                  <span className="font-semibold">{property.area} sq.ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-semibold">{property.type || property.propertyType || 'N/A'}</span>
                </div>
              </div>

              {/* Status Management Buttons */}
              {isVerified && (
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Manage Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStatusUpdate('Active')}
                      disabled={updatingStatus || currentStatus === 'Active'}
                      className={`py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1 transition-all duration-200 ${
                        currentStatus === 'Active'
                          ? 'bg-green-100 text-green-700 border-2 border-green-500 cursor-default'
                          : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      Active
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('Rented')}
                      disabled={updatingStatus || currentStatus === 'Rented'}
                      className={`py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1 transition-all duration-200 ${
                        currentStatus === 'Rented'
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-500 cursor-default'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                      }`}
                    >
                      <Key className="w-3 h-3" />
                      Rented
                    </button>
                  </div>
                  {currentStatus === 'Active' && (
                    <p className="text-xs text-green-600 text-center">✓ Property is currently active and available</p>
                  )}
                  {currentStatus === 'Rented' && (
                    <p className="text-xs text-blue-600 text-center">🔑 Property has been rented out</p>
                  )}
                  {updatingStatus && (
                    <p className="text-xs text-blue-600 text-center">Updating status...</p>
                  )}
                </div>
              )}

              {!isVerified && (
                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-xs text-yellow-700 text-center">
                     Status management available after verification
                  </p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 gap-3">
                <button
                  onClick={() => navigate('/host/my-properties')}
                  className="rounded-2xl border border-gray-300 py-3.5 font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Back to Properties
                </button> 
                <button
                  onClick={handleDelete}
                  className="rounded-2xl bg-red-500 py-3.5 font-semibold text-white hover:bg-red-600 transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Property
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={15} className="text-green-500" />
                Your property is secure
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
};

// Refresh icon  
const Refresh = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default HostPropertyDetails;