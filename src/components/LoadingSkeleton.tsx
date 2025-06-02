"use client";

import { cva, type VariantProps } from "class-variance-authority";

const skeletonVariants = cva(
  "animate-pulse rounded bg-gray-200 dark:bg-gray-700",
  {
    variants: {
      variant: {
        text: "h-4 w-full",
        circular: "rounded-full",
        rectangular: "rounded-md",
        button: "h-9 rounded-md",
        avatar: "rounded-full",
        card: "h-full w-full rounded-lg",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
        custom: "",
      },
    },
    compoundVariants: [
      {
        variant: "circular",
        size: "xs",
        class: "h-6 w-6",
      },
      {
        variant: "circular",
        size: "sm",
        class: "h-8 w-8",
      },
      {
        variant: "circular",
        size: "md",
        class: "h-12 w-12",
      },
      {
        variant: "circular",
        size: "lg",
        class: "h-16 w-16",
      },
      {
        variant: "circular",
        size: "xl",
        class: "h-20 w-20",
      },
      {
        variant: "avatar",
        size: "xs",
        class: "h-6 w-6",
      },
      {
        variant: "avatar",
        size: "sm",
        class: "h-8 w-8",
      },
      {
        variant: "avatar",
        size: "md",
        class: "h-12 w-12",
      },
      {
        variant: "avatar",
        size: "lg",
        class: "h-16 w-16",
      },
      {
        variant: "avatar",
        size: "xl",
        class: "h-20 w-20",
      },
      {
        variant: "rectangular",
        size: "xs",
        class: "h-4",
      },
      {
        variant: "rectangular",
        size: "sm",
        class: "h-6",
      },
      {
        variant: "rectangular",
        size: "md",
        class: "h-8",
      },
      {
        variant: "rectangular",
        size: "lg",
        class: "h-12",
      },
      {
        variant: "rectangular",
        size: "xl",
        class: "h-16",
      },
    ],
    defaultVariants: {
      variant: "text",
      size: "md",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  className?: string;
  children?: React.ReactNode;
}

export default function LoadingSkeleton({
  variant,
  size,
  width,
  height,
  className,
  children,
  ...props
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={skeletonVariants({ variant, size, className })}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

// Preset configurations for common loading patterns
export function ListingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <LoadingSkeleton variant="avatar" size="md" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="text" className="w-3/4" />
          <LoadingSkeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <LoadingSkeleton variant="rectangular" className="h-48 w-full" />
      <div className="space-y-2">
        <LoadingSkeleton variant="text" className="w-full" />
        <LoadingSkeleton variant="text" className="w-5/6" />
        <LoadingSkeleton variant="text" className="w-4/6" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <LoadingSkeleton variant="rectangular" className="h-40" />
          <LoadingSkeleton variant="text" className="w-3/4" />
          <LoadingSkeleton variant="text" className="w-1/2" />
        </div>
      ))}
    </div>
  );
}