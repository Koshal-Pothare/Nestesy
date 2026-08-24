const Property = require("../../owner/models/Property");
const { success, error } = require("../../common/utils/response");

/**
 * Normalize property status
 */
const normalizeStatus = (status) => {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  const statusMap = {
    pending: "pending",
    approved: "active",
    active: "active",
    verified: "active",
    rejected: "rejected",
    inactive: "inactive",
    rented: "rented",
  };

  return statusMap[value] || null;
};

/**
 * Format owner information
 */
const formatOwner = (owner, property) => {
  if (!owner || !owner._id) {
    return {
      id: null,
      name: "Unknown Host",
      email: "N/A",
      phone: "N/A",
      location: property.city || "",
      profileImage: "",
      isVerified: false,
    };
  }

  return {
    id: owner._id,
    name: owner.name || "Unknown Host",
    email: owner.email || "N/A",
    phone: owner.phone || "N/A",
    location: owner.city || property.city || "",
    profileImage: owner.profileImage || "",
    isVerified: owner.isVerified || false,
  };
};

/**
 * Format property for admin response
 */
const formatProperty = (property) => {
  const owner = property.ownerId || property.owner || null;

  return {
    id: property._id,
    _id: property._id,

    title: property.title || "Untitled Property",
    description: property.description || "",

    propertyType:
      property.propertyType ||
      property.type ||
      "Property",

    type:
      property.type ||
      property.propertyType ||
      "Property",

    bhk: Number(
      property.bhk ??
        property.bedrooms ??
        0
    ),

    bedrooms: Number(
      property.bedrooms ??
        property.bhk ??
        0
    ),

    bathrooms: Number(
      property.bathrooms ?? 0
    ),

    area: Number(
      property.area ??
        property.squareFeet ??
        0
    ),

    squareFeet: Number(
      property.squareFeet ??
        property.area ??
        0
    ),

    price: Number(
      property.price ??
        property.rent ??
        0
    ),

    rent: Number(
      property.rent ??
        property.price ??
        0
    ),

    monthlyRent: Number(
      property.monthlyRent ??
        property.rent ??
        property.price ??
        0
    ),

    deposit: Number(
      property.deposit ??
        property.securityDeposit ??
        0
    ),

    securityDeposit: Number(
      property.securityDeposit ??
        property.deposit ??
        0
    ),

    maintenance: Number(
      property.maintenance ?? 0
    ),

    furnished:
      property.furnished ||
      property.furnishing ||
      "",

    furnishing:
      property.furnishing ||
      property.furnished ||
      "",

    tenantPreference:
      property.tenantPreference || "",

    idealFor: Array.isArray(property.idealFor)
      ? property.idealFor
      : [],

    amenities: Array.isArray(property.amenities)
      ? property.amenities
      : [],

    images: Array.isArray(property.images)
      ? property.images
      : [],

    outerImages: Array.isArray(property.outerImages)
      ? property.outerImages
      : [],

    livingRoomImages: Array.isArray(
      property.livingRoomImages
    )
      ? property.livingRoomImages
      : [],

    bathroomImages: Array.isArray(
      property.bathroomImages
    )
      ? property.bathroomImages
      : [],

    balconyImages: Array.isArray(
      property.balconyImages
    )
      ? property.balconyImages
      : [],

    kitchenImages: Array.isArray(
      property.kitchenImages
    )
      ? property.kitchenImages
      : [],

    bedroomImages: Array.isArray(
      property.bedroomImages
    )
      ? property.bedroomImages.flat(Infinity)
      : [],

    city: property.city || "",
    locality: property.locality || "",
    state: property.state || "",
    country: property.country || "India",
    pincode:
      property.pincode ||
      property.pinCode ||
      "",

    location:
      property.location ||
      [
        property.locality,
        property.city,
        property.state,
      ]
        .filter(Boolean)
        .join(", "),

    address:
      property.address ||
      property.propertyAddress ||
      "",

    coordinates:
      property.coordinates || {},

    status:
      property.status || "pending",

    approvalStatus:
      property.approvalStatus ||
      property.status ||
      "pending",

    availability:
      property.status === "active" &&
      property.availability !== false,

    rejectionReason:
      property.rejectionReason || "",

    adminNotes:
      property.adminNotes || "",

    views: Number(
      property.views ?? 0
    ),

    inquiries: Number(
      property.inquiries ?? 0
    ),

    favorites: Number(
      property.favorites ??
        property.likes ??
        0
    ),

    createdAt:
      property.createdAt || null,

    updatedAt:
      property.updatedAt || null,

    statusUpdatedAt:
      property.statusUpdatedAt || null,

    owner: formatOwner(
      owner,
      property
    ),
  };
};

