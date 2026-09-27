import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

async function jestConfig() {
  const config = await createJestConfig(customJestConfig)();
  config.transformIgnorePatterns = [];
  return config;
}

export default jestConfig;