import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Users, 
  UserCheck,
  Calendar, 
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight, 
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle, 
  Download, 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { API_BASE } from '../Apitemp';
 
const defaultStatsData = [
  {
    id: 1,
    title: "Total Properties",
    value: "0",
    change: "...",
    icon: Building2,
    color: "text-green-600",
    bgColor: "bg-green-100",
    trend: "up"
  },
  {
    id: 2,
    title: "Total Host",
    value: "0",
    change: "...",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    trend: "up"
  },
  {
    id: 3,
    title: "Total Tenants",
    value: "0",
    change: "...",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    trend: "up"
  },
  {
    id: 4,
    title: "Total Visits",
    value: "₹0",
    change: "...",
    icon: Building2,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    trend: "up"
  },
];

const STAT_ICONS = [Building2, Users, Users, Building2];

const recentProperties = [
  {
    id: 1,
    title: "Luxury 3BHK in Whitefield",
    location: "Bangalore, Karnataka",
    price: "₹45,000/month",
    status: "Active",
    owner: "Priya Sharma",
    image: "/api/placeholder/80/80",
    date: "2 hours ago"
  },
  {
    id: 2,
    title: "Cozy 2BHK near IT Park",
    location: "Hyderabad, Telangana",
    price: "₹28,000/month",
    status: "Pending",
    owner: "Rahul Verma",
    image: "/api/placeholder/80/80",
    date: "5 hours ago"
  },
  {
    id: 3,
    title: "Premium Villa with Pool",
    location: "Pune, Maharashtra",
    price: "₹1,20,000/month",
    status: "Inactive",
    owner: "Amit Patel",
    image: "/api/placeholder/80/80",
    date: "1 day ago"
  },
  {
    id: 4,
    title: "Modern 1BHK Apartment",
    location: "Mumbai, Maharashtra",
    price: "₹35,000/month",
    status: "Active",
    owner: "Neha Reddy",
    image: "/api/placeholder/80/80",
    date: "2 days ago"
  }
];
 //users
const recentUsers = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@email.com",
    role: "Property Owner",
    joined: "2 days ago",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 2,
    name: "Rahul Verma",
    email: "rahul@email.com",
    role: "Tenant",
    joined: "5 days ago",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 3,
    name: "Amit Patel",
    email: "amit@email.com",
    role: "Agent",
    joined: "1 week ago",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 4,
    name: "Neha Reddy",
    email: "neha@email.com",
    role: "Property Owner",
    joined: "2 weeks ago",
    avatar: "/api/placeholder/40/40"
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram@email.com",
    role: "Tenant",
    joined: "3 weeks ago",
    avatar: "/api/placeholder/40/40"
  }
];

