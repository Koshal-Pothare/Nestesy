import React, { useState, useEffect } from 'react'
import HeroImage from '../assets/Wishlist/HeroImage.png'
import { FaHeart } from "react-icons/fa";
import { Properties } from '../Data/Data'
import ExploreSkeleton from '../components/ExploreSkeleton'
import ExploreSidebar from '../components/ExploreSidebar';
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, BedDouble, Bath, Ruler, ArrowRight } from 'lucide-react'
import { getFavorites } from "../utils/favorite";
import PropertyCard from '../Ui/PropertyCard'
import Pagination from '../components/Pagination'
import { useNavigate } from 'react-router-dom';
import WishlistSidebar from '../components/WishlistSidebar';
import SortBy from '../Ui/SortBy'


const UserWishlist = () => {

 const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    const loadFavorites = () => {
      setFavorites(getFavorites());
    };

    loadFavorites();

    window.addEventListener("storage", loadFavorites);

    return () => window.removeEventListener("storage", loadFavorites);
  }, []);



  const [isSavedDataLoading, setIsSaveDataLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

   const sortedProperties = [...favorites].sort((a, b) => {
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

  const propertiesPerPage = 6;

  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

  const currentProperties = sortedProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );



  return (
     <>
      {/* hero section */}
      <section>
      <div className='w-full bg-cover bg-center h-[300px] flex items-center md:px-20 '
        style={{ backgroundImage: `url(${HeroImage})` }}
      >
        {/* hero text */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 py-16 px-6 md:px-12">

          <div className="flex h-15 w-15 items-center justify-center rounded-full bg-primary-100 text-primary-600 shadow-lg shadow-primary-500/20">
            <FaHeart size={38} className="animate-pulse" />
          </div>

          <div className="text-center md:text-left">
            <p className="uppercase tracking-[0.35em] text-sm font-semibold text-primary-500 mb-3">
              Wishlist
            </p>

            <h1 className="text-4xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-900 leading-tight">
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

            {/* Property Grid */}
            <div className="">
              {favorites.length === 0 ? (
                <>

                <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Heart size={38} />
          </div>

          <h2 className="mt-6 text-xl font-bold text-gray-800 sm:text-2xl">
            No Favorite Properties
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
            Your completed and cancelled property visits will appear here.
          </p>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/explore")}
            className="mt-6 flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700"
          >
            Explore Properties
            <ArrowRight size={17} />
          </motion.button>
        </motion.div>

              </>) : (<>

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

                <div className="flex justify-center items-center gap-3 mt-12">
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalItems={favorites.length}
                    itemsPerPage={propertiesPerPage}
                    scrollTo={300}
                  />

                </div>
              </>)}
            </div>
         
        </>

        )}

      </div>
      </section>

    </>
  );
};

export default UserWishlist;