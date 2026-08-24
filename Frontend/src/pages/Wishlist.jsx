import React, { useState, useEffect } from 'react'
import HeroImage from '../assets/Wishlist/HeroImage.png'
import { FaHeart } from "react-icons/fa";
import { Properties } from '../Data/Data'
import ExploreSkeleton from '../components/ExploreSkeleton'
import ExploreSidebar from '../components/ExploreSidebar';
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, BedDouble, Bath, Ruler, ArrowRight } from 'lucide-react'
import { getFavorites } from "../utils/favorite";
import { WishlistService } from "../services/UserServices";
import PropertyCard from '../Ui/PropertyCard'
import Pagination from '../components/Pagination'
import { useNavigate } from 'react-router-dom';
import WishlistSidebar from '../components/WishlistSidebar';
import SortBy from '../Ui/SortBy'

const Wishlist = () => {

  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("newest")
  const [loading, setLoading] = useState(true);

  const normalizeFav = (fav) => ({
    ...fav,
    id: String(fav.propertyId || fav._id || fav.id || ''),
    _id: String(fav.propertyId || fav._id || fav.id || ''),
    propertyId: String(fav.propertyId || fav._id || fav.id || ''),
    title: fav.title || 'Property',
    location: fav.location || '',
    price: Number(fav.price || fav.rent || 0),
    bedrooms: Number(fav.bedrooms || fav.bhk || 0),
    bathrooms: Number(fav.bathrooms || 0),
    area: Number(fav.area || 0),
    images: Array.isArray(fav.images) && fav.images.length > 0
      ? fav.images
      : (Array.isArray(fav.allImages) && fav.allImages.length > 0 ? fav.allImages : []),
    status: fav.status || 'active',
  });

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const data = await WishlistService.getFavorites();
          if (data && Array.isArray(data.favorites)) {
            setFavorites(data.favorites.map(normalizeFav));
            setLoading(false);
            return;
          }
        } catch (apiErr) {
          console.log("API wishlist fetch error, trying local:", apiErr);
        }
      }

      const favs = getFavorites();
      setFavorites((favs || []).map(normalizeFav));
    } catch (error) {
      console.error('Error loading favorites:', error);
      const favs = getFavorites();
      setFavorites((favs || []).map(normalizeFav));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Listen for favorite updates
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    window.addEventListener('storage', handleFavoritesUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('storage', handleFavoritesUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* hero section */}
      <section>
        <div className='w-full bg-cover bg-center h-[500px] flex items-center md:px-20 '
          style={{ backgroundImage: `url(${HeroImage})` }}
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

        <div className="py-20 w-full p-10">

          {isSavedDataLoading ? (<ExploreSkeleton />) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

              {/* Sidebar */}
              <WishlistSidebar favoritesCount={favorites.length} />

              {/* Property Grid */}
              <div className="lg:col-span-3">
                {favorites.length === 0 ? (
                  <div className="w-full h-200 flex flex-col items-center justify-center">
                    <div className="bg-gray-100 rounded-full p-8 mb-6">
                      <Heart className="w-16 h-16 text-gray-300" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-400 text-center">No saved properties</h1>
                    <p className="text-gray-400 mt-2 text-center">Start exploring and save your favorite properties</p>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/explore")}
                      className="mt-8 w-50 flex items-center justify-center gap-2 rounded-2xl bg-primary-600 py-4 px-8 font-semibold text-white shadow-xl hover:bg-primary-500 transition-colors"
                    >
                      Explore Properties
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                      >
                        <ArrowRight size={18} />
                      </motion.div>
                    </motion.button>
                  </div>
                ) : (
                  <>
                    <div className="w-full flex justify-between items-center mb-5">
                      <p className="text-sm text-gray-500">
                        Showing {currentProperties.length} of {favorites.length} saved properties
                      </p>
                      <SortBy sortBy={sortBy} setSortBy={setSortBy} />
                    </div>

                    <motion.div
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                      {currentProperties.map((property, index) => (
                        <PropertyCard 
                          property={property} 
                          index={index} 
                          key={property.id || property._id || property.propertyId || index} 
                          variant="public"
                        />
                      ))}
                    </motion.div>

                    {/* Pagination */}
                    {favorites.length > propertiesPerPage && (
                      <div className="flex justify-center items-center gap-3 mt-12">
                        <Pagination
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          totalItems={favorites.length}
                          itemsPerPage={propertiesPerPage}
                          scrollTo={300}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Wishlist;