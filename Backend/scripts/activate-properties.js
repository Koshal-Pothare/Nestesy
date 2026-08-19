require("dotenv").config();

const mongoose = require("mongoose");
const Property = require("../src/owner/models/Property");

const activateProperties = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const result = await Property.updateMany(
      { status: "pending" },
      {
        $set: {
          status: "active",
          approvalStatus: "active",
          availability: true,
        },
      }
    );

    console.log(
      `✅ Updated ${result.modifiedCount} properties to active`
    );

    if (result.modifiedCount === 0) {
      console.log("ℹ️ No pending properties were found.");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
};

activateProperties();