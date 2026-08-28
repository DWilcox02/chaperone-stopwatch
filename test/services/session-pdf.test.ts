import { describe, expect, it, vi } from "vitest";

vi.mock("expo-print", () => ({ printToFileAsync: vi.fn() }));
vi.mock("expo-sharing", () => ({ isAvailableAsync: vi.fn(), shareAsync: vi.fn() }));
vi.mock("expo-sqlite", () => ({ openDatabaseAsync: vi.fn() }));

import { injectLogEntriesIntoTimeGrid } from "../../src/services/session-pdf";

const timestamp = (reportDate: string, hour: number, minute: number) =>
    new Date(`${reportDate}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`).getTime();

describe("session PDF time grid", () => {
    it("fills each activity through the slot before the next activity", () => {
        const reportDate = "2026-08-27";
        const grid = injectLogEntriesIntoTimeGrid(
            [
                {
                    id: "call",
                    childId: "child-1",
                    timestamp: timestamp(reportDate, 7, 25),
                    categoryCode: "C",
                    voided: false,
                },
                {
                    id: "meal",
                    childId: "child-1",
                    timestamp: timestamp(reportDate, 11, 45),
                    categoryCode: "M",
                    voided: false,
                },
                {
                    id: "wrap",
                    childId: "child-1",
                    timestamp: timestamp(reportDate, 11, 48),
                    categoryCode: "W",
                    voided: false,
                },
            ],
            reportDate,
        );

        expect(grid.match(/>C<\/td>/g)).toHaveLength(26);
        expect(grid).toContain('data-time="1100-50">M<br>W</td>');
        expect(grid).toContain('data-time="1100-40">C</td>');
    });
});
