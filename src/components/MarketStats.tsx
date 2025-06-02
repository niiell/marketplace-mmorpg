"use client";

import { motion } from "framer-motion";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useCurrency } from "../context/CurrencyContext";

interface MarketStat {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  percentage?: number;
  isPrice?: boolean;
}

interface MarketStatsProps {
  stats: MarketStat[];
}

export default function MarketStats({ stats }: MarketStatsProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { format: formatCurrency } = useCurrency();

  const trendColors = {
    up: "text-green-600 dark:text-green-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-gray-600 dark:text-gray-400",
  };

  const trendIcons = {
    up: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    down: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
        />
      </svg>
    ),
    neutral: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14"
        />
      </svg>
    ),
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div
        className={`grid gap-6 ${
          isMobile ? "grid-cols-2" : `grid-cols-${Math.min(stats.length, 4)}`
        }`}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/50"
          >
            {/* Background decoration */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1.5rem 1.5rem, currentColor 0.5rem, transparent 0.5rem)",
                backgroundSize: "3rem 3rem",
              }}
            />

            <div className="relative">
              <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </dt>
              <dd className="mt-2 flex items-baseline justify-between">
                <div className="flex items-baseline text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.isPrice ? formatCurrency(Number(stat.value)) : stat.value}
                </div>
                {stat.trend && (
                  <div
                    className={`inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium ${
                      trendColors[stat.trend]
                    }`}
                  >
                    <span className="sr-only">
                      {stat.trend === "up"
                        ? "Increased by"
                        : stat.trend === "down"
                        ? "Decreased by"
                        : "Changed by"}
                    </span>
                    {stat.percentage && (
                      <span className="mr-1">
                        {stat.trend === "down" ? "-" : "+"}
                        {stat.percentage}%
                      </span>
                    )}
                    {trendIcons[stat.trend]}
                  </div>
                )}
              </dd>
            </div>

            {/* Animated border on hover */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              initial={false}
              whileHover={{
                boxShadow: "0 0 0 2px currentColor",
              }}
              style={{
                color: stat.trend
                  ? stat.trend === "up"
                    ? "rgb(22 163 74)" // green-600
                    : stat.trend === "down"
                    ? "rgb(220 38 38)" // red-600
                    : "rgb(75 85 99)" // gray-600
                  : "rgb(59 130 246)", // blue-500
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}