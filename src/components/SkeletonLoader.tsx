"use client";

export default function SkeletonLoader({
  className = "",
  height = "auto",
  width,
  children,
}: {
  className?: string;
  height?: string;
  width?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`}
      style={{ height, width }}
      aria-busy="true"
      aria-label="Loading"
    >
      {children || <>&nbsp;</>}
    </div>
  );
}