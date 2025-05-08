module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/components/$1',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  collectCoverage: true,
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  coverageDirectory: 'coverage',
};