import { describe, expect, it } from "vitest";

import { formatClock, formatDuration, formatHoursMinutes, formatHoursRounded, formatTimer } from "./utils";

describe("time formatting utilities", () => {
    it("formats durations without allowing negative values", () => {
        expect(formatDuration(-1)).toBe("0m");
        expect(formatDuration(3_726_000)).toBe("1h 02m");
    });

    it("formats timer and hours displays", () => {
        expect(formatTimer(3_726_000)).toBe("1 : 2 : 6");
        expect(formatHoursMinutes(3_726_000)).toBe("01hrs 02mins");
        expect(formatHoursRounded(7_200_000)).toBe("2hrs");
    });

    it("formats a timestamp using the runtime locale", () => {
        const timestamp = new Date(2024, 0, 2, 13, 5).getTime();
        expect(formatClock(timestamp)).toBe(
            new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        );
    });
});
