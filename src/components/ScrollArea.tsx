"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  hideScrollbar?: boolean;
  orientation?: "vertical" | "horizontal";
  smoothScroll?: boolean;
}

export default function ScrollArea({
  children,
  className = "",
  hideScrollbar = false,
  orientation = "vertical",
  smoothScroll = true,
}: ScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);

  const smoothScrollY = useSpring(0, {
    stiffness: 300,
    damping: 30,
    mass: 0.5,
  });

  const scrollbarHeight = useTransform(
    smoothScrollY,
    [0, 100],
    ["0%", "100%"]
  );

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const newScrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollPercentage(newScrollPercentage);
      smoothScrollY.set(newScrollPercentage);
      setShowScrollbar(true);
    };

    const hideScrollbarTimer = setTimeout(() => {
      if (!isDragging) {
        setShowScrollbar(false);
      }
    }, 1000);

    element.addEventListener("scroll", handleScroll);
    return () => {
      element.removeEventListener("scroll", handleScroll);
      clearTimeout(hideScrollbarTimer);
    };
  }, [isDragging, smoothScrollY]);

  const handleMouseEnter = () => {
    setShowScrollbar(true);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setShowScrollbar(false);
    }
  };

  const isVertical = orientation === "vertical";
  const scrollbarStyle = isVertical
    ? {
        right: 2,
        top: 0,
        width: 6,
        height: "100%",
      }
    : {
        bottom: 2,
        left: 0,
        height: 6,
        width: "100%",
      };

  const thumbStyle = isVertical
    ? {
        height: `${Math.max(10, 100 - scrollPercentage)}%`,
        y: `${scrollPercentage}%`,
      }
    : {
        width: `${Math.max(10, 100 - scrollPercentage)}%`,
        x: `${scrollPercentage}%`,
      };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={scrollRef}
        className={`h-full overflow-auto scrollbar-none ${
          smoothScroll ? "scroll-smooth" : ""
        }`}
        style={{
          maskImage: hideScrollbar
            ? "none"
            : `linear-gradient(to ${isVertical ? "right" : "bottom"}, black calc(100% - 12px), transparent)`,
          WebkitMaskImage: hideScrollbar
            ? "none"
            : `linear-gradient(to ${isVertical ? "right" : "bottom"}, black calc(100% - 12px), transparent)`,
        }}
      >
        {children}
      </div>

      {!hideScrollbar && (
        <motion.div
          className="absolute rounded-full bg-gray-200 dark:bg-gray-700"
          style={{
            ...scrollbarStyle,
            opacity: showScrollbar ? 1 : 0,
          }}
          initial={false}
          animate={{ opacity: showScrollbar ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute bg-gray-400 dark:bg-gray-500 rounded-full hover:bg-gray-500 dark:hover:bg-gray-400 transition-colors cursor-pointer"
            style={{
              ...scrollbarStyle,
              ...thumbStyle,
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            drag={isVertical ? "y" : "x"}
            dragConstraints={scrollRef}
            dragElastic={0}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
            onDrag={(_, info) => {
              const { scrollHeight, clientHeight, scrollWidth, clientWidth } =
                scrollRef.current!;
              const maxScroll = isVertical
                ? scrollHeight - clientHeight
                : scrollWidth - clientWidth;
              const delta = isVertical ? info.delta.y : info.delta.x;
              const scrollAmount = (delta / 100) * maxScroll;
              
              if (isVertical) {
                scrollRef.current!.scrollTop += scrollAmount;
              } else {
                scrollRef.current!.scrollLeft += scrollAmount;
              }
            }}
          />
        </motion.div>
      )}
    </div>
  );
}