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

    if (!propertyId || !title || !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const existingFavorite = await Favorite.findOne({
      tenant: tenantId,
      propertyId: String(propertyId),
    });

    if (existingFavorite) {
      return res.status(409).json({
        success: false,
        message: "Property already in favorites",
        favorite: existingFavorite,
      });
    }

    const favorite = await Favorite.create({
      tenant: tenantId,
      propertyId: String(propertyId),
      title,
      location,
      price: Number(price) || 0,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      area: Number(area) || 0,
      images: Array.isArray(images) ? images : [],
      description: description || "",
    });

    return res.status(201).json({
      success: true,
      message: "Added to favorites",
      favorite,
    });
  } catch (error) {
    console.error("Error adding favorite:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
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