const cloudinary = require('../../config/cloudinary');

const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  const publicId = fileName.split('.')[0];
  const folder = parts[parts.length - 2];
  return `${folder}/${publicId}`;
};

module.exports = { deleteImage, extractPublicId };