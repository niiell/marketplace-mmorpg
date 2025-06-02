import React, { ReactNode } from "react";

interface GridLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * GridLayout component provides a responsive grid container
 * with consistent spacing and max width.
 * 
 * Usage:
 * <GridLayout>
 *   <YourContent />
 * </GridLayout>
 */
export default function GridLayout({ children, className = "" }: GridLayoutProps) {
  return (
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-6 ${className}`}
    >
      {children}
    </div>
  );
}
