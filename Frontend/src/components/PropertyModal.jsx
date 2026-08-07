import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, BedDouble, Bath, Ruler, Calendar, Wifi, Car, Shield, IndianRupee } from "lucide-react";

const PropertyModal = ({ property, open, onClose }) => {
  if (!property) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
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
            className="fixed left-1/2 top-1/2 z-50 w-[95%] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-5 right-5 z-20 rounded-full bg-white p-2 shadow">
              <X />
            </button>

            <div className="grid lg:grid-cols-2">
              <img src={property.image} alt={property.title} className="h-[320px] w-full object-cover lg:h-full" />

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

                <div className="mt-8 flex items-end gap-2">
                  <h2 className="text-4xl font-bold text-primary-600">₹{property.price.toLocaleString()}</h2>
                  <span className="text-gray-500">/month</span>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold">Description</h3>
                  <p className="mt-3 leading-7 text-gray-600">{property.description}</p>
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

                <div className="mt-8 grid grid-cols-2 gap-5">
                  <div className="rounded-2xl bg-gray-50 p-5">
                    <Calendar className="text-primary-600" />
                    <h4 className="mt-2 font-semibold">Availability</h4>
                    <p>{property.availability}</p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-5">
                    <Shield className="text-primary-600" />
                    <h4 className="mt-2 font-semibold">Verified Host</h4>
                    <p>Trusted by Nestesy</p>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button className="flex-1 rounded-2xl border-2 border-primary-600 py-4 font-semibold text-primary-600 transition hover:bg-primary-50">
                    Save Property
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