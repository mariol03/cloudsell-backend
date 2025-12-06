module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './src',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
  ],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/contexts/shared/$1',
    '^@users/(.*)$': '<rootDir>/contexts/users/$1',
    '^@items/(.*)$': '<rootDir>/contexts/items/$1',
    '^@wishlist/(.*)$': '<rootDir>/contexts/items/wishlist/$1',
    '^@contexts/(.*)$': '<rootDir>/contexts/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    },
  },
};
