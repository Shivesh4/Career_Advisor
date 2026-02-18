import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  coverageProvider: "v8",

  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.[jt]s"],

  transform: {}, // native ESM (no transpile)

  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/**/index.{js,ts}",
    "!src/**/__mocks__/**",
  ],

  // Leave out extensionsToTreatAsEsm; Jest infers from package.json ("type": "module")

  verbose: true,

  // ✅ Add this to automatically close lingering handles (for ESM/vm-modules)
  forceExit: true,
};

export default config;
