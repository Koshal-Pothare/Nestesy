const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Property = require("../../owner/models/Property");

const normalizeImages = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .flat(Infinity)
    .filter(
      (image) =>
        typeof image === "string" &&
        image.trim() !== "" &&
        !image.startsWith("blob:")
    );
};

const normalizeProperty = (property) => {
  const data =
    typeof property?.toObject === "function"
      ? property.toObject()
      : property || {};

  const outerImages = normalizeImages(
    data.outerImages
  );

  const livingRoomImages = normalizeImages(
    data.livingRoomImages
  );

  const bathroomImages = normalizeImages(
    data.bathroomImages
  );

  const balconyImages = normalizeImages(
    data.balconyImages
  );

  const kitchenImages = normalizeImages(
    data.kitchenImages
  );

  const bedroomImages = normalizeImages(
    data.bedroomImages
  );

  const images = normalizeImages(
    data.images
  );

  const allImages = [
    ...outerImages,
    ...livingRoomImages,
    ...bathroomImages,
    ...balconyImages,
    ...kitchenImages,
    ...bedroomImages,
    ...images,
  ];

  const uniqueImages = [
    ...new Set(allImages),
  ];

  const ownerId = data.ownerId
    ? data.ownerId.toString()
    : "";

  const price = Number(
    data.rent ??
      data.price ??
      0
  );

  const bedrooms = Number(
    data.bhk ??
      data.bedrooms ??
      0
  );

  const bathrooms = Number(
    data.bathrooms ??
      data.bath ??
      0
  );

  const area = Number(
    data.area ??
      data.squareFeet ??
      0
  );

  const location =
    data.location ||
    [
      data.locality,
      data.city,
    ]
      .filter(Boolean)
      .join(", ") ||
    data.address ||
    "Location not available";

  const host =
    data.verification?.ownerName ||
    "Host";

  const hostPhone =
    data.verification?.ownerPhone ||
    "Not provided";

  const hostEmail =
    data.verification?.ownerEmail ||
    "Not provided";

  return {
    ...data,

    id: data._id
      ? data._id.toString()
      : "",

    _id: data._id
      ? data._id.toString()
      : "",

    ownerId,

    title:
      data.title ||
      "Untitled Property",

    description:
      data.description || "",

    location,

    city:
      data.city || "",

    locality:
      data.locality || "",

    address:
      data.address ||
      data.verification?.propertyAddress ||
      "",

    propertyType:
      data.propertyType || "",

    type:
      data.propertyType || "",

    price,

    rent: Number(
      data.rent ?? 0
    ),

    deposit: Number(
      data.deposit ?? 0
    ),

    bedrooms,

    bhk: bedrooms,

    bathrooms,

    area,

    squareFeet: area,

    furnished:
      data.furnished || "Unfurnished",

    furnishing:
      data.furnished || "Unfurnished",

    tenantPreference:
      data.tenantPreference || "Any",

    amenities:
      Array.isArray(data.amenities)
        ? data.amenities
        : [],

    images: uniqueImages,

    allImages: uniqueImages,

    outerImages,

    livingRoomImages,

    bathroomImages,

    balconyImages,

    kitchenImages,

    bedroomImages,

    host,

    hostPhone,

    hostEmail,

    status:
      data.status || "pending",

    availability:
      data.availability !== false,

    verification:
      data.verification || null,

    coordinates:
      data.coordinates || null,

    views:
      Number(data.views ?? 0),

    createdAt:
      data.createdAt || null,

    updatedAt:
      data.updatedAt || null,
  };
};

const getPublicProperties = asyncHandler(
  async (req, res) => {
    const properties =
      await Property.find({
        status: {
          $in: [
            "approved",
            "active",
          ],
        },

        availability: true,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    const normalizedProperties =
      properties.map(
        normalizeProperty
      );

    res.status(200).json({
      success: true,

      count:
        normalizedProperties.length,

      properties:
        normalizedProperties,
    });
  }
);

const getPublicPropertyById =
  asyncHandler(
    async (req, res) => {
      const { id } =
        req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        res.status(400);

        throw new Error(
          "Invalid property ID"
        );
      }

      const property =
        await Property.findOne({
          _id: id,

          status: {
            $in: [
              "approved",
              "active",
            ],
          },

          availability: true,
        }).lean();

      if (!property) {
        res.status(404);

        throw new Error(
          "Property not found or not available"
        );
      }

      res.status(200).json({
        success: true,

        property:
          normalizeProperty(
            property
          ),
      });
    }
  );

module.exports = {
  getPublicProperties,
  getPublicPropertyById,
};