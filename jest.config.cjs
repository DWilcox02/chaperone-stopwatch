module.exports = {
    preset: "jest-expo",
    roots: ["<rootDir>/test"],
    testMatch: ["<rootDir>/test/**/*.component.test.tsx"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "\\.css$": "<rootDir>/jest.styleMock.js",
    },
};
