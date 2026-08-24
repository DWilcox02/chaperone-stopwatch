import { describe, expect, it, vi } from "vitest";

vi.mock("expo-sqlite", () => ({ openDatabaseAsync: vi.fn() }));

import { calculateChildTime, getChildTime } from "../../src/services/child-time";
import type { LogEntry } from "../../src/services/database";

const entry = (
    id: string,
    timestamp: number,
    categoryCode: LogEntry["categoryCode"],
    childId = "child-1",
): LogEntry => ({
    id,
    childId,
    timestamp,
    categoryCode,
    voided: false,
});

describe("child time", () => {
    it("sorts entries, ignores other children and voided entries, and calculates continuous performance", () => {
        const result = calculateChildTime(
            "child-1",
            "9 or over",
            [
                entry("rest", 3_600_000, "R"),
                entry("performance-2", 7_200_000, "P"),
                entry("other-child", 0, "P", "child-2"),
                { ...entry("voided", 0, "P"), voided: true },
                entry("performance-1", 0, "P"),
            ],
            10_800_000,
        );

        expect(result.ageGroup).toBe("9+");
        expect(result.totalMilliseconds).toBe(10_800_000);
        expect(result.longestContinuousPerformanceMilliseconds).toBe(3_600_000);
        expect(result.totalHoursLimit).toBe(9.5);
        expect(result.continuousPerformanceWarning).toBe(false);
    });

    it("warns when continuous performance exceeds the age-group limit", () => {
        const result = calculateChildTime("child-1", "0 to 4", [entry("performance", 0, "P")], 31 * 60 * 1000);

        expect(result.continuousPerformanceWarning).toBe(true);
        expect(result.totalHoursWarning).toBe(false);
    });

    it("rejects unsupported age groups", () => {
        expect(() => calculateChildTime("child-1", "adult", [])).toThrow("Unsupported child age group: adult");
    });

    it("loads entries through the injected database adapter", async () => {
        const listLogEntries = vi.fn().mockResolvedValue([entry("one", 0, "R")]);
        const result = await getChildTime("child-1", "0-4", 60_000, { listLogEntries });

        expect(listLogEntries).toHaveBeenCalledWith("child-1");
        expect(result.totalMilliseconds).toBe(60_000);
    });
});
