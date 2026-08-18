import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================================
// ATTACH OWNER JWT
// =====================================

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("ownerToken");

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================
// RESPONSE INTERCEPTOR
// =====================================

API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status =
      error.response?.status;

    console.error("API Error:", {
      status,
      message:
        error.response?.data?.message,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Only clear token when authentication
    // is actually invalid.
    if (status === 401) {
      localStorage.removeItem(
        "ownerToken"
      );

      localStorage.removeItem(
        "owner"
      );
    }

    return Promise.reject(error);
  }
);

export default API;