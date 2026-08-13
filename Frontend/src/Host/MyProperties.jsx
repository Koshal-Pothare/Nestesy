import React, { useState, useEffect } from 'react';
import {
  Home,
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
  Calendar,
  Building2,
  Heart,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../Ui/PropertyCard';  

const MyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load properties from localStorage
  useEffect(() => {
    const loadProperties = () => {
      try {
        setLoading(true);
        setError(null);
        
        const storedProperties = localStorage.getItem('hostProperties');
        if (storedProperties) {
          const parsedProperties = JSON.parse(storedProperties);
          setProperties(parsedProperties);
        } else {
          // Initialize with empty array if no properties exist
          localStorage.setItem('hostProperties', JSON.stringify([]));
          setProperties([]);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
        setError('Failed to load properties. Please try again.');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();

    // Listen for property added event (from AddProperty component)
    const handlePropertyAdded = (event) => {
      const newProperty = event.detail;
      setProperties(prev => {
        const updated = [newProperty, ...prev];
        localStorage.setItem('hostProperties', JSON.stringify(updated));
        return updated;
      });
    };

    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'hostProperties') {
        try {
          const updatedProperties = JSON.parse(e.newValue);
          setProperties(updatedProperties);
        } catch (error) {
          console.error('Error parsing storage data:', error);
        }
      }
    };

    window.addEventListener('propertyAdded', handlePropertyAdded);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('propertyAdded', handlePropertyAdded);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const propertyTypes = ['all', ...new Set(properties.map(p => p.type))];

  const filteredProperties = properties
    .filter(property => {
      const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
      const matchesType = filterType === 'all' || property.type === filterType;
      return matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case 'latest':
          return new Date(b.listedDate) - new Date(a.listedDate);
        case 'oldest':
          return new Date(a.listedDate) - new Date(b.listedDate);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        default:
          return 0;
      }
    });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Inactive':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleAddProperty = () => {
    navigate('/host/add-property');
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  const getStats = () => {
    const total = properties.length;
    const active = properties.filter(p => p.status === 'Active').length;
    const pending = properties.filter(p => p.status === 'Pending').length;
    const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiries || 0), 0);
    return { total, active, pending, totalInquiries };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Properties</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
          <p className="text-gray-500 mt-1">Manage all your hosted properties in one place</p>
        </div>
        <button
          onClick={handleAddProperty}
          className="mt-4 sm:mt-0 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-green-600/20"
        >
          <Plus className="w-5 h-5" />
          List New Property
        </button>
      </div>

      {properties.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-400">Properties</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
            <p className="text-xs text-green-600">Active</p>
            <p className="text-2xl font-bold text-green-700">{stats.active}</p>
            <p className="text-xs text-green-500">Listings</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-yellow-100 shadow-sm">
            <p className="text-xs text-yellow-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            <p className="text-xs text-yellow-500">Approvals</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm">
            <p className="text-xs text-purple-600">Inquiries</p>
            <p className="text-2xl font-bold text-purple-700">{stats.totalInquiries}</p>
            <p className="text-xs text-purple-500">Total</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-4 border-t border-gray-100">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Property Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  >
                    <option value="latest">Latest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-700">{filteredProperties.length}</span> properties
        </p>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">
            {properties.length === 0 ? 'No properties listed yet' : 'No properties match your filters'}
          </h3>
          <p className="text-gray-400 mt-2">
            {properties.length === 0 
              ? 'Start by listing your first property' 
              : 'Try adjusting your filters to see more properties'}
          </p>
          {properties.length === 0 && (
            <button
              onClick={handleAddProperty}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              List New Property
            </button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property, index) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-64 h-48 sm:h-auto relative overflow-hidden">
                      <img 
                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'} 
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusBadge(property.status)}`}>
                          {getStatusIcon(property.status)}
                          {property.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-800 text-lg">{property.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <MapPin className="w-4 h-4" />
                              {property.location}
                              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{property.type}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewDetails(property)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-sm mt-3">
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4 text-gray-400" />
                            {property.bedrooms} Beds
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4 text-gray-400" />
                            {property.bathrooms} Baths
                          </span>
                          <span className="flex items-center gap-1">
                            <Square className="w-4 h-4 text-gray-400" />
                            {property.area} sq.ft
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {property.listedDate}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{property.description}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between pt-3 mt-3 border-t border-gray-100">
                        <div>
                          <span className="text-xl font-bold text-gray-900">₹{property.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">/mo</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {property.inquiries || 0} inquiries
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

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
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64">
                <img 
                  src={selectedProperty.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'} 
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 border ${getStatusBadge(selectedProperty.status)}`}>
                    {getStatusIcon(selectedProperty.status)}
                    {selectedProperty.status}
                  </span>
                  <span className="px-4 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                    {selectedProperty.type}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedProperty.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  {selectedProperty.location}
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4 text-gray-400" />
                    {selectedProperty.bedrooms} Beds
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4 text-gray-400" />
                    {selectedProperty.bathrooms} Baths
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="w-4 h-4 text-gray-400" />
                    {selectedProperty.area} sq.ft
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Listed: {selectedProperty.listedDate}
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                  <span className="text-3xl font-bold text-gray-800">{selectedProperty.price.toLocaleString()}</span>
                  <span className="text-gray-500">/month</span>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">{selectedProperty.description}</p>
                </div>

                {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.amenities.map((amenity) => (
                        <span key={amenity} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex gap-4">
                    <span>💬 {selectedProperty.inquiries || 0} inquiries</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyProperties;