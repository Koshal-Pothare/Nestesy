import React, { useEffect } from "react";

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage,
  scrollTo = 0,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  }, [currentPage, scrollTo]);

  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];

    // Show all pages if <= 5
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Page 1
    if (currentPage === 1) {
      return [1, 2, 3, "...", totalPages];
    }

    // Page 2
    if (currentPage === 2) {
      return [1, 2, 3, "...", totalPages];
    }

    // Page 3
    if (currentPage === 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    // Last Page
    if (currentPage === totalPages) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // Second Last Page
    if (currentPage === totalPages - 1) {
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // Third Last Page
    if (currentPage === totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // Middle Pages
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mt-12">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => prev - 1)}
        className="px-4 py-2 rounded-xl border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-50"
      >
        Previous
      </button>

      {getPages().map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-2 text-gray-500 font-semibold">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`h-11 w-11 rounded-xl font-semibold transition ${
              currentPage === page
                ? "bg-primary-600 text-white"
                : "border hover:bg-primary-50"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        className="px-4 py-2 rounded-xl border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;