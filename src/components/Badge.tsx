"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

const badgeVariants = cva(
  "inline-flex items-center rounded-full text-xs font-medium ring-1 ring-inset transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20",
        primary:
          "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
        success:
          "bg-green-50 text-green-700 ring-green-600/10 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20",
        warning:
          "bg-yellow-50 text-yellow-700 ring-yellow-600/10 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/20",
        error:
          "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20",
        premium:
          "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-700 ring-amber-600/10 dark:from-amber-400/10 dark:to-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-sm",
        lg: "px-3 py-1 text-sm",
      },
      interactive: {
        true: "cursor-pointer hover:bg-opacity-80",
        false: "",
      },
      removable: {
        true: "pr-1",
        false: "",
      },
      pulse: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      interactive: false,
      removable: false,
      pulse: false,
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof VariantProps<typeof badgeVariants> | 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  onRemove?: () => void;
  icon?: React.ReactNode;
}

export default function Badge({
  children,
  variant,
  size,
  className,
  interactive,
  removable,
  pulse,
  onRemove,
  icon,
  ...props
}: BadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={badgeVariants({
        variant,
        size,
        interactive,
        removable,
        pulse,
        className,
      })}
      {...props}
    >
      {icon && <span className="mr-1 -ml-0.5">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className={`
            ml-1 rounded-full p-0.5 hover:bg-black/5 dark:hover:bg-white/5
            ${
              variant === "premium"
                ? "hover:bg-amber-600/5 dark:hover:bg-amber-400/5"
                : ""
            }
          `}
          aria-label="Remove badge"
        >
          <svg
            className="h-3 w-3 opacity-50 hover:opacity-100"
            fill="none"
            strokeWidth="2.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Premium effect */}
      {variant === "premium" && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-600/20 opacity-0"
          animate={{
            opacity: [0, 0.5, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      )}
    </motion.div>
  );
}

// Preset configurations for common use cases
export const BadgePresets = {
  new: {
    variant: "primary" as const,
    children: "New",
    pulse: true,
  },
  sale: {
    variant: "error" as const,
    children: "Sale",
  },
  verified: {
    variant: "success" as const,
    children: "Verified",
  },
  premium: {
    variant: "premium" as const,
    children: "Premium",
  },
  limited: {
    variant: "warning" as const,
    children: "Limited",
  },
} as const;