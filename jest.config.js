module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
      }
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.js$)'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
