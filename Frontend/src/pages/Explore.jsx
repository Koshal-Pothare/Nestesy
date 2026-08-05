import React, { useState, useEffect } from 'react'
import DesktopHero from '../assets/Explore/DesktopHero.png'
import { AnimatePresence, motion } from 'framer-motion'
import ExploreSkeleton from '../components/ExploreSkeleton'
import {
    ShieldCheck, User, Headset, IndianRupee, MapPin, Building2, Wallet2, Wallet, Search, ChevronUp,
    BedDouble, Bath, Ruler, Heart, ListFilterPlus
} from 'lucide-react'
import { Properties } from '../Data/Data'

const Explore = () => {

    const [propertyLoading, StylePropertyLoading] = useState(false);
    const [openFilters, setOpenFilters] = useState({
        location: true,
        propertyType: true,
        priceRange: true,
        bedroom: true,
        furnishing: true,
        amenities: true,
        availability: true,
    });
    const [currentPage, setCurrentPage] = useState(1);

    const propertiesPerPage = 9;

    const totalPages = Math.ceil(Properties.length / propertiesPerPage);

    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

    const currentProperties = Properties.slice(
        indexOfFirstProperty,
        indexOfLastProperty
    );

  useEffect(() => {
  window.scrollTo({
    top: 700, 
    behavior: "smooth",
  });
}, [currentPage]);

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
            id: "property",
            title: "Property Type",
            content: (
                <div className="space-y-3">
                    {["Apartment", "Villa", "Independent House", "PG"].map((item) => (
                        <label key={item} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="accent-primary-600" />
                            <span>{item}</span>
                        </label>
                    ))}
                </div>
            ),
        },

        {
            id: "price",
            title: "Price Range",
            content: (
                <div>
                    <input type="range" className="w-full accent-primary-600" />
                    <div className="flex justify-between text-sm mt-2">
                        <span>₹5k</span>
                        <span>₹50k+</span>
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
                            <input type="checkbox" className="accent-primary-600" />
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
                            <input type="checkbox" className="accent-primary-600" />
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
                                className="accent-primary-600"
                            />
                            <span>{item}</span>
                        </label>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <section>

            {/*hero section */}
            <div className="relative">
                <div
                    className="relative h-[650px] w-full bg-cover bg-center bg-no-repeat flex items-center text-center md:text-left p-10"
                    style={{
                        backgroundImage: `url(${DesktopHero})`,
                    }}
                >
                    <div className="absolute inset-0 bg-linear-to-r from-amber-100/90 via-white/30 to-transparent"></div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="relative z-10 max-w-2xl px-6 md:px-10 py-16 lg:py-18 "
                    >


                        {/* Heading */}
                        <motion.h1
                            variants={item}
                            className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-tight mt-10"
                        >
                            Find a place
                        </motion.h1>

                        <motion.h1
                            variants={item}
                            className="text-4xl md:text-6xl font-serif font-bold  mt-2"
                        >
                            <span className="text-gray-900">you'll</span>
                            <span className="text-primary-600"> love</span>
                            <span className="text-gray-900"> to live.</span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            variants={item}
                            className="max-w-xl mt-8 text-gray-700 leading-8 text-base md:text-xl font-semibold"
                        >
                            Explore thousands of verifired flats and houses.<br />
                            Trusted Host. Secure Stay. Better Living
                        </motion.p>

                        {/* Stats */}
                        <motion.div variants={item} className="mt-10 max-w-2xl hidden md:flex">
                            <div className="flex rounded-xl  ">
                                {stats.map(({ icon: Icon, value, label }, i) => (
                                    <div
                                        key={label}
                                        className={`flex-1 flex items-center gap-3 px-5 py-4 ${i !== stats.length - 1 ? "" : ""
                                            }`}
                                    >
                                        <div className=" rounded-full bg-white/30 flex items-center justify-center">
                                            <Icon className="text-primary-600" size={40} />
                                        </div>

                                        <div>

                                            <p className="text-lg font-semibold text-gray-900 mt-1">
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
                    className="absolute hidden md:flex left-1/2 -bottom-14 -translate-x-1/2 z-30 w-[95%] max-w-6xl"
                >
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-6">

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
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Building2 size={30} className="text-primary-600" />
                                <div>
                                    <label className="text-sm font-semibold text-gray-500">
                                        Property
                                    </label>

                                    <select className=" w-full outline-none bg-transparent">
                                        <option>Apartment</option>
                                        <option>Villa</option>
                                        <option>PG</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Wallet2 size={30} className="text-primary-600" />
                                <div>
                                    <label className="text-sm font-semibold text-gray-500">
                                        Budget
                                    </label>

                                    <select className=" w-full outline-none bg-transparent">
                                        <option>Any</option>
                                        <option>₹10k-20k</option>
                                        <option>₹20k-50k</option>
                                    </select>
                                </div>
                            </div>

                            <button className="rounded-2xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition">
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

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                        {/* Sidebar */}

                        <div className="hidden col-span-1 lg:block rounded-3xl border border-gray-200 bg-white  shadow-sm">

                            <div className="w-full flex items-center justify-between px-6 py-3">
                                <h3 className='text-[23px]  font-semibold'>Filters</h3>
                                <button className='text-sm font-bold text-primary-700 mt-3'>Reset All</button>
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



                        {/* Property Grid */}

                        <div className="lg:col-span-3">

                            <div className="w-full flex justify-end">
                                <div className='shadow-2xl bg-gray-200 p-3 rounded-2xl mb-5 flex items-center gap-2'>
                                    <p className='font-semibold text-md'>Sorted by</p>
                                <select className="outline-none text-center">
                                <option>Newest</option>
                                <option>Student</option>
                                <option>Working Professional</option>
                                </select>
                                </div>
                            </div>

                            <motion.div

                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {currentProperties.map((property, index) => (
                                    <motion.div
                                        key={property.id}
                                        // initial={{ opacity: 0, y: 40 }}
                                        // whileInView={{ opacity: 1, y: 0 }}
                                        // transition={{ duration: .5, delay: index * .08 }}
                                        // viewport={{ once: true }}
                                        // whileHover={{ y: -8 }}
                                        className="group overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
                                    >

                                        {/* Image */}

                                        <div className="relative overflow-hidden h-56">
                                            <img
                                                src={property.image}
                                                alt={property.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />

                                            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-md bg-primary-600 text-white">
                                                Featured
                                            </span>

                                            <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white shadow flex items-center justify-center hover:bg-primary-600 hover:text-white transition">
                                                <Heart size={18} />
                                            </button>
                                        </div>

                                        {/* Content */}

                                        <div className="p-5">

                                            <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
                                                {property.title}
                                            </h2>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {property.location}
                                            </p>

                                            {/* Details */}

                                            <div className="flex items-center gap-4 text-gray-500 text-sm mt-4">

                                                <div className="flex items-center gap-1">
                                                    <BedDouble size={16} />
                                                    <span>{property.bedrooms} Beds</span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <Bath size={16} />
                                                    <span>{property.bedrooms} Baths</span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <Ruler size={16} />
                                                    <span>{property.area} sq.ft</span>
                                                </div>

                                            </div>

                                            {/* Price */}

                                            <div className="mt-5 flex items-end gap-1">
                                                <span className="text-3xl font-bold text-primary-700">
                                                    ₹{property.price.toLocaleString()}
                                                </span>
                                                <span className="text-gray-500 text-sm mb-1">
                                                    /month
                                                </span>
                                            </div>

                                        </div>

                                    </motion.div>
                                ))}





                            </motion.div>

                            {/* Pagination */}

                            <div className="flex justify-center items-center gap-3 mt-12">

                                <button
                                    disabled={currentPage === 1}
                                  onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="px-4 py-2 rounded-xl border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-50"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`h-11 w-11 rounded-xl font-semibold transition ${currentPage === i + 1
                                                ? "bg-primary-600 text-white"
                                                : "border hover:bg-primary-50"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages}
                                 onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="px-4 py-2 rounded-xl border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-50"
                                >
                                    Next
                                </button>

                            </div>


                        </div>




                    </div>

                </>

                )}

            </div>




        </section>
    )
}

export default Explore