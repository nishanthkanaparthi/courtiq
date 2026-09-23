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
  config.transformIgnorePatterns = ['/node_modules/(?!@prisma/client)'];
  return config;
}

export default jestConfig;