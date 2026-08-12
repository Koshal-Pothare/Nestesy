import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { motion,animate,useInView} from 'framer-motion'

export default function FAQItem({ q, a, isOpen, onToggle, index = 0 }) {
    return (
        < motion.div
         initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
      className={`bg-white border rounded-2xl mb-3 overflow-hidden transition-colors ${
        isOpen ? "border-emerald-800 shadow-lg shadow-emerald-950/5" : "border-stone-200"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-stone-900"
      >
        <span className={isOpen ? "bg-gradient-to-r from-emerald-800 to-emerald-500 bg-clip-text text-transparent" : ""}
>{q}</span>
        <span
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isOpen ? "bg-emerald-800 text-white" : "bg-stone-100 text-emerald-800"
          }`}
        >
          {isOpen ? (
            <ChevronUp size={16} strokeWidth={2.5} />
          ) : (
            <ChevronDown size={16} strokeWidth={2.5} />
          )}
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-stone-600 leading-relaxed">{a}</p>
        </div>
      </div>
    </motion.div>
    )
}