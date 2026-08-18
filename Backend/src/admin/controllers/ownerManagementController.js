const Owner = require('../../owner/models/Owner');
const Property = require('../../owner/models/Property');
const { success, error } = require('../../common/utils/response');

/**
 * @route   GET /api/admin/owners
 * @desc    Get all hosts with pagination, search, and status filter
 * @access  Private (admin)
 */
const getHosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, status, verified } = req.query;

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

    if (verified !== undefined && verified !== 'all') {
      query.isVerified = verified === 'true' || verified === 'verified';
    }

    const totalHosts = await Owner.countDocuments(query);
    const hostsDocs = await Owner.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    // Fetch properties for each host to build rich structure expected by HostManagement component
    const hostsWithProperties = await Promise.all(
      hostsDocs.map(async (host) => {
        const properties = await Property.find({ ownerId: host._id }).select(
          'title images locality city status rent createdAt'
        );

        const formattedProperties = properties.map((p) => ({
          id: p._id,
          name: p.title,
          image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
          location: `${p.locality}, ${p.city}`,
          status: p.status,
          price: p.rent,
        }));

        return {
          id: host._id,
          _id: host._id,
          name: host.name,
          username: host.username,
          email: host.email,
          phone: host.phone || 'N/A',
          location: host.city || 'N/A',
          profileImage: host.profileImage || '',
          isVerified: host.isVerified,
          isActive: host.isActive,
          createdAt: host.createdAt,
          propertiesCount: properties.length,
          properties: formattedProperties,
        };
      })
    );

    return success(res, 200, 'Hosts fetched successfully', {
      hosts: hostsWithProperties,
      pagination: {
        total: totalHosts,
        page,
        limit,
        totalPages: Math.ceil(totalHosts / limit),
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to fetch hosts');
  }
};

/**
 * @route   GET /api/admin/owners/:id
 * @desc    Get host detailed profile and properties
 * @access  Private (admin)
 */
const getHostById = async (req, res) => {
  try {
    const host = await Owner.findById(req.params.id).select('-password');
    if (!host) {
      return error(res, 404, 'Host not found');
    }

    const properties = await Property.find({ ownerId: host._id });

    const formattedProperties = properties.map((p) => ({
      id: p._id,
      name: p.title,
      image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
      location: `${p.locality}, ${p.city}`,
      status: p.status,
      rent: p.rent,
      deposit: p.deposit,
      bhk: p.bhk,
      createdAt: p.createdAt,
    }));

    return success(res, 200, 'Host details fetched', {
      host: {
        id: host._id,
        _id: host._id,
        name: host.name,
        username: host.username,
        email: host.email,
        phone: host.phone,
        location: host.city,
        profileImage: host.profileImage,
        isVerified: host.isVerified,
        isActive: host.isActive,
        verificationNotes: host.verificationNotes,
        createdAt: host.createdAt,
        properties: formattedProperties,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to fetch host details');
  }
};

/**
 * @route   PUT /api/admin/owners/:id/status
 * @desc    Update host status (isVerified, isActive, verificationNotes)
 * @access  Private (admin)
 */
const updateHostStatus = async (req, res) => {
  try {
    const { isVerified, isActive, verificationNotes } = req.body;
    const host = await Owner.findById(req.params.id);

    if (!host) {
      return error(res, 404, 'Host not found');
    }

    if (isVerified !== undefined) host.isVerified = isVerified;
    if (isActive !== undefined) host.isActive = isActive;
    if (verificationNotes !== undefined) host.verificationNotes = verificationNotes;

    await host.save();

    return success(res, 200, 'Host status updated successfully', {
      host: {
        id: host._id,
        name: host.name,
        email: host.email,
        isVerified: host.isVerified,
        isActive: host.isActive,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to update host status');
  }
};

/**
 * @route   DELETE /api/admin/owners/:id
 * @desc    Delete host account and their properties
 * @access  Private (admin)
 */
const deleteHost = async (req, res) => {
  try {
    const host = await Owner.findById(req.params.id);
    if (!host) {
      return error(res, 404, 'Host not found');
    }

    await Property.deleteMany({ ownerId: host._id });
    await Owner.findByIdAndDelete(req.params.id);

    return success(res, 200, 'Host account and associated listings deleted successfully');
  } catch (err) {
    return error(res, 500, err.message || 'Failed to delete host');
  }
};

module.exports = { getHosts, getHostById, updateHostStatus, deleteHost };
