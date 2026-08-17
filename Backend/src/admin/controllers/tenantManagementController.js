const Tenant = require('../../tenant/models/Tenant');
const Booking = require('../../tenant/models/Booking');
const Favorite = require('../../tenant/models/Favorite');
const Review = require('../../tenant/models/Review');
const { success, error } = require('../../common/utils/response');

/**
 * @route   GET /api/admin/tenants
 * @desc    Get all tenants with pagination, search, and active status filter
 * @access  Private (admin)
 */
const getTenants = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, status } = req.query;

    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { city: searchRegex },
        { username: searchRegex },
      ];
    }

    if (status !== undefined && status !== 'all') {
      query.isActive = status === 'active';
    }

    const totalTenants = await Tenant.countDocuments(query);
    const tenantsDocs = await Tenant.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    const tenantsWithCounts = await Promise.all(
      tenantsDocs.map(async (tenant) => {
        const [bookingsCount, favoritesCount] = await Promise.all([
          Booking.countDocuments({ tenantId: tenant._id }),
          Favorite ? Favorite.countDocuments({ tenantId: tenant._id }) : Promise.resolve(0),
        ]);

        return {
          id: tenant._id,
          _id: tenant._id,
          name: tenant.name,
          username: tenant.username,
          email: tenant.email,
          phone: tenant.phone || 'N/A',
          location: tenant.city || 'N/A',
          profileImage: tenant.profileImage || '',
          role: 'Tenant',
          isActive: tenant.isActive,
          bookingsCount,
          favoritesCount,
          createdAt: tenant.createdAt,
        };
      })
    );

    return success(res, 200, 'Tenants fetched successfully', {
      tenants: tenantsWithCounts,
      pagination: {
        total: totalTenants,
        page,
        limit,
        totalPages: Math.ceil(totalTenants / limit),
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to fetch tenants');
  }
};

/**
 * @route   GET /api/admin/tenants/:id
 * @desc    Get detailed tenant profile with booking history
 * @access  Private (admin)
 */
const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id).select('-password');
    if (!tenant) {
      return error(res, 404, 'Tenant not found');
    }

    const bookings = await Booking.find({ tenantId: tenant._id })
      .populate('propertyId', 'title city rent images')
      .populate('ownerId', 'name email phone');

    return success(res, 200, 'Tenant details fetched', {
      tenant: {
        id: tenant._id,
        _id: tenant._id,
        name: tenant.name,
        username: tenant.username,
        email: tenant.email,
        phone: tenant.phone,
        city: tenant.city,
        profileImage: tenant.profileImage,
        role: tenant.role,
        isActive: tenant.isActive,
        createdAt: tenant.createdAt,
        bookings: bookings.map((b) => ({
          id: b._id,
          propertyTitle: b.propertyId ? b.propertyId.title : 'Property Deleted',
          propertyImage: b.propertyId && b.propertyId.images ? b.propertyId.images[0] : '',
          visitDate: b.visitDate,
          visitTime: b.visitTime,
          status: b.status,
          ownerName: b.ownerId ? b.ownerId.name : '',
        })),
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to fetch tenant details');
  }
};

/**
 * @route   PUT /api/admin/tenants/:id/status
 * @desc    Update tenant status (isActive)
 * @access  Private (admin)
 */
const updateTenantStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const tenant = await Tenant.findById(req.params.id);

    if (!tenant) {
      return error(res, 404, 'Tenant not found');
    }

    if (isActive !== undefined) tenant.isActive = isActive;
    await tenant.save();

    return success(res, 200, 'Tenant status updated successfully', {
      tenant: {
        id: tenant._id,
        name: tenant.name,
        email: tenant.email,
        isActive: tenant.isActive,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to update tenant status');
  }
};

/**
 * @route   DELETE /api/admin/tenants/:id
 * @desc    Delete tenant account and associated bookings
 * @access  Private (admin)
 */
const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return error(res, 404, 'Tenant not found');
    }

    await Booking.deleteMany({ tenantId: tenant._id });
    if (Review) await Review.deleteMany({ tenantId: tenant._id });
    await Tenant.findByIdAndDelete(req.params.id);

    return success(res, 200, 'Tenant account deleted successfully');
  } catch (err) {
    return error(res, 500, err.message || 'Failed to delete tenant');
  }
};

module.exports = { getTenants, getTenantById, updateTenantStatus, deleteTenant };
