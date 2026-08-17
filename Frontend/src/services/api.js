
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach owner JWT to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ownerToken");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
API.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem("ownerToken");
      localStorage.removeItem("owner");

      console.error(
        `Owner authentication failed (${status})`,
        error.response?.data
      );
    }

    return Promise.reject(error);
  }
);

export default API;

