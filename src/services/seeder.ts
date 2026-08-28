import { useDatabase } from "@/services/service-context";

export function useDatabaseSeeder() {
    const database = useDatabase();

    const seedTestScenario = async (childId: string, reportDateStr: string) => {
        const baseDate = new Date(`${reportDateStr}T00:00:00`);
        const sessionId = "active-session";
        const existingSession = await database.getSession(sessionId, true);
        if (!existingSession) {
            await database.createSession({ id: sessionId, date: reportDateStr });
        } else {
            await database.updateSession(sessionId, reportDateStr);
        }

        await database.clearChildData(childId);
        await database.createChild({ id: childId, sessionId, name: childId, ageGroup: "9+" });

        // Define the timestamps for the mock data
        const timestamps = [
            [new Date(baseDate).setHours(7, 25), "C"],
            [new Date(baseDate).setHours(11, 45), "M"],
            [new Date(baseDate).setHours(11, 48), "W"],
        ] as const;

        for (const [timestamp, categoryCode] of timestamps) {
            await database.createLogEntry({
                id: `seed-${childId}-${timestamp}`,
                childId,
                timestamp,
                categoryCode,
            });
        }

        console.log(`Successfully seeded database for child ${childId} on ${reportDateStr}`);
    };

    return { seedTestScenario };
}
