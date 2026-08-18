const asyncHandler = require("express-async-handler");
const Property = require("../models/Property");

const getOwnerAnalytics = asyncHandler(
  async (req, res) => {
    if (!req.user || !req.user._id) {
      res.status(401);
      throw new Error(
        "Owner authentication required"
      );
    }

    const ownerId = req.user._id;

    const properties =
      await Property.find({
        $or: [
          { owner: ownerId },
          { ownerId: ownerId },
        ],
      }).lean();

    const totalProperties =
      properties.length;

    const activeProperties =
      properties.filter((property) => {
        const status = String(
          property.status || ""
        ).toLowerCase();

        return (
          status === "approved" ||
          status === "active"
        );
      }).length;

    const pendingApprovals =
      properties.filter((property) => {
        return (
          String(
            property.status || ""
          ).toLowerCase() === "pending"
        );
      }).length;

    const rejectedProperties =
      properties.filter((property) => {
        return (
          String(
            property.status || ""
          ).toLowerCase() === "rejected"
        );
      }).length;

    const totalViews =
      properties.reduce(
        (total, property) =>
          total +
          Number(property.views || 0),
        0
      );

    const totalInquiries =
      properties.reduce(
        (total, property) =>
          total +
          Number(
            property.inquiries || 0
          ),
        0
      );

    res.status(200).json({
      success: true,

      analytics: {
        totalProperties,
        activeProperties,
        pendingApprovals,
        rejectedProperties,
        totalViews,
        totalInquiries,
      },

      properties,
    });
  }
);

module.exports = {
  getOwnerAnalytics,
};