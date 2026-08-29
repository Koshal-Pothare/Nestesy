import React from "react";

const UpcomingVisitSkeleton = () => {
  return (
    <div className="w-full mt-50">
      <div className="overflow-hidden rounded-[24px] bg-white shadow-sm animate-pulse">
        <div className="flex w-full flex-col lg:flex-row">

          {/* LEFT - PROPERTY IMAGE */}
          <div className="relative h-[260px] w-full shrink-0 bg-gray-200 sm:h-[300px] lg:h-[323px] lg:w-[55%]">
            <div className="absolute left-5 top-5 h-7 w-20 rounded-full bg-gray-300" />

            <div className="absolute bottom-6 left-5 right-5 sm:left-6 lg:left-6">
              <div className="mb-2 h-3 w-32 rounded bg-gray-300" />
              <div className="h-7 w-56 rounded-md bg-gray-300 sm:w-64" />
              <div className="mt-3 h-4 w-24 rounded bg-gray-300" />
            </div>
          </div>

          {/* RIGHT - VISIT DETAILS */}
          <div className="flex-1 bg-[#0f4b32] p-5 sm:p-6 lg:p-7">
            <div className="h-3 w-28 rounded bg-white/20" />

            <div className="mt-3 h-7 w-64 rounded-md bg-white/20 sm:w-72" />

            {/* DATE + TIME */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[15px] bg-white/10 p-4 sm:min-h-[92px]">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-white/20" />

                  <div className="flex-1">
                    <div className="h-2.5 w-10 rounded bg-white/20" />
                    <div className="mt-3 h-4 w-24 rounded bg-white/20" />
                  </div>
                </div>
              </div>

              <div className="rounded-[15px] bg-white/10 p-4 sm:min-h-[92px]">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-white/20" />

                  <div className="flex-1">
                    <div className="h-2.5 w-10 rounded bg-white/20" />
                    <div className="mt-3 h-4 w-28 rounded bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* HOST */}
            <div className="mt-3 flex min-h-[66px] items-center gap-3 rounded-[15px] bg-white/10 p-3">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-white/20" />

              <div className="flex-1">
                <div className="h-2.5 w-8 rounded bg-white/20" />
                <div className="mt-2 h-4 w-32 rounded bg-white/20" />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <div className="h-11 flex-1 rounded-xl bg-white/20" />
              <div className="h-11 w-full rounded-xl bg-white/20 sm:w-[90px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingVisitSkeleton;