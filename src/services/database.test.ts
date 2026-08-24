import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    database: {
        execAsync: vi.fn(),
        runAsync: vi.fn(),
        getFirstAsync: vi.fn(),
        getAllAsync: vi.fn(),
        withTransactionAsync: vi.fn(async (callback: () => Promise<void>) => callback()),
    },
    openDatabaseAsync: vi.fn(),
}));

vi.mock("expo-sqlite", () => ({ openDatabaseAsync: mocks.openDatabaseAsync }));

import { createLogEntry, getDatabase, listChildren, listLogEntries } from "./database";

describe("database adapter", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mocks.openDatabaseAsync.mockResolvedValue(mocks.database);
        mocks.database.getAllAsync.mockResolvedValue([]);
        mocks.database.getFirstAsync.mockResolvedValue(null);
    });

    it("initializes SQLite once and maps child rows", async () => {
        const database = await getDatabase();
        expect(database).toBe(mocks.database);
        expect(mocks.openDatabaseAsync).toHaveBeenCalledWith("chaperone-stopwatch.db");
        expect(mocks.database.execAsync).toHaveBeenCalledOnce();

        mocks.database.getAllAsync.mockResolvedValue([
            { id: "child-1", session_id: "session-1", name: "Ava", age_group: "9+", voided: 0 },
        ]);
        await expect(listChildren("session-1")).resolves.toEqual([
            { id: "child-1", sessionId: "session-1", name: "Ava", ageGroup: "9+", voided: false },
        ]);
    });

    it("maps log rows, converts timestamps, and filters by child", async () => {
        mocks.database.getAllAsync.mockResolvedValue([
            { id: "log-1", child_id: "child-1", timestamp: "2024-01-01T10:00:00.000Z", category_code: "P", voided: 0 },
        ]);

        await expect(listLogEntries("child-1")).resolves.toEqual([
            {
                id: "log-1",
                childId: "child-1",
                timestamp: Date.parse("2024-01-01T10:00:00.000Z"),
                categoryCode: "P",
                voided: false,
            },
        ]);
        expect(mocks.database.getAllAsync).toHaveBeenLastCalledWith(expect.stringContaining("child_id = ?"), "child-1");
    });

    it("persists a log entry as an ISO timestamp and returns the mapped row", async () => {
        mocks.database.getFirstAsync.mockResolvedValue({
            id: "log-1",
            child_id: "child-1",
            timestamp: "2024-01-01T10:00:00.000Z",
            category_code: "P",
            voided: 0,
        });

        await createLogEntry({
            id: "log-1",
            childId: "child-1",
            timestamp: Date.parse("2024-01-01T10:00:00.000Z"),
            categoryCode: "P",
        });
        expect(mocks.database.runAsync).toHaveBeenCalledWith(
            expect.stringContaining("INSERT INTO LogEntries"),
            "log-1",
            "child-1",
            "2024-01-01T10:00:00.000Z",
            "P",
        );
    });
});
