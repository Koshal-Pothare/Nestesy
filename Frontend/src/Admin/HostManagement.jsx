import React, { useState, useEffect } from "react";
import { Search, Eye, Users, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from '../Apitemp';
import AdminSkeleton  from '../components/AdminSkeleton'

const mockHosts = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "9876543210",
    location: "Pune",
    properties: [
      {
        id: 101,
        name: "Modern 2 BHK Apartment",
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
        location: "Baner, Pune",
        status: "approved",
      },
      {
        id: 102,
        name: "Luxury 3 BHK Flat",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
        location: "Wakad, Pune",
        status: "pending",
      },
      {
        id: 103,
        name: "Premium Studio Apartment",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        location: "Kothrud, Pune",
        status: "rented",
      },
    ],
  },
  {
    id: 2,
    name: "Amit Patil",
    email: "amit@gmail.com",
    phone: "9876543211",
    location: "Mumbai",
    properties: [
      {
        id: 104,
        name: "Sea View Apartment",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
        location: "Andheri, Mumbai",
        status: "approved",
      },
      {
        id: 105,
        name: "Premium 1 BHK",
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
        location: "Powai, Mumbai",
        status: "rented",
      },
    ],
  },
  {
    id: 3,
    name: "Priya Joshi",
    email: "priya@gmail.com",
    phone: "9876543212",
    location: "Nagpur",
    properties: [
      {
        id: 106,
        name: "Elegant Family Home",
        image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
        location: "Dharampeth, Nagpur",
        status: "approved",
      },
      {
        id: 107,
        name: "Spacious 2 BHK",
        image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
        location: "Manish Nagar, Nagpur",
        status: "pending",
      },
    ],
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    email: "sneha@gmail.com",
    phone: "9876543213",
    location: "Nashik",
    properties: [
      {
        id: 108,
        name: "Green Valley House",
        image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
        location: "Gangapur Road, Nashik",
        status: "approved",
      },
      {
        id: 109,
        name: "Modern Family Apartment",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
        location: "College Road, Nashik",
        status: "rented",
      },
    ],
  },
  {
    id: 5,
    name: "Vikram Deshmukh",
    email: "vikram@gmail.com",
    phone: "9876543214",
    location: "Thane",
    properties: [
      {
        id: 110,
        name: "Urban 2 BHK Apartment",
        image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1",
        location: "Ghodbunder Road, Thane",
        status: "pending",
      },
      {
        id: 111,
        name: "Luxury City Apartment",
        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
        location: "Hiranandani Estate, Thane",
        status: "approved",
      },
    ],
  },
  {
    id: 6,
    name: "Neha Sharma",
    email: "neha@gmail.com",
    phone: "9876543215",
    location: "Aurangabad",
    properties: [
      {
        id: 112,
        name: "Peaceful 2 BHK Home",
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
        location: "CIDCO, Aurangabad",
        status: "approved",
      },
      {
        id: 113,
        name: "Modern Rental Apartment",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        location: "Garkheda, Aurangabad",
        status: "pending",
      },
    ],
  },
];

const HostManagement = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hostsList, setHostsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/admin/owners?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.hosts)) {
          setHostsList(data.hosts);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('Host fetch error:', err);
        setLoading(false);
      });
  }, []);

  const hostsPerPage = 5;

  const filteredHosts = hostsList.filter((host) => {
    const value = search.toLowerCase();

    return (
      host.name.toLowerCase().includes(value) ||
      host.email.toLowerCase().includes(value) ||
      (host.phone && host.phone.includes(value))
    );
  });

  const totalPages = Math.ceil(filteredHosts.length / hostsPerPage);

  const indexOfLastHost = currentPage * hostsPerPage;
  const indexOfFirstHost = indexOfLastHost - hostsPerPage;

  const currentHosts = filteredHosts.slice(
    indexOfFirstHost,
    indexOfLastHost
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

{loading ? (
        <AdminSkeleton />
      ) : (
        <>
        {/* Header */}
        <div className="mb-6">
          

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Host Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View host information and manage their properties.
          </p>
        </div>

        {/* Top Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-primary-50 p-3 text-primary-600">
                <Users size={24} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Hosts</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {hostsList.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Building2 size={24} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Properties</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {hostsList.reduce(
                    (total, host) => total + (host.properties?.length || host.propertiesCount || 0),
                    0
                  )}
                </h2>
              </div>
            </div>
          </div>

        </div>

        {/* Search */}
        <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="relative max-w-md">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search host by name, email or phone..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                    Host
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500">
                    Properties
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentHosts.length > 0 ? (
                  currentHosts.map((host) => (
                    <tr
                      key={host.id}
                      className="border-b border-gray-100 last:border-0 transition hover:bg-primary-50/30"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-600">
                            {host.name.charAt(0)}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {host.name}
                            </p>

                            <p className="text-xs text-gray-400">
                              {host.location}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {host.email}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-600">
                        {host.phone}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-semibold text-primary-600">
                          {host.properties?.length ?? host.propertiesCount ?? 0}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() =>
                            navigate(`/admin/hosts/${host.id}`, {
                              state: { host },
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No hosts found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-gray-500">
                Showing {indexOfFirstHost + 1}-
                {Math.min(indexOfLastHost, filteredHosts.length)} of{" "}
                {filteredHosts.length} hosts
              </p>

              <div className="flex items-center gap-2">

                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="rounded-lg border border-gray-200 p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                      currentPage === index + 1
                        ? "bg-primary-600 text-white"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="rounded-lg border border-gray-200 p-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>

              </div>
            </div>
          )}

        </div>
</>)}
      </div>
    </div>
  );
};

export default HostManagement;