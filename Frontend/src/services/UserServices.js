import axios from "axios";

const userAPI = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/tenant`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

userAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

userAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");

    // Do NOT redirect signup/login errors to /login.
    // Let Login.jsx display the actual backend error.
    if (status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("nestesyLoggedInUser");
      localStorage.removeItem("nestesyUser");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const AuthService = {
  register: async (data) => {
    const response = await userAPI.post("/auth/register", data);
    return response.data;
  },

  login: async (data) => {
    const response = await userAPI.post("/auth/login", data);
    return response.data;
  },

  getMe: async () => {
    const response = await userAPI.get("/auth/me");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await userAPI.put("/auth/me", data);
    return response.data;
  },
};

export const WishlistService = {
  getFavorites: async () => {
    const response = await userAPI.get("/favorites");
    return response.data;
  },

  addFavorite: async (propertyData) => {
    const response = await userAPI.post("/favorites", propertyData);
    return response.data;
  },

  removeFavorite: async (propertyId) => {
    const response = await userAPI.delete(`/favorites/${propertyId}`);
    return response.data;
  },

  checkFavorite: async (propertyId) => {
    const response = await userAPI.get(`/favorites/check/${propertyId}`);
    return response.data;
  },

  getCount: async () => {
    const response = await userAPI.get("/favorites/count");
    return response.data;
  },
};

export const BookingService = {
  createBooking: async (bookingData) => {
    const response = await userAPI.post("/bookings", bookingData);
    return response.data;
  },

  getBookings: async (status = "all") => {
    const response = await userAPI.get("/bookings", {
      params: { status },
    });
    return response.data;
  },

  getUpcomingVisits: async () => {
    const response = await userAPI.get("/bookings/upcoming/visits");
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await userAPI.get(`/bookings/${id}`);
    return response.data;
  },

  updateBooking: async (id, data) => {
    const response = await userAPI.put(`/bookings/${id}`, data);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await userAPI.patch(`/bookings/${id}/cancel`);
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await userAPI.delete(`/bookings/${id}`);
    return response.data;
  },
};

export default userAPI;