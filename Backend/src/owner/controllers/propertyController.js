const asyncHandler = require("express-async-handler");
const Property = require("../models/Property");
const { uploadImage } = require("../../config/cloudinary");

const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const parseObject = (value) => {
  if (!value) return {};
  if (typeof value === "object") return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
};

// Convert { lat, lng } / { latitude, longitude } to GeoJSON Point
const normalizeCoordinates = (raw) => {
  if (!raw || typeof raw !== "object") return null;

  const lat =
    raw.lat ?? raw.latitude ?? (Array.isArray(raw.coordinates) ? raw.coordinates[1] : null);
  const lng =
    raw.lng ?? raw.lon ?? raw.longitude ?? (Array.isArray(raw.coordinates) ? raw.coordinates[0] : null);

  if (lat == null || lng == null) return null;

  const numLat = Number(lat);
  const numLng = Number(lng);
  if (!Number.isFinite(numLat) || !Number.isFinite(numLng)) return null;

  return { type: "Point", coordinates: [numLng, numLat] };
};

const getFiles = (req, fieldName) => {
  if (!req.files) return [];
  if (Array.isArray(req.files)) {
    return req.files.filter((file) => file?.fieldname === fieldName);
  }
  return Array.isArray(req.files[fieldName]) ? req.files[fieldName] : [];
};

const uploadFiles = async (files, folder) => {
  if (!Array.isArray(files) || files.length === 0) return [];
  const results = await Promise.all(
    files.filter((file) => file?.buffer).map((file) => uploadImage(file.buffer, `nestesy/${folder}`))
  );
  return results.map((r) => r?.url || r?.secure_url).filter(Boolean);
};

const uploadSingleFile = async (file, folder) => {
  if (!file?.buffer) return null;
  const result = await uploadImage(file.buffer, `nestesy/${folder}`);
  return result?.url || result?.secure_url || null;
};

const normalizeBedroomImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .flat(Infinity)
    .filter((image) => typeof image === "string" && image.trim() !== "");
};

const normalizeProperty = (property) => {
  const data =
    typeof property?.toObject === "function" ? property.toObject() : property || {};

  const outerImages = Array.isArray(data.outerImages) ? data.outerImages : [];
  const livingRoomImages = Array.isArray(data.livingRoomImages) ? data.livingRoomImages : [];
  const bathroomImages = Array.isArray(data.bathroomImages) ? data.bathroomImages : [];
  const balconyImages = Array.isArray(data.balconyImages) ? data.balconyImages : [];
  const kitchenImages = Array.isArray(data.kitchenImages) ? data.kitchenImages : [];
  const bedroomImages = normalizeBedroomImages(data.bedroomImages);
  const images = Array.isArray(data.images) ? data.images : [];

  const allImages = [
    ...outerImages,
    ...livingRoomImages,
    ...bathroomImages,
    ...balconyImages,
    ...kitchenImages,
    ...bedroomImages,
    ...images,
  ].filter((image) => typeof image === "string" && image.trim() !== "" && !image.startsWith("blob:"));
  const uniqueImages = [...new Set(allImages)];

  const ownerId = data.ownerId || data.owner?._id || data.owner || null;

  const price = Number(data.price ?? data.rent ?? data.monthlyRent ?? 0);
  const bedrooms = Number(data.bedrooms ?? data.bhk ?? 0);
  const bathrooms = Number(data.bathrooms ?? data.bath ?? 0);
  const area = Number(data.area ?? data.squareFeet ?? data.size ?? 0);

  const location =
    data.location ||
    [data.locality, data.city, data.state].filter(Boolean).join(", ") ||
    data.address ||
    "Location not available";

  return {
    ...data,
    id: data._id ? data._id.toString() : data.id || "",
    _id: data._id ? data._id.toString() : data.id || "",
    ownerId,
    title: data.title || data.name || "Untitled Property",
    description: data.description || data.details || "",
    location,
    city: data.city || "",
    locality: data.locality || "",
    state: data.state || "",
    country: data.country || "India",
    pincode: data.pincode || data.pinCode || data.zipCode || "",
    address: data.address || data.propertyAddress || data.verification?.propertyAddress || "",
    price,
    rent: Number(data.rent ?? data.price ?? 0),
    monthlyRent: Number(data.monthlyRent ?? data.rent ?? data.price ?? 0),
    maintenance: Number(data.maintenance ?? 0),
    deposit: Number(data.deposit ?? data.securityDeposit ?? 0),
    securityDeposit: Number(data.securityDeposit ?? data.deposit ?? 0),
    type: data.type || data.propertyType || "Property",
    propertyType: data.propertyType || data.type || "Property",
    bedrooms,
    bhk: bedrooms,
    bathrooms,
    kitchens: Number(data.kitchens ?? data.kitchen ?? 0),
    area,
    squareFeet: area,
    furnished: data.furnished || data.furnishing || "",
    furnishing: data.furnishing || data.furnished || "",
    tenantPreference: data.tenantPreference || "",
    idealFor: Array.isArray(data.idealFor) ? data.idealFor : [],
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    images: uniqueImages,
    outerImages,
    livingRoomImages,
    bathroomImages,
    balconyImages,
    kitchenImages,
    bedroomImages,
    allImages: uniqueImages,
    status: data.status || data.approvalStatus || "pending",
    approvalStatus: data.approvalStatus || data.status || "pending",
    availability: data.availability !== false,
    verification: data.verification || null,
    coordinates: data.coordinates || {},
    views: Number(data.views ?? 0),
    inquiries: Number(data.inquiries ?? 0),
    favorites: Number(data.favorites ?? data.likes ?? 0),
    listedDate: data.listedDate || data.createdAt || null,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
  };
};

const createProperty = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    res.status(401);
    throw new Error("Owner authentication required");
  }

  const {
    title, location, price, rent, type, propertyType, bhk, bedrooms,
    bathrooms, area, description, amenities, ownerName, ownerEmail, ownerPhone,
    propertyAddress, additionalNotes, furnished, furnishing, deposit,
    securityDeposit, tenantPreference, idealFor, city, locality, state,
    country, pincode, address, coordinates, maintenance,
  } = req.body;

  const safeAmenities = parseArray(amenities);
  const safeIdealFor = parseArray(idealFor);
  const safeCoordinates = normalizeCoordinates(parseObject(coordinates)) || {
    type: "Point",
    coordinates: [0, 0],
  };

  const safeOuterImages = await uploadFiles(getFiles(req, "outerImages"), "properties/outer");
  const safeLivingRoomImages = await uploadFiles(getFiles(req, "livingRoomImages"), "properties/living-room");
  const safeBathroomImages = await uploadFiles(getFiles(req, "bathroomImages"), "properties/bathroom");
  const safeBalconyImages = await uploadFiles(getFiles(req, "balconyImages"), "properties/balcony");
  const safeKitchenImages = await uploadFiles(getFiles(req, "kitchenImages"), "properties/kitchen");

  const safeBedroomImages = [];
  for (let i = 0; i < 10; i += 1) {
    const bedroomFiles = getFiles(req, `bedroomImages_${i}`);
    if (bedroomFiles.length > 0) {
      const uploaded = await uploadFiles(bedroomFiles, `properties/bedroom-${i + 1}`);
      safeBedroomImages.push(...uploaded);
    }
  }
  const standardBedroomFiles = getFiles(req, "bedroomImages");
  if (standardBedroomFiles.length > 0) {
    const uploaded = await uploadFiles(standardBedroomFiles, "properties/bedrooms");
    safeBedroomImages.push(...uploaded);
  }

  const allImages = [
    ...safeOuterImages, ...safeLivingRoomImages, ...safeBathroomImages,
    ...safeBalconyImages, ...safeKitchenImages, ...safeBedroomImages,
  ].filter(Boolean);

  const aadharFile = getFiles(req, "aadhar")[0];
  const panFile = getFiles(req, "pan")[0];
  const propertyTaxFile = getFiles(req, "propertyTax")[0];
  const ownershipDeedFile = getFiles(req, "ownershipDeed")[0];
  const utilityBillFile = getFiles(req, "utilityBill")[0];

  const [aadharUrl, panUrl, propertyTaxUrl, ownershipDeedUrl, utilityBillUrl] = await Promise.all([
    uploadSingleFile(aadharFile, "documents/aadhar"),
    uploadSingleFile(panFile, "documents/pan"),
    uploadSingleFile(propertyTaxFile, "documents/property-tax"),
    uploadSingleFile(ownershipDeedFile, "documents/ownership-deed"),
    uploadSingleFile(utilityBillFile, "documents/utility-bill"),
  ]);

  const property = await Property.create({
    owner: req.user._id,
    ownerId: req.user._id,
    title: title?.trim() || "",
    description: description?.trim() || "",
    location: location?.trim() || "",
    city: city?.trim() || "",
    locality: locality?.trim() || "",
    state: state?.trim() || "",
    country: country?.trim() || "India",
    pincode: pincode?.trim() || "",
    address: address?.trim() || propertyAddress?.trim() || "",
    price: Number(price ?? rent ?? 0),
    rent: Number(rent ?? price ?? 0),
    monthlyRent: Number(rent ?? price ?? 0),
    deposit: Number(deposit ?? securityDeposit ?? 0),
    securityDeposit: Number(securityDeposit ?? deposit ?? 0),
    maintenance: Number(maintenance ?? 0),
    type: type || propertyType || "",
    propertyType: propertyType || type || "Apartment",
    bedrooms: Number(bedrooms ?? bhk ?? 0),
    bhk: Number(bhk ?? bedrooms ?? 0),
    bathrooms: Number(bathrooms ?? 0),
    area: Number(area ?? 0),
    furnished: furnished || furnishing || "Unfurnished",
    furnishing: furnishing || furnished || "",
    tenantPreference: tenantPreference || "Any",
    idealFor: safeIdealFor,
    amenities: safeAmenities,
    images: allImages,
    outerImages: safeOuterImages,
    livingRoomImages: safeLivingRoomImages,
    bathroomImages: safeBathroomImages,
    balconyImages: safeBalconyImages,
    kitchenImages: safeKitchenImages,
    bedroomImages: safeBedroomImages,
    coordinates: safeCoordinates,
    verification: {
      ownerName: ownerName?.trim() || "",
      ownerEmail: ownerEmail?.trim().toLowerCase() || "",
      ownerPhone: ownerPhone?.trim() || "",
      propertyAddress: propertyAddress?.trim() || "",
      documents: {
        aadhar: aadharUrl || "",
        pan: panUrl || "",
        propertyTax: propertyTaxUrl || "",
        ownershipDeed: ownershipDeedUrl || "",
        utilityBill: utilityBillUrl || "",
      },
      additionalNotes: additionalNotes?.trim() || "",
    },
        status: "active",
    approvalStatus: "active",
    availability: true,
    views: 0,
    inquiries: 0,
  });

  res.status(201).json({
    success: true,
    message: "Property submitted for verification",
    property: normalizeProperty(property),
  });
});

