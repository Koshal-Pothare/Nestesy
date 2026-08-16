import React from "react";
import { ArrowLeft, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const HostDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const host = location.state?.host;

  if (!host) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">
            Host details not found
          </h2>

          <button
            onClick={() => navigate("/admin/hosts")}
            className="mt-5 rounded-xl bg-primary-600 px-5 py-3 font-semibold text-white"
          >
            Back to Hosts
          </button>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-amber-100 text-amber-700";

      case "rented":
        return "bg-blue-100 text-blue-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/hosts")}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-primary-600"
        >
          <ArrowLeft size={18} />
          Back to Host Management
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-500">
            Host Details
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            {host.name}
          </h1>
        </div>

        {/* Host Information */}
        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-6 md:flex-row md:items-center">

            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-3xl font-bold text-primary-600">
              {host.name.charAt(0)}
            </div>

            {/* Details */}
            <div className="flex-1">

              <h2 className="text-xl font-bold text-gray-900">
                {host.name}
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
                    <Mail size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-700">
                      {host.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
                    <Phone size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-700">
                      {host.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-50 p-2 text-primary-600">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm font-medium text-gray-700">
                      {host.location}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Property Count */}
            <div className="rounded-2xl bg-primary-50 px-6 py-5 text-center">
              <Building2
                size={25}
                className="mx-auto text-primary-600"
              />

              <p className="mt-2 text-2xl font-bold text-primary-700">
                {host.properties.length}
              </p>

              <p className="text-xs font-medium text-gray-500">
                Total Properties
              </p>
            </div>

          </div>
        </div>

        {/* Properties */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="border-b border-gray-100 p-5">
            <h2 className="text-lg font-bold text-gray-900">
              Host Properties
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Properties listed by {host.name}
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px]">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">

                  <th className="px-5 py-4 text-xs font-bold uppercase text-gray-500">
                    Property
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-gray-500">
                    Location
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase text-gray-500">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {host.properties.map((property) => (

                  <tr
                    key={property.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >

                    {/* Property */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <img
                          src={property.image}
                          alt={property.name}
                          className="h-14 w-20 rounded-xl object-cover"
                        />

                        <div>
                          <p className="font-semibold text-gray-800">
                            {property.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            Property ID: #{property.id}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} className="text-primary-500" />
                        {property.location}
                      </div>

                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                          property.status
                        )}`}
                      >
                        {property.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        </div>

      </div>
    </div>
  );
};

export default HostDetails;