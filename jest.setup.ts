import { jest } from "@jest/globals";

jest.mock("expo-symbols", () => ({
    SymbolView: () => null,
}));

jest.mock("expo-sqlite", () => ({
    openDatabaseAsync: jest.fn(),
}));
