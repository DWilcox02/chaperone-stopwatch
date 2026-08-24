import { act, fireEvent, render } from "@testing-library/react-native";
import { describe, expect, it, jest } from "@jest/globals";

import ChildScreen from "./child";
import LogScreen from "./log";
import { DatabaseProvider } from "@/services/service-context";
import type { Child, LogEntry, Session, SessionExportRow } from "@/services/database";
import type { DatabaseAdapter } from "@/services/database";
import { ExportServicesProvider } from "@/services/service-context";
import { StopwatchSessionProvider } from "@/hooks/use-stopwatch-session";

const databaseMocks = {
    getSession: jest.fn<DatabaseAdapter["getSession"]>().mockResolvedValue({ id: "active-session", date: "2024-01-01", voided: false } satisfies Session),
    createSession: jest.fn<DatabaseAdapter["createSession"]>(),
    listChildren: jest.fn<DatabaseAdapter["listChildren"]>().mockResolvedValue([
        { id: "child-1", sessionId: "active-session", name: "Ava", ageGroup: "9+", voided: false },
    ] satisfies Child[]),
    createChild: jest.fn<DatabaseAdapter["createChild"]>(),
    listLogEntries: jest.fn<DatabaseAdapter["listLogEntries"]>(),
    createLogEntry: jest.fn<DatabaseAdapter["createLogEntry"]>(),
    getSessionExportRows: jest.fn<DatabaseAdapter["getSessionExportRows"]>().mockResolvedValue([] satisfies SessionExportRow[]),
};
const database = databaseMocks as unknown as DatabaseAdapter;

describe("screen data integration", () => {
    it("shares database-backed session state between child and log screens", async () => {
        const entries: LogEntry[] = [];
        databaseMocks.listLogEntries.mockImplementation(async (childId) => entries.filter((entry) => !childId || entry.childId === childId));
        databaseMocks.createLogEntry.mockImplementation(async (entry) => {
            const saved = { ...entry, voided: false };
            entries.push(saved);
            return saved;
        });
        const view = await render(
            <DatabaseProvider adapter={database}>
                <ExportServicesProvider>
                    <StopwatchSessionProvider>
                        <ChildScreen />
                        <LogScreen />
                    </StopwatchSessionProvider>
                </ExportServicesProvider>
            </DatabaseProvider>,
        );
        await act(async () => {
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(view.getByText("Ava")).toBeOnTheScreen();
        await fireEvent.press(view.getAllByText("Performance")[0]);
        await act(async () => {
            await Promise.resolve();
            await Promise.resolve();
        });

        expect(database.createLogEntry).toHaveBeenCalledWith(expect.objectContaining({ childId: "child-1", categoryCode: "P" }));
        expect(view.getByText("Ava / Performance")).toBeOnTheScreen();
    });
});