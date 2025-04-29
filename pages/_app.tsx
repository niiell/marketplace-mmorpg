import React from 'react';

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('react-axe').then((axe) => {
    // @ts-ignore
    axe.default(React, window, 1000);
  });
}

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
