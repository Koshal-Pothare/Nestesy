import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  DollarSign,
  Users,
  Star,
  Award,
  BarChart2,
  PieChart,
  Activity,
  Zap,
  Clock,
  MapPin,
  Building2,
  Home,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HostAnalytics = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  });

  // Load properties from localStorage
  useEffect(() => {
    const loadProperties = () => {
      try {
        const storedProperties = localStorage.getItem('hostProperties');
        if (storedProperties) {
          const parsedProperties = JSON.parse(storedProperties);
          setProperties(parsedProperties);
        } else {
          // Default properties with analytics data
          const defaultProperties = [
            {
              id: 1,
              title: "Luxury Villa with Garden",
              location: "Pune, Maharashtra",
              price: 65000,
              type: "Villa",
              bedrooms: 4,
              bathrooms: 4,
              area: 2200,
              status: "Active",
              image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400",
              listedDate: "2026-01-20",
              views: 1245,
              inquiries: 12,
              inquiriesData: [2, 1, 0, 3, 2, 1, 0, 2, 1],
              viewsData: [45, 67, 89, 56, 78, 90, 67, 89, 78],
              rating: 4.8,
              reviews: 23,
              amenities: ["Parking", "Pool", "Garden", "Security", "Power Backup"],
              description: "Beautiful luxury villa with modern amenities and spacious garden.",
              bookings: 8,
              revenue: 520000,
              conversionRate: 12.5
            },
            {
              id: 2,
              title: "Modern 3BHK Apartment",
              location: "Mumbai, Maharashtra",
              price: 45000,
              type: "Apartment",
              bedrooms: 3,
              bathrooms: 2,
              area: 1200,
              status: "Active",
              image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
              listedDate: "2026-01-15",
              views: 890,
              inquiries: 8,
              inquiriesData: [1, 0, 2, 1, 0, 2, 1, 0, 1],
              viewsData: [34, 56, 45, 67, 78, 56, 89, 67, 45],
              rating: 4.5,
              reviews: 15,
              amenities: ["Parking", "Gym", "Security", "Lift"],
              description: "Modern apartment in prime location with all amenities.",
              bookings: 5,
              revenue: 225000,
              conversionRate: 8.9
            },
            {
              id: 3,
              title: "Cozy 2BHK Flat",
              location: "Bangalore, Karnataka",
              price: 28000,
              type: "Flat",
              bedrooms: 2,
              bathrooms: 2,
              area: 850,
              status: "Pending",
              image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400",
              listedDate: "2026-01-18",
              views: 345,
              inquiries: 3,
              inquiriesData: [0, 0, 1, 0, 0, 1, 0, 1, 0],
              viewsData: [23, 34, 45, 23, 34, 56, 34, 23, 45],
              rating: 0,
              reviews: 0,
              amenities: ["Parking", "Security", "Lift"],
              description: "Cozy flat perfect for small families.",
              bookings: 0,
              revenue: 0,
              conversionRate: 0
            },
            {
              id: 4,
              title: "Premium Penthouse",
              location: "Delhi, Delhi",
              price: 85000,
              type: "Penthouse",
              bedrooms: 5,
              bathrooms: 4,
              area: 3200,
              status: "Inactive",
              image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400",
              listedDate: "2026-01-10",
              views: 1567,
              inquiries: 18,
              inquiriesData: [3, 2, 1, 2, 3, 2, 1, 2, 2],
              viewsData: [78, 89, 67, 90, 78, 89, 67, 90, 78],
              rating: 4.9,
              reviews: 31,
              amenities: ["Parking", "Pool", "Gym", "Garden", "Security", "Terrace"],
              description: "Luxurious penthouse with panoramic city views.",
              bookings: 12,
              revenue: 1020000,
              conversionRate: 15.2
            },
            {
              id: 5,
              title: "Beachside Studio",
              location: "Goa, India",
              price: 35000,
              type: "Studio",
              bedrooms: 1,
              bathrooms: 1,
              area: 450,
              status: "Active",
              image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400",
              listedDate: "2026-01-25",
              views: 678,
              inquiries: 9,
              inquiriesData: [1, 1, 0, 2, 1, 0, 2, 1, 1],
              viewsData: [45, 56, 34, 67, 45, 56, 78, 56, 45],
              rating: 4.2,
              reviews: 11,
              amenities: ["WiFi", "AC", "Beach Access", "Parking"],
              description: "Beautiful studio apartment just steps away from the beach.",
              bookings: 4,
              revenue: 140000,
              conversionRate: 6.7
            },
            {
              id: 6,
              title: "Luxury Farmhouse",
              location: "Jaipur, Rajasthan",
              price: 75000,
              type: "Villa",
              bedrooms: 6,
              bathrooms: 5,
              area: 4500,
              status: "Pending",
              image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400",
              listedDate: "2026-01-28",
              views: 456,
              inquiries: 5,
              inquiriesData: [0, 1, 0, 1, 0, 1, 0, 1, 1],
              viewsData: [34, 45, 23, 56, 34, 45, 67, 45, 34],
              rating: 0,
              reviews: 0,
              amenities: ["Pool", "Garden", "Parking", "Security", "Playground"],
              description: "Spacious farmhouse with lush green surroundings.",
              bookings: 0,
              revenue: 0,
              conversionRate: 0
            }
          ];
          setProperties(defaultProperties);
          localStorage.setItem('hostProperties', JSON.stringify(defaultProperties));
        }
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Get unique property types for filter
  const propertyTypes = ['all', ...new Set(properties.map(p => p.type))];

  // Filter properties based on selection
  const getFilteredProperties = () => {
    if (selectedProperty === 'all') {
      return properties;
    }
    return properties.filter(p => p.id === parseInt(selectedProperty));
  };

  const filteredProperties = getFilteredProperties();

  // Calculate overall analytics
  const calculateAnalytics = () => {
    const totalProperties = filteredProperties.length;
    const activeProperties = filteredProperties.filter(p => p.status === 'Active').length;
    const totalInquiries = filteredProperties.reduce((sum, p) => sum + (p.inquiries || 0), 0);
    const totalRevenue = filteredProperties.reduce((sum, p) => sum + (p.revenue || 0), 0);
    const totalBookings = filteredProperties.reduce((sum, p) => sum + (p.bookings || 0), 0);
    const avgRating = filteredProperties.filter(p => p.rating > 0).reduce((sum, p) => sum + p.rating, 0) / 
                      filteredProperties.filter(p => p.rating > 0).length || 0;
    const totalReviews = filteredProperties.reduce((sum, p) => sum + (p.reviews || 0), 0);
    const avgConversion = filteredProperties.filter(p => p.conversionRate > 0).reduce((sum, p) => sum + p.conversionRate, 0) / 
                          filteredProperties.filter(p => p.conversionRate > 0).length || 0;
    
    // Calculate growth metrics (mock data)
    const inquiryGrowth = 15.2;
    const revenueGrowth = 18.7;

    return {
      totalProperties,
      activeProperties,
      totalInquiries,
      totalRevenue,
      totalBookings,
      avgRating,
      totalReviews,
      avgConversion,
      inquiryGrowth,
      revenueGrowth
    };
  };

  const analytics = calculateAnalytics();

  // Get property performance data for charts
  const getPropertyPerformance = () => {
    return filteredProperties
      .filter(p => p.status === 'Active' || p.status === 'Inactive')
      .map(p => ({
        name: p.title.substring(0, 20) + (p.title.length > 20 ? '...' : ''),
        views: p.views || 0,
        inquiries: p.inquiries || 0,
        revenue: p.revenue || 0,
        bookings: p.bookings || 0,
        rating: p.rating || 0
      }));
  };

  const performanceData = getPropertyPerformance();

  // Get monthly data for 6 months based on selected month
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const selectedYear = parseInt(selectedMonth.split('-')[0]);
    const selectedMonthNum = parseInt(selectedMonth.split('-')[1]);
    
    let labels = [];
    let inquiryData = [];
    let revenueData = [];
    let bookingData = [];
    
    for (let i = 5; i >= 0; i--) {
      let monthIndex = selectedMonthNum - 1 - i;
      let year = selectedYear;
      if (monthIndex < 0) {
        monthIndex += 12;
        year -= 1;
      }
      labels.push(months[monthIndex]);
      
      // Generate random data for each month (in real app, this would come from API)
      const baseValue = Math.floor(Math.random() * 20) + 5;
      inquiryData.push(baseValue);
      revenueData.push(baseValue * 15000 + Math.floor(Math.random() * 50000));
      bookingData.push(Math.floor(baseValue / 3) + 1);
    }

    return {
      labels,
      inquiries: inquiryData,
      revenue: revenueData,
      bookings: bookingData
    };
  };

  const monthlyData = getMonthlyData();

  // Get top performing properties
  const getTopProperties = (metric) => {
    return [...filteredProperties]
      .filter(p => p[metric] > 0)
      .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
      .slice(0, 5);
  };

  const topInquired = getTopProperties('inquiries');
  const topRevenue = getTopProperties('revenue');

  // Bar chart component
  const BarChart = ({ data, labels, title, color = '#10B981' }) => {
    const maxValue = Math.max(...data, 1);
    
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-4">{title}</h4>
        <div className="flex items-end justify-between h-48 gap-2">
          {data.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full rounded-lg transition-all duration-500 hover:opacity-80"
                style={{
                  height: `${(value / maxValue) * 100}%`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
              >
                <div className="text-center text-xs text-gray-500 mt-1">
                  {value}
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-2 transform -rotate-45">
                {labels[index]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Donut chart component (simplified)
  const DonutChart = ({ data, labels, colors, title }) => {
    const total = data.reduce((sum, val) => sum + val, 0);
    
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-4">{title}</h4>
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {data.map((value, index) => {
                const percentage = (value / total) * 100;
                const startAngle = data.slice(0, index).reduce((sum, val) => sum + (val / total) * 360, 0);
                const endAngle = startAngle + (percentage * 3.6);
                
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                
                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);
                
                const largeArc = percentage > 50 ? 1 : 0;
                
                return (
                  <path
                    key={index}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={colors[index % colors.length]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                );
              })}
              <circle cx="50" cy="50" r="25" fill="white" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-800">{total}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {labels.map((label, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[index % colors.length] }}></div>
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Get property status distribution
  const getStatusDistribution = () => {
    const active = filteredProperties.filter(p => p.status === 'Active').length;
    const pending = filteredProperties.filter(p => p.status === 'Pending').length;
    const inactive = filteredProperties.filter(p => p.status === 'Inactive').length;
    return {
      labels: ['Active', 'Pending', 'Inactive'],
      data: [active, pending, inactive],
      colors: ['#10B981', '#F59E0B', '#9CA3AF']
    };
  };

  const statusDistribution = getStatusDistribution();

  // Generate month options (last 24 months)
  const getMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    for (let i = 0; i < 24; i++) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const label = `${date.toLocaleString('default', { month: 'short' })} ${year}`;
      options.push({ value: `${year}-${month}`, label });
    }
    return options;
  };

  const monthOptions = getMonthOptions();

  // Navigate months
  const navigateMonth = (direction) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    let newMonth = month + direction;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  };

  // Get current month label
  const getCurrentMonthLabel = () => {
    const [year, month] = selectedMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return `${date.toLocaleString('default', { month: 'long' })} ${year}`;
  };

  // Get the labels for the 6 months being shown
  const getMonthRangeLabel = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const selectedYear = parseInt(selectedMonth.split('-')[0]);
    const selectedMonthNum = parseInt(selectedMonth.split('-')[1]);
    
    const startMonthIndex = selectedMonthNum - 6;
    let startMonth = startMonthIndex;
    let startYear = selectedYear;
    if (startMonthIndex < 0) {
      startMonth = startMonthIndex + 12;
      startYear = selectedYear - 1;
    }
    
    const endMonth = selectedMonthNum;
    const endYear = selectedYear;
    
    return `${months[startMonth]} ${startYear} - ${months[endMonth - 1]} ${endYear}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your property performance and insights</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          >
            <option value="all">All Properties</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <MessageCircle className="w-5 h-5 text-pink-500" />
            <span className="text-xs text-green-600 font-medium">↑ {analytics.inquiryGrowth}%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalInquiries}</p>
          <p className="text-xs text-gray-500">Total Inquiries</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-xs text-green-600 font-medium">↑ {analytics.revenueGrowth}%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{(analytics.totalRevenue / 100000).toFixed(1)}L</p>
          <p className="text-xs text-gray-500">Total Revenue</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <Home className="w-5 h-5 text-purple-500" />
            <span className="text-xs text-green-600 font-medium">↑ 8%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</p>
          <p className="text-xs text-gray-500">Total Bookings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-xs text-gray-500">{analytics.totalReviews} reviews</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.avgRating.toFixed(1)} ★</p>
          <p className="text-xs text-gray-500">Average Rating</p>
        </motion.div>
      </div>

      {/* Month Navigator */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">6-Month Performance</h3>
          <p className="text-sm text-gray-500">Showing data for: <span className="font-medium text-gray-700">{getMonthRangeLabel()}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none min-w-[140px]"
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Charts Row - 6 Months */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <BarChart
          data={monthlyData.inquiries}
          labels={monthlyData.labels}
          title="Monthly Inquiries"
          color="#EC4899"
        />
        <BarChart
          data={monthlyData.revenue.map(val => val / 1000)}
          labels={monthlyData.labels}
          title="Monthly Revenue (₹ in thousands)"
          color="#10B981"
        />
        <BarChart
          data={monthlyData.bookings}
          labels={monthlyData.labels}
          title="Monthly Bookings"
          color="#8B5CF6"
        />
      </div>

      {/* Property Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Inquired */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-pink-500" />
            Most Inquired Properties
          </h4>
          <div className="space-y-3">
            {topInquired.map((property, index) => (
              <div key={property.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{property.title}</p>
                    <p className="text-xs text-gray-500">{property.location}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700">{property.inquiries}</span>
              </div>
            ))}
            {topInquired.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Top Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Top Revenue Properties
          </h4>
          <div className="space-y-3">
            {topRevenue.map((property, index) => (
              <div key={property.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{property.title}</p>
                    <p className="text-xs text-gray-500">{property.location}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700">₹{(property.revenue / 1000).toFixed(0)}K</span>
              </div>
            ))}
            {topRevenue.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Status Distribution & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <DonutChart
            data={statusDistribution.data}
            labels={statusDistribution.labels}
            colors={statusDistribution.colors}
            title="Property Status Distribution"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Properties</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeProperties}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">Out of {analytics.totalProperties} total properties</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalReviews}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400">Across all properties</p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 mt-8">
          <BarChart2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600">No data available</h3>
          <p className="text-gray-400 mt-2">Start listing properties to see analytics</p>
        </div>
      )}
    </div>
  );
};

export default HostAnalytics;