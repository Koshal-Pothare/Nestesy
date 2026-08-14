import React, { useState, useEffect } from 'react'
import DesktopHero from '../assets/Explore/DesktopHero2.png'
import { AnimatePresence, motion } from 'framer-motion'
import ExploreSkeleton from '../components/ExploreSkeleton'
import {
    ShieldCheck, User, Headset, IndianRupee, MapPin, Building2, Wallet2, Wallet, Search, ChevronUp,
    BedDouble, Bath, Ruler, Heart, ListFilterPlus, Home
} from 'lucide-react'
import { budgets, Properties, propertyTypes } from '../Data/Data'
import ExploreSidebar from '../components/ExploreSidebar'
import CTA from '../assets/Explore/CTA.png'
import PropertyCard from '../Ui/PropertyCard'
import { useNavigate } from "react-router-dom"
import Pagination from '../components/Pagination'
import SortBy from '../Ui/SortBy'

const Explore = () => {

    const [filter, setFilter] = useState({
        location: "",
        propertyType: "Any",
        budget: "Any",
        priceRange: 15000,
        bedroom: "",
        furnishing: "",
        amenities: [],
        availability: "",
        idealFor: "",
    })


    const [rotate, setRotate] = useState(0);
    const [sortBy, setSortBy] = useState("newest")
    const [filteredProperties, setFilteredProperties] = useState(Properties);
    const [propertyLoading, StylePropertyLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const scrollToProperty = () => {
        document.getElementById("properties")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const handleChange = (e) => {
        setFilter((prev) => ({
            ...prev, [e.target.name]: e.target.value
        }))
    }

    const handleSearch = () => {
        let result = [...Properties];

        if (filter.location.trim()) {
            result = result.filter((property) =>
                property.location
                    .toLowerCase()
                    .includes(filter.location.toLowerCase())
            );
        }

        if (filter.propertyType !== "Any") {
            result = result.filter(
                (property) => property.propertyType === filter.propertyType
            );
        }

        if (filter.budget !== "Any") {
            const [min, max] = filter.budget.split("-").map(Number);

            result = result.filter(
                (property) => property.price >= min && property.price <= max
            );
        }

        if (filter.idealFor) {
            result = result.filter((property) =>
                property.idealFor.includes(filter.idealFor)
            );
        }

        setFilteredProperties(result);
        setCurrentPage(1);

        scrollToProperty();
        console.log("Search clicked")
    };

    const handleAmenity = (amenity) => {
        setFilter((prev) => {

            const exists = prev.amenities.includes(amenity);

            return {
                ...prev,
                amenities: exists
                    ? prev.amenities.filter((a) => a !== amenity)
                    : [...prev.amenities, amenity]
            }

        });
    };

    // sorting logic


    const sortedProperties = [...filteredProperties].sort((a, b) => {
        switch (sortBy) {
            case "priceLow":
                return a.price - b.price;

            case "priceHigh":
                return b.price - a.price;

            case "newest":
                return b.id - a.id;

            default:
                return 0;
        }
    });

    // reseting filter 
    const resetFilters = () => {
        setFilter({
            location: "",
            propertyType: "Any",
            budget: "Any",
            priceRange: 15000,
            bedroom: "",
            furnishing: "",
            amenities: [],
            availability: "",
        });

        setSortBy("newest");
        setRotate((prev) => prev + 360);
        setFilteredProperties(Properties);
        setCurrentPage(1);
    };

    // pagination
    const propertiesPerPage = 9;

    const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);

    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

    const currentProperties = sortedProperties.slice(
        indexOfFirstProperty,
        indexOfLastProperty
    );


    const navigate = useNavigate();

    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.18,
            },
        },
    };

    const item = {
        hidden: {
            opacity: 0,
            y: 30,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut",
            },
        },
    };

    const CardContainer = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const card = {
        hidden: { opacity: 0, y: 70, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const stats = [
        { icon: ShieldCheck, label: "Verified Property" },
        { icon: User, label: "Trusted Host" },
        { icon: IndianRupee, label: "Pocket Friendly" },
        { icon: Headset, label: "24/7 Support" },
    ];




    return (
        <section>

            {/*hero section */}
            <div className="relative">
                <div
                    className="relative h-[600px] w-full bg-cover bg-center bg-no-repeat flex items-center text-center md:text-left p-10"
                    style={{
                        backgroundImage: `url(${DesktopHero})`,
                    }}
                >
                    <div className="absolute inset-0 bg-linear-to-r from-primary-900 via-primary-900/50 to-black/20"></div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="relative z-10 max-w-2xl px-6 md:px-10 py-16 lg:py-18 "
                    >


                        {/* Heading */}
                        <motion.h1
                            variants={item}
                            className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mt-5"
                        >
                            Find a place
                        </motion.h1>

                        <motion.h1
                            variants={item}
                            className="text-4xl md:text-6xl font-serif font-bold  mt-4"
                        >
                            <span className="text-white">you'll</span>
                            <span className="text-white"> love</span>
                            <span className=" text-green-400"> to live.</span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            variants={item}
                            className="max-w-xl mt-12 text-gray-200 leading-6 text-base md:text-xl font-semibold"
                        >
                            Explore thousands of verifired flats and houses.<br />
                            Trusted Host. Secure Stay. Better Living
                        </motion.p>

                        {/* Stats */}
                        <motion.div variants={item} className="mt-10 max-w-2xl hidden md:flex ">
                            <div className="flex rounded-xl  ">
                                {stats.map(({ icon: Icon, value, label }, i) => (
                                    <div
                                        key={label}
                                        className={`flex-1 flex items-center    py-3  `}
                                    >
                                        <div className=" p-3 rounded-full   flex items-center justify-center">
                                            <Icon className="text-white" size={30} />
                                        </div>

                                        <div>

                                            <p className="text-sm font-semibold text-gray-200 mt-1 leading-5">
                                                {label}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>




                    </motion.div>


                </div>
                {/* search bar */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .4 }}
                    className="absolute hidden md:flex left-1/2 -bottom-10 -translate-x-1/2 z-30 w-[95%] max-w-6xl border border-primary-500 rounded-3xl"
                >
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-6 w-full">

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                            <div className="md:col-span-2 flex items-center gap-2">
                                <MapPin size={30} className="text-primary-600" />
                                <div>
                                    <label className="text-sm font-semibold text-gray-500">
                                        Location
                                    </label>

                                    <input
                                        placeholder="Search city or locality"
                                        className=" w-full outline-none text-lg"
                                        type="text"
                                        name='location'
                                        value={filter.location}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Building2 size={30} className="text-primary-600" />
                                <div>
                                    <label className="text-sm font-semibold text-gray-500">
                                        Property
                                    </label>

                                    <select className=" w-full outline-none bg-transparent"
                                        name="propertyType"
                                        value={filter.propertyType}
                                        onChange={handleChange}
                                    >
                                        <option value="Any">Any</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Flat">Flat</option>
                                        <option value="PG">PG</option>
                                         <option value="Single Room">Single Room</option>
                                        <option value="Independent House">Independent House</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Wallet2 size={30} className="text-primary-600" />
                                <div>
                                    <label className="text-sm font-semibold text-gray-500">
                                        Budget
                                    </label>

                                    <select
                                        name="budget"
                                        value={filter.budget}
                                        onChange={handleChange}
                                        className=" w-full outline-none bg-transparent">
                                        <option value="Any">Any</option>
                                        <option value="0-10000">Below ₹10k</option>
                                        <option value="10000-20000">₹10k - ₹20k</option>
                                        <option value="20000-50000">₹20k - ₹50k</option>
                                        <option value="50000-1000000">Above ₹50k</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleSearch}
                                className="rounded-2xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition">
                                Search
                            </button>

                        </div>

                    </div>
                </motion.div>
            </div>

            <div className="py-20 w-full  p-10">

                {propertyLoading ? (<ExploreSkeleton />) : (<>
                    <div className=" p-5">
                        <h2 className="font-semibold text-4xl">Explore Homes</h2>
                        <p className="mt-2 font-semibold text-gray-700">Find your perfect place from thousands of verified properties</p>


                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start" id="properties">

                        {/* Sidebar */}

                        <ExploreSidebar filter={filter} setFilter={setFilter} handleChange={handleChange}
                            reset={resetFilters} search={handleSearch} handleAmenity={handleAmenity}
                            rotate={rotate} setRotate={setRotate}
                        />


                        {/* Property Grid */}

                        <div className="lg:col-span-3">

                            <div className="w-full flex justify-end mb-5">
                                <SortBy sortBy={sortBy} setSortBy={setSortBy} />
                            </div>

                            <motion.div

                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {currentProperties.map((property, index) => (
                                    <PropertyCard property={property} index={index} key={property.id} />
                                ))}

                            </motion.div>

                            {/* Pagination */}

                            <div className="flex justify-end items-center gap-3 mt-12">
                                <Pagination
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalItems={Properties.length}
                                    itemsPerPage={propertiesPerPage}
                                    scrollTo={700}
                                />
                            </div>

                        </div>

                    </div>
                </>

                )}



            </div>

            {/* CTA */}

            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="w-full px-6 py-20"
            >
                <div
                    style={{
                        backgroundImage: `url(${CTA})`,
                    }}
                    className="relative overflow-hidden bg-cover bg-center max-w-7xl mx-auto h-[400px] rounded-[32px]  px-8 py-10 md:px-12 md:py-12">
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-start gap-10">

                        {/* Left Content */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left py-10">

                            <motion.div
                                whileHover={{
                                    rotate: 8,
                                    scale: 1.08,
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 shadow-lg"
                            >
                                <Home size={42} className="text-white" />
                            </motion.div>

                            <div>
                                <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white">
                                    You've Saved the Best. Now Choose One.
                                </h2>

                                <p className="mt-3 text-primary-100 text-base md:text-lg max-w-xl leading-7">
                                    Explore your wishlist and schedule a visit for the properties that caught your eye.
                                </p>
                                {/* CTA Button */}
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        y: -2,
                                    }}
                                    whileTap={{
                                        scale: 0.96,
                                    }}
                                    onClick={() => navigate("/wishlist")}
                                    className="bg-transparent backdrop-blur-xl mt-10 text-white border border-white/20 px-10 py-4 rounded-2xl font-semibold text-lg shadow-xl transition-colors hover:bg-primary-50 hover:text-primary-700"
                                >
                                    Explore Whishlist
                                </motion.button>


                            </div>

 
                        </div>

                     
  


                    </div>

                </div>
            </motion.div>

        </section>
    )
}

export default Explore