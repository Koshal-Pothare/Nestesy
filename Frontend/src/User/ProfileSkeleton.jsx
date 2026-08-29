import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[310px_1fr]">

        {/* LEFT PROFILE CARD */}
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="h-28 w-28 rounded-full bg-gray-200 ring-8 ring-gray-100" />
              <div className="absolute bottom-1 right-1 h-7 w-7 rounded-full bg-gray-300 ring-4 ring-white" />
            </div>

            <div className="mt-5 h-5 w-24 rounded-md bg-gray-200" />
            <div className="mt-3 h-3.5 w-40 rounded bg-gray-200" />

            <div className="mt-4 h-8 w-32 rounded-full bg-gray-100" />
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="flex h-[72px] flex-col items-center justify-center rounded-2xl bg-gray-50">
              <div className="h-5 w-6 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-16 rounded bg-gray-200" />
            </div>

            <div className="flex h-[72px] flex-col items-center justify-center rounded-2xl bg-gray-50">
              <div className="h-5 w-6 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-14 rounded bg-gray-200" />
            </div>
          </div>

          <div className="mt-6 h-11 w-full rounded-xl border border-gray-200 bg-gray-50" />
        </div>

        {/* RIGHT INFORMATION CARD */}
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
          <div className="h-5 w-40 rounded bg-gray-200" />
          <div className="mt-3 h-3.5 w-52 rounded bg-gray-200" />

          {/* INPUTS */}
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <div className="mb-2 h-3 w-16 rounded bg-gray-200" />
              <div className="h-11 w-full rounded-xl bg-gray-100" />
            </div>

            <div>
              <div className="mb-2 h-3 w-20 rounded bg-gray-200" />
              <div className="h-11 w-full rounded-xl bg-gray-100" />
            </div>

            <div>
              <div className="mb-2 h-3 w-20 rounded bg-gray-200" />
              <div className="h-11 w-full rounded-xl bg-gray-100" />
            </div>

            <div>
              <div className="mb-2 h-3 w-14 rounded bg-gray-200" />
              <div className="h-11 w-full rounded-xl bg-gray-100" />
            </div>
          </div>

          {/* BOTTOM CARDS */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* PROFILE COMPLETION */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gray-200" />

                  <div>
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="mt-2 h-3 w-20 rounded bg-gray-200" />
                  </div>
                </div>

                <div className="h-5 w-10 rounded bg-gray-200" />
              </div>

              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-[75%] rounded-full bg-gray-300" />
              </div>

              <div className="ml-auto mt-3 h-3 w-24 rounded bg-gray-200" />
            </div>

            {/* JOINED ON */}
            <div className="flex min-h-[96px] items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-200" />

                <div>
                  <div className="h-3 w-20 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
                </div>
              </div>

              <div className="h-5 w-5 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;