/**
 * @route   GET /api/admin/properties
 * @desc    Get properties with filters, search and owner information
 * @access  Private (admin)
 */
const getProperties = async (req, res) => {
  try {
    const page = Math.max(
      parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        parseInt(req.query.limit, 10) || 20,
        1
      ),
      100
    );

    const skip = (page - 1) * limit;

    const {
      search,
      status,
      city,
      propertyType,
    } = req.query;

    const query = {};

    /**
     * Search
     */
    if (search && search.trim()) {
      const searchRegex = new RegExp(
        search.trim().replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        ),
        "i"
      );

      query.$or = [
        { title: searchRegex },
        { city: searchRegex },
        { locality: searchRegex },
        { address: searchRegex },
        { description: searchRegex },
      ];
    }

    /**
     * City filter
     */
    if (
      city &&
      city.toLowerCase() !== "all"
    ) {
      query.city = new RegExp(
        city.trim(),
        "i"
      );
    }

    /**
     * Property type filter
     */
    if (
      propertyType &&
      propertyType.toLowerCase() !== "all"
    ) {
      query.$or = [
        {
          propertyType: propertyType,
        },
        {
          type: propertyType,
        },
      ];
    }

    /**
     * Status filter
     */
    if (
      status &&
      status.toLowerCase() !== "all"
    ) {
      const normalizedStatus =
        normalizeStatus(status);

      if (!normalizedStatus) {
        return error(
          res,
          400,
          "Invalid property status"
        );
      }

      query.status =
        normalizedStatus;
    }

    /**
     * Count filtered properties
     */
    const total =
      await Property.countDocuments(query);

    /**
     * Fetch properties
     */
    const propertiesDocs =
      await Property.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .populate(
          "ownerId",
          "name email phone profileImage isVerified city bio createdAt"
        )
        .lean();

    /**
     * Format properties
     */
    const formattedProperties =
      propertiesDocs.map(
        formatProperty
      );

    /**
     * Admin dashboard statistics
     */
    const [
      totalCount,
      pendingCount,
      activeCount,
      rejectedCount,
      inactiveCount,
      rentedCount,
    ] = await Promise.all([
      Property.countDocuments(),

      Property.countDocuments({
        status: "pending",
      }),

      Property.countDocuments({
        status: { $in: ["approved", "active"] },
      }),

      Property.countDocuments({
        status: "rejected",
      }),

      Property.countDocuments({
        status: "inactive",
      }),

      Property.countDocuments({
        status: "rented",
      }),
    ]);

    const stats = {
      total: totalCount,
      pending: pendingCount,
      active: activeCount,
      approved: activeCount,
      verified: activeCount,
      rejected: rejectedCount,
      inactive: inactiveCount,
      rented: rentedCount,
    };

    return success(
      res,
      200,
      "Properties fetched successfully",
      {
        properties:
          formattedProperties,

        stats,

        pagination: {
          total,
          page,
          limit,
          totalPages:
            Math.ceil(
              total / limit
            ),
        },
      }
    );
  } catch (err) {
    console.error(
      "Admin getProperties error:",
      err
    );

    return error(
      res,
      500,
      err.message ||
        "Failed to fetch properties"
    );
  }
};

/**
 * @route   GET /api/admin/properties/:id
 * @desc    Get detailed property verification information
 * @access  Private (admin)
 */
const getPropertyById = async (
  req,
  res
) => {
  try {
    const property =
      await Property.findById(
        req.params.id
      )
        .populate(
          "ownerId",
          "name email phone profileImage isVerified city bio createdAt"
        )
        .lean();

    if (!property) {
      return error(
        res,
        404,
        "Property not found"
      );
    }

    return success(
      res,
      200,
      "Property details fetched successfully",
      {
        property:
          formatProperty(property),
      }
    );
  } catch (err) {
    console.error(
      "Admin getPropertyById error:",
      err
    );

    return error(
      res,
      500,
      err.message ||
        "Failed to fetch property"
    );
  }
};

/**
 * @route   PUT /api/admin/properties/:id/status
 * @desc    Approve, reject or change property status
 * @access  Private (admin)
 */
