"use client";

export default function SkeletonLoader({ className = "", height }: { className?: string; height?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`}
      style={{ height }}
      aria-busy="true"
      aria-label="Loading"
    >
      &nbsp;
    </div>
  );
}
