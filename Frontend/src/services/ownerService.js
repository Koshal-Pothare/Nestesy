import API from "./api";

export const registerOwner = async (ownerData) => {
  return API.post("/owner/auth/register", ownerData);
};

export const loginOwner = async (email, password) => {
  return API.post("/owner/auth/login", {
    email: email.trim().toLowerCase(),
    password,
  });
};

export const getOwnerMe = async () => {
  return API.get("/owner/auth/me");
};

export const logoutOwner = async () => {
  return API.post("/owner/auth/logout");
};

export const getMyProperties = async () => {
  return API.get("/owners/properties");
};

export const getPropertyById = async (id) => {
  return API.get(`/owners/properties/${id}`);
};

export const deleteProperty = async (id) => {
  return API.delete(`/owners/properties/${id}`);
};

export const updatePropertyStatus = async (id, status) => {
  return API.put(`/owners/properties/${id}/status`, {
    status,
  });
};

export const getDashboardStats = async () => {
  return API.get("/owners/dashboard");
};

export const getOwnerAnalytics = async () => {
  return API.get("/owners/analytics");
};

export const getOwnerVisits = async () => {
  return API.get("/owners/visits");
};

export const updateVisitStatus = async (id, status) => {
  return API.put(`/owners/visits/${id}/status`, {
    status,
  });
};

export const createRoom = async (propertyId, roomData) => {
  return API.post(
    `/owners/properties/${propertyId}/rooms`,
    roomData
  );
};

export const getRoomsByProperty = async (propertyId) => {
  return API.get(
    `/owners/properties/${propertyId}/rooms`
  );
};

export const updateRoom = async (id, roomData) => {
  return API.put(
    `/owners/rooms/${id}`,
    roomData
  );
};

export const deleteRoom = async (id) => {
  return API.delete(`/owners/rooms/${id}`);
};

export const getOwnerProfile = async () => {
  return API.get("/owners/profile");
};

export const updateOwnerProfile = async (data) => {
  return API.put("/owners/profile", data);
};

export const changeOwnerPassword = async (
  currentPassword,
  newPassword
) => {
  return API.put("/owners/change-password", {
    currentPassword,
    newPassword,
  });
};