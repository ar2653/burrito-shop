module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
    collectCoverage: true,
    collectCoverageFrom: ['routes/*.js', 'utils/*.js', '*.js', '!*.config.js'],
  };