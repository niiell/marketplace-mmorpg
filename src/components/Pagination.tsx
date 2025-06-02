"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import KeyboardShortcutHint from "./KeyboardShortcutHint";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showShortcuts?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showShortcuts = true,
}: PaginationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;

      if (e.key === "ArrowLeft" && currentPage > 1) {
        e.preventDefault();
        onPageChange(currentPage - 1);
      } else if (e.key === "ArrowRight" && currentPage < totalPages) {
        e.preventDefault();
        onPageChange(currentPage + 1);
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [currentPage, totalPages, onPageChange]);

  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        // Show first 3, ellipsis, and last 2
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push("ellipsis");
        pages.push(totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first 2, ellipsis, and last 3
        pages.push(1, 2);
        pages.push("ellipsis");
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        // Show first, ellipsis, current-1, current, current+1, ellipsis, last
        pages.push(1);
        pages.push("ellipsis");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      ref={containerRef}
      className={`flex items-center justify-between ${className}`}
      aria-label="Pagination"
    >
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
            ${
              currentPage === 1
                ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
            }
          `}
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium
            ${
              currentPage === totalPages
                ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
            }
          `}
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing page{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {totalPages}
            </span>
          </p>
        </div>

        <div className="flex items-center space-x-8">
          {showShortcuts && (
            <div className="hidden lg:flex lg:items-center lg:space-x-3">
              <KeyboardShortcutHint
                keys={["ArrowLeft"]}
                label="Previous page"
              />
              <KeyboardShortcutHint
                keys={["ArrowRight"]}
                label="Next page"
              />
            </div>
          )}

          <div className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
            {/* Previous button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`
                relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300
                hover:bg-gray-50 focus:z-20 focus:outline-offset-0
                dark:ring-gray-700 dark:hover:bg-gray-800
                ${currentPage === 1 ? "cursor-not-allowed" : "hover:text-gray-500"}
              `}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Page numbers */}
            {pageNumbers.map((pageNumber, index) => {
              if (pageNumber === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 dark:text-gray-300 dark:ring-gray-700"
                  >
                    ...
                  </span>
                );
              }

              const isCurrentPage = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber as number)}
                  className={`
                    relative inline-flex items-center px-4 py-2 text-sm font-semibold
                    ring-1 ring-inset focus:z-20 focus:outline-offset-0
                    ${
                      isCurrentPage
                        ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500"
                        : "text-gray-900 ring-gray-300 hover:bg-gray-50 dark:text-gray-200 dark:ring-gray-700 dark:hover:bg-gray-800"
                    }
                  `}
                  aria-current={isCurrentPage ? "page" : undefined}
                >
                  {pageNumber}

                  {isCurrentPage && (
                    <motion.div
                      layoutId="pagination-highlight"
                      className="absolute inset-0 rounded-sm bg-blue-600 dark:bg-blue-500"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </button>
              );
            })}

            {/* Next button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`
                relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300
                hover:bg-gray-50 focus:z-20 focus:outline-offset-0
                dark:ring-gray-700 dark:hover:bg-gray-800
                ${currentPage === totalPages ? "cursor-not-allowed" : "hover:text-gray-500"}
              `}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}