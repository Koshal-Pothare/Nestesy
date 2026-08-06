import React from 'react'
import{motion,AnimatePresence} from 'framer-motion'
import {Heart ,BedDouble,Bath,Ruler} from 'lucide-react'

const PropertyCard = ({property,index}) => {
    return (
        <>

            <motion.div
                key={property.id}
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

        </>
    )
}

export default PropertyCard