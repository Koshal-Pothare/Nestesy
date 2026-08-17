const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary SDK
 * Uses environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Verify Cloudinary configuration
 * Logs status on startup
 */
const verifyCloudinaryConfig = async () => {
  try {
    // Test the configuration
    const result = await cloudinary.api.resources({ max_results: 1 });
    console.log('✅ Cloudinary configured successfully');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary configuration failed:', error.message);
    return false;
  }
};

/**
 * Upload single image to Cloudinary
 * @param {Buffer} buffer - Image buffer from multer
 * @param {string} folder - Cloudinary folder path (e.g., 'nestesy/properties')
 * @param {string} publicId - Optional custom public ID
 * @returns {Promise<Object>} Cloudinary response with secure_url
 */
const uploadImage = (buffer, folder = 'nestesy/properties', publicId = null) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        public_id: publicId,
        quality: 'auto',
        fetch_format: 'auto', // Auto-optimize format
        width: 1200,
        crop: 'fill'
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Upload multiple images in parallel
 * @param {Array<Buffer>} buffers - Array of image buffers
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<Array>} Array of upload results
 */
const uploadMultipleImages = async (buffers, folder = 'nestesy/properties') => {
  if (!Array.isArray(buffers) || buffers.length === 0) {
    return [];
  }

  try {
    const uploadPromises = buffers.map((buffer, index) => 
      uploadImage(buffer, folder, null)
    );
    const results = await Promise.all(uploadPromises);
    return results.map(r => r.url);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID of the image
 * @returns {Promise<Object>} Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Delete multiple images in parallel
 * @param {Array<string>} publicIds - Array of Cloudinary public IDs
 * @returns {Promise<Array>} Array of deletion results
 */
const deleteMultipleImages = async (publicIds) => {
  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    return [];
  }

  try {
    const deletePromises = publicIds.map(id => deleteImage(id));
    return await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple images:', error);
    throw error;
  }
};

/**
 * Generate optimized Cloudinary URL for different sizes
 * @param {string} secureUrl - Cloudinary secure URL
 * @param {string} size - 'thumbnail', 'medium', or 'large'
 * @returns {string} Optimized URL
 */
const getOptimizedImageUrl = (secureUrl, size = 'medium') => {
  const sizes = {
    thumbnail: 'w_200,h_200,c_fill,q_auto,f_auto',
    medium: 'w_600,h_400,c_fill,q_auto,f_auto',
    large: 'w_1200,h_800,c_fill,q_auto,f_auto'
  };

  if (!secureUrl) return null;

  // Extract public ID from URL and regenerate with transformations
  const matches = secureUrl.match(/\/([^/]+)\/([^/]+)$/);
  if (matches) {
    const folder = matches[1];
    const filename = matches[2];
    return `${secureUrl.split('/upload/')[0]}/upload/${sizes[size] || sizes.medium}/${folder}/${filename}`;
  }

  return secureUrl;
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  getOptimizedImageUrl,
  verifyCloudinaryConfig
};