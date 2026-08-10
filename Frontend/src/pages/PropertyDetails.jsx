import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Calendar,
  ShieldCheck,
  Phone,
  Mail,
  User,
  Star,
  Clock,
  IndianRupee,
  Heart,
} from "lucide-react";
import {useParams} from 'react-router-dom'
import { Properties } from "../Data/Data";
import AddReviewModal from "../Ui/AddReviewModal";
import BookVisitModal from "../Ui/BookVisitModal";

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "The property was exactly as shown in the pictures. The location is excellent and the host was very helpful.",
  },
  {
    id: 2,
    name: "Priya Verma",
    rating: 4,
    date: "1 month ago",
    comment:
      "Good property with decent amenities. The surroundings are peaceful and the overall experience was great.",
  },
  {
    id: 3,
    name: "Amit Patil",
    rating: 5,
    date: "2 months ago",
    comment:
      "Very clean and well-maintained property. The booking process was also simple and convenient.",
  },
  {
    id: 4,
    name: "Sneha Joshi",
    rating: 4,
    date: "3 months ago",
    comment:
      "Nice apartment in a good locality. The host responded quickly whenever we had questions.",
  },
  {
    id: 5,
    name: "Vikram Singh",
    rating: 5,
    date: "4 months ago",
    comment:
      "Highly recommended for working professionals. Everything was convenient and easily accessible.",
  },
];

 

