import React, { useMemo, useState, useEffect } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Eye,
  ArrowLeft,
  Edit3,
  User,
  Home,
  CheckCircle,
  X,
  Save,
  Clock,
  Building2,
  History,
  CalendarCheck,
} from "lucide-react";
import { API_BASE } from '../Apitemp';
import AdminSkeleton  from '../components/AdminSkeleton'



const initialTenants = [
  {
    id: 1,
    name: "Pooja Chauhan",
    email: "pooja@gmail.com",
    phone: "6201945659",
    address: "Near Hanuman Mandir",
    city: "Wardha",
    state: "Maharashtra",
    pincode: "442001",
    joined: "14/08/2026",
    status: "Active",

    visitHistory: [
      {
        id: "VIS-001",
        propertyName: "Green Valley Apartment",
        propertyLocation: "Civil Lines, Wardha",
        date: "18/08/2026",
        time: "10:30 AM",
        status: "Completed",
      },
      {
        id: "VIS-002",
        propertyName: "Sunrise Residency",
        propertyLocation: "Maganwadi, Wardha",
        date: "22/08/2026",
        time: "04:00 PM",
        status: "Approved",
      },
    ],
  },

  {
    id: 2,
    name: "Neha Singh",
    email: "nehasingh@gmail.com",
    phone: "9022469699",
    address: "Wardha",
    city: "Wardha",
    state: "Maharashtra",
    pincode: "442001",
    joined: "29/07/2026",
    status: "Active",

    visitHistory: [
      {
        id: "VIS-003",
        propertyName: "Royal Heights",
        propertyLocation: "Arvi Road, Wardha",
        date: "05/08/2026",
        time: "11:00 AM",
        status: "Completed",
      },
      {
        id: "VIS-004",
        propertyName: "Lake View Homes",
        propertyLocation: "Bachelor Road, Wardha",
        date: "15/08/2026",
        time: "03:30 PM",
        status: "Approved",
      },
      {
        id: "VIS-005",
        propertyName: "Green Valley Apartment",
        propertyLocation: "Civil Lines, Wardha",
        date: "25/08/2026",
        time: "05:00 PM",
        status: "Pending",
      },
    ],
  },

  {
    id: 3,
    name: "Ritika Sharma",
    email: "ritika.sharma@gmail.com",
    phone: "9156784321",
    address: "Subhash Nagar",
    city: "Wardha",
    state: "Maharashtra",
    pincode: "442001",
    joined: "25/07/2026",
    status: "Active",

    visitHistory: [
      {
        id: "VIS-006",
        propertyName: "Shree Residency",
        propertyLocation: "Ram Nagar, Wardha",
        date: "02/08/2026",
        time: "12:00 PM",
        status: "Completed",
      },
    ],
  },

  {
    id: 4,
    name: "Aman Verma",
    email: "aman.verma@gmail.com",
    phone: "8765432109",
    address: "Sai Nagar",
    city: "Wardha",
    state: "Maharashtra",
    pincode: "442001",
    joined: "20/07/2026",
    status: "Active",

    visitHistory: [
      {
        id: "VIS-007",
        propertyName: "Sai Enclave",
        propertyLocation: "Sai Nagar, Wardha",
        date: "12/08/2026",
        time: "02:00 PM",
        status: "Rejected",
      },
      {
        id: "VIS-008",
        propertyName: "Green Valley Apartment",
        propertyLocation: "Civil Lines, Wardha",
        date: "28/08/2026",
        time: "11:30 AM",
        status: "Pending",
      },
    ],
  },

  {
    id: 5,
    name: "Saurav Thapliyal",
    email: "sauravthapliyal2005@gmail.com",
    phone: "7972766519",
    address: "At Kochewahi Post Banathar",
    city: "Wardha",
    state: "Maharashtra",
    pincode: "442001",
    joined: "23/07/2026",
    status: "Active",

    visitHistory: [
      {
        id: "VIS-009",
        propertyName: "Modern Heights",
        propertyLocation: "Indira Market, Wardha",
        date: "09/08/2026",
        time: "10:00 AM",
        status: "Completed",
      },
      {
        id: "VIS-010",
        propertyName: "Royal Heights",
        propertyLocation: "Arvi Road, Wardha",
        date: "30/08/2026",
        time: "04:30 PM",
        status: "Approved",
      },
    ],
  },
];



