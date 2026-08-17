const multer = require('multer');

// Buffer files in memory; cloudUploader streams them straight to Cloudinary
// (no need to write to local disk first).
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB per image
});

// Bedroom images are sent as bedroomImages_0, bedroomImages_1, ... one field
// per bedroom (max 5 BHK), so the frontend must append files under that
// naming convention instead of a single shared 'bedroomImages' field.
const bedroomFields = Array.from({ length: 5 }, (_, i) => ({
  name: `bedroomImages_${i}`,
  maxCount: 2,
}));

// Field names mirror the sections in AddProperty.jsx + PropertyVerification.jsx
const propertyImageFields = upload.fields([
  { name: 'outerImages', maxCount: 5 },
  { name: 'livingRoomImages', maxCount: 2 },
  { name: 'bathroomImages', maxCount: 2 },
  { name: 'balconyImages', maxCount: 2 },
  { name: 'kitchenImages', maxCount: 2 },
  ...bedroomFields,
  { name: 'aadhar', maxCount: 1 },
  { name: 'pan', maxCount: 1 },
  { name: 'propertyTax', maxCount: 1 },
  { name: 'ownershipDeed', maxCount: 1 },
  { name: 'utilityBill', maxCount: 1 },
]);

module.exports = { upload, propertyImageFields };