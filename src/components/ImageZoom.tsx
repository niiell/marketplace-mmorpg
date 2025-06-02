"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ImageZoomProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  quality?: number;
}

export default function ImageZoom({
  src,
  alt,
  width,
  height,
  className = "",
  quality = 85,
}: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) {
        setIsZoomed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  const handleZoomIn = () => {
    setIsZoomed(true);
    setScale(2);
    document.body.style.overflow = "hidden";
  };

  const handleZoomOut = () => {
    setIsZoomed(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = "";
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isZoomed) return;

    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(scale + delta, 1), 4);
    setScale(newScale);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isZoomed || !isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const deltaX = (mouseX - centerX) * 0.1;
    const deltaY = (mouseY - centerY) * 0.1;

    setPosition({
      x: position.x + deltaX,
      y: position.y + deltaY,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden rounded-lg ${className}`}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{
          scale: isZoomed ? scale : 1,
          x: isZoomed ? position.x : 0,
          y: isZoomed ? position.y : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        style={{ x, y }}
        drag={isZoomed}
        dragConstraints={containerRef}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            isDragging ? "cursor-grabbing" : isZoomed ? "cursor-grab" : "cursor-zoom-in"
          }`}
          onClick={() => (isZoomed ? handleZoomOut() : handleZoomIn())}
        />
      </motion.div>

      {/* Zoom controls */}
      <AnimatePresence>
        {!isZoomed && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-black/70"
            onClick={handleZoomIn}
            aria-label="Zoom in"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
          </motion.button>
        )}

        {isZoomed && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm transition-opacity hover:bg-black/70"
            onClick={handleZoomOut}
            aria-label="Close zoom"
          >
            <XMarkIcon className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Zoom level indicator */}
      {isZoomed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm"
        >
          {Math.round(scale * 100)}%
        </motion.div>
      )}

      {/* Zoom instructions */}
      <AnimatePresence>
        {!isZoomed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <div className="rounded-full bg-black/50 px-3 py-1.5 text-sm backdrop-blur-sm">
              Click to zoom
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}