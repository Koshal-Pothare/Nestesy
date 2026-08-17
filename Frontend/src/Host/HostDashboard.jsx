import React, {
  useEffect,
  useState,
} from "react";

import {
  Home,
  Plus,
  Eye,
  Search,
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Square,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Users,
  Star,
  Award,
  X,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useNavigate } from "react-router-dom";

import {
  getDashboardStats,
  getMyProperties,
} from "../services/ownerService";

const HostDashboard = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    pendingApprovals: 0,
    totalEarnings: 0,
    totalViews: 0,
    totalInquiries: 0,
    rating: 0,
    responseRate: 0,
  });

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState("all");

  const [selectedProperty, setSelectedProperty] =
    useState(null);

  const [showDetailModal, setShowDetailModal] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [notification, setNotification] =
    useState(null);

  const showNotification = (
    message,
    type = "success"
  ) => {
    setNotification({
      message,
      type,
    });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("ownerToken");

        if (!token) {
          navigate("/login");
          return;
        }

        const [
          statsRes,
          propertiesRes,
        ] = await Promise.all([
          getDashboardStats(),
          getMyProperties(),
        ]);

        if (!mounted) return;

        const statsData =
          statsRes.data?.stats ||
          statsRes.data?.data ||
          statsRes.data ||
          {};

        setStats({
          totalProperties:
            Number(
              statsData.totalProperties || 0
            ),

          activeListings:
            Number(
              statsData.activeListings || 0
            ),

          pendingApprovals:
            Number(
              statsData.pendingApprovals || 0
            ),

          totalEarnings:
            Number(
              statsData.totalEarnings || 0
            ),

          totalViews:
            Number(
              statsData.totalViews || 0
            ),

          totalInquiries:
            Number(
              statsData.totalInquiries || 0
            ),

          rating:
            Number(
              statsData.rating || 0
            ),

          responseRate:
            Number(
              statsData.responseRate || 0
            ),
        });

        const propertyData =
          Array.isArray(propertiesRes.data)
            ? propertiesRes.data
            : Array.isArray(
                propertiesRes.data?.properties
              )
            ? propertiesRes.data.properties
            : Array.isArray(
                propertiesRes.data?.data
              )
            ? propertiesRes.data.data
            : [];

        setProperties(propertyData);
      } catch (error) {
        console.error(
          "Error fetching owner dashboard:",
          error.response?.data || error
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem(
            "ownerToken"
          );

          navigate("/login");
          return;
        }

        showNotification(
          error.response?.data?.message ||
            "Failed to load dashboard data.",
          "error"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleViewDetails = (property) => {
    const propertyId =
      property._id || property.id;

    if (!propertyId) {
      showNotification(
        "Property ID not found.",
        "error"
      );
      return;
    }

    navigate(
      `/host/properties/${propertyId}`
    );
  };

  const handleAddProperty = () => {
    navigate("/host/add-property");
  };

  const normalizeStatus = (status) => {
    if (!status) return "Inactive";

    const value =
      String(status).toLowerCase();

    if (
      value === "active" ||
      value === "approved"
    ) {
      return "Active";
    }

    if (value === "pending") {
      return "Pending";
    }

    return "Inactive";
  };

  const getStatusBadge = (status) => {
    switch (
      normalizeStatus(status)
    ) {
      case "Active":
        return "bg-green-100 text-green-800";

      case "Pending":
        return "bg-yellow-100 text-yellow-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (
      normalizeStatus(status)
    ) {
      case "Active":
        return (
          <CheckCircle className="w-4 h-4" />
        );

      case "Pending":
        return (
          <Clock className="w-4 h-4" />
        );

      default:
        return (
          <AlertCircle className="w-4 h-4" />
        );
    }
  };

  const filteredProperties =
    properties.filter((property) => {
      const title = String(
        property.title ||
          property.name ||
          ""
      );

      const location = String(
        property.location ||
          property.address ||
          ""
      );

      const status =
        normalizeStatus(
          property.status
        );

      const search =
        searchTerm
          .toLowerCase()
          .trim();

      const matchesSearch =
        title
          .toLowerCase()
          .includes(search) ||
        location
          .toLowerCase()
          .includes(search);

      const matchesFilter =
        filterStatus === "all" ||
        status === filterStatus;

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  const getPropertyImage = (property) => {
    if (
      Array.isArray(property.images) &&
      property.images.length > 0
    ) {
      const image =
        property.images[0];

      return typeof image === "string"
        ? image
        : image?.url ||
            image?.secure_url;
    }

    if (
      Array.isArray(
        property.outerImages
      ) &&
      property.outerImages.length > 0
    ) {
      const image =
        property.outerImages[0];

      return typeof image === "string"
        ? image
        : image?.url ||
            image?.secure_url;
    }

    if (property.image) {
      return property.image;
    }

    return "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800";
  };

  const getPrice = (property) => {
    return Number(
      property.price || 0
    ).toLocaleString("en-IN");
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600 font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* तुमचा existing dashboard JSX इथे ठेवा */}
    </div>
  );
};

export default HostDashboard;