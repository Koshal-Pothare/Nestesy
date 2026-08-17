const Property = require('../../owner/models/Property');
const Owner = require('../../owner/models/Owner');
const { success, error } = require('../../common/utils/response');

/**
 * @route   GET /api/admin/properties
 * @desc    Get properties with filters, search, and owner populating
 * @access  Private (admin)
 */
const getProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { search, status, city, propertyType } = req.query;

    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { city: searchRegex },
        { locality: searchRegex },
        { address: searchRegex },
      ];
    }

    if (city && city !== 'all') {
      query.city = new RegExp(city, 'i');
    }

    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    if (status && status !== 'all') {
      if (status === 'pending') {
        query.status = { $in: ['pending', 'Pending'] };
      } else if (status === 'approved' || status === 'verified') {
        query.status = { $in: ['approved', 'Active', 'Verified'] };
      } else if (status === 'rejected') {
        query.status = { $in: ['rejected', 'Inactive', 'Rejected'] };
      } else {
        query.status = status;
      }
    }

    const total = await Property.countDocuments(query);
    const propertiesDocs = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('ownerId', 'name email phone profileImage isVerified city');

    const formattedProperties = propertiesDocs.map((p) => {
      const owner = p.ownerId || {};
      return {
        id: p._id,
        _id: p._id,
        title: p.title,
        description: p.description,
        propertyType: p.propertyType,
        bhk: p.bhk,
        bathrooms: p.bathrooms,
        area: p.area,
        rent: p.rent,
        deposit: p.deposit,
        furnished: p.furnished,
        tenantPreference: p.tenantPreference,
        amenities: p.amenities || [],
        images: p.images || [],
        city: p.city,
        locality: p.locality,
        address: p.address,
        status: p.status,
        rejectionReason: p.rejectionReason || '',
        adminNotes: p.adminNotes || '',
        views: p.views || 0,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        owner: {
          id: owner._id,
          name: owner.name || 'Unknown Host',
          email: owner.email || 'N/A',
          phone: owner.phone || 'N/A',
          location: owner.city || p.city,
          isVerified: owner.isVerified || false,
        },
      };
    });

    const stats = {
      total: await Property.countDocuments(),
      pending: await Property.countDocuments({ status: { $in: ['pending', 'Pending'] } }),
      verified: await Property.countDocuments({ status: { $in: ['approved', 'Active'] } }),
      rejected: await Property.countDocuments({ status: { $in: ['rejected', 'Inactive'] } }),
    };

    return success(res, 200, 'Properties fetched successfully', {
      properties: formattedProperties,
      stats,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to fetch properties');
  }
};

/**
 * @route   GET /api/admin/properties/:id
 * @desc    Get detailed property verification info
 * @access  Private (admin)
 */
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('ownerId', 'name email phone profileImage isVerified city bio createdAt');

    if (!property) {
      return error(res, 404, 'Property not found');
    }

    const owner = property.ownerId || {};

    return success(res, 200, 'Property details fetched', {
      property: {
        id: property._id,
        _id: property._id,
        title: property.title,
        description: property.description,
        propertyType: property.propertyType,
        bhk: property.bhk,
        bathrooms: property.bathrooms,
        area: property.area,
        rent: property.rent,
        deposit: property.deposit,
        furnished: property.furnished,
        tenantPreference: property.tenantPreference,
        amenities: property.amenities || [],
        images: property.images || [],
        city: property.city,
        locality: property.locality,
        address: property.address,
        coordinates: property.coordinates,
        status: property.status,
        rejectionReason: property.rejectionReason || '',
        adminNotes: property.adminNotes || '',
        views: property.views || 0,
        createdAt: property.createdAt,
        owner: {
          id: owner._id,
          name: owner.name,
          email: owner.email,
          phone: owner.phone,
          location: owner.city || property.city,
          profileImage: owner.profileImage,
          isVerified: owner.isVerified,
          joined: owner.createdAt,
        },
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to fetch property');
  }
};

/**
 * @route   PUT /api/admin/properties/:id/status
 * @desc    Approve or Reject a property listing
 * @access  Private (admin)
 */
const updatePropertyStatus = async (req, res) => {
  try {
    const { status, rejectionReason, adminNotes } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return error(res, 404, 'Property not found');
    }

    if (status) property.status = status;
    if (rejectionReason !== undefined) property.rejectionReason = rejectionReason;
    if (adminNotes !== undefined) property.adminNotes = adminNotes;

    await property.save();

    return success(res, 200, `Property status updated to ${property.status}`, {
      property: {
        id: property._id,
        title: property.title,
        status: property.status,
        rejectionReason: property.rejectionReason,
        adminNotes: property.adminNotes,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to update property status');
  }
};

/**
 * @route   DELETE /api/admin/properties/:id
 * @desc    Delete a property listing
 * @access  Private (admin)
 */
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return error(res, 404, 'Property not found');
    }

    await Property.findByIdAndDelete(req.params.id);

    return success(res, 200, 'Property listing deleted successfully');
  } catch (err) {
    return error(res, 500, err.message || 'Failed to delete property');
  }
};

module.exports = { getProperties, getPropertyById, updatePropertyStatus, deleteProperty };
