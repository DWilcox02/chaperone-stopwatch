module.exports = {
    preset: "jest-expo",
    testMatch: ["<rootDir>/src/**/*.component.test.tsx"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "\\.css$": "<rootDir>/jest.styleMock.js",
    },
};
