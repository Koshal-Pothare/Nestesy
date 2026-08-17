import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getPropertyById,
  deleteProperty,
  updatePropertyStatus,
} from "../services/ownerService";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] =
    useState(false);
  const [error, setError] = useState("");

  const loadProperty = useCallback(async () => {
    if (!id) {
      setError("Property ID is missing.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("ownerToken");

    if (!token) {
      setError(
        "Owner session expired. Please login again."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getPropertyById(id);

      const data =
        response.data?.property ||
        response.data?.data ||
        response.data;

      setProperty(data);
    } catch (err) {
      console.error(
        "Error loading property:",
        err.response?.data || err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("ownerToken");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load property details."
      );
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  const handleDelete = async () => {
    if (deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this property?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteProperty(id);

      alert("Property deleted successfully.");

      navigate("/host/my-properties", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Error deleting property:",
        err.response?.data || err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("ownerToken");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to delete property."
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (updatingStatus || !id || !newStatus) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");

      const response =
        await updatePropertyStatus(
          id,
          newStatus
        );

      const data =
        response.data?.property ||
        response.data?.data ||
        response.data;

      setProperty(data);
    } catch (err) {
      console.error(
        "Error updating property status:",
        err.response?.data || err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("ownerToken");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to update property status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

          <p className="mt-4 text-sm text-gray-500">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold text-red-600">
            Unable to Load Property
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={loadProperty}
              className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/host/my-properties")
              }
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">
            Property not found
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate("/host/my-properties")
            }
            className="mt-5 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to My Properties
          </button>
        </div>
      </div>
    );
  }

  const images =
    Array.isArray(property.outerImages)
      ? property.outerImages
      : Array.isArray(property.images)
      ? property.images
      : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {property.title ||
                property.name ||
                "Property Details"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {property.location ||
                property.address ||
                "Location not available"}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/host/my-properties")
            }
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Properties
          </button>
        </div>

        {error && property && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {images.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {images.slice(0, 4).map((image, index) => {
                const imageUrl =
                  typeof image === "string"
                    ? image
                    : image?.url ||
                      image?.secure_url;

                if (!imageUrl) return null;

                return (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`${property.title || "Property"} ${
                      index + 1
                    }`}
                    className="h-64 w-full object-cover"
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center bg-gray-100 text-gray-400">
              No property images available
            </div>
          )}

          <div className="p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-gray-400">
                  Price
                </p>

                <p className="mt-1 font-bold text-gray-800">
                  ₹
                  {Number(
                    property.price || 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Type
                </p>

                <p className="mt-1 font-bold text-gray-800">
                  {property.type || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Bedrooms
                </p>

                <p className="mt-1 font-bold text-gray-800">
                  {property.bedrooms ??
                    property.bhk ??
                    0}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Bathrooms
                </p>

                <p className="mt-1 font-bold text-gray-800">
                  {property.bathrooms ?? 0}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-400">
                Property Status
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                    property.status === "approved"
                      ? "bg-green-50 text-green-600"
                      : property.status === "rejected"
                      ? "bg-red-50 text-red-600"
                      : property.status === "rented"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {property.status || "pending"}
                </span>

                <select
                  value={property.status || "pending"}
                  onChange={(e) =>
                    handleStatusUpdate(
                      e.target.value
                    )
                  }
                  disabled={updatingStatus}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="approved">
                    Approved
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>

                  <option value="rented">
                    Rented
                  </option>
                </select>

                {updatingStatus && (
                  <span className="text-xs text-gray-500">
                    Updating...
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <h2 className="font-bold text-gray-800">
                Description
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {property.description ||
                  "No description available."}
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/host/properties/${id}/edit`
                  )
                }
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Edit Property
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Property"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;