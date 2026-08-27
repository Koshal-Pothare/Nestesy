const AdminSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gray-200" />
          <div className="h-8 w-64 rounded-lg bg-gray-200 sm:h-10" />
          <div className="h-7 w-24 rounded-full bg-gray-200" />
        </div>

        <div className="mt-3 h-4 w-80 rounded bg-gray-200" />
      </div>

      {/* Stat Cards Skeleton */}
      <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-gray-200 border-l-4 border-l-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-8 w-16 rounded bg-gray-200" />
              </div>

              <div className="h-11 w-11 rounded-full bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Search Skeleton */}
      <div className="mb-7 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="h-12 w-full rounded-xl bg-gray-200" />
      </div>

      {/* Table Skeleton */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        
        {/* Table Header */}
        <div className="hidden grid-cols-[2.3fr_1.2fr_0.8fr_1fr_0.5fr] border-b border-gray-200 bg-gray-50 px-7 py-5 md:grid">
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="mx-auto h-4 w-16 rounded bg-gray-200" />
        </div>

        {/* Rows */}
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="grid grid-cols-1 gap-4 border-b border-gray-200 px-6 py-5 md:grid-cols-[2.3fr_1.2fr_0.8fr_1fr_0.5fr] md:items-center md:gap-0 md:px-7"
          >
            {/* Tenant */}
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200" />

              <div className="min-w-0 space-y-2">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-3 w-44 rounded bg-gray-200" />
                <div className="h-3 w-36 rounded bg-gray-200" />
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>

            {/* Visits */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-gray-200" />
              <div className="h-4 w-8 rounded bg-gray-200" />
            </div>

            {/* Joined */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
            </div>

            {/* Action */}
            <div className="flex justify-start md:justify-center">
              <div className="h-9 w-9 rounded-full bg-gray-200" />
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="h-4 w-40 rounded bg-gray-200" />

          <div className="flex gap-2">
            <div className="h-9 w-9 rounded bg-gray-200" />
            <div className="h-9 w-10 rounded bg-gray-200" />
            <div className="h-9 w-9 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};