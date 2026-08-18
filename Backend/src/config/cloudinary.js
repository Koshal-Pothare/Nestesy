const cloudinary = require("cloudinary").v2;

/*
|--------------------------------------------------------------------------
| Cloudinary Configuration
|--------------------------------------------------------------------------
*/

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName) {
  console.error("❌ CLOUDINARY_CLOUD_NAME is missing");
}

if (!apiKey) {
  console.error("❌ CLOUDINARY_API_KEY is missing");
}

if (!apiSecret) {
  console.error("❌ CLOUDINARY_API_SECRET is missing");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

/*
|--------------------------------------------------------------------------
| Verify Configuration
|--------------------------------------------------------------------------
*/

const verifyCloudinaryConfig = async () => {
  if (!cloudName || !apiKey || !apiSecret) {
    console.error(
      "❌ Cloudinary configuration is incomplete."
    );

    return false;
  }

  try {
    await cloudinary.api.ping();

    console.log("✅ Cloudinary configured successfully");
    console.log(`☁️ Cloud name: ${cloudName}`);

    return true;
  } catch (error) {
    console.error(
      "❌ Cloudinary configuration failed:",
      error?.message || error
    );

    return false;
  }
};

/*
|--------------------------------------------------------------------------
| Upload Single Image
|--------------------------------------------------------------------------
*/

const uploadImage = (
  buffer,
  folder = "nestesy/properties",
  publicId = undefined
) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(
        new Error("Image buffer is required")
      );
    }

    const options = {
      folder,
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
      transformation: [
        {
          width: 1600,
          height: 1200,
          crop: "limit",
        },
      ],
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const uploadStream =
      cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            console.error(
              "❌ Cloudinary upload error:",
              error.message
            );

            return reject(error);
          }

          if (!result) {
            return reject(
              new Error(
                "Cloudinary returned an empty response"
              )
            );
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        }
      );

    uploadStream.end(buffer);
  });
};

/*
|--------------------------------------------------------------------------
| Upload Multiple Images
|--------------------------------------------------------------------------
*/

const uploadMultipleImages = async (
  buffers,
  folder = "nestesy/properties"
) => {
  if (!Array.isArray(buffers) || buffers.length === 0) {
    return [];
  }

  const validBuffers = buffers.filter(Boolean);

  if (validBuffers.length === 0) {
    return [];
  }

  try {
    const results = await Promise.all(
      validBuffers.map((buffer) =>
        uploadImage(buffer, folder)
      )
    );

    return results;
  } catch (error) {
    console.error(
      "❌ Multiple image upload failed:",
      error.message
    );

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Delete Single Image
|--------------------------------------------------------------------------
*/

const deleteImage = async (publicId) => {
  if (!publicId) {
    return null;
  }

  try {
    const result =
      await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (error) {
    console.error(
      "❌ Cloudinary delete error:",
      error.message
    );

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Delete Multiple Images
|--------------------------------------------------------------------------
*/

const deleteMultipleImages = async (publicIds) => {
  if (!Array.isArray(publicIds) || publicIds.length === 0) {
    return [];
  }

  const validIds = publicIds.filter(Boolean);

  if (validIds.length === 0) {
    return [];
  }

  return Promise.all(
    validIds.map((publicId) =>
      deleteImage(publicId)
    )
  );
};

/*
|--------------------------------------------------------------------------
| Optimized Image URL
|--------------------------------------------------------------------------
*/

const getOptimizedImageUrl = (
  secureUrl,
  size = "medium"
) => {
  if (!secureUrl) {
    return null;
  }

  const transformations = {
    thumbnail:
      "w_300,h_200,c_fill,q_auto,f_auto",
    medium:
      "w_700,h_500,c_fill,q_auto,f_auto",
    large:
      "w_1400,h_1000,c_limit,q_auto,f_auto",
  };

  const transformation =
    transformations[size] ||
    transformations.medium;

  if (!secureUrl.includes("/upload/")) {
    return secureUrl;
  }

  return secureUrl.replace(
    "/upload/",
    `/upload/${transformation}/`
  );
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages,
  getOptimizedImageUrl,
  verifyCloudinaryConfig,
};