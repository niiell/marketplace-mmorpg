"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "react-use";

interface Step {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const steps: Step[] = [
  {
    target: "[data-guide='create-listing']",
    title: "Buat Listing",
    description: "Mulai jual barang Anda dengan mudah dan aman.",
    position: "bottom"
  },
  {
    target: "[data-guide='wishlist']",
    title: "Wishlist",
    description: "Simpan item favorit Anda untuk dibeli nanti.",
    position: "left"
  },
  {
    target: "[data-guide='chat']",
    title: "Chat Real-time",
    description: "Komunikasi langsung dengan penjual untuk negosiasi.",
    position: "right"
  }
];

export default function OnboardingGuide() {
  const [hasSeenGuide, setHasSeenGuide] = useLocalStorage("has-seen-guide", false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!hasSeenGuide) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenGuide]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setHasSeenGuide(true);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setHasSeenGuide(true);
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const targetElement = document.querySelector(currentStepData.target);
  const targetRect = targetElement?.getBoundingClientRect();

  if (!targetRect) return null;

  const getTooltipPosition = () => {
    switch (currentStepData.position) {
      case "top":
        return { top: targetRect.top - 80, left: targetRect.left + targetRect.width / 2 };
      case "bottom":
        return { top: targetRect.bottom + 20, left: targetRect.left + targetRect.width / 2 };
      case "left":
        return { top: targetRect.top + targetRect.height / 2, left: targetRect.left - 280 };
      case "right":
        return { top: targetRect.top + targetRect.height / 2, left: targetRect.right + 20 };
    }
  };

  const position = getTooltipPosition();

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleSkip} />

      {/* Spotlight on target element */}
      <div
        className="fixed z-50 pointer-events-none"
        style={{
          top: targetRect.top - 4,
          left: targetRect.left - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
          borderRadius: "8px"
        }}
      />

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed z-50 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4"
        style={{
          top: position.top,
          left: position.left,
          transform: "translate(-50%, -50%)"
        }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {currentStepData.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {currentStepData.description}
        </p>
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Lewati
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? "Selesai" : "Lanjut"}
          </button>
        </div>
        <div className="mt-3 flex justify-center space-x-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-4 rounded-full ${
                index === currentStep
                  ? "bg-blue-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </>
  );
}