const AdminDashboard = () => {
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredPieSlice, setHoveredPieSlice] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dashboardStats, setDashboardStats] = useState(defaultStatsData);
  const [dashboardRecentProps, setDashboardRecentProps] = useState([]);
  const [dashboardRecentUsers, setDashboardRecentUsers] = useState([]);
  const [pieChartData, setPieChartData] = useState([
    { label: "Total Listings", value: 0, color: "#10b981" },
    { label: "Total Hosts", value: 0, color: "#8b5cf6" },
    { label: "Total Tenants", value: 0, color: "#3b82f6" }
  ]);
  const [liveStats, setLiveStats] = useState({ newUsers: 0, newListings: 0 });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { setLoading(false); return; }

    fetch(`${API_BASE}/admin/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.stats && data.stats.length > 0) {
            setDashboardStats(
              data.stats.map((s, idx) => ({
                ...s,
                icon: STAT_ICONS[idx] || Building2,
              }))
            );
          }
          console.log(dashboardStats)
          if (data.recentProperties) setDashboardRecentProps(data.recentProperties);
          if (data.recentUsers) setDashboardRecentUsers(data.recentUsers);

          if (data.counts) {
            const { totalProperties, totalOwners, totalTenants } = data.counts;
            setPieChartData([
              { label: "Total Listings", value: totalProperties || 0, color: "#10b981" },
              { label: "Total Hosts", value: totalOwners || 0, color: "#8b5cf6" },
              { label: "Total Tenants", value: totalTenants || 0, color: "#3b82f6" },
            ]);
            setLiveStats({
              newUsers: totalTenants || 0,
              newListings: totalProperties || 0,
            });
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('Dashboard stats fetch error:', err);
        setLoading(false);
      });
  }, []);

  // Calculate total for percentage
  const totalPieValue = useMemo(() => {
    return pieChartData.reduce((sum, item) => sum + item.value, 0);
  }, [pieChartData]);

  // Stats cards
  const statsCards = useMemo(() => 
    dashboardStats.map((stat, index) => (
      <motion.div
        key={stat.id || index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
        onMouseEnter={() => setHoveredStat(stat.id)}
        onMouseLeave={() => setHoveredStat(null)}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${stat.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">
                {loading ? <span className="animate-pulse text-gray-300">—</span> : stat.value}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change || '—'}
                </span>
                <span className="text-gray-400 text-xs">live data</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon && <stat.icon className={`w-6 h-6 ${stat.color}`} />}
            </div>
          </div>
        </div>
      </motion.div>
    )), [dashboardStats, loading]
  );

  // Pie Chart Component
  const PieChart = ({ data, total, hoveredIndex, setHoveredIndex }) => {
    const radius = 120;
    const center = 130;
    let currentAngle = 0;

    return (
      <div className="relative" style={{ width: '260px', height: '260px' }}>
        <svg viewBox="0 0 260 260" className="w-full h-full">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            // Calculate SVG arc path
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);
            
            const x1 = center + radius * Math.cos(startRad);
            const y1 = center + radius * Math.sin(startRad);
            const x2 = center + radius * Math.cos(endRad);
            const y2 = center + radius * Math.sin(endRad);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const path = `
              M ${center} ${center}
              L ${x1} ${y1}
              A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z
            `;

            const isHovered = hoveredIndex === index;

            return (
              <g key={index}>
                <path
                  d={path}
                  fill={item.color}
                  className="transition-all duration-300 cursor-pointer"
                  opacity={isHovered ? 1 : (hoveredIndex !== null && hoveredIndex !== index ? 0.6 : 1)}
                  transform={isHovered ? `scale(1.05) translate(-${center * 0.05}, -${center * 0.05})` : ''}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {isHovered && (
                  <text
                    x={center}
                    y={center - 10}
                    textAnchor="middle"
                    className="text-xs font-bold fill-white"
                  >
                    {percentage.toFixed(1)}%
                  </text>
                )}
              </g>
            );
          })}
          {/* Inner circle for donut effect */}
          <circle
            cx={center}
            cy={center}
            r={60}
            fill="white"
            className="transition-all duration-300"
          />
          <text
            x={center}
            y={center - 8}
            textAnchor="middle"
            className="text-lg font-bold fill-gray-800"
          >
            {total.toLocaleString()}
          </text>
          <text
            x={center}
            y={center + 16}
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            Total
          </text>
        </svg>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'inactive':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'inactive':
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="space-y-6 pb-8">
        {/* Page Header - Simplified */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with your platform.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {statsCards}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart - Distribution */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Platform Distribution</h3>
                <p className="text-sm text-gray-500">Total Listings vs Hosts vs Tenants</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Pie Chart */}
              <PieChart 
                data={pieChartData} 
                total={totalPieValue}
                hoveredIndex={hoveredPieSlice}
                setHoveredIndex={setHoveredPieSlice}
              />

              {/* Legend */}
              <div className="flex flex-col gap-3">
                {pieChartData.map((item, index) => {
                  const percentage = totalPieValue > 0 ? ((item.value / totalPieValue) * 100).toFixed(1) : '0.0';
                  const isHovered = hoveredPieSlice === index;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                        isHovered ? 'bg-gray-50 shadow-sm' : 'hover:bg-gray-50'
                      }`}
                      onMouseEnter={() => setHoveredPieSlice(index)}
                      onMouseLeave={() => setHoveredPieSlice(null)}
                    >
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.value.toLocaleString()} users</p>
                      </div>
                      <span className="text-sm font-bold" style={{ color: item.color }}>
                        {percentage}%
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Today's Stats</h3>
            <div className="space-y-4">
              {[
                { icon: UserCheck, label: "Total Users", value: String(liveStats.newUsers), color: "green", bg: "bg-green-50" },
                { icon: Building2, label: "Total Listings", value: String(liveStats.newListings), color: "blue", bg: "bg-blue-50" },
                { icon: MessageSquare, label: "Reviews", value: String(dashboardStats[2]?.value || '0'), color: "purple", bg: "bg-purple-50" },
                { icon: Calendar, label: "Bookings", value: String(dashboardStats[1]?.value || '0'), color: "orange", bg: "bg-orange-50" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:shadow-md transition-all cursor-pointer group"
                  style={{ backgroundColor: item.bg }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{item.label}</p>
                    </div>
                  </div>
                  <span className={`text-xl font-bold text-${item.color}-600`}>{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Properties & Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Properties */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Recent Properties</h3>
                <p className="text-sm text-gray-500">Latest listings added</p>
              </div>
              <button className="text-sm text-green-600 hover:text-green-700 font-semibold hover:underline">
                View All →
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                </div>
              ) : dashboardRecentProps.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No properties yet</p>
              ) : dashboardRecentProps.map((property, index) => (
                <motion.div
                  key={property.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                    <img
                      src={property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=80&q=60'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=80&q=60'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{property.title}</p>
                    <p className="text-xs text-gray-500">{property.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-bold text-green-600">{property.price}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        {property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-IN') : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${getStatusColor(property.status || 'active')}`}>
                      {getStatusIcon(property.status || 'active')}
                      {property.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Recent Users</h3>
                <p className="text-sm text-gray-500">Newest platform members</p>
              </div>
              <button className="text-sm text-green-600 hover:text-green-700 font-semibold hover:underline">
                View All →
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : dashboardRecentUsers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No users yet</p>
              ) : dashboardRecentUsers.map((user, index) => (
                <motion.div
                  key={user.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center text-green-700 font-semibold text-sm flex-shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{user.role}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {user.joined ? new Date(user.joined).toLocaleDateString('en-IN') : ''}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
 
      {/* <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c7cd;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0a7ae;
        }
      `}</style> */}
    </div>
  );
};

export default AdminDashboard;