const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { setLoading(false); return; }

    fetch(`${API_BASE}/admin/tenants?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tenants)) {
          // Map API response to match component expectations
          const mapped = data.tenants.map((t) => ({
            id: String(t._id || t.id),
            name: t.name || 'Unknown',
            email: t.email || '',
            phone: t.phone || 'N/A',
            address: t.address || t.location || 'N/A',
            city: t.location || t.city || 'N/A',
            state: t.state || '',
            pincode: t.pincode || '',
            joined: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : 'N/A',
            status: t.isActive === false ? 'Inactive' : 'Active',
            isActive: t.isActive,
            bookingsCount: t.bookingsCount || 0,
            favoritesCount: t.favoritesCount || 0,
            visitHistory: [],
          }));
          setTenants(mapped);
        } else {
          setTenants([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('Tenant fetch error:', err);
        setTenants([]);
        setLoading(false);
      });
  }, []);
  const [search, setSearch] = useState("");

  const [selectedTenant, setSelectedTenant] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState(null);


  const filteredTenants = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return tenants;
    }

    return tenants.filter((tenant) => {
      return (
        tenant.name.toLowerCase().includes(searchValue) ||
        tenant.email.toLowerCase().includes(searchValue) ||
        tenant.phone.includes(searchValue) ||
        tenant.address.toLowerCase().includes(searchValue) ||
        tenant.city.toLowerCase().includes(searchValue)
      );
    });
  }, [tenants, search]);



  const totalTenants = tenants.length;

  const totalVisits = tenants.reduce(
    (total, tenant) => total + (tenant.bookingsCount || tenant.visitHistory?.length || 0),
    0
  );

  const completedVisits = tenants.reduce(
    (total, tenant) =>
      total +
      (tenant.visitHistory || []).filter(
        (visit) => visit.status === "Completed"
      ).length,
    0
  );

  const pendingVisits = tenants.reduce(
    (total, tenant) =>
      total +
      (tenant.visitHistory || []).filter(
        (visit) => visit.status === "Pending"
      ).length,
    0
  );


  const openTenant = (tenant) => {
    setSelectedTenant(tenant);
    setEditData({ ...tenant });
    setIsEditing(false);
  };


  const handleBack = () => {
    setSelectedTenant(null);
    setEditData(null);
    setIsEditing(false);
  };

   

  const handleEdit = () => {
    setEditData({ ...selectedTenant });
    setIsEditing(true);
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEditData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

 
  const handleSave = () => {
    const updatedTenant = {
      ...editData,
    };

    setTenants((previousTenants) =>
      previousTenants.map((tenant) =>
        tenant.id === updatedTenant.id
          ? updatedTenant
          : tenant
      )
    );

    setSelectedTenant(updatedTenant);
    setEditData(updatedTenant);
    setIsEditing(false);
  };

 

  const handleCancel = () => {
    setEditData({ ...selectedTenant });
    setIsEditing(false);
  };

 

  if (selectedTenant) {
    const tenant = isEditing ? editData : selectedTenant;

    return (
      <TenantDetail
        tenant={tenant}
        isEditing={isEditing}
        onBack={handleBack}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        onChange={handleInputChange}
      />
    );
  }



  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-[1500px]">

 {loading ? (
        <AdminSkeleton />
      ) : (
        <>
        {/* PAGE HEADER */}

        <div className="mb-8">

          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center justify-center text-[#1f7a45]">
              <Users size={40} strokeWidth={2} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#0b1736] sm:text-4xl">
              Tenant Management
            </h1>

            <span className="rounded-full bg-[#1f7a45] px-4 py-1.5 text-sm font-semibold text-white">
              {totalTenants} Total
            </span>

          </div>

          <p className="mt-2 text-base text-[#52627f]">
            View tenant information and complete visit history
          </p>

        </div>

        {/* STAT CARDS */}

        <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Tenants"
            value={totalTenants}
            icon={<Users size={22} />}
          />

          <StatCard
            title="Total Visits"
            value={totalVisits}
            icon={<CalendarCheck size={22} />}
          />

          <StatCard
            title="Completed Visits"
            value={completedVisits}
            icon={<CheckCircle size={22} />}
            green
          />

          <StatCard
            title="Pending Visits"
            value={pendingVisits}
            icon={<Clock size={22} />}
          />

        </div>

        {/* SEARCH */}

        <div className="mb-7 rounded-xl border border-[#e4e7ed] bg-white p-4 shadow-sm">

          <div className="flex items-center rounded-xl border-2 border-[#1f7a45] bg-white px-4">

            <Search
              size={21}
              className="shrink-0 text-[#8995ab]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, phone, or address..."
              className="w-full bg-transparent px-3 py-4 text-[15px] text-[#0b1736] outline-none placeholder:text-[#8290a8]"
            />

          </div>

        </div>

        {/* TENANT TABLE */}

        <div className="overflow-hidden rounded-xl border border-[#e2e5ea] bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="hidden grid-cols-[2.3fr_1.2fr_0.8fr_1fr_0.5fr] border-b border-[#e5e7eb] bg-[#fafbfc] px-7 py-5 text-[13px] font-medium tracking-wide text-[#536585] md:grid">

            <div>TENANT</div>

            <div>CONTACT</div>

            <div>VISITS</div>

            <div>JOINED</div>

            <div className="text-center">ACTION</div>

          </div>

          {/* TENANT LIST */}

          {filteredTenants.map((tenant) => (

            <div
              key={tenant.id}
              onClick={() => openTenant(tenant)}
              className="grid cursor-pointer grid-cols-1 gap-4 border-b border-[#e5e7eb] px-6 py-5 transition duration-200 hover:bg-[#f8fbf9] md:grid-cols-[2.3fr_1.2fr_0.8fr_1fr_0.5fr] md:items-center md:gap-0 md:px-7"
            >

              {/* TENANT */}

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9f5ed] text-lg font-bold text-[#1f7a45]">
                  {tenant.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">

                  <p className="truncate font-semibold text-[#0b1736]">
                    {tenant.name}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-sm text-[#61718d]">
                    <Mail size={14} />
                    <span className="truncate">
                      {tenant.email}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-sm text-[#8793aa]">
                    <MapPin size={14} />
                    <span className="truncate">
                      {tenant.address}
                    </span>
                  </div>

                </div>

              </div>

              {/* CONTACT */}

              <div className="flex items-center gap-2 text-[#405579]">

                <Phone
                  size={17}
                  className="text-[#1f7a45]"
                />

                <span>
                  {tenant.phone}
                </span>

              </div>

              {/* VISITS */}

              <div className="flex items-center gap-2 font-medium text-[#0b1736]">

                <CalendarCheck
                  size={18}
                  className="text-[#1f7a45]"
                />

                {tenant.visitHistory.length}

              </div>

              {/* JOINED */}

              <div className="flex items-center gap-2 text-[#536585]">

                <CalendarDays
                  size={17}
                  className="text-[#1f7a45]"
                />

                {tenant.joined}

              </div>

              {/* ACTION */}

              <div className="flex justify-start md:justify-center">

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openTenant(tenant);
                  }}
                  className="rounded-full p-2 text-[#1f7a45] transition hover:bg-[#e9f5ed]"
                >
                  <Eye size={20} />
                </button>

              </div>

            </div>

          ))}

          {/* NO RESULTS */}

          {filteredTenants.length === 0 && (

            <div className="px-6 py-16 text-center">

              <Search
                size={40}
                className="mx-auto mb-3 text-gray-300"
              />

              <p className="font-medium text-gray-500">
                No tenants found
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Try searching with another name or email.
              </p>

            </div>

          )}

          {/* TABLE FOOTER */}

          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 text-sm text-[#536585]">

            <p>
              Showing 1 to {filteredTenants.length} of{" "}
              {totalTenants} tenants
            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                className="rounded-md border border-gray-300 p-2 text-gray-500 transition hover:bg-gray-50"
              >
                <ArrowLeft size={18} />
              </button>

              <button
                type="button"
                className="rounded-md bg-[#1f7a45] px-4 py-2 font-medium text-white"
              >
                1
              </button>

              <button
                type="button"
                className="rounded-md border border-gray-300 p-2 text-gray-500 transition hover:bg-gray-50"
              >
                <ArrowLeft
                  size={18}
                  className="rotate-180"
                />
              </button>

            </div>

          </div>

        </div>
</>
      )}
      </div>
      
      

    </div>
    
  );
};



const TenantDetail = ({
  tenant,
  isEditing,
  onBack,
  onEdit,
  onCancel,
  onSave,
  onChange,
}) => {

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-[1450px]">

        {/* DETAIL HEADER */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={onBack}
              className="rounded-full p-2 text-[#0b1736] transition hover:bg-white hover:shadow-sm"
            >
              <ArrowLeft size={25} />
            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#1f7a45] to-[#43a76c] text-xl font-bold text-white">
                {tenant.name.charAt(0).toUpperCase()}
              </div>

              <div>

                <h1 className="text-xl font-bold text-[#0b1736] sm:text-2xl">
                  {tenant.name}
                </h1>

                <div className="mt-1 flex items-center gap-2 text-sm text-[#64748b]">
                  <Mail size={15} />
                  {tenant.email}
                </div>

              </div>

            </div>

          </div>

          {/* EDIT BUTTON */}

          {!isEditing ? (

            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-2 rounded-lg bg-[#1f7a45] px-5 py-3 font-medium text-white shadow-sm transition hover:bg-[#176438]"
            >
              <Edit3 size={18} />
              Edit
            </button>

          ) : (

            <div className="flex gap-3">

              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <X size={18} />
                Cancel
              </button>

              <button
                type="button"
                onClick={onSave}
                className="flex items-center gap-2 rounded-lg bg-[#1f7a45] px-5 py-3 font-medium text-white shadow-sm transition hover:bg-[#176438]"
              >
                <Save size={18} />
                Save Changes
              </button>

            </div>

          )}

        </div>

      

        <div className="mb-6 overflow-hidden rounded-2xl border border-[#e1e5ea] bg-white shadow-sm">

          {isEditing ? (

            <div className="p-6 lg:p-8">

              <h2 className="mb-7 text-lg font-semibold text-[#536585]">
                EDIT TENANT INFORMATION
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <InputField
                  label="Full Name"
                  name="name"
                  value={tenant.name}
                  onChange={onChange}
                />

                <InputField
                  label="Email Address"
                  name="email"
                  value={tenant.email}
                  onChange={onChange}
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  value={tenant.phone}
                  onChange={onChange}
                />

                <InputField
                  label="Address"
                  name="address"
                  value={tenant.address}
                  onChange={onChange}
                />

                <InputField
                  label="City"
                  name="city"
                  value={tenant.city}
                  onChange={onChange}
                />

                <InputField
                  label="State"
                  name="state"
                  value={tenant.state}
                  onChange={onChange}
                />

                <InputField
                  label="Pincode"
                  name="pincode"
                  value={tenant.pincode}
                  onChange={onChange}
                />

                <InputField
                  label="Joined Date"
                  name="joined"
                  value={tenant.joined}
                  onChange={onChange}
                />

              </div>

            </div>

          ) : (

            <div className="p-6 lg:p-8">

              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-[#536585]">
                <User size={20} className="text-[#1f7a45]" />
                PERSONAL INFORMATION
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <InfoBox
                  icon={<User size={21} />}
                  label="Full Name"
                  value={tenant.name}
                />

                <InfoBox
                  icon={<Mail size={21} />}
                  label="Email Address"
                  value={tenant.email}
                />

                <InfoBox
                  icon={<Phone size={21} />}
                  label="Phone Number"
                  value={tenant.phone}
                />

                <InfoBox
                  icon={<Home size={21} />}
                  label="Address"
                  value={`${tenant.address}, ${tenant.city}, ${tenant.state} - ${tenant.pincode}`}
                />

                <InfoBox
                  icon={<CalendarDays size={21} />}
                  label="Joined Date"
                  value={tenant.joined}
                />

              

              </div>

            </div>

          )}

        </div>

       {/* visit history */}

        <div className="overflow-hidden rounded-2xl border border-[#e1e5ea] bg-white shadow-sm">

          <div className="border-b border-[#e5e7eb] px-6 py-5 lg:px-8">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div>

                <h2 className="flex items-center gap-2 text-xl font-bold text-[#0b1736]">
                  <History
                    size={23}
                    className="text-[#1f7a45]"
                  />
                  Visit History
                </h2>

                <p className="mt-1 text-sm text-[#687896]">
                  Properties visited or requested by this tenant
                </p>

              </div>

              <span className="rounded-full bg-[#e9f5ed] px-4 py-2 text-sm font-semibold text-[#1f7a45]">
                {tenant.visitHistory.length} Visits
              </span>

            </div>

          </div>

          {tenant.visitHistory.length > 0 ? (

            <div className="divide-y divide-[#e5e7eb]">

              {tenant.visitHistory.map((visit) => (

                <div
                  key={visit.id}
                  className="p-6 transition hover:bg-[#fafcfb] lg:px-8"
                >

                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* PROPERTY */}

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e9f5ed] text-[#1f7a45]">
                        <Building2 size={22} />
                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-bold text-[#0b1736]">
                            {visit.propertyName}
                          </h3>

                          <VisitStatus status={visit.status} />

                        </div>

                        <div className="mt-2 flex items-center gap-1 text-sm text-[#687896]">
                          <MapPin size={15} />
                          {visit.propertyLocation}
                        </div>

                        <p className="mt-1 text-xs text-[#9aa5b7]">
                          Visit ID: {visit.id}
                        </p>

                      </div>

                    </div>

                    {/* DATE + TIME */}

                    <div className="grid grid-cols-2 gap-5 sm:flex sm:items-center">

                      <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f3f7f4] text-[#1f7a45]">
                          <CalendarDays size={17} />
                        </div>

                        <div>

                          <p className="text-xs text-[#8a96a9]">
                            Visit Date
                          </p>

                          <p className="text-sm font-semibold text-[#263653]">
                            {visit.date}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f3f7f4] text-[#1f7a45]">
                          <Clock size={17} />
                        </div>

                        <div>

                          <p className="text-xs text-[#8a96a9]">
                            Visit Time
                          </p>

                          <p className="text-sm font-semibold text-[#263653]">
                            {visit.time}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="px-6 py-16 text-center">

              <CalendarCheck
                size={45}
                className="mx-auto mb-3 text-gray-300"
              />

              <p className="font-medium text-gray-500">
                No visit history
              </p>

              <p className="mt-1 text-sm text-gray-400">
                This tenant has not booked any property visits yet.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
};



const VisitStatus = ({ status }) => {

  const statusStyles = {
    Completed:
      "bg-green-50 text-green-700 border-green-200",

    Approved:
      "bg-blue-50 text-blue-700 border-blue-200",

    Pending:
      "bg-yellow-50 text-yellow-700 border-yellow-200",

    Rejected:
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        statusStyles[status] ||
        "bg-gray-50 text-gray-600 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  title,
  value,
  icon,
  green = false,
}) => {

  return (
    <div
      className={`rounded-xl border border-[#e2e5ea] border-l-4 ${
        green
          ? "border-l-green-500"
          : "border-l-[#1f7a45]"
      } bg-white p-6 shadow-sm`}
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-[#536585]">
            {title}
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
              green
                ? "text-green-600"
                : "text-[#0b1736]"
            }`}
          >
            {value}
          </p>

        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            green
              ? "bg-[#edfff4] text-green-600"
              : "bg-[#e9f5ed] text-[#1f7a45]"
          }`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};



const InfoBox = ({
  icon,
  label,
  value,
}) => {

  return (
    <div className="flex items-center gap-4 rounded-xl bg-[#f8f9fc] p-4">

      <div className="shrink-0 text-[#1f7a45]">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-sm text-[#687896]">
          {label}
        </p>

        <p className="mt-1 break-words font-semibold text-[#0b1736]">
          {value}
        </p>

      </div>

    </div>
  );
};


const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}) => {

  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-[#536585]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full rounded-lg border border-[#d8dde5] bg-white px-4 py-3 text-[#0b1736] outline-none transition focus:border-[#1f7a45] focus:ring-2 focus:ring-[#1f7a45]/10"
      />

    </div>
  );
};

export default TenantManagement;