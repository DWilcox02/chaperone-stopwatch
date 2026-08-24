import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const testState = vi.hoisted(() => ({
    entries: [] as Array<{
        id: string;
        childId: string;
        timestamp: number;
        categoryCode: "P" | "S";
        voided: boolean;
    }>,
    database: {
        getSession: vi.fn(),
        createSession: vi.fn(),
        listChildren: vi.fn(),
        createChild: vi.fn(),
        listLogEntries: vi.fn(),
        createLogEntry: vi.fn(),
        getSessionExportRows: vi.fn(),
    },
}));

vi.mock("expo-sqlite", () => ({ openDatabaseAsync: vi.fn() }));

vi.mock("@/services/service-context", () => ({
    useDatabase: () => testState.database,
}));

import { useStopwatchSession, StopwatchSessionProvider } from "./use-stopwatch-session";

function Probe({ onUpdate }: { onUpdate: (value: ReturnType<typeof useStopwatchSession>) => void }) {
    onUpdate(useStopwatchSession());
    return null;
}

async function flushEffects() {
    await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve();
        await new Promise((resolve) => setTimeout(resolve, 0));
    });
}

describe("useStopwatchSession", () => {
    beforeEach(() => {
        testState.entries = [];
        testState.database.getSession.mockResolvedValue({ id: "active-session", date: "2024-01-01", voided: false });
        testState.database.listChildren.mockResolvedValue([
            { id: "emily", sessionId: "active-session", name: "Emily", ageGroup: "9+", voided: false },
        ]);
        testState.database.listLogEntries.mockImplementation(async (childId?: string) =>
            testState.entries.filter((entry) => !childId || entry.childId === childId),
        );
        testState.database.createLogEntry.mockImplementation(async (entry) => {
            const saved = { ...entry, voided: false };
            testState.entries.push(saved);
            return saved;
        });
    });

    it("hydrates children and session date from the database", async () => {
        let current: ReturnType<typeof useStopwatchSession> | undefined;
        let renderer: ReactTestRenderer;

        await act(async () => {
            renderer = create(
                <StopwatchSessionProvider>
                    <Probe onUpdate={(value) => (current = value)} />
                </StopwatchSessionProvider>,
            );
        });
        await flushEffects();

        expect(current?.sessionDate).toBe("2024-01-01");
        expect(current?.children).toHaveLength(1);
        expect(current?.children[0].name).toBe("Emily");
        renderer!.unmount();
    });

    it("persists an activity through the injected database", async () => {
        let current: ReturnType<typeof useStopwatchSession> | undefined;
        let renderer: ReactTestRenderer;

        await act(async () => {
            renderer = create(
                <StopwatchSessionProvider>
                    <Probe onUpdate={(value) => (current = value)} />
                </StopwatchSessionProvider>,
            );
        });
        await flushEffects();

        await act(async () => {
            current!.assignChildActivity("emily", "Performance");
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(testState.database.createLogEntry).toHaveBeenCalledWith(
            expect.objectContaining({ childId: "emily", categoryCode: "P" }),
        );
        expect(current?.children[0].segments.at(-1)?.category).toBe("Performance");
        renderer!.unmount();
    });
});