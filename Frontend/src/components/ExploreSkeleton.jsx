import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const card = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const PropertyCardSkeleton = ({ index }) => (
  <motion.div variants={card}>
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{
        repeat: Infinity,
        duration: 3,
        delay: index * 0.15,
        ease: "easeInOut",
      }}
      className="rounded-3xl border border-gray-200 bg-white p-3 shadow-sm"
    >
      {/* Image */}
      <div className="relative skeleton shimmer h-52 rounded-2xl" />

      {/* Content */}
      <div className="mt-5 space-y-4">
        <div className="relative skeleton shimmer h-5 w-3/4 rounded-full" />

        <div className="flex gap-2">
          <div className="relative skeleton shimmer h-3 w-20 rounded-full" />
          <div className="relative skeleton shimmer h-3 w-16 rounded-full" />
        </div>

        <div className="flex justify-between">
          <div className="relative skeleton shimmer h-3 w-14 rounded-full" />
          <div className="relative skeleton shimmer h-3 w-14 rounded-full" />
          <div className="relative skeleton shimmer h-3 w-14 rounded-full" />
        </div>

        <div className="relative skeleton shimmer h-6 w-32 rounded-full" />
      </div>
    </motion.div>
  </motion.div>
);

const ExploreSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="relative skeleton shimmer h-8 w-56 rounded-full" />
          <div className="relative skeleton shimmer h-4 w-72 rounded-full mt-3" />
        </div>

        <div className="flex gap-3">
          <div className="relative skeleton shimmer h-11 w-36 rounded-xl" />
          <div className="relative skeleton shimmer h-11 w-24 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar */}

        <div className="hidden lg:block rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="relative skeleton shimmer h-6 w-28 rounded-full mb-8" />

          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mb-8">
              <div className="relative skeleton shimmer h-4 w-24 rounded-full mb-4" />

              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="relative skeleton shimmer h-4 rounded-full"
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="relative skeleton shimmer h-12 rounded-xl" />

        </div>

        {/* Property Grid */}

        <div className="lg:col-span-3">

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <PropertyCardSkeleton key={i} index={i} />
            ))}
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default ExploreSkeleton;