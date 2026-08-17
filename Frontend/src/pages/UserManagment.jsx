import React, { useMemo, useState } from "react";
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  BriefcaseBusiness,
  Eye,
  ArrowLeft,
  Edit3,
  User,
  Home,
  CheckCircle,
  IndianRupee,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* =========================================================
   MOCK CUSTOMER DATA
========================================================= */

const initialCustomers = [
  {
    id: 1,
    name: "pooja Chauhan",
    email: "pooja@gmail.com",
    phone: "6201945659",
    address: "Near Hanuman Mandir",
    city: "Wardha",
    state: "Maharashtra",
    pincode: "442001",
    joined: "14/08/2026",
    bookings: 1,
    completed: 0,
    spent: 0,
  },

  {
    id: 2,
    name: "neha singh",
    email: "nehasingh@gmail.com",
    phone: "9022469699",
    address: "Wardha",
    city: "Wardha",
    state: "Maharashtra",
    pincode: "442001",
    joined: "29/07/2026",
    bookings: 2,
    completed: 1,
    spent: 5200,
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
    bookings: 1,
    completed: 1,
    spent: 2800,
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
    bookings: 1,
    completed: 0,
    spent: 0,
  },

  {
    id: 5,
    name: "saurav thapliyal",
    email: "sauravthapliyal2005@gmail.com",
    phone: "7972766519",
    address: "At Kochewahi Post Banathar",
    city: "Wardha",
    state: "Maharashtra",
    pincode: "442001",
    joined: "23/07/2026",
    bookings: 1,
    completed: 0,
    spent: 1000,
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

const CustomerManagement = () => {
  const [customers, setCustomers] = useState(initialCustomers);

  const [search, setSearch] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState(null);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredCustomers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(searchValue) ||
        customer.email.toLowerCase().includes(searchValue) ||
        customer.phone.includes(searchValue) ||
        customer.address.toLowerCase().includes(searchValue) ||
        customer.city.toLowerCase().includes(searchValue)
      );
    });
  }, [customers, search]);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const totalCustomers = customers.length;

  const totalBookings = customers.reduce(
    (total, customer) => total + customer.bookings,
    0
  );

  const totalCompleted = customers.reduce(
    (total, customer) => total + customer.completed,
    0
  );

  const totalSpent = customers.reduce(
    (total, customer) => total + customer.spent,
    0
  );

  /* =======================================================
     OPEN CUSTOMER DETAIL
  ======================================================= */

  const openCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditData({ ...customer });
    setIsEditing(false);
  };

  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = () => {
    setSelectedCustomer(null);
    setEditData(null);
    setIsEditing(false);
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = () => {
    setEditData({ ...selectedCustomer });
    setIsEditing(true);
  };

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEditData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = () => {
    const updatedCustomer = {
      ...editData,
      bookings: Number(editData.bookings),
      completed: Number(editData.completed),
      spent: Number(editData.spent),
    };

    setCustomers((previousCustomers) =>
      previousCustomers.map((customer) =>
        customer.id === updatedCustomer.id
          ? updatedCustomer
          : customer
      )
    );

    setSelectedCustomer(updatedCustomer);
    setEditData(updatedCustomer);
    setIsEditing(false);
  };

  /* =======================================================
     CANCEL EDIT
  ======================================================= */

  const handleCancel = () => {
    setEditData({ ...selectedCustomer });
    setIsEditing(false);
  };

  /* =======================================================
     DETAIL PAGE
  ======================================================= */

  if (selectedCustomer) {
    const customer = isEditing ? editData : selectedCustomer;

    return (
      <CustomerDetail
        customer={customer}
        isEditing={isEditing}
        onBack={handleBack}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        onChange={handleInputChange}
      />
    );
  }

  /* =======================================================
     CUSTOMER MANAGEMENT LIST
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-[1500px]">

        {/* PAGE HEADER */}

        <div className="mb-8">

          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center justify-center text-[#1f7a45]">
              <Users size={40} strokeWidth={2} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#0b1736] sm:text-4xl">
              Customer Management
            </h1>

            <span className="rounded-full bg-[#1f7a45] px-4 py-1.5 text-sm font-semibold text-white">
              {totalCustomers} Total
            </span>

          </div>

          <p className="mt-2 text-base text-[#52627f]">
            Click on any customer to view detailed information
          </p>

        </div>

        {/* STAT CARDS */}

        <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Customers"
            value={totalCustomers}
            icon={<Users size={22} />}
          />

          <StatCard
            title="Total Bookings"
            value={totalBookings}
            icon={<BriefcaseBusiness size={22} />}
          />

          <StatCard
            title="Completed Bookings"
            value={totalCompleted}
            icon={<CheckCircle size={22} />}
            green
          />

          <StatCard
            title="Total Spent"
            value={`₹${totalSpent.toLocaleString("en-IN")}`}
            icon={<IndianRupee size={22} />}
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

        {/* CUSTOMER TABLE */}

        <div className="overflow-hidden rounded-xl border border-[#e2e5ea] bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="hidden grid-cols-[2.4fr_1.1fr_0.7fr_1fr_0.5fr] border-b border-[#e5e7eb] bg-[#fafbfc] px-7 py-5 text-[13px] font-medium tracking-wide text-[#536585] md:grid">

            <div>CUSTOMER</div>
            <div>CONTACT</div>
            <div>BOOKINGS</div>
            <div>JOINED</div>
            <div className="text-center">ACTION</div>

          </div>

          {/* CUSTOMER LIST */}

          {filteredCustomers.map((customer) => (

            <div
              key={customer.id}
              onClick={() => openCustomer(customer)}
              className="grid cursor-pointer grid-cols-1 gap-4 border-b border-[#e5e7eb] px-6 py-5 transition duration-200 hover:bg-[#f8fbf9] md:grid-cols-[2.4fr_1.1fr_0.7fr_1fr_0.5fr] md:items-center md:gap-0 md:px-7"
            >

              {/* CUSTOMER */}

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e9f5ed] text-lg font-bold text-[#1f7a45]">
                  {customer.name.charAt(0)}
                </div>

                <div className="min-w-0">

                  <p className="truncate font-semibold text-[#0b1736]">
                    {customer.name}
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-sm text-[#61718d]">
                    <Mail size={14} />
                    <span className="truncate">
                      {customer.email}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-sm text-[#8793aa]">
                    <MapPin size={14} />
                    <span className="truncate">
                      {customer.address}
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
                  {customer.phone}
                </span>

              </div>

              {/* BOOKINGS */}

              <div className="flex items-center gap-2 font-medium text-[#0b1736]">

                <BriefcaseBusiness
                  size={18}
                  className="text-[#1f7a45]"
                />

                {customer.bookings}

              </div>

              {/* JOINED */}

              <div className="flex items-center gap-2 text-[#536585]">

                <CalendarDays
                  size={17}
                  className="text-[#1f7a45]"
                />

                {customer.joined}

              </div>

              {/* ACTION */}

              <div className="flex justify-start md:justify-center">

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openCustomer(customer);
                  }}
                  className="rounded-full p-2 text-[#1f7a45] transition hover:bg-[#e9f5ed]"
                >
                  <Eye size={20} />
                </button>

              </div>

            </div>

          ))}

          {/* NO RESULTS */}

          {filteredCustomers.length === 0 && (

            <div className="px-6 py-16 text-center">

              <Search
                size={40}
                className="mx-auto mb-3 text-gray-300"
              />

              <p className="font-medium text-gray-500">
                No customers found
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Try searching with another name or email.
              </p>

            </div>

          )}

          {/* TABLE FOOTER */}

          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 text-sm text-[#536585]">

            <p>
              Showing 1 to {filteredCustomers.length} of{" "}
              {totalCustomers} customers
            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                className="rounded-md border border-gray-300 p-2 text-gray-500 transition hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
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
                <ChevronRight size={18} />
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

/* =========================================================
   CUSTOMER DETAIL
========================================================= */

const CustomerDetail = ({
  customer,
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

        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={onBack}
              className="rounded-full p-2 text-[#0b1736] transition hover:bg-white hover:shadow-sm"
            >
              <ArrowLeft size={25} />
            </button>

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-xl font-bold text-white">
                {customer.name.charAt(0)}
              </div>

              <div>

                <h1 className="text-xl font-bold text-[#0b1736] sm:text-2xl">
                  {customer.name}
                </h1>

                <div className="mt-1 flex items-center gap-2 text-sm text-[#64748b]">
                  <Mail size={15} />
                  {customer.email}
                </div>

              </div>

            </div>

          </div>

          {/* EDIT BUTTON */}

          {!isEditing ? (

            <button
              type="button"
              onClick={onEdit}
              className="flex items-center gap-2 rounded-lg bg-[#6d00ff] px-5 py-3 font-medium text-white shadow-sm transition hover:bg-[#5800d6]"
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

        {/* MAIN DETAIL CARD */}

        <div className="overflow-hidden rounded-2xl border border-[#e1e5ea] bg-white shadow-sm">

          {isEditing ? (

            /* =================================================
               EDIT MODE
            ================================================= */

            <div className="p-6 lg:p-8">

              <h2 className="mb-7 text-lg font-semibold text-[#536585]">
                EDIT CUSTOMER INFORMATION
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <InputField
                  label="Full Name"
                  name="name"
                  value={customer.name}
                  onChange={onChange}
                />

                <InputField
                  label="Email Address"
                  name="email"
                  value={customer.email}
                  onChange={onChange}
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  value={customer.phone}
                  onChange={onChange}
                />

                <InputField
                  label="Address"
                  name="address"
                  value={customer.address}
                  onChange={onChange}
                />

                <InputField
                  label="City"
                  name="city"
                  value={customer.city}
                  onChange={onChange}
                />

                <InputField
                  label="State"
                  name="state"
                  value={customer.state}
                  onChange={onChange}
                />

                <InputField
                  label="Pincode"
                  name="pincode"
                  value={customer.pincode}
                  onChange={onChange}
                />

                <InputField
                  label="Joined Date"
                  name="joined"
                  value={customer.joined}
                  onChange={onChange}
                />

                <InputField
                  label="Total Bookings"
                  name="bookings"
                  type="number"
                  value={customer.bookings}
                  onChange={onChange}
                />

                <InputField
                  label="Completed Bookings"
                  name="completed"
                  type="number"
                  value={customer.completed}
                  onChange={onChange}
                />

                <InputField
                  label="Total Spent"
                  name="spent"
                  type="number"
                  value={customer.spent}
                  onChange={onChange}
                />

              </div>

            </div>

          ) : (

            /* =================================================
               VIEW MODE
            ================================================= */

            <div className="grid grid-cols-1 gap-8 p-6 lg:grid-cols-2 lg:p-8">

              {/* LEFT SIDE */}

              <div>

                <h2 className="mb-5 text-lg font-medium text-[#536585]">
                  PERSONAL INFORMATION
                </h2>

                <InfoBox
                  icon={<User size={22} />}
                  label="Full Name"
                  value={customer.name}
                />

                <InfoBox
                  icon={<Mail size={22} />}
                  label="Email Address"
                  value={customer.email}
                />

                <InfoBox
                  icon={<Phone size={22} />}
                  label="Phone Number"
                  value={customer.phone}
                />

                <InfoBox
                  icon={<Home size={22} />}
                  label="Address"
                  value={customer.address}
                />

                <h2 className="mb-5 mt-8 text-lg font-medium text-[#536585]">
                  ACCOUNT STATUS
                </h2>

                <div className="rounded-xl bg-[#f8f9fc] p-5">

                  <div className="flex items-center gap-3">

                    <CalendarDays
                      size={21}
                      className="text-[#6d00ff]"
                    />

                    <div>

                      <p className="text-sm text-[#687896]">
                        Joined Date
                      </p>

                      <p className="mt-1 font-semibold text-[#0b1736]">
                        {customer.joined}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                 RIGHT SIDE
                 ONLY TOTAL BOOKINGS
              ================================================= */}

              <div>

                <h2 className="mb-5 text-lg font-medium text-[#536585]">
                  ACTIVITY SUMMARY
                </h2>

                <div className="grid grid-cols-1 gap-4">

                  <ActivityBox
                    icon={<BriefcaseBusiness size={21} />}
                    label="Total Bookings"
                    value={customer.bookings}
                  />

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
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

/* =========================================================
   INFO BOX
========================================================= */

const InfoBox = ({
  icon,
  label,
  value,
}) => {

  return (
    <div className="mb-4 flex items-center gap-4 rounded-xl bg-[#f8f9fc] p-4">

      <div className="shrink-0 text-[#6d00ff]">
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

/* =========================================================
   ACTIVITY BOX
========================================================= */

const ActivityBox = ({
  icon,
  label,
  value,
}) => {

  return (
    <div className="rounded-xl bg-[#eef3ff] p-5">

      <div className="flex items-center gap-3">

        <div className="text-[#6d00ff]">
          {icon}
        </div>

        <div>

          <p className="text-sm text-[#60708f]">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#6d00ff]">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
};

/* =========================================================
   INPUT FIELD
========================================================= */

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
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-[#d8dde5] bg-white px-4 py-3 text-[#0b1736] outline-none transition focus:border-[#1f7a45] focus:ring-2 focus:ring-[#1f7a45]/10"
      />

    </div>
  );
};

export default CustomerManagement;