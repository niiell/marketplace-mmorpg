"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold text-white"
          >
            <span className="block">Marketplace MMORPG</span>
            <span className="block mt-2 text-blue-400">Asia Tenggara</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-lg mx-auto text-xl text-blue-100 sm:max-w-3xl"
          >
            Jual beli item, gold, dan jasa game MMORPG teraman & terpercaya di
            Asia Tenggara. Transaksi mudah, chat real-time, dan sistem escrow.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex justify-center gap-4"
          >
            <motion.a
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Daftar Sekarang
            </motion.a>
            <motion.a
              href="/marketplace"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Lihat Marketplace
            </motion.a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={containerVariants}
            className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-3"
          >
            {(
              [
                { number: "10K+", label: "Transaksi Sukses" },
                { number: "5K+", label: "Pengguna Aktif" },
                { number: "99%", label: "Rating Positif" },
              ] as const
            ).map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <p className="text-3xl font-bold text-white">{stat.number}</p>
                <p className="mt-1 text-blue-300">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}