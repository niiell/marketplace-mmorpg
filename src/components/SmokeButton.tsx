import React from 'react';
import { motion, Variants } from 'framer-motion';

const smokeVariants: Variants = {
  hover: {
    boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.3)',
    transition: {
      duration: 0.5,
      yoyo: Infinity,
      ease: 'easeInOut',
    },
  },
};

interface SmokeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SmokeButton: React.FC<SmokeButtonProps> = ({ children, className, ...rest }) => {
  return (
    <motion.button
      {...rest}
      variants={smokeVariants}
      whileHover="hover"
      className={`relative inline-block rounded bg-blue-600 text-white px-4 py-2 font-semibold ${className ?? ''}`}
    >
      {children}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded" />
    </motion.button>
  );
};

export default SmokeButton;
