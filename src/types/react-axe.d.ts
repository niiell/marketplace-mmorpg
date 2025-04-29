declare module 'react-axe' {
  import { type ReactInstance } from 'react';
  import { type Container } from 'react-dom';

  interface AxeConfig {
    rules?: Array<{
      id: string;
      enabled: boolean;
      [key: string]: any;
    }>;
    [key: string]: any;
  }

  function axe(
    React: any,
    ReactDOM: { findDOMNode: (instance: ReactInstance) => Container },
    timeout?: number,
    config?: AxeConfig
  ): void;

  export default axe;
}