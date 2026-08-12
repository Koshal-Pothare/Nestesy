import React, { useState, useEffect } from 'react';
import {
  Home,
  Plus,
  Eye,
  Search,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Square,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Users,
  Star,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Sample data for dashboard stats
const initialStats = {
  totalProperties: 12,
  activeListings: 8,
  pendingApprovals: 2,
  totalEarnings: 425000,
  totalViews: 2847,
  totalInquiries: 156,
  rating: 4.8,
  responseRate: 92
};

// Sample property data
const initialProperties = [
  {
    id: 1,
    title: "Luxury Villa with Garden",
    location: "Pune, Maharashtra",
    price: 65000,
    type: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    area: 2200,
    status: "Active",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
    listedDate: "2026-01-20",
    views: 245,
    inquiries: 12,
    amenities: ["Parking", "Pool", "Garden", "Security", "Power Backup"]
  },
  {
    id: 2,
    title: "Modern 3BHK Apartment",
    location: "Mumbai, Maharashtra",
    price: 45000,
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    status: "Active",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    listedDate: "2026-01-15",
    views: 189,
    inquiries: 8,
    amenities: ["Parking", "Gym", "Security", "Lift"]
  },
  {
    id: 3,
    title: "Cozy 2BHK Flat",
    location: "Bangalore, Karnataka",
    price: 28000,
    type: "Flat",
    bedrooms: 2,
    bathrooms: 2,
    area: 850,
    status: "Pending",
    image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400",
    listedDate: "2026-01-18",
    views: 67,
    inquiries: 3,
    amenities: ["Parking", "Security", "Lift"]
  },
  {
    id: 4,
    title: "Premium Penthouse",
    location: "Delhi, Delhi",
    price: 85000,
    type: "Penthouse",
    bedrooms: 5,
    bathrooms: 4,
    area: 3200,
    status: "Inactive",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400",
    listedDate: "2026-01-10",
    views: 412,
    inquiries: 18,
    amenities: ["Parking", "Pool", "Gym", "Garden", "Security", "Terrace"]
  }
];

const HostDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState(initialProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [stats, setStats] = useState(initialStats);
  const [notification, setNotification] = useState(null);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle view property details
  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  // Navigate to add property page
  const handleAddProperty = () => {
    navigate('/host/add-property');
  };

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
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

  return (
    <div> 
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

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Properties</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalProperties}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-green-600 font-medium">↑ 12%</span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Listings</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.activeListings}</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-green-600 font-medium">↑ 8%</span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.pendingApprovals}</h3>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-yellow-600 font-medium">⏳ Awaiting review</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Earnings</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">₹{stats.totalEarnings.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-green-600 font-medium">↑ 23%</span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Inquiries</p>
            <p className="text-lg font-bold text-gray-800">{stats.totalInquiries}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Rating</p>
            <p className="text-lg font-bold text-gray-800">{stats.rating} ★</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-teal-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Response Rate</p>
            <p className="text-lg font-bold text-gray-800">{stats.responseRate}%</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button
            onClick={handleAddProperty}
            className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-green-600/20"
          >
            <Plus className="w-5 h-5" />
            Add Property
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48">
              <img 
                src={property.image} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadge(property.status)}`}>
                {getStatusIcon(property.status)}
                {property.status}
              </span>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 text-lg mb-1">{property.title}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <MapPin className="w-4 h-4" />
                {property.location}
              </div>
              <div className="flex items-center gap-4 text-sm mb-3">
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
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-bold text-gray-800">{property.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">/mo</span>
                </div>
                <button
                  onClick={() => handleViewDetails(property)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No properties found</h3>
          <p className="text-gray-400 mt-1">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Property Detail Modal */}
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
              <div className="relative h-56">
                <img 
                  src={selectedProperty.image} 
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
                <span className={`absolute bottom-4 right-4 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusBadge(selectedProperty.status)}`}>
                  {getStatusIcon(selectedProperty.status)}
                  {selectedProperty.status}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedProperty.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  {selectedProperty.location}
                </div>

                <div className="flex items-center gap-6 text-sm mb-4">
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
                </div>

                <div className="flex items-center gap-1 mb-4">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-gray-800">{selectedProperty.price.toLocaleString()}</span>
                  <span className="text-gray-500">/month</span>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm">
                    {selectedProperty.description || 'Spacious property with premium finishes. Perfect for families seeking comfort and elegance.'}
                  </p>
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
                  <span>Listed on: {selectedProperty.listedDate}</span>
                  <div className="flex gap-4">
                    <span>👁️ {selectedProperty.views} views</span>
                    <span>💬 {selectedProperty.inquiries} inquiries</span>
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

export default HostDashboard;