const getMyProperties = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    res.status(401);
    throw new Error("Owner authentication required");
  }

  const ownerId = req.user._id;
  const properties = await Property.find({
    $or: [{ owner: ownerId }, { ownerId: ownerId }],
  })
    .sort({ createdAt: -1 })
    .lean();

  const normalizedProperties = properties.map(normalizeProperty);

  res.status(200).json({
    success: true,
    count: normalizedProperties.length,
    properties: normalizedProperties,
  });
});

const getPropertyById = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    res.status(401);
    throw new Error("Owner authentication required");
  }

  const property = await Property.findById(req.params.id).lean();
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const loggedInOwner = req.user._id.toString();
  const propertyOwner =
    property.ownerId?.toString() || property.owner?._id?.toString() || property.owner?.toString();

  if (propertyOwner !== loggedInOwner) {
    res.status(403);
    throw new Error("You are not authorized to view this property");
  }

  res.status(200).json({ success: true, property: normalizeProperty(property) });
});

const updateProperty = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    res.status(401);
    throw new Error("Owner authentication required");
  }

  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const loggedInOwner = req.user._id.toString();
  const propertyOwner =
    property.ownerId?.toString() || property.owner?._id?.toString() || property.owner?.toString();

  if (propertyOwner !== loggedInOwner) {
    res.status(403);
    throw new Error("You are not authorized to edit this property");
  }

  const {
    title, location, price, rent, type, propertyType, bhk, bedrooms, bathrooms,
    area, description, amenities, furnished, furnishing, deposit,
    securityDeposit, tenantPreference, idealFor, city, locality, state,
    country, pincode, address, coordinates, maintenance,
    existingOuterImages, existingLivingRoomImages, existingBathroomImages,
    existingBalconyImages, existingKitchenImages, existingBedroomImages,
  } = req.body;

  const newOuterImages = await uploadFiles(getFiles(req, "outerImages"), "properties/outer");
  const newLivingRoomImages = await uploadFiles(getFiles(req, "livingRoomImages"), "properties/living-room");
  const newBathroomImages = await uploadFiles(getFiles(req, "bathroomImages"), "properties/bathroom");
  const newBalconyImages = await uploadFiles(getFiles(req, "balconyImages"), "properties/balcony");
  const newKitchenImages = await uploadFiles(getFiles(req, "kitchenImages"), "properties/kitchen");

  const newBedroomImages = [];
  for (let i = 0; i < 10; i += 1) {
    const bedroomFiles = getFiles(req, `bedroomImages_${i}`);
    if (bedroomFiles.length > 0) {
      const uploaded = await uploadFiles(bedroomFiles, `properties/bedroom-${i + 1}`);
      newBedroomImages.push(...uploaded);
    }
  }

  // ---- Text fields ----
  if (title !== undefined) property.title = title.trim();
  if (description !== undefined) property.description = description.trim();
  if (location !== undefined) property.location = location.trim();
  if (city !== undefined) property.city = city.trim();
  if (locality !== undefined) property.locality = locality.trim();
  if (state !== undefined) property.state = state.trim();
  if (country !== undefined) property.country = country.trim();
  if (pincode !== undefined) property.pincode = pincode.trim();
  if (address !== undefined) property.address = address.trim();

  if (price !== undefined || rent !== undefined) {
    property.price = Number(price ?? rent ?? property.price);
    property.rent = Number(rent ?? price ?? property.rent);
    property.monthlyRent = property.rent;
  }

  if (deposit !== undefined || securityDeposit !== undefined) {
    property.deposit = Number(deposit ?? securityDeposit ?? property.deposit);
    property.securityDeposit = Number(securityDeposit ?? deposit ?? property.securityDeposit);
  }

  if (maintenance !== undefined) property.maintenance = Number(maintenance);

  if (type !== undefined || propertyType !== undefined) {
    property.type = type || propertyType || property.type;
    property.propertyType = propertyType || type || property.propertyType;
  }

  if (bedrooms !== undefined || bhk !== undefined) {
    property.bedrooms = Number(bedrooms ?? bhk ?? property.bedrooms);
    property.bhk = Number(bhk ?? bedrooms ?? property.bhk);
  }

  if (bathrooms !== undefined) property.bathrooms = Number(bathrooms);
  if (area !== undefined) {
    property.area = Number(area);
    property.squareFeet = Number(area);
  }

  if (furnished !== undefined || furnishing !== undefined) {
    property.furnished = furnished || furnishing || property.furnished;
    property.furnishing = furnishing || furnished || property.furnishing;
  }

  if (tenantPreference !== undefined) property.tenantPreference = tenantPreference;
  if (idealFor !== undefined) property.idealFor = parseArray(idealFor);
  if (amenities !== undefined) property.amenities = parseArray(amenities);
  if (coordinates !== undefined) {
    const geo = normalizeCoordinates(parseObject(coordinates));
    if (geo) property.coordinates = geo;
  }

  // ---- Images: only update when explicitly provided ----
  const hasOuterUpdate = newOuterImages.length > 0 || existingOuterImages !== undefined;
  const hasLivingUpdate = newLivingRoomImages.length > 0 || existingLivingRoomImages !== undefined;
  const hasBathUpdate = newBathroomImages.length > 0 || existingBathroomImages !== undefined;
  const hasBalconyUpdate = newBalconyImages.length > 0 || existingBalconyImages !== undefined;
  const hasKitchenUpdate = newKitchenImages.length > 0 || existingKitchenImages !== undefined;
  const hasBedroomUpdate = newBedroomImages.length > 0 || existingBedroomImages !== undefined;

  if (hasOuterUpdate)
    property.outerImages = [...parseArray(existingOuterImages), ...newOuterImages];
  if (hasLivingUpdate)
    property.livingRoomImages = [...parseArray(existingLivingRoomImages), ...newLivingRoomImages];
  if (hasBathUpdate)
    property.bathroomImages = [...parseArray(existingBathroomImages), ...newBathroomImages];
  if (hasBalconyUpdate)
    property.balconyImages = [...parseArray(existingBalconyImages), ...newBalconyImages];
  if (hasKitchenUpdate)
    property.kitchenImages = [...parseArray(existingKitchenImages), ...newKitchenImages];
  if (hasBedroomUpdate)
    property.bedroomImages = [...parseArray(existingBedroomImages), ...newBedroomImages];

  // Recompute combined `images` only if any image array changed
  if (hasOuterUpdate || hasLivingUpdate || hasBathUpdate || hasBalconyUpdate || hasKitchenUpdate || hasBedroomUpdate) {
    property.images = [
      ...property.outerImages,
      ...property.livingRoomImages,
      ...property.bathroomImages,
      ...property.balconyImages,
      ...property.kitchenImages,
      ...property.bedroomImages,
    ];
  }

  const updatedProperty = await property.save();

  res.status(200).json({
    success: true,
    message: "Property updated successfully",
    property: normalizeProperty(updatedProperty),
  });
});

