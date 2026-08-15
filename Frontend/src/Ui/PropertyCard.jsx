import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  BedDouble, 
  Bath, 
  Ruler, 
  MapPin, 
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  IndianRupee
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property, index, onClick }) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);

  const getStatusBadge = (status, verification) => {
    if (status === 'Active' && verification?.verified) {
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Verified ✓'
      };
    }
    switch(status) {
      case 'Active':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle className="w-3 h-3" />,
          label: 'Active'
        };
      case 'Pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <Clock className="w-3 h-3" />,
          label: 'Pending'
        };
      case 'Inactive':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: <AlertCircle className="w-3 h-3" />,
          label: 'Rejected'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <AlertCircle className="w-3 h-3" />,
          label: 'Unknown'
        };
    }
  };

  // Handle click on the card
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Fallback: navigate to property details
      navigate(`/host/property/${property.id}`);
    }
  };

  // Handle view details button click (stops propagation)
  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      navigate(`/host/property/${property.id}`);
    }
  };

  const status = getStatusBadge(property.status, property.verification);

  // Don't show favorite button for host properties
  const showFavorite = false; // Set to false for host view

  return (
    <motion.div
      key={property.id}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Status Badge - Single verification badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${status.bg} ${status.text}`}>
            {status.icon}
            {status.label}
          </span>
        </div> 

        {/* Quick View Button */}
        <button
          onClick={handleViewDetails}
          className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
        >
          <Eye className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
          {property.title}
        </h2>

        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <MapPin size={14} />
          <span>{property.location}</span>
        </div>

        {/* Details */}
        <div className="flex items-center gap-4 text-gray-500 text-sm mt-4">
          <div className="flex items-center gap-1">
            <BedDouble size={16} />
            <span>{property.bedrooms} Beds</span>
          </div>

          <div className="flex items-center gap-1">
            <Bath size={16} />
            <span>{property.bathrooms} Baths</span>
          </div>

          <div className="flex items-center gap-1">
            <Ruler size={16} />
            <span>{property.area} sq.ft</span>
          </div>
        </div>

        {/* Price & Status */}
        <div className="mt-5 flex items-end justify-between">
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-primary-700">
              ₹{property.price?.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm mb-1">/month</span>
          </div>

          {/* Status Indicator - Only show if status is not already shown in badge */}
          {property.status === 'Pending' && !property.verification?.verified && (
            <div className="flex items-center gap-1 text-yellow-600 text-xs bg-yellow-50 px-2 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              Pending
            </div>
          )}
          {property.status === 'Inactive' && (
            <div className="flex items-center gap-1 text-red-600 text-xs bg-red-50 px-2 py-1 rounded-full">
              <AlertCircle className="w-3 h-3" />
              Rejected
            </div>
          )}
        </div>

        {/* Listed Date */}
        <div className="mt-2 text-xs text-gray-400">
          Listed: {property.listedDate || 'N/A'}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;