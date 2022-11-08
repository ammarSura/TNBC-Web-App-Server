/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: [ "**/tests/test.*.+(ts|tsx|js)"],
  preset: 'ts-jest',
  testEnvironment: 'node',
};