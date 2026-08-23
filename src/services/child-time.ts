import { listLogEntries, type LogEntry } from "./database";

export type ChildAgeGroup = "0-4" | "5-8" | "9+";

export type ChildTimeCalculation = {
    childId: string;
    ageGroup: ChildAgeGroup;
    totalMilliseconds: number;
    totalHours: number;
    totalHoursLimit: number;
    totalHoursWarning: boolean;
    longestContinuousPerformanceMilliseconds: number;
    longestContinuousPerformanceHours: number;
    continuousPerformanceLimitHours: number;
    continuousPerformanceWarning: boolean;
};

const REGULATION_LIMITS: Record<ChildAgeGroup, { totalHours: number; continuousPerformanceHours: number }> = {
    "0-4": { totalHours: 5, continuousPerformanceHours: 0.5 },
    "5-8": { totalHours: 8, continuousPerformanceHours: 2.5 },
    "9+": { totalHours: 9.5, continuousPerformanceHours: 2.5 },
};

function getAgeGroup(ageGroup: string): ChildAgeGroup {
    const normalized = ageGroup.trim().toLowerCase();
    if (normalized === "0-4" || normalized === "0 to 4" || normalized === "0–4") return "0-4";
    if (normalized === "5-8" || normalized === "5 to 8" || normalized === "5–8") return "5-8";
    if (normalized === "9+" || normalized === "9 or over" || normalized === "9 and over") return "9+";
    throw new Error(`Unsupported child age group: ${ageGroup}`);
}

function getEntryEndTime(entry: LogEntry, nextEntry: LogEntry | undefined, now: number): number {
    return Math.max(entry.timestamp, nextEntry?.timestamp ?? now);
}

export function calculateChildTime(
    childId: string,
    ageGroup: string,
    entries: LogEntry[],
    now = Date.now(),
): ChildTimeCalculation {
    const normalizedAgeGroup = getAgeGroup(ageGroup);
    const limits = REGULATION_LIMITS[normalizedAgeGroup];
    const childEntries = entries
        .filter((entry) => entry.childId === childId && !entry.voided && Number.isFinite(entry.timestamp))
        .sort((first, second) => first.timestamp - second.timestamp);

    let totalMilliseconds = 0;
    let longestContinuousPerformanceMilliseconds = 0;
    let continuousPerformanceMilliseconds = 0;

    childEntries.forEach((entry, index) => {
        const nextEntry = childEntries[index + 1];
        const duration = Math.max(0, getEntryEndTime(entry, nextEntry, now) - entry.timestamp);
        totalMilliseconds += duration;

        if (entry.categoryCode === "P") {
            continuousPerformanceMilliseconds += duration;
            longestContinuousPerformanceMilliseconds = Math.max(
                longestContinuousPerformanceMilliseconds,
                continuousPerformanceMilliseconds,
            );
        } else {
            continuousPerformanceMilliseconds = 0;
        }
    });

    return {
        childId,
        ageGroup: normalizedAgeGroup,
        totalMilliseconds,
        totalHours: totalMilliseconds / 3_600_000,
        totalHoursLimit: limits.totalHours,
        totalHoursWarning: totalMilliseconds > limits.totalHours * 3_600_000,
        longestContinuousPerformanceMilliseconds,
        longestContinuousPerformanceHours: longestContinuousPerformanceMilliseconds / 3_600_000,
        continuousPerformanceLimitHours: limits.continuousPerformanceHours,
        continuousPerformanceWarning:
            longestContinuousPerformanceMilliseconds > limits.continuousPerformanceHours * 3_600_000,
    };
}

export async function getChildTime(childId: string, ageGroup: string, now = Date.now()): Promise<ChildTimeCalculation> {
    const entries = await listLogEntries(childId);
    return calculateChildTime(childId, ageGroup, entries, now);
}
