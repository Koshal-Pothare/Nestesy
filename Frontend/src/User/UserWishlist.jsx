import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import HeroImage from "../assets/Wishlist/HeroImage.png";
import ExploreSkeleton from "../components/ExploreSkeleton";
import PropertyCard from "../Ui/PropertyCard";
import Pagination from "../components/Pagination";
import SortBy from "../Ui/SortBy";
import { WishlistService } from "../services/UserServices";

const UserWishlist = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const data = await WishlistService.getFavorites();

      if (data?.success === false) {
        throw new Error(data.message || "Failed to load wishlist");
      }

      const favoriteList = Array.isArray(data?.favorites)
        ? data.favorites
        : [];

      setFavorites(favoriteList);
    } catch (error) {
      console.error("Wishlist loading error:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load wishlist"
      );

      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, favorites.length]);

  const sortedProperties = useMemo(() => {
    const properties = [...favorites];

    return properties.sort((a, b) => {
      switch (sortBy) {
        case "priceLow":
          return (
            Number(a?.price || 0) -
            Number(b?.price || 0)
          );

        case "priceHigh":
          return (
            Number(b?.price || 0) -
            Number(a?.price || 0)
          );

        case "newest":
          return (
            new Date(b?.addedAt || b?.createdAt || 0).getTime() -
            new Date(a?.addedAt || a?.createdAt || 0).getTime()
          );

        default:
          return 0;
      }
    });
  }, [favorites, sortBy]);

  const propertiesPerPage = 6;

  const totalPages = Math.ceil(
    sortedProperties.length / propertiesPerPage
  );

  const indexOfLastProperty =
    currentPage * propertiesPerPage;

  const indexOfFirstProperty =
    indexOfLastProperty - propertiesPerPage;

  const currentProperties = sortedProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <section>
      <div
        className="w-full bg-cover bg-center h-[300px] flex items-center md:px-20"
        style={{
          backgroundImage: `url(${HeroImage})`,
        }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 py-16 px-6 md:px-12">
          <div className="flex h-15 w-15 items-center justify-center rounded-full bg-primary-100 text-primary-600 shadow-lg shadow-primary-500/20">
            <FaHeart
              size={38}
              className="animate-pulse"
            />
          </div>

          <div className="text-center md:text-left">
            <p className="uppercase tracking-[0.35em] text-sm font-semibold text-primary-500 mb-3">
              Wishlist
            </p>

            <h1 className="text-4xl sm:text-4xl lg:text-5xl font-serif font-bold text-primary-900 leading-tight">
              My Wishlist
            </h1>

            <p className="mt-4 max-w-xl text-gray-600 text-base sm:text-lg leading-8">
              Keep all your favorite properties in one
              place. Compare listings, revisit them
              anytime, and find the perfect home with ease.
            </p>
          </div>
        </div>
      </div>

      <div className="py-20 w-full p-10">
        {loading ? (
          <ExploreSkeleton />
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.5,
            }}
            className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Heart size={38} />
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-800 sm:text-2xl">
              No Favorite Properties
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              Your saved properties will appear here.
              Start exploring and add properties to your
              wishlist.
            </p>

            <motion.button
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() => navigate("/explore")}
              className="mt-6 flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:bg-primary-700"
            >
              Explore Properties
              <ArrowRight size={17} />
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="w-full flex justify-between items-center mb-5">
              <div>
                <h2 className="text-2xl font-semibold text-primary-900">
                  Saved Properties
                </h2>

                <p className="text-gray-500 mt-1">
                  {favorites.length}{" "}
                  {favorites.length === 1
                    ? "property"
                    : "properties"}{" "}
                  saved
                </p>
              </div>

              <SortBy
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>

            <motion.div
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {currentProperties.map(
                (property, index) => (
                  <PropertyCard
                    property={property}
                    index={index}
                    key={
                      property?._id ||
                      property?.id ||
                      `favorite-${index}`
                    }
                  />
                )
              )}
            </motion.div>

            {totalPages > 1 && (
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
    </section>
  );
};

export default UserWishlist;