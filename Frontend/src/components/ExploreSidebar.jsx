import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {  Search, ChevronUp, ListFilterPlus} from 'lucide-react'


const ExploreSidebar = () => {

 const [openFilters, setOpenFilters] = useState({
        location: true,
        propertyType: true,
        priceRange: true,
        bedroom: true,
        furnishing: true,
        amenities: true,
        availability: true,
    });

    const [priceRange, setPriceRange] = useState(15000);

    
        const toggleFilter = (filter) => {
            setOpenFilters((prev) => ({
                ...prev,
                [filter]: !prev[filter],
            }));
        };
    
    
        const filters = [
            {
                id: "location",
                title: "Location",
                content: (
                    <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3">
                        <Search size={18} className="text-primary-600" />
                        <input
                            type="text"
                            placeholder="Search Location"
                            className="w-full outline-none"
                        />
                    </div>
                ),
            },
    
            {
                id: "propertyType",
                title: "Property Type",
                content: (
                    <div className="space-y-3">
                        {["Apartment", "Villa", "Independent House", "PG"].map((item) => (
                            <label key={item} className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="accent-primary-600 cursor-pointer" />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                ),
            },
    
           {
  id: "priceRange",
  title: "Price Range",
  content: (
    <div>
      <input
        type="range"
        min="5000"
        max="50000"
        step="1000"
        value={priceRange}
        onChange={(e) => setPriceRange(Number(e.target.value))}
        className="w-full accent-primary-600 cursor-pointer"
      />

      <div className="flex justify-between text-sm mt-2">
        <span className="font-semibold text-primary-600">₹5,000</span>
        <span className="font-semibold text-primary-600">
          ₹{priceRange.toLocaleString()}
        </span>
      </div>
    </div>
  ),
},
    
            {
                id: "bedroom",
                title: "Bedroom",
                content: (
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, "4+"].map((item) => (
                            <button
                                key={item}
                                className="px-4 py-2 rounded-xl border hover:bg-primary-600 hover:text-white transition"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                ),
            },
    
            {
                id: "furnishing",
                title: "Furnishing",
                content: (
                    <div className="space-y-3">
                        {["Fully Furnished", "Semi Furnished", "Unfurnished"].map((item) => (
                            <label key={item} className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="accent-primary-600 cursor-pointer" />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                ),
            },
    
            {
                id: "amenities",
                title: "Amenities",
                content: (
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            "Parking",
                            "Gym",
                            "Lift",
                            "WiFi",
                            "AC",
                            "Security",
                            "Pool",
                            "Power Backup",
                        ].map((item) => (
                            <label key={item} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-primary-600 cursor-pointer" />
                                <span className="text-sm">{item}</span>
                            </label>
                        ))}
                    </div>
                ),
            },
    
            {
                id: "availability",
                title: "Availability",
                content: (
                    <div className="space-y-3">
                        {["Immediate", "Within 15 Days", "Next Month"].map((item) => (
                            <label key={item} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="availability"
                                    className="accent-primary-600 cursor-pointer"
                                />
                                <span>{item}</span>
                            </label>
                        ))}
                    </div>
                ),
            },
        ];

  return (
    <>
     <div className="hidden col-span-1 lg:block rounded-3xl border border-primary-300 bg-white shadow-2xl ">
    
                                <div className="w-full flex items-center justify-between px-6 py-3 bg-primary-600  text-white rounded-t-2xl">
                                    <h3 className='text-[23px]  font-semibold'>Filters</h3>
                                    <button className='text-sm font-bold  mt-3 transition-all duration-150 hover:scale-105'>Reset </button>
                                </div>
    
                                <div className="w-full h-px mb-3 bg-gray-300" />
    
                                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
    
                                    {filters.map((filter) => (
                                        <div key={filter.id}>
    
                                            <button
                                                onClick={() => toggleFilter(filter.id)}
                                                className="w-full px-6 py-5 flex items-center justify-between hover:bg-primary-50 transition"
                                            >
                                                <h3 className="text-lg font-semibold">
                                                    {filter.title}
                                                </h3>
    
                                                <ChevronUp
                                                    className={`transition-transform duration-300 ${openFilters[filter.id] ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>
    
                                            <AnimatePresence initial={true}>
                                                {openFilters[filter.id] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-6 pb-5">
                                                            {filter.content}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
    
                                            <div className="mx-6 h-px bg-gray-200" />
    
                                        </div>
                                    ))}
    
                                </div>
                                <div className="w-full px-4 py-5">
                                    <button className='bg-primary-600 text-md font-semibold py-3 w-full text-white rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-primary-500 hover:scale-105'> <ListFilterPlus />Apply Filters</button>
                                </div>
                            </div>
    
    
    </>
  )
}

export default ExploreSidebar