"use client";

export default function SkeletonLoader({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`}
      aria-busy="true"
      aria-label="Loading"
    >
      &nbsp;
    </div>
  );
}
