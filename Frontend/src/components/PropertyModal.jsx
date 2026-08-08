import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, MapPin, BedDouble, Bath, Ruler, Calendar, Phone, Mail, User, Star, ShieldCheck, IndianRupee, Clock } from "lucide-react";

const PropertyModal = ({ property, open, onClose }) => {
  if (!property) return null;

  const [currentImage, setCurrentImage] = useState(0);

useEffect(() => {
  if (!open || !property?.images?.length) return;

  const timer = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  }, 3500);

  return () => clearInterval(timer);
}, [open, property]);

useEffect(() => {
  setCurrentImage(0);
}, [property]);



  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ duration: 0.35 }}
            className="fixed left-1/2 top-1/2 z-100 w-[95%] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-5 right-5 z-20 rounded-full bg-white p-2 shadow">
              <X />
            </button>

            <div className="grid lg:grid-cols-2">
             <div className="relative h-[320px] lg:h-full overflow-hidden">

  <AnimatePresence mode="wait">
    <motion.img
      key={currentImage}
      src={property.images[currentImage]}
      alt={property.title}
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .5 }}
      className="absolute inset-0 h-full w-full object-cover"
    />
  </AnimatePresence>

  {/* Previous */}

  <button
    onClick={() =>
      setCurrentImage((prev) =>
        prev === 0
          ? property.images.length - 1
          : prev - 1
      )
    }
    className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 backdrop-blur hover:bg-white"
  >
    <ChevronLeft size={20}/>
  </button>

  {/* Next */}

  <button
    onClick={() =>
      setCurrentImage((prev) =>
        (prev + 1) % property.images.length
      )
    }
    className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 backdrop-blur hover:bg-white"
  >
    <ChevronRight size={20}/>
  </button>

  {/* Dots */}

  <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
    {property.images.map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentImage(i)}
        className={`h-2 rounded-full transition-all ${
          currentImage === i
            ? "w-8 bg-white"
            : "w-2 bg-white/60"
        }`}
      />
    ))}
  </div>

  {/* Rating */}

  <div className="absolute left-6 bottom-14 rounded-2xl bg-white/90 px-5 py-3 backdrop-blur shadow-xl">
    <div className="flex items-center gap-2">
      <Star className="fill-yellow-400 text-yellow-400" size={18}/>
      <span className="font-semibold">{property.rating}</span>
      <span className="text-gray-500">
        ({property.reviews} Reviews)
      </span>
    </div>
  </div>

</div>
              <div className="max-h-[85vh] overflow-y-auto p-8">
                <h1 className="text-3xl font-bold">{property.title}</h1>

                <div className="mt-2 flex items-center gap-2 text-gray-500">
                  <MapPin size={18} />
                  <span>{property.location}</span>
                </div>

                <div className="mt-6 flex flex-wrap gap-6 text-gray-600">
                  <div className="flex items-center gap-2"><BedDouble size={18} />{property.bedrooms} Beds</div>
                  <div className="flex items-center gap-2"><Bath size={18} />{property.bathrooms} Baths</div>
                  <div className="flex items-center gap-2"><Ruler size={18} />{property.area} Sq.ft</div>
                </div>
                     
                     <div className="mt-8 flex justify-between">                     
                <div className=" flex items-end gap-2">
                  <h2 className="text-4xl font-bold text-primary-600">₹{property.price.toLocaleString()}</h2>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-gray-800 mt-5 font-semibold">Listed on: {property.listedOn}</p>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold">Description</h3>
                  <p className="mt-3 leading-7 text-gray-600">{property.description}</p>
                </div>

                   <div className="mt-8">
                  <h3 className="text-xl font-semibold">Best For</h3>
                  <p className="mt-3 leading-7 text-gray-800">{property.idealFor.join(",  ")}</p>
                </div>

                <div className="mt-8">
                  <h3 className="mb-4 text-xl font-semibold">Amenities</h3>
                  <div className="flex flex-wrap gap-3">
                    {property.amenities.map((item) => (
                      <span key={item} className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold">Host Details</h3>
                  <p className="mt-3 leading-8 text-gray-800 font-semibold">{property.host}</p>
                   <p className=" leading-tight text-gray-600 flex items-center gap-5">{property.hostPhone} <span>{property.hostEmail}</span></p>
                </div>

                   <div className="mt-8">
                  <h3 className="text-xl font-semibold">Security & Maintenance</h3>
                  <p className="mt-3 leading-8 text-gray-600 font-semibold">Security Deposit : {property.securityDeposit}</p>
                   <p className=" leading-8 text-gray-600 font-semibold ">Maintenance : {property.maintenance} </p>
                </div>

                  
                  <h3 className="text-xl mt-8 font-semibold">Visiting Hours : <span className="font-normal text-gray-700 text-lg">{property.visitTime}</span> </h3>
                
                  

                <div className="mt-8 grid grid-cols-2 gap-5">
                  <div className="rounded-2xl bg-gray-50 p-5">
                    <Calendar className="text-primary-600" />
                    <h4 className="mt-2 font-semibold">Availability</h4>
                    <p>{property.availability}</p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-5">
                    <ShieldCheck className="text-primary-600" />
                    <h4 className="mt-2 font-semibold">Verified Host</h4>
                    <p>Trusted by Nestesy</p>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button className="flex-1 rounded-2xl bg-white py-4 font-semibold text-primary-600 border border-primary-600 transition hover:bg-primary-700 hover:text-white">
                    Add review
                  </button>

                  <button className="flex-1 rounded-2xl bg-primary-600 py-4 font-semibold text-white transition hover:bg-primary-700">
                    Book Visit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PropertyModal;