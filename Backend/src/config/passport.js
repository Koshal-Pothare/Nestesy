const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Tenant = require("../User/models/Tenant");
const TenantProfile = require("../User/models/TenantProfile");

const configurePassport = () => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL =
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:5000/api/tenant/auth/google/callback";

  if (!clientID || !clientSecret || clientID.includes("your_google_client_id")) {
    console.log(
      "⚠️ Google OAuth credentials not configured in .env (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET). Google login will remain in standby."
    );
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value.toLowerCase().trim()
              : null;

          if (!email) {
            return done(new Error("No email found in Google profile"), null);
          }

          const googleId = profile.id;
          const name = profile.displayName || "Google User";
          const avatar =
            profile.photos && profile.photos.length > 0
              ? profile.photos[0].value
              : "";

          // 1. Find by googleId or email
          let tenant = await Tenant.findOne({
            $or: [{ googleId }, { email }],
          });

          if (tenant) {
            // Update googleId and avatar if missing
            let isModified = false;
            if (!tenant.googleId) {
              tenant.googleId = googleId;
              tenant.authProvider = "google";
              isModified = true;
            }
            if (!tenant.profilePicture && avatar) {
              tenant.profilePicture = avatar;
              isModified = true;
            }
            if (isModified) {
              await tenant.save();
            }
            return done(null, tenant);
          }

          // 2. If new user, create a unique username
          let baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
          if (!baseUsername) baseUsername = "user";
          let username = baseUsername;
          let count = 1;
          while (await Tenant.findOne({ username })) {
            username = `${baseUsername}${count++}`;
          }

          // 3. Create Tenant
          tenant = await Tenant.create({
            name,
            email,
            username,
            googleId,
            authProvider: "google",
            profilePicture: avatar,
            avatar,
            isVerified: true,
          });

          // 4. Create TenantProfile
          try {
            await TenantProfile.create({
              tenantId: tenant._id,
              preferredCity: "",
              occupation: "",
            });
          } catch (profileErr) {
            console.log("Auto-created TenantProfile note:", profileErr.message);
          }

          return done(null, tenant);
        } catch (err) {
          console.error("GoogleStrategy error:", err);
          return done(err, null);
        }
      }
    )
  );
};

module.exports = configurePassport;