const PropertyDetails = () => {
    const { id } = useParams();

    const property = Properties.find(
        (item) => item.id === Number(id)
    );

    const [currentImage, setCurrentImage] = useState(0);
    const[openReviewModal,setOpenReviewModal] = useState(false);
    const[openBookModal,setOpenBookModal] = useState(false);

    useEffect(() => {
        if (!property?.images?.length) return;

        const timer = setInterval(() => {
            setCurrentImage(
                (prev) => (prev + 1) % property.images.length
            );
        }, 4000);

        return () => clearInterval(timer);
    }, [property]);

    useEffect(() => {
        setCurrentImage(0);
    }, [id]);

    if (!property) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">
                    Property not found.
                </p>
            </div>
        );
    }

    const nextImage = () => {
        setCurrentImage(
            (prev) => (prev + 1) % property.images.length
        );
    };

    const previousImage = () => {
        setCurrentImage((prev) =>
            prev === 0
                ? property.images.length - 1
                : prev - 1
        );
    };


  return (
    <div className="min-h-screen bg-gray-50 py-20">
     
      {/* Hero / Image Gallery */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-auto lg:h-[420px]"
        >
          {/* Main Carousel */}
          <div className="relative h-[320px] sm:h-[320px] lg:h-full overflow-hidden rounded-3xl group">
            <motion.img
              key={currentImage}
              src={property.images?.[currentImage]}
              alt={property.title}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

            <button
              onClick={previousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-5 left-5 flex gap-2">
              {property.images?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentImage === index
                      ? "w-7 bg-white"
                      : "w-2 bg-white/60"
                  }`}
                />
              ))}
            </div>

            <div className="absolute top-5 left-5 rounded-full bg-black/40 backdrop-blur-md px-4 py-2 text-sm text-white">
              {currentImage + 1} / {property.images?.length}
            </div>

            <button className="absolute right-5 top-5 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 text-red-500 shadow-lg hover:scale-110 transition">
              <Heart size={18} />
            </button>
          </div>

          {/* Static Images */}
          <div className="grid grid-cols-2 gap-3 h-[320px] sm:h-[420px] lg:h-full">
            {property.images?.slice(1, 5).map((image, index) => (
              <motion.div
                key={image}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="overflow-hidden rounded-2xl"
              >
                <img
                  src={image}
                  alt={`${property.title} ${index + 2}`}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          {/* Left Content */}
          <div className="min-w-0">
            {/* Title */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                <div>
                  <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                    {property.propertyType}
                  </span>

                  <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    {property.title}
                  </h1>

                  <div className="mt-2 flex items-center gap-2 text-gray-500">
                    <MapPin
                      size={18}
                      className="shrink-0 text-primary-600"
                    />
                    <span>{property.location}</span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="flex items-baseline gap-1 sm:justify-end">
                    <span className="text-2xl sm:text-3xl font-bold text-primary-600">
                      ₹{property.price?.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>

                  <div className="mt-2 flex items-center gap-1 sm:justify-end">
                    <Star
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />
                    <span className="font-semibold">
                      {property.rating}
                    </span>
                    <span className="text-gray-500">
                      ({property.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <BedDouble className="text-primary-600" size={21} />
                  <p className="mt-2 text-xs text-gray-500">Bedrooms</p>
                  <p className="font-semibold text-gray-800">
                    {property.bedrooms}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <Bath className="text-primary-600" size={21} />
                  <p className="mt-2 text-xs text-gray-500">Bathrooms</p>
                  <p className="font-semibold text-gray-800">
                    {property.bathrooms}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <Ruler className="text-primary-600" size={21} />
                  <p className="mt-2 text-xs text-gray-500">Area</p>
                  <p className="font-semibold text-gray-800">
                    {property.area} sq.ft
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <IndianRupee className="text-primary-600" size={21} />
                  <p className="mt-2 text-xs text-gray-500">Furnishing</p>
                  <p className="font-semibold text-gray-800">
                    {property.furnishing}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Description */}
            <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                About this property
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-7 text-gray-600">
                {property.description}
              </p>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-900">Best For</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {property.idealFor?.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                Amenities
              </h2>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {property.amenities?.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-2xl border border-primary-100 bg-primary-50 p-3 text-sm font-medium text-gray-700"
                  >
                    <ShieldCheck
                      size={17}
                      className="text-primary-600"
                    />
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Host */}
            <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                Host Details
              </h2>

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700">
                  <User size={30} />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">
                    {property.host}
                  </h3>

                  <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-5 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                      <Phone size={15} />
                      {property.hostPhone}
                    </span>

                    <span className="flex items-center gap-2 break-all">
                      <Mail size={15} />
                      {property.hostEmail}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  <ShieldCheck size={17} />
                  Verified Host
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 sm:p-6">
                <ShieldCheck className="text-primary-600" size={25} />
                <h3 className="mt-3 font-bold text-gray-900">
                  Security Deposit
                </h3>
                <p className="mt-1 text-gray-600">
                  ₹{property.securityDeposit?.toLocaleString()}
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 sm:p-6">
                <IndianRupee className="text-primary-600" size={25} />
                <h3 className="mt-3 font-bold text-gray-900">
                  Maintenance
                </h3>
                <p className="mt-1 text-gray-600">
                  ₹{property.maintenance?.toLocaleString()} / month
                </p>
              </div>
            </section>

            {/* Reviews */}
            <section className="mt-5 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-7 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Reviews & Ratings
                  </h2>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star
                        size={18}
                        className="fill-amber-400 text-amber-400"
                      />
                      <span className="font-bold">
                        {property.rating}
                      </span>
                    </div>

                    <span className="text-sm text-gray-500">
                      Based on {property.reviews} reviews
                    </span>
                  </div>
                </div>

                
              </div>

              {/* Auto Scroll Reviews */}
              <div className="relative mt-6 overflow-hidden">
                <motion.div
                  className="flex gap-4"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {[...reviews, ...reviews].map((review, index) => (
                    <div
                      key={`${review.id}-${index}`}
                      className="w-[280px] sm:w-[330px] shrink-0 rounded-2xl border border-gray-100 bg-gray-50 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {review.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {review.date}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <Star
                            size={14}
                            className="fill-amber-400 text-amber-400"
                          />
                          <span className="text-sm font-semibold">
                            {review.rating}
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-gray-600">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>
            </section>
          </div>

          {/* Right Sticky Booking Card */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-lg p-5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Monthly Rent</p>
                  <h2 className="text-2xl font-bold text-primary-600">
                    ₹{property.price?.toLocaleString()}
                  </h2>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-sm">
                  <Star
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                  {property.rating}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-primary-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">
                      Availability
                    </p>
                    <p className="font-semibold text-gray-800">
                      {property.availability}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Clock className="text-primary-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">
                      Visiting Hours
                    </p>
                    <p className="font-semibold text-gray-800">
                      {property.visitTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Security Deposit
                  </span>
                  <span className="font-semibold">
                    ₹{property.securityDeposit?.toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-gray-500">Maintenance</span>
                  <span className="font-semibold">
                    ₹{property.maintenance?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <button
                onClick={()=>setOpenReviewModal(true)}
                className="rounded-2xl border border-primary-600 py-3.5 font-semibold text-primary-600 hover:bg-primary-600 hover:text-white transition">
                  Add Review
                </button>

                <button
                onClick={()=>setOpenBookModal(true)}
                className="rounded-2xl bg-primary-600 py-3.5 font-semibold text-white hover:bg-primary-700 transition shadow-lg shadow-primary-600/20">
                  Book Visit
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={15} className="text-green-500" />
                Your information is secure
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
      <AddReviewModal
    open={openReviewModal}
    onClose={() => setOpenReviewModal(false)}
    property={property}
/>

<BookVisitModal
    property={property}
    open={openBookModal}
    onClose={() => setOpenBookModal(false)}
/>
    </div>
    
  );
};

export default PropertyDetails;