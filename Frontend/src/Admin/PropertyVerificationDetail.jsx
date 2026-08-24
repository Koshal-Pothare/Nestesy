import React, { useState, useEffect } from 'react';
import {
  Shield, CheckCircle, XCircle, Clock, Eye, 
  Filter, Search, User, Mail, Phone, Building,
  FileText, AlertCircle, RefreshCw, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPropertyVerification = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0
  });
  const [actionLoading, setActionLoading] = useState(false);

  // Load properties from localStorage
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');

    if (token) {
      try {
        const res = await fetch('/api/admin/properties?limit=100', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok && data.success && Array.isArray(data.properties)) {
          setProperties(data.properties);
          setFilteredProperties(data.properties);
          if (data.stats) {
            setStats({
              total: data.stats.total || data.properties.length,
              pending: data.stats.pending || 0,
              verified: data.stats.active || data.stats.approved || 0,
              rejected: data.stats.rejected || 0,
            });
          } else {
            updateStats(data.properties);
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('API loadProperties failed, using fallback:', err);
      }
    }

    try {
      const stored = localStorage.getItem('hostProperties');
      if (stored) {
        const allProperties = JSON.parse(stored);
        setProperties(allProperties);
        setFilteredProperties(allProperties);
        updateStats(allProperties);
      } else {
        setProperties([]);
        setFilteredProperties([]);
        updateStats([]);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (props) => {
    setStats({
      total: props.length,
      pending: props.filter(p => p.status === 'pending' || p.status === 'Pending').length,
      verified: props.filter(p => p.status === 'approved' || p.status === 'Active' || p.verification?.verified).length,
      rejected: props.filter(p => p.status === 'rejected' || p.status === 'Inactive').length
    });
  };

  // Filter properties
  useEffect(() => {
    let filtered = properties;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.verification?.ownerName?.toLowerCase().includes(term) ||
        p.verification?.ownerEmail?.toLowerCase().includes(term)
      );
    }
    
    setFilteredProperties(filtered);
  }, [filterStatus, searchTerm, properties]);

  // COMMENTED OUT: Verification actions - removed as per requirement
  // Only keeping property view functionality
  /*
  const handleVerificationAction = (propertyId, action, notes = '') => {
    // This function handled verify/reject/delete actions
    // Now removed to keep only property details viewing
  };
  */

  const getStatusBadge = (property) => {
    const status = property.status;
    const verification = property.verification;
    
    if (status === 'approved' || status === 'Active' || verification?.verified) {
      return { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Approved ✓'
      };
    }
    if (status === 'pending' || status === 'Pending') {
      return { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800', 
        icon: <Clock className="w-4 h-4" />,
        label: 'Pending Review'
      };
    }
    return { 
      bg: 'bg-red-100', 
      text: 'text-red-800', 
      icon: <XCircle className="w-4 h-4" />,
      label: 'Rejected ✗'
    };
  };

  // Get verification status for display
  const getVerificationStatus = (property) => {
    const v = property.verification;
    if (!v) return { label: 'Not Submitted', color: 'text-gray-400' };
    if (v.verified) return { label: 'Verified ✓', color: 'text-green-600' };
    if (v.status === 'rejected') return { label: 'Rejected ✗', color: 'text-red-600' };
    return { label: 'Pending ⏳', color: 'text-yellow-600' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Property Management
          </h1>
          <p className="text-gray-500 mt-1">View all property listings</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={loadProperties}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-400">All Properties</p>
        </div>
       
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, location, or owner..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Active">✅ Verified</option>
              <option value="Inactive">❌ Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-700">{filteredProperties.length}</span> properties
        </p>
      </div>

      {/* Property List */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">
            {properties.length === 0 ? 'No properties found' : 'No properties match your filters'}
          </h3>
          <p className="text-gray-400 mt-2">
            {properties.length === 0 
              ? 'Add properties to get started' 
              : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => {
            const statusBadge = getStatusBadge(property);
            const verificationStatus = getVerificationStatus(property);
            
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  property.status === 'Active' ? 'border-green-200' :
                  property.status === 'Pending' ? 'border-yellow-200' :
                  property.status === 'Inactive' ? 'border-red-200' :
                  'border-gray-100'
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="md:w-48 h-48 md:h-auto relative overflow-hidden bg-gray-100">
                    {property.images?.[0] ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Building className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800 text-lg">{property.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{property.location}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">
                            ₹{(property.price !== undefined ? property.price : property.rent || 0).toLocaleString()}
                            <span className="text-sm text-gray-500 font-normal">/mo</span>
                          </span>
                          <div className={`text-xs font-medium ${verificationStatus.color}`}>
                            {verificationStatus.label}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                        <span>🛏 {property.bedrooms} BHK</span>
                        <span>🛁 {property.bathrooms} Bath</span>
                        <span>📐 {property.area} sq.ft</span>
                        <span className="text-gray-400">
                          Listed: {new Date(property.listedDate).toLocaleDateString()}
                        </span>
                        {property.verification?.verifiedAt && (
                          <span className="text-green-600 text-xs">
                            ✓ Verified: {new Date(property.verification.verifiedAt).toLocaleDateString()}
                          </span>
                        )}
                        {property.verification?.status === 'rejected' && property.verification?.verifiedAt && (
                          <span className="text-red-600 text-xs">
                            ✗ Rejected: {new Date(property.verification.verifiedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Owner Info */}
                      {property.verification && (
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{property.verification.ownerName}</span>
                          <span className="text-gray-300">|</span>
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{property.verification.ownerEmail}</span>
                          <span className="text-gray-300">|</span>
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{property.verification.ownerPhone}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons - Only View Details */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setShowDetailModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      
                      {/* COMMENTED OUT: Verification and Delete buttons removed */}
                      {/* Only keep View Details button */}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail Modal - Only showing property details, no verification actions */}
      <AnimatePresence>
        {showDetailModal && selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Property Details</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Property Images Carousel */}
                {selectedProperty.images && selectedProperty.images.length > 0 && (
                  <div className="mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedProperty.images.slice(0, 6).map((img, idx) => (
                        <img 
                          key={idx}
                          src={img} 
                          alt={`${selectedProperty.title} ${idx + 1}`}
                          className="w-32 h-24 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                        />
                      ))}
                      {selectedProperty.images.length > 6 && (
                        <div className="w-32 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500 flex-shrink-0">
                          +{selectedProperty.images.length - 6} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Property Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="font-semibold">{selectedProperty.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{selectedProperty.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-semibold text-green-600">₹{(selectedProperty.price !== undefined ? selectedProperty.price : selectedProperty.rent || 0).toLocaleString()}/mo</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadge(selectedProperty).bg} ${getStatusBadge(selectedProperty).text} inline-flex`}>
                      {getStatusBadge(selectedProperty).icon}
                      {getStatusBadge(selectedProperty).label}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">BHK</p>
                    <p className="font-semibold">{selectedProperty.bedrooms} BHK</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-semibold">{selectedProperty.area} sq.ft</p>
                  </div>
                </div>

                {/* Amenities */}
                {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.amenities.map((amenity) => (
                        <span key={amenity} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedProperty.description && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-sm text-gray-600">{selectedProperty.description}</p>
                  </div>
                )}

                {/* Owner Details */}
                {selectedProperty.verification && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Owner Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">{selectedProperty.verification?.ownerName || selectedProperty.owner?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedProperty.verification?.ownerEmail || selectedProperty.owner?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedProperty.verification?.ownerPhone || selectedProperty.owner?.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Property Address</p>
                        <p className="font-medium">{selectedProperty.verification?.propertyAddress || selectedProperty.address || selectedProperty.location || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Submitted At</p>
                        <p className="font-medium">
                          {selectedProperty.verification?.submittedAt ? new Date(selectedProperty.verification.submittedAt).toLocaleString() : selectedProperty.createdAt ? new Date(selectedProperty.createdAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      {selectedProperty.verification?.verifiedAt && (
                        <div>
                          <p className="text-sm text-gray-500">Verified At</p>
                          <p className={`font-medium ${
                            selectedProperty.verification?.status === 'approved' ? 'text-green-600' :
                            selectedProperty.verification?.status === 'rejected' ? 'text-red-600' :
                            'text-gray-600'
                          }`}>
                            {selectedProperty.verification?.verifiedAt ? new Date(selectedProperty.verification.verifiedAt).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      )}
                      {(selectedProperty.verification?.status || selectedProperty.status) && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-500">Verification Status</p>
                          <p className={`font-medium ${
                            (selectedProperty.verification?.status || selectedProperty.status) === 'approved' || (selectedProperty.verification?.status || selectedProperty.status) === 'Active' ? 'text-green-600' :
                            (selectedProperty.verification?.status || selectedProperty.status) === 'rejected' || (selectedProperty.verification?.status || selectedProperty.status) === 'Inactive' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {(selectedProperty.verification?.status || selectedProperty.status) === 'approved' || (selectedProperty.verification?.status || selectedProperty.status) === 'Active' ? '✅ Approved' :
                             (selectedProperty.verification?.status || selectedProperty.status) === 'rejected' || (selectedProperty.verification?.status || selectedProperty.status) === 'Inactive' ? '❌ Rejected' :
                             '⏳ Pending'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {selectedProperty.verification?.documents && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Verification Documents
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(selectedProperty.verification.documents).map(([docType, docUrl]) => (
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

                {/* Admin Notes */}
                {selectedProperty.verification?.adminNotes && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Admin Notes</h3>
                    <div className={`p-3 rounded-lg ${
                      selectedProperty.verification.status === 'approved' ? 'bg-green-50 border border-green-200' :
                      selectedProperty.verification.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                      'bg-gray-50 border border-gray-200'
                    }`}>
                      <p className="text-sm text-gray-600">{selectedProperty.verification.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Close Button Only - No Verification Actions */}
                <div className="border-t border-gray-100 pt-4 mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Close
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

export default AdminPropertyVerification;