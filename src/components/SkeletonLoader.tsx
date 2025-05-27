"use client";

interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  className?: string;
}

export default function SkeletonLoader({
  count = 6,
  height,
  className,
}: SkeletonLoaderProps) {
  // If height is provided, render a single skeleton line
  if (height) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse ${
          className || ""
        }`}
        style={{ height }}
      />
    );
  }

  // Otherwise render the default grid layout
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm animate-pulse"
        >
          {/* Image skeleton */}
          <div className="relative aspect-square w-full bg-gray-200 dark:bg-gray-700 rounded-t-xl" />

          <div className="p-4 space-y-4">
            {/* Game badge skeleton */}
            <div className="flex">
              <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3" />
            </div>

            {/* Price and seller info skeleton */}
            <div className="flex items-center justify-between pt-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-24" />
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-20" />
              </div>
            </div>

            {/* Rating skeleton */}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"
                />
              ))}
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-8 ml-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}