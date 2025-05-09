const isProduction = process.env.NODE_ENV === 'production';

const log = (...args: any[]) => {
  if (!isProduction) {
    console.log(...args);
  }
};

const error = (...args: any[]) => {
  if (!isProduction) {
    console.error(...args);
  }
};

const warn = (...args: any[]) => {
  if (!isProduction) {
    console.warn(...args);
  }
};

export const logger = {
  log,
  error,
  warn,
};
