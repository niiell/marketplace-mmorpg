import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('react-axe').then((axe) => {
    // @ts-ignore
    axe.default(React, window, 1000);
  });
}

export default function MyApp({ Component, pageProps, router }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={router.route}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Component {...pageProps} />
      </motion.div>
    </AnimatePresence>
  );
}