const deleteProperty = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    res.status(401);
    throw new Error("Owner authentication required");
  }

  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const loggedInOwner = req.user._id.toString();
  const propertyOwner =
    property.ownerId?.toString() || property.owner?._id?.toString() || property.owner?.toString();

  if (propertyOwner !== loggedInOwner) {
    res.status(403);
    throw new Error("You are not authorized to delete this property");
  }

  await property.deleteOne();

  res.status(200).json({ success: true, message: "Property removed successfully" });
});

const updatePropertyStatus = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    res.status(401);
    throw new Error("Owner authentication required");
  }

  const { status } = req.body;
  const allowedStatuses = ["pending", "approved", "active", "rejected", "inactive", "rented"];
  const normalizedStatus = String(status || "").trim().toLowerCase();

  if (!allowedStatuses.includes(normalizedStatus)) {
    res.status(400);
    throw new Error("Invalid property status");
  }

  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const loggedInOwner = req.user._id.toString();
  const propertyOwner =
    property.ownerId?.toString() || property.owner?._id?.toString() || property.owner?.toString();

  if (propertyOwner !== loggedInOwner) {
    res.status(403);
    throw new Error("You are not authorized to update this property");
  }

  property.status = normalizedStatus;
  property.approvalStatus = normalizedStatus;
  property.statusUpdatedAt = new Date();

  if (normalizedStatus === "rented") property.availability = false;
  if (normalizedStatus === "approved" || normalizedStatus === "active") property.availability = true;
  if (normalizedStatus === "inactive") property.availability = false;

  const updatedProperty = await property.save();

  res.status(200).json({
    success: true,
    message: "Property status updated successfully",
    property: normalizeProperty(updatedProperty),
  });
});

module.exports = {
  createProperty,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
};