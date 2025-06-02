require('@testing-library/jest-dom');

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'dummy-anon-key';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ rates: { USD: 1, EUR: 0.85, GBP: 0.73 } }),
  })
);

// Mock location functions
const mockAssign = jest.fn();
const mockReplace = jest.fn();
const mockReload = jest.fn();

// Create a minimal location mock
const mockLocation = {
  assign: mockAssign,
  replace: mockReplace,
  reload: mockReload,
  href: 'http://localhost:3000',
  toString: () => 'http://localhost:3000',
};

// Store original location
const originalLocation = window.location;

// Set up location mock before each test
beforeEach(() => {
  // Define non-enumerable properties to avoid JSDOM issues
  Object.defineProperties(window, {
    location: {
      configurable: true,
      enumerable: true,
      value: mockLocation,
      writable: true
    }
  });
});

// Restore original location after each test
afterEach(() => {
  Object.defineProperties(window, {
    location: {
      configurable: true,
      enumerable: true,
      value: originalLocation,
      writable: true
    }
  });
  
  // Clear all mocks
  mockAssign.mockClear();
  mockReplace.mockClear();
  mockReload.mockClear();
  mockLocation.href = 'http://localhost:3000';
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
  },
  AnimatePresence: ({ children }) => children,
}));