import React from 'react'

const HistorySkeleton = () => {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
        
        {/* Image Skeleton */}
        <div className="h-52 bg-gray-200 sm:h-60 lg:h-full lg:min-h-[260px]" />

        {/* Content Skeleton */}
        <div className="p-5 sm:p-6 lg:p-6">
          
          {/* Title + Price */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="h-7 w-40 rounded-md bg-gray-200" />
              <div className="h-4 w-24 rounded-md bg-gray-200" />
            </div>

            <div className="h-6 w-28 rounded-md bg-gray-200" />
          </div>

          {/* Specs */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-y border-gray-100 py-3">
            <div className="h-4 w-16 rounded-md bg-gray-200" />
            <div className="h-4 w-16 rounded-md bg-gray-200" />
            <div className="h-4 w-20 rounded-md bg-gray-200" />
          </div>

          {/* Visit Info */}
          <div className="mt-3 flex flex-wrap gap-3">
            <div className="h-7 w-36 rounded-xl bg-gray-200" />
            <div className="h-7 w-32 rounded-xl bg-gray-200" />
            <div className="h-7 w-28 rounded-xl bg-gray-200" />
          </div>

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-3">
            <div className="h-9 w-28 rounded-xl bg-gray-200" />
            <div className="h-9 w-32 rounded-xl bg-gray-200" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default HistorySkeleton