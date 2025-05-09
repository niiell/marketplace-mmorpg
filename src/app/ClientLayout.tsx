"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key="client-layout"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}