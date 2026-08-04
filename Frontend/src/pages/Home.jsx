import React from "react";
import Hero from "../assets/Home/Hero.png";
import {
  Search,
  MapPin,
  Calendar,
  Home as HomeIcon,
  DollarSign,
  Bed,
  Bath,
  Square,
  Heart,
} from "lucide-react";

const properties = [
  {
    id: 1,
    title: "Modern Family Apartment",
    location: "Mumbai, Maharashtra",
    price: "₹28,000",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    beds: 3,
    baths: 2,
    area: "1450 sqft",
  },
  {
    id: 2,
    title: "Luxury Villa",
    location: "Pune, Maharashtra",
    price: "₹65,000",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    beds: 4,
    baths: 3,
    area: "2400 sqft",
  },
  {
    id: 3,
    title: "Premium Studio",
    location: "Bangalore, Karnataka",
    price: "₹18,000",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800",
    beds: 1,
    baths: 1,
    area: "650 sqft",
  },
];

const Home = () => {
  return (
    <>
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Hero})` }}
      ></div>
      
      {/* Gradient Overlay - Dark to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20"></div>

      {/* Decorative Elements */}
      <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-green-500/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">

        <div className="max-w-4xl">
          {/* Small Heading */}
          <p className="text-green-400 font-medium text-sm sm:text-base tracking-wider uppercase mb-3">
            Find Your Perfect Home
          </p>

          {/* Main Heading - Left Aligned */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-white">
            Spaces that feel like
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mt-2">
              Home
            </span>
          </h1>

          {/* Description - Left Aligned */}
          <p className="mt-4 text-gray-300 text-base sm:text-lg max-w-2xl">
            Discover verified flats and houses for rent. 
            <span className="block sm:inline"> Trusted hosts. Secure stays. Better living.</span>
          </p>

          {/* Search Form - Left Aligned */}
          <div className="mt-10 bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-2xl max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {/* Location */}
              <div className="relative lg:col-span-1">
                <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
                <input
                  type="text"
                  placeholder="Search city or locality"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <label className="absolute -top-2 left-3 px-1 text-xs text-gray-400 bg-black/50 rounded">
                  Where
                </label>
              </div>

              {/* Move In Date */}
              <div className="relative lg:col-span-1">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
                <input
                  type="date"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
                <label className="absolute -top-2 left-3 px-1 text-xs text-gray-400 bg-black/50 rounded">
                  Move In
                </label>
              </div>

              {/* Move Out Date */}
              <div className="relative lg:col-span-1">
                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
                <input
                  type="date"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                />
                <label className="absolute -top-2 left-3 px-1 text-xs text-gray-400 bg-black/50 rounded">
                  Move Out
                </label>
              </div>

              {/* Property Type */}
              <div className="relative lg:col-span-1">
                <HomeIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
                <select className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer">
                  <option value="" className="text-gray-900">All Type</option>
                  <option value="apartment" className="text-gray-900">Apartment</option>
                  <option value="villa" className="text-gray-900">Villa</option>
                  <option value="house" className="text-gray-900">House</option>
                  <option value="room" className="text-gray-900">Room</option>
                  <option value="studio" className="text-gray-900">Studio</option>
                </select>
                <label className="absolute -top-2 left-3 px-1 text-xs text-gray-400 bg-black/50 rounded">
                  Property Type
                </label>
              </div>

              {/* Budget */}
              <div className="relative lg:col-span-1">
                <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" />
                <select className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer">
                  <option value="" className="text-gray-900">Any Budget</option>
                  <option value="10k-25k" className="text-gray-900">₹10K - ₹25K</option>
                  <option value="25k-50k" className="text-gray-900">₹25K - ₹50K</option>
                  <option value="50k-1l" className="text-gray-900">₹50K - ₹1L</option>
                  <option value="1l-2l" className="text-gray-900">₹1L - ₹2L</option>
                  <option value="2l+" className="text-gray-900">₹2L+</option>
                </select>
                <label className="absolute -top-2 left-3 px-1 text-xs text-gray-400 bg-black/50 rounded">
                  Budget
                </label>
              </div>

              {/* Search Button */}
              <button className="lg:col-span-1 w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 rounded-xl text-white font-semibold py-3.5 flex justify-center items-center gap-2 shadow-lg shadow-green-500/30 hover:shadow-green-500/40 hover:-translate-y-0.5">
                <Search size={20} />
                Search
              </button>
            </div>
          </div>

          {/* Quick Stats - Left Aligned */}
          <div className="mt-8 flex flex-wrap gap-6 sm:gap-10">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">12K+</span>
              <span className="text-gray-400 text-sm">Properties</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">8K+</span>
              <span className="text-gray-400 text-sm">Happy Clients</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">150+</span>
              <span className="text-gray-400 text-sm">Cities</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">4.9★</span>
              <span className="text-gray-400 text-sm">Rating</span>
            </div>
          </div>
        </div> 
      </div>
    </section>

    {/* Popular Cities  */}
    <section className="relative bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14"> 
          <h2 className="text-4xl font-bold text-gray-900 mt-2">
            Explore Homes in Top Locations
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Find your dream home in the most sought-after cities across India.
          </p>
        </div>
        </div>
        </section>
    
{/* Property  Section */}
    
    <section className="relative -mt-20 z-20 bg-white rounded-t-[50px] md:rounded-t-[70px] shadow-2xl py-16">
  <div className="max-w-7xl mx-auto px-4">

    <div className="text-center mb-14">
      <p className="text-green-600 font-semibold uppercase tracking-wider">
        Featured Properties
      </p>

      <h2 className="text-4xl font-bold text-gray-900 mt-2">
        Discover Your Next Home
      </h2>

      <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
        Browse our handpicked premium homes with verified listings and
        trusted owners.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
      {properties.map((property) => (
        <div
          key={property.id}
          className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group"
        >
          <div className="relative overflow-hidden">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
            />

            <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md">
              <Heart size={18} />
            </button>

            <div className="absolute bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full font-semibold">
              {property.price}/month
            </div>
          </div>

          <div className="p-6">

            <h3 className="text-2xl font-bold text-gray-900">
              {property.title}
            </h3>

            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <MapPin size={16} />
              {property.location}
            </div>

            <div className="flex justify-between mt-6 border-t pt-5 text-gray-600">

              <div className="flex items-center gap-2">
                <Bed size={18} />
                {property.beds}
              </div>

              <div className="flex items-center gap-2">
                <Bath size={18} />
                {property.baths}
              </div>

              <div className="flex items-center gap-2">
                <Square size={18} />
                {property.area}
              </div>

            </div>

            <button className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition">
              View Details
            </button>

          </div>
        </div>
      ))}
    </div>
  </div>
</section>
</>
  );  
};

export default Home;