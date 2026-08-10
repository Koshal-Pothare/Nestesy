import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { toggleFavorite, isFavorite } from "../utils/favorite";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property, index }) => {
    const [favorite, setFavorite] = useState(isFavorite(property.id));
    const navigate = useNavigate();

    const handleFavorite = () => {
        const added = toggleFavorite(property);
        setFavorite(added);

        if (added) {
            toast.success("Property added to Wishlist ❤️");
        } else {
            toast.info("Property removed from Wishlist");
        }
    };

    const handleViewProperty = () => {
        navigate(`/property/${property.id}`);
    };

    return (
        <motion.div
            key={property.id}
            onClick={handleViewProperty}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="group cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            {/* Image */}
            <div className="relative overflow-hidden h-56">
                <img
                    src={property.images?.[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-md bg-primary-600 text-white">
                    Featured
                </span>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFavorite();
                    }}
                    className={`absolute top-3 right-3 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        favorite
                            ? "bg-white text-red-500"
                            : "bg-white text-gray-600 hover:bg-primary-600 hover:text-white"
                    }`}
                >
                    <Heart
                        size={18}
                        fill={favorite ? "currentColor" : "none"}
                    />
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

                {/* Price */}
                <div className="mt-5 flex items-end gap-1">
                    <span className="text-3xl font-bold text-primary-700">
                        ₹{property.price?.toLocaleString()}
                    </span>

                    <span className="text-gray-500 text-sm mb-1">
                        /month
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default PropertyCard;