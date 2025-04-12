// Renombra a jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1' // Opcional: alias para imports
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-fetch-mock)/)'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.vite/'
  ],
  globals: {
    fetchMock: require('jest-fetch-mock')
  }
};