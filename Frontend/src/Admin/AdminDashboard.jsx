import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  Users,
  Home,
  DollarSign,
  TrendingUp,
  TrendingDown,
  UserCheck,
  Calendar,
  Star,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter,
  Plus,
  FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';
 
const statsData = [
  {
    id: 1,
    title: "Total Properties",
    value: "12,847",
    change: "+12.5%",
    icon: Building2,
    color: "text-green-600",
    bgColor: "bg-green-100",
    trend: "up"
  },
  {
    id: 2,
    title: "Total Users",
    value: "8,234",
    change: "+8.2%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    trend: "up"
  },
  {
    id: 3,
    title: "Active Listings",
    value: "4,521",
    change: "+3.1%",
    icon: Home,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    trend: "up"
  },
  {
    id: 4,
    title: "Revenue",
    value: "₹85.4L",
    change: "-2.3%",
    icon: DollarSign,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    trend: "down"
  }
];
 
const chartData = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 45 },
  { day: "Wed", value: 78 },
  { day: "Thu", value: 55 },
  { day: "Fri", value: 90 },
  { day: "Sat", value: 70 },
  { day: "Sun", value: 85 }
];

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
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  // Calculate max value for chart  
  const maxValue = useMemo(() => {
    const max = Math.max(...chartData.map(item => item.value));
    return max * 1.1;
  }, []);

  // Stats cards
  const statsCards = useMemo(() => 
    statsData.map((stat, index) => (
      <motion.div
        key={stat.id}
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
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</h3>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
                <span className="text-gray-400 text-xs">vs last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      </motion.div>
    )), []
  );

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Activity Overview</h3>
                <p className="text-sm text-gray-500">Weekly property listings and inquiries</p>
              </div>
              <div className="flex items-center gap-2">
                <select 
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Dynamic Chart Bars */}
            <div className="h-64 flex items-end justify-between gap-2">
              {chartData.map((item, index) => {
                const heightPercentage = Math.max((item.value / maxValue) * 100, 10);
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full">
                    <div className="relative w-full h-full flex items-end">
                      <motion.div 
                        className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-lg transition-all duration-300 origin-bottom cursor-pointer relative"
                        style={{ minHeight: '20px' }}
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
                        onMouseEnter={() => setHoveredBar(index)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded transition-all duration-200 whitespace-nowrap ${
                          hoveredBar === index ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                        }`}>
                          {item.value} listings
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{item.day}</span>
                  </div>
                );
              })}
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-t from-green-500 to-green-300"></div>
                <span className="text-xs text-gray-500">Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-xs text-gray-500">Inquiries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <span className="text-xs text-gray-500">Bookings</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Today's Stats</h3>
            <div className="space-y-4">
              {[
                { icon: UserCheck, label: "New Users", value: "24", color: "green", bg: "bg-green-50" },
                { icon: Building2, label: "New Listings", value: "12", color: "blue", bg: "bg-blue-50" },
                { icon: MessageSquare, label: "Inquiries", value: "8", color: "purple", bg: "bg-purple-50" },
                { icon: Calendar, label: "Bookings", value: "5", color: "orange", bg: "bg-orange-50" }
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
              {recentProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                    <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{property.title}</p>
                    <p className="text-xs text-gray-500">{property.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-bold text-green-600">{property.price}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{property.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${getStatusColor(property.status)}`}>
                      {getStatusIcon(property.status)}
                      {property.status}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                        <Eye className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                        <Edit className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
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
              {recentUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center text-green-700 font-semibold text-sm flex-shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{user.role}</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{user.joined}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                      <Edit className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
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