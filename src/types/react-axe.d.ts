declare module 'react-axe' {
  import { type ReactInstance } from 'react';
  import { type Container } from 'react-dom';

  interface AxeRule {
    id: string;
    enabled: boolean;
    [key: string]: any;
  }

  interface AxeConfig {
    rules?: AxeRule[];
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