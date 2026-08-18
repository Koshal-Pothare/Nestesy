import Favorite from '../models/Favorite.js';

// Add property to favorites
export const addFavorite = async (req, res) => {
  try {
    const { propertyId, title, location, price, bedrooms, bathrooms, area, images, description } = req.body;
    const tenantId = req.user._id;

    // Validation
    if (!propertyId || !title || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      tenant: tenantId,
      propertyId,
    });

    if (existingFavorite) {
      return res.status(409).json({
        success: false,
        message: 'Property already in favorites',
      });
    }

    const favorite = new Favorite({
      tenant: tenantId,
      propertyId,
      title,
      location,
      price,
      bedrooms,
      bathrooms,
      area,
      images,
      description,
    });

    await favorite.save();

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      favorite,
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while adding favorite',
    });
  }
};

// Get all favorites
export const getFavorites = async (req, res) => {
  try {
    const tenantId = req.user._id;

    const favorites = await Favorite.find({ tenant: tenantId }).sort({ addedAt: -1 });

    res.status(200).json({
      success: true,
      count: favorites.length,
      favorites,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching favorites',
    });
  }
};

// Check if property is favorited
export const isFavorited = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const tenantId = req.user._id;

    const favorite = await Favorite.findOne({
      tenant: tenantId,
      propertyId,
    });

    res.status(200).json({
      success: true,
      isFavorited: !!favorite,
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while checking favorite status',
    });
  }
};

// Remove from favorites
export const removeFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const tenantId = req.user._id;

    const favorite = await Favorite.findOneAndDelete({
      tenant: tenantId,
      propertyId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Removed from favorites',
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while removing favorite',
    });
  }
};

// Get favorite count
export const getFavoriteCount = async (req, res) => {
  try {
    const tenantId = req.user._id;

    const count = await Favorite.countDocuments({ tenant: tenantId });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Error fetching favorite count:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching favorite count',
    });
  }
};
