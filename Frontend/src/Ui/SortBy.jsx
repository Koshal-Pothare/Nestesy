import React,{useState} from 'react'
import { ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";


const SortBy = ({sortBy,setSortBy}) => {

const [isSortOpen, setIsSortOpen] = useState(false);

const sortOptions = [
  { value: "priceLow", label: " Low to High" },
  { value: "priceHigh", label: " High to Low" },

];



  return (
    <>
    
<div className="relative w-72">
  <button
    onClick={() => setIsSortOpen(!isSortOpen)}
    className="w-full bg-primary-600 text-white border-2 border-primary-500 rounded-2xl  py-2 md:px-5 md:py-3 flex items-center justify-around shadow-lg hover:border-primary-600 transition"
  >
    <div className="text-left">
      <p className="text-sm md:text-lg  font-medium">Sort By</p>
</div>
<div className="flex items-center gap-2">
      <p className="text-sm md:text-base font-semibold">
        {sortOptions.find((item) => item.value === sortBy)?.label}
      </p>
    

    <motion.div
      animate={{ rotate: isSortOpen ? 180 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <ChevronDown className="" size={15}/>
    </motion.div>
    </div>
  </button>

  <AnimatePresence>
    {isSortOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="absolute mt-3 w-full bg-white rounded-2xl border border-primary-100 shadow-2xl overflow-hidden z-50"
      >
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setSortBy(option.value);
              setIsSortOpen(false);
            }}
            className={`w-full px-5 py-4 flex justify-between items-center text-left transition
              ${
                sortBy === option.value
                  ? "bg-primary-50 text-primary-700"
                  : "hover:bg-primary-50"
              }`}
          >
            <span>{option.label}</span>

            {sortBy === option.value && (
              <Check size={18} className="text-primary-600" />
            )}
          </button>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
</div>
    
    </>
  )
}

export default SortBy