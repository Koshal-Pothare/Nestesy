import React, { useEffect, useState } from "react";
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
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toggleFavorite, isFavorite } from "../utils/favorite";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80";

const PropertyCard = ({ 
  property, 
  index = 0, 
  onClick, 
  onDelete, 
  variant = "public", 
}) => { 
  const navigate = useNavigate(); 
 
  const [favorite, setFavorite] = useState(false); 
  const [deleting, setDeleting] = useState(false); 
 
  const isOwnerCard = variant === "owner"; 
  const isPublicCard = variant === "public"; 
 
  useEffect(() => { 
    if (isPublicCard && property?.id) { 
      setFavorite(isFavorite(property.id)); 
    } 
  }, [property?.id, isPublicCard]); 
 
  const getStatusBadge = (status, verification) => { 
    const normalizedStatus = String(status || "").trim().toLowerCase(); 
 
    if (normalizedStatus === "active" && verification?.verified) { 
      return { 
        bg: "bg-green-100", 
        text: "text-green-800", 
        icon: <CheckCircle className="w-3 h-3" />, 
        label: "Verified", 
      }; 
    } 
 
    switch (normalizedStatus) { 
      case "active": 
        return { 
          bg: "bg-green-100", 
          text: "text-green-800", 
          icon: <CheckCircle className="w-3 h-3" />, 
          label: "Active", 
        }; 
      case "approved": 
        return { 
          bg: "bg-green-100", 
          text: "text-green-800", 
          icon: <CheckCircle className="w-3 h-3" />, 
          label: "Approved", 
        }; 
      case "pending": 
        return { 
          bg: "bg-yellow-100", 
          text: "text-yellow-800", 
          icon: <Clock className="w-3 h-3" />, 
          label: "Pending", 
        }; 
      case "rented": 
        return { 
          bg: "bg-blue-100", 
          text: "text-blue-800", 
          icon: <CheckCircle className="w-3 h-3" />, 
          label: "Rented", 
        }; 
      case "inactive": 
      case "rejected": 
        return { 
          bg: "bg-red-100", 
          text: "text-red-800", 
          icon: <AlertCircle className="w-3 h-3" />, 
          label: "Rejected", 
        }; 
      default: 
        return { 
          bg: "bg-gray-100", 
          text: "text-gray-800", 
          icon: <AlertCircle className="w-3 h-3" />, 
          label: "Unknown", 
        }; 
    } 
  }; 
 
  const handleCardClick = () => { 
    if (deleting) return; 
    if (onClick) { 
      onClick(); 
      return; 
    } 
    if (property?.id) { 
      navigate(`/property/${property.id}`); 
    } 
  }; 
 
  const handleViewDetails = (event) => { 
    event.stopPropagation(); 
    if (onClick) { 
      onClick(); 
      return; 
    } 
    if (property?.id) { 
      navigate(`/property/${property.id}`); 
    } 
  }; 
 
  const handleFavorite = (event) => { 
    event.stopPropagation(); 
    const storedUser = localStorage.getItem("nestesyLoggedInUser"); 
    if (!storedUser) { 
      alert("Please login to add properties to wishlist"); 
      return; 
    } 
    let user; 
    try { 
      user = JSON.parse(storedUser); 
    } catch { 
      user = null; 
    } 
    if (!user) { 
      alert("Please login to add properties to wishlist"); 
      return; 
    } 
    const result = toggleFavorite(property); 
    if (result === null) { 
      alert("Please login to add properties to wishlist"); 
      return; 
    } 
    setFavorite(result); 
    window.dispatchEvent(new Event("storage")); 
    window.dispatchEvent(new CustomEvent("favoritesUpdated")); 
  }; 
 
  const handleDelete = async (event) => { 
    event.stopPropagation(); 
    if (!property?.id || deleting || !onDelete) return; 
 
    const confirmed = window.confirm( 
      `Are you sure you want to delete "${property.title}"?\n\nThis action cannot be undone.` 
    ); 
 
    if (!confirmed) return; 
 
    try { 
      setDeleting(true); 
      await onDelete(property.id); 
    } catch (error) { 
      console.error("Delete property error:", error); 
      alert(error?.message || "Failed to delete property. Please try again."); 
      setDeleting(false); 
    } 
  }; 
 
  const status = getStatusBadge(property?.status, property?.verification); 
 
  const image = 
    property?.allImages?.find( 
      (item) => typeof item === "string" && item.trim() !== "" && !item.startsWith("blob:") 
    ) || 
    property?.images?.find( 
      (item) => typeof item === "string" && item.trim() !== "" && !item.startsWith("blob:") 
    ) || 
    FALLBACK_IMAGE; 
 
  const bedrooms = Number(property?.bedrooms) || Number(property?.bhk) || 0; 
  const bathrooms = Number(property?.bathrooms) || 0; 
  const area = Number(property?.area) || 0; 
  const price = Number(property?.price) || 0; 
 
  return ( 
    <motion.div 
      onClick={handleCardClick} 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: deleting ? 0.5 : 1, y: 0 }} 
      transition={{ delay: index * 0.05 }} 
      whileHover={deleting ? {} : { y: -5 }} 
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300" 
    > 
      <div className="relative overflow-hidden h-56"> 
        <img 
          src={image} 
          alt={property?.title || "Property"} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          onError={(event) => { 
            if (event.currentTarget.src !== FALLBACK_IMAGE) { 
              event.currentTarget.src = FALLBACK_IMAGE; 
            } 
          }} 
        /> 
 
        <div className="absolute top-3 left-3"> 
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${status.bg} ${status.text}`}> 
            {status.icon} 
            {status.label} 
          </span> 
        </div> 
 
        <div className="absolute top-3 right-3 flex items-center gap-2"> 
          {isPublicCard && ( 
            <button 
              type="button" 
              onClick={handleFavorite} 
              className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${ 
                favorite 
                  ? "bg-white text-red-500 shadow-md" 
                  : "bg-white text-gray-600 hover:bg-red-500 hover:text-white shadow-md" 
              }`} 
              title={favorite ? "Remove from favorites" : "Add to favorites"} 
            > 
              <Heart size={18} fill={favorite ? "currentColor" : "none"} /> 
            </button> 
          )} 
 
          {isOwnerCard && ( 
            <button 
              type="button" 
              onClick={handleDelete} 
              disabled={deleting} 
              className="h-10 w-10 rounded-full flex items-center justify-center bg-white text-red-500 shadow-md hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
              title="Delete property" 
            > 
              {deleting ? ( 
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> 
              ) : ( 
                <Trash2 className="w-[18px] h-[18px]" /> 
              )} 
            </button> 
          )} 
        </div> 
 
        <button 
          type="button" 
          onClick={handleViewDetails} 
          className="absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shadow-sm" 
          title="View details" 
        > 
          <Eye className="w-4 h-4 text-gray-700" /> 
        </button> 
      </div> 
 
      <div className="p-5"> 
        <h2 className="text-xl font-semibold text-gray-900 line-clamp-1"> 
          {property?.title || "Untitled Property"} 
        </h2> 
 
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1"> 
          <MapPin size={14} /> 
          <span className="line-clamp-1"> 
            {property?.location || "Location not available"} 
          </span> 
        </div> 
 
        <div className="flex items-center gap-4 text-gray-500 text-sm mt-4"> 
          <div className="flex items-center gap-1"> 
            <BedDouble size={16} /> 
            <span>{bedrooms} Beds</span> 
          </div> 
          <div className="flex items-center gap-1"> 
            <Bath size={16} /> 
            <span>{bathrooms} Baths</span> 
          </div> 
          <div className="flex items-center gap-1"> 
            <Ruler size={16} /> 
            <span>{area} sq.ft</span> 
          </div> 
        </div> 
 
        <div className="mt-5 flex items-end justify-between gap-3"> 
          <div className="flex items-end gap-1 min-w-0"> 
            <span className="text-3xl font-bold text-primary-700"> 
              ₹{price.toLocaleString("en-IN")} 
            </span> 
            <span className="text-gray-500 text-sm mb-1">/month</span> 
          </div> 
 
          {property?.status === "pending" && ( 
            <div className="flex-shrink-0 flex items-center gap-1 text-yellow-600 text-xs bg-yellow-50 px-2 py-1 rounded-full"> 
              <Clock className="w-3 h-3" /> Pending 
            </div> 
          )} 
          {(property?.status === "rejected" || property?.status === "inactive") && ( 
            <div className="flex-shrink-0 flex items-center gap-1 text-red-600 text-xs bg-red-50 px-2 py-1 rounded-full"> 
              <AlertCircle className="w-3 h-3" /> Rejected 
            </div> 
          )} 
          {property?.status === "rented" && ( 
            <div className="flex-shrink-0 flex items-center gap-1 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full"> 
              <CheckCircle className="w-3 h-3" /> Rented 
            </div> 
          )} 
        </div> 
 
        <div className="mt-2 text-xs text-gray-400"> 
          Listed: {property?.listedDate || property?.createdAt || "N/A"} 
        </div> 
      </div> 
    </motion.div> 
  ); 
}; 
 
export default PropertyCard;