module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/src/**/*.test.ts"],
  extensionsToTreatAsEsm: [".ts"],
  setupFiles: ["<rootDir>/src/tests/setup-env.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        isolatedModules: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },
};