const updatePropertyStatus = async (
  req,
  res
) => {
  try {
    const {
      status,
      rejectionReason,
      adminNotes,
    } = req.body;

    const normalizedStatus =
      normalizeStatus(status);

    if (!normalizedStatus) {
      return error(
        res,
        400,
        "Invalid property status. Allowed values: pending, active, rejected, inactive, rented"
      );
    }

    const property =
      await Property.findById(
        req.params.id
      );

    if (!property) {
      return error(
        res,
        404,
        "Property not found"
      );
    }

    /**
     * Update status
     */
    property.status =
      normalizedStatus;

    property.approvalStatus =
      normalizedStatus;

    property.statusUpdatedAt =
      new Date();

    /**
     * Approval logic
     */
    if (
      normalizedStatus === "active"
    ) {
      property.availability =
        true;

      property.rejectionReason =
        "";
    }

    /**
     * Rejection logic
     */
    if (
      normalizedStatus === "rejected"
    ) {
      property.availability =
        false;

      property.rejectionReason =
        rejectionReason || "";
    }

    /**
     * Pending logic
     */
    if (
      normalizedStatus === "pending"
    ) {
      property.availability =
        false;
    }

    /**
     * Inactive / rented logic
     */
    if (
      normalizedStatus === "inactive" ||
      normalizedStatus === "rented"
    ) {
      property.availability =
        false;
    }

    /**
     * Admin notes
     */
    if (
      adminNotes !== undefined
    ) {
      property.adminNotes =
        adminNotes;
    }

    await property.save();

    return success(
      res,
      200,
      `Property ${normalizedStatus} successfully`,
      {
        property:
          formatProperty(property),
      }
    );
  } catch (err) {
    console.error(
      "Admin updatePropertyStatus error:",
      err
    );

    return error(
      res,
      500,
      err.message ||
        "Failed to update property status"
    );
  }
};

/**
 * @route   PUT /api/admin/properties/:id/approve
 * @desc    Approve property
 * @access  Private (admin)
 */
const approveProperty = async (
  req,
  res
) => {
  try {
    const property =
      await Property.findById(
        req.params.id
      );

    if (!property) {
      return error(
        res,
        404,
        "Property not found"
      );
    }

    property.status = "active";
    property.approvalStatus =
      "active";
    property.availability = true;
    property.rejectionReason = "";
    property.statusUpdatedAt =
      new Date();

    if (
      req.body.adminNotes !==
      undefined
    ) {
      property.adminNotes =
        req.body.adminNotes;
    }

    await property.save();

    return success(
      res,
      200,
      "Property approved successfully",
      {
        property:
          formatProperty(property),
      }
    );
  } catch (err) {
    console.error(
      "Admin approveProperty error:",
      err
    );

    return error(
      res,
      500,
      err.message ||
        "Failed to approve property"
    );
  }
};

/**
 * @route   PUT /api/admin/properties/:id/reject
 * @desc    Reject property
 * @access  Private (admin)
 */
const rejectProperty = async (
  req,
  res
) => {
  try {
    const {
      rejectionReason,
      adminNotes,
    } = req.body;

    const property =
      await Property.findById(
        req.params.id
      );

    if (!property) {
      return error(
        res,
        404,
        "Property not found"
      );
    }

    property.status =
      "rejected";

    property.approvalStatus =
      "rejected";

    property.availability =
      false;

    property.rejectionReason =
      rejectionReason || "";

    property.statusUpdatedAt =
      new Date();

    if (
      adminNotes !== undefined
    ) {
      property.adminNotes =
        adminNotes;
    }

    await property.save();

    return success(
      res,
      200,
      "Property rejected successfully",
      {
        property:
          formatProperty(property),
      }
    );
  } catch (err) {
    console.error(
      "Admin rejectProperty error:",
      err
    );

    return error(
      res,
      500,
      err.message ||
        "Failed to reject property"
    );
  }
};

/**
 * @route   DELETE /api/admin/properties/:id
 * @desc    Delete property listing
 * @access  Private (admin)
 */
const deleteProperty = async (
  req,
  res
) => {
  try {
    const property =
      await Property.findById(
        req.params.id
      );

    if (!property) {
      return error(
        res,
        404,
        "Property not found"
      );
    }

    await Property.findByIdAndDelete(
      req.params.id
    );

    return success(
      res,
      200,
      "Property listing deleted successfully"
    );
  } catch (err) {
    console.error(
      "Admin deleteProperty error:",
      err
    );

    return error(
      res,
      500,
      err.message ||
        "Failed to delete property"
    );
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  updatePropertyStatus,
  approveProperty,
  rejectProperty,
  deleteProperty,
};