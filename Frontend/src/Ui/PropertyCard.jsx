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
import { toast } from "react-toastify";

import { WishlistService } from "../services/UserServices";
import {
  addToFavorites,
  removeFromFavorites,
  isFavorite as isLocalFavorite,
} from "../utils/favorite";

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
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwnerCard = variant === "owner";
  const isPublicCard = variant === "public";

  /*
   * Get the property ID safely.
   */
  const propertyId = String(
    property?.propertyId || property?._id || property?.id || ""
  );

  /*
   * Check whether this property is already in wishlist.
   */
  useEffect(() => {
    let mounted = true;

    const checkFavorite = async () => {
      if (!isPublicCard || !propertyId) {
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        if (mounted) {
          setFavorite(isLocalFavorite(propertyId));
        }
        return;
      }

      try {
        const response = await WishlistService.checkFavorite(propertyId);
        if (mounted) {
          setFavorite(
            Boolean(response?.isFavorited || isLocalFavorite(propertyId))
          );
        }
      } catch {
        if (mounted) {
          setFavorite(isLocalFavorite(propertyId));
        }
      }
    };

    checkFavorite();

    return () => {
      mounted = false;
    };
  }, [propertyId, isPublicCard]);

  /*
   * Property status badge
   */
  const getStatusBadge = (status, verification) => {
    const normalizedStatus = String(status || "")
      .trim()
      .toLowerCase();

    if (
      normalizedStatus === "active" &&
      verification?.verified
    ) {
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

  /*
   * Open property details
   */
  const handleCardClick = () => {
    if (deleting) return;

    if (onClick) {
      onClick();
      return;
    }

    if (propertyId) {
      navigate(`/property/${propertyId}`);
    }
  };

  /*
   * View details button
   */
  const handleViewDetails = (event) => {
    event.stopPropagation();

    if (onClick) {
      onClick();
      return;
    }

    if (propertyId) {
      navigate(`/property/${propertyId}`);
    }
  };

  /*
   * Add / Remove wishlist
   */
  const handleFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (favoriteLoading) {
      return;
    }

    if (!propertyId) {
      toast.error("Property ID is missing");
      return;
    }

    const token = localStorage.getItem("token");

    const safeLocation =
      property?.location ||
      [property?.locality, property?.city, property?.state]
        .filter(Boolean)
        .join(", ") ||
      property?.address ||
      "Location not available";

    const safeTitle = property?.title || property?.name || "Untitled Property";
    const safePrice =
      Number(property?.price ?? property?.rent ?? property?.monthlyRent ?? 0) ||
      0;
    const safeBedrooms =
      Number(property?.bedrooms ?? property?.bhk ?? 0) || 0;
    const safeBathrooms =
      Number(property?.bathrooms ?? property?.bath ?? 0) || 0;
    const safeArea =
      Number(property?.area ?? property?.squareFeet ?? property?.size ?? 0) ||
      0;
    const safeImages =
      property?.allImages || property?.images || property?.outerImages || [];

    try {
      setFavoriteLoading(true);

      /*
       * REMOVE FROM WISHLIST
       */
      if (favorite) {
        if (token) {
          try {
            await WishlistService.removeFavorite(propertyId);
          } catch (err) {
            console.error("API removeFavorite error:", err);
          }
        }

        removeFromFavorites(propertyId);
        setFavorite(false);
        toast.success("Removed from wishlist");
      }

      /*
       * ADD TO WISHLIST
       */
      else {
        if (token) {
          try {
            await WishlistService.addFavorite({
              propertyId: propertyId,
              title: safeTitle,
              location: safeLocation,
              price: safePrice,
              bedrooms: safeBedrooms,
              bathrooms: safeBathrooms,
              area: safeArea,
              images: Array.isArray(safeImages) ? safeImages : [],
              description: property?.description || property?.details || "",
            });
          } catch (err) {
            console.error("API addFavorite error:", err);
          }
        }

        addToFavorites({
          ...property,
          id: propertyId,
          _id: propertyId,
          propertyId: propertyId,
          title: safeTitle,
          location: safeLocation,
          price: safePrice,
          bedrooms: safeBedrooms,
          bathrooms: safeBathrooms,
          area: safeArea,
          images: safeImages,
        });

        setFavorite(true);
        toast.success("Added to wishlist");
      }

      /*
       * Notify other components such as Wishlist & UserDashboard.
       */
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    } catch (error) {
      console.error("Wishlist update error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update wishlist";

      toast.error(message);
    } finally {
      setFavoriteLoading(false);
    }
  };

  /*
   * Delete property
   */
  const handleDelete = async (event) => {
    event.stopPropagation();

    if (!propertyId || deleting || !onDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${property?.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await onDelete(propertyId);
    } catch (error) {
      console.error(
        "Delete property error:",
        error
      );

      alert(
        error?.message ||
          "Failed to delete property. Please try again."
      );

      setDeleting(false);
    }
  };

  const status = getStatusBadge(
    property?.status,
    property?.verification
  );

  /*
   * Property image
   */
  const image =
    property?.allImages?.find(
      (item) =>
        typeof item === "string" &&
        item.trim() !== "" &&
        !item.startsWith("blob:")
    ) ||
    property?.images?.find(
      (item) =>
        typeof item === "string" &&
        item.trim() !== "" &&
        !item.startsWith("blob:")
    ) ||
    FALLBACK_IMAGE;

  const bedrooms =
    Number(property?.bedrooms) ||
    Number(property?.bhk) ||
    0;

  const bathrooms =
    Number(property?.bathrooms) || 0;

  const area =
    Number(property?.area) || 0;

  const price =
    Number(property?.price) || 0;

  return (
    <motion.div
      onClick={handleCardClick}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: deleting ? 0.5 : 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.05,
      }}
      whileHover={
        deleting
          ? {}
          : {
              y: -5,
            }
      }
      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={property?.title || "Property"}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(event) => {
            if (
              event.currentTarget.src !== FALLBACK_IMAGE
            ) {
              event.currentTarget.src = FALLBACK_IMAGE;
            }
          }}
        />

        {/* Status */}
        <div className="absolute left-3 top-3">
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${status.bg} ${status.text}`}
          >
            {status.icon}
            {status.label}
          </span>
        </div>

        {/* Top right actions */}
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {/* Wishlist */}
          {isPublicCard && (
            <button
              type="button"
              onClick={handleFavorite}
              disabled={favoriteLoading}
              className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-300 ${
                favorite
                  ? "bg-white text-red-500"
                  : "bg-white text-gray-600 hover:bg-red-500 hover:text-white"
              } ${
                favoriteLoading
                  ? "cursor-not-allowed opacity-60"
                  : ""
              }`}
              title={
                favorite
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              {favoriteLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-500" />
              ) : (
                <Heart
                  size={18}
                  fill={
                    favorite
                      ? "currentColor"
                      : "none"
                  }
                />
              )}
            </button>
          )}

          {/* Owner delete */}
          {isOwnerCard && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition-all duration-300 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              title="Delete property"
            >
              {deleting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
              ) : (
                <Trash2 className="h-[18px] w-[18px]" />
              )}
            </button>
          )}
        </div>

        {/* View details */}
        <button
          type="button"
          onClick={handleViewDetails}
          className="absolute bottom-3 right-3 rounded-lg bg-white/90 p-2.5 opacity-0 shadow-sm backdrop-blur-sm transition-colors hover:bg-white group-hover:opacity-100"
          title="View details"
        >
          <Eye className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <h2 className="line-clamp-1 text-xl font-semibold text-gray-900">
          {property?.title || "Untitled Property"}
        </h2>

        {/* Location */}
        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={14} />

          <span className="line-clamp-1">
            {property?.location ||
              "Location not available"}
          </span>
        </div>

        {/* Property information */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
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

        {/* Price */}
        <div className="mt-5 flex items-end justify-between gap-3">
          <div className="flex min-w-0 items-end gap-1">
            <span className="text-3xl font-bold text-primary-700">
              ₹{price.toLocaleString("en-IN")}
            </span>

            <span className="mb-1 text-sm text-gray-500">
              /month
            </span>
          </div>

          {property?.status === "pending" && (
            <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs text-yellow-600">
              <Clock className="h-3 w-3" />
              Pending
            </div>
          )}

          {(property?.status === "rejected" ||
            property?.status === "inactive") && (
            <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" />
              Rejected
            </div>
          )}

          {property?.status === "rented" && (
            <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600">
              <CheckCircle className="h-3 w-3" />
              Rented
            </div>
          )}
        </div>

        {/* Listed date */}
        <div className="mt-2 text-xs text-gray-400">
          Listed:{" "}
          {property?.listedDate ||
            property?.createdAt ||
            "N/A"}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;