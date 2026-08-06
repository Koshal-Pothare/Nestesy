import React ,{useState,useEffect}from 'react'
import HeroImage from '../assets/Wishlist/HeroImage.png'
import { FaHeart } from "react-icons/fa";
import {Properties} from '../Data/Data'
import ExploreSkeleton from '../components/ExploreSkeleton'
import ExploreSidebar from '../components/ExploreSidebar';
import{motion,AnimatePresence} from 'framer-motion'
import {Heart ,BedDouble,Bath,Ruler} from 'lucide-react'
import { getFavorites } from "../utils/favorite";
import PropertyCard from '../Ui/PropertyCard'
import Pagination from '../components/Pagination'




const Wishlist = () => {

const [favorites, setFavorites] = useState([]);

useEffect(() => {
  const loadFavorites = () => {
    setFavorites(getFavorites());
  };

  loadFavorites();

  window.addEventListener("storage", loadFavorites);

  return () => window.removeEventListener("storage", loadFavorites);
}, []);


const[isSavedDataLoading , setIsSaveDataLoading]= useState(false);
 const [currentPage, setCurrentPage] = useState(1);

    const propertiesPerPage = 6;

    const totalPages = Math.ceil(favorites.length / propertiesPerPage);

    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

    const currentProperties = favorites.slice(
        indexOfFirstProperty,
        indexOfLastProperty
    );




  return (
   <>
   {/* hero section */}
   <div className='w-full bg-cover bg-center h-[500px] flex items-center md:px-20 '
   style={{backgroundImage:`url(${HeroImage})`}}
   >
    {/* hero text */}
   <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 py-16 px-6 md:px-12">

  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-600 shadow-lg shadow-primary-500/20">
    <FaHeart size={38} className="animate-pulse" />
  </div>

  <div className="text-center md:text-left">
    <p className="uppercase tracking-[0.35em] text-sm font-semibold text-primary-500 mb-3">
      Wishlist
    </p>

    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-primary-900 leading-tight">
      My Wishlist
    </h1>

    <p className="mt-4 max-w-xl text-gray-600 text-base sm:text-lg leading-8">
      Keep all your favorite properties in one place. Compare listings, revisit
      them anytime, and find the perfect home with ease.
    </p>
  </div>

</div>

   </div>


   {/* properties and Sidebar */}

 <div className="py-20 w-full  p-10">

                {isSavedDataLoading ? (<ExploreSkeleton />) : (<>
                   

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                        {/* Sidebar */}

                     <ExploreSidebar/>


                        {/* Property Grid */}

                        <div className="lg:col-span-3">

                            <div className="w-full flex justify-end">
                                <div className=' shadow-2xl shadow-gray-500/20 bg-primary-600 text-white p-3 rounded-2xl mb-5 flex items-center gap-2 '>
                                    <p className='font-semibold text-md'>Sorted by</p>
                                <select className="outline-none text-center ">
                                <option className=''>Newest</option>
                                <option>High-Low</option>
                                <option>Low-High</option>
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
                               <Pagination
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalItems={favorites.length}
                                    itemsPerPage={propertiesPerPage}
                                    scrollTo={700}
                                />

                            </div>

                        </div>

                    </div>
                </>

                )}

                

            </div>

   </>
  )
}

export default Wishlist;