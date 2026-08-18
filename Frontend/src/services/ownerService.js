import API from "./api";

// =====================================
// OWNER AUTH
// =====================================

export const registerOwner = (ownerData) => {
  return API.post(
    "/owner/auth/register",
    ownerData
  );
};

export const loginOwner = (
  email,
  password
) => {
  return API.post(
    "/owner/auth/login",
    {
      email,
      password,
    }
  );
};

export const getOwnerMe = () => {
  return API.get(
    "/owner/auth/me"
  );
};

export const logoutOwner = () => {
  return API.post(
    "/owner/auth/logout"
  );
};

// =====================================
// OWNER PROPERTIES
// =====================================

export const getMyProperties = () => {
  return API.get(
    "/owners/properties"
  );
};

export const getPropertyById = (id) => {
  return API.get(
    `/owners/properties/${id}`
  );
};

export const deleteProperty = (id) => {
  return API.delete(
    `/owners/properties/${id}`
  );
};

export const updatePropertyStatus = (
  id,
  status
) => {
  return API.patch(
    `/owners/properties/${id}/status`,
    { status }
  );
};

// =====================================
// OWNER DASHBOARD
// =====================================

export const getDashboardStats = () => {
  return API.get(
    "/owners/dashboard/stats"
  );
};

// =====================================
// OWNER PROFILE
// =====================================

export const getOwnerProfile = () => {
  return API.get(
    "/owners/profile"
  );
};

export const updateOwnerProfile = (
  data
) => {
  return API.put(
    "/owners/profile",
    data
  );
};