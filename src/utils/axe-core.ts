import React from 'react';
import ReactDOM from 'react-dom/client';

export function initializeAxe() {
  if (process.env.NODE_ENV !== 'production') {
    import('react-axe').then(axe => {
      axe.default(React, ReactDOM as any, 1000, {
        rules: [
          {
            id: 'skip-link',
            enabled: true
          },
          {
            id: 'color-contrast',
            enabled: true
          }
        ]
      });
    });
  }
}
