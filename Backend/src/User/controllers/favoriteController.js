const Favorite = require("../models/Favorite");

const addFavorite = async (req, res) => {
  try {
    const {
      propertyId,
      title,
      location,
      price,
      bedrooms,
      bathrooms,
      area,
      images,
      description,
    } = req.body;

    const tenantId = req.user?._id;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const safePropertyId = String(propertyId || req.body._id || req.body.id || "").trim();
    const safeTitle = String(title || req.body.name || "Untitled Property").trim();
    const safeLocation = String(
      location ||
      [req.body.locality, req.body.city, req.body.state].filter(Boolean).join(", ") ||
      req.body.address ||
      "Location not available"
    ).trim();

    if (!safePropertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    const existingFavorite = await Favorite.findOne({
      tenant: tenantId,
      propertyId: safePropertyId,
    });

    if (existingFavorite) {
      return res.status(200).json({
        success: true,
        message: "Property already in favorites",
        favorite: existingFavorite,
      });
    }

    const safeImages = Array.isArray(images)
      ? images
      : Array.isArray(req.body.allImages)
      ? req.body.allImages
      : [];

    const favorite = await Favorite.create({
      tenant: tenantId,
      propertyId: safePropertyId,
      title: safeTitle,
      location: safeLocation,
      price: Number(price ?? req.body.rent ?? 0) || 0,
      bedrooms: Number(bedrooms ?? req.body.bhk ?? 0) || 0,
      bathrooms: Number(bathrooms ?? 0) || 0,
      area: Number(area ?? req.body.squareFeet ?? 0) || 0,
      images: safeImages,
      description: description || req.body.details || "",
    });

    return res.status(201).json({
      success: true,
      message: "Added to favorites",
      favorite,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);

    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Property already in favorites",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while adding favorite",
    });
  }
};

const getFavorites = async (req, res) => {
  try {
    const tenantId = req.user?._id;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const favorites = await Favorite.find({
      tenant: tenantId,
    }).sort({
      addedAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: favorites.length,
      favorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching favorites",
    });
  }
};

const isFavorited = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const tenantId = req.user?._id;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    const favorite = await Favorite.findOne({
      tenant: tenantId,
      propertyId: String(propertyId),
    });

    return res.status(200).json({
      success: true,
      isFavorited: Boolean(favorite),
    });
  } catch (error) {
    console.error("Error checking favorite status:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "An error occurred while checking favorite status",
    });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const tenantId = req.user?._id;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    const favorite = await Favorite.findOneAndDelete({
      tenant: tenantId,
      propertyId: String(propertyId),
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Removed from favorites",
    });
  } catch (error) {
    console.error("Error removing favorite:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while removing favorite",
    });
  }
};

const getFavoriteCount = async (req, res) => {
  try {
    const tenantId = req.user?._id;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const count = await Favorite.countDocuments({
      tenant: tenantId,
    });

    return res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error fetching favorite count:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while fetching favorite count",
    });
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
  isFavorited,
  getFavoriteCount,
};