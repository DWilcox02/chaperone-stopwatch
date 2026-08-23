import * as SQLite from "expo-sqlite";

export const CATEGORY_CODES = ["P", "Rh", "S", "R", "C", "M", "T", "Cs", "HMU", "Tt", "W", "O", "A", "D"] as const;

export type CategoryCode = (typeof CATEGORY_CODES)[number];

export const CATEGORY_LABELS: Record<CategoryCode, string> = {
    P: "Performance",
    Rh: "Rehearsal",
    S: "Standby",
    R: "Rest",
    C: "Call Time",
    M: "Meal",
    T: "Travel",
    Cs: "Costume",
    HMU: "Hair and Makeup",
    Tt: "Tutoring",
    W: "Wrap",
    O: "Other",
    A: "Arrive",
    D: "Departure",
};

export type Session = { id: string; date: string; voided: boolean };
export type Child = { id: string; sessionId: string; name: string; ageGroup: string; voided: boolean };
export type LogEntry = {
    id: string;
    childId: string;
    timestamp: number;
    categoryCode: CategoryCode;
    voided: boolean;
};

type SessionRow = { id: string; date: string; voided: number };
type ChildRow = { id: string; session_id: string; name: string; age_group: string; voided: number };
type LogEntryRow = { id: string; child_id: string; timestamp: string; category_code: CategoryCode; voided: number };

const databaseName = "chaperone-stopwatch.db";
const categorySqlValues = CATEGORY_CODES.map((code) => `'${code}'`).join(", ");
let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

function toSession(row: SessionRow): Session {
    return { ...row, voided: row.voided === 1 };
}

function toChild(row: ChildRow): Child {
    return {
        id: row.id,
        sessionId: row.session_id,
        name: row.name,
        ageGroup: row.age_group,
        voided: row.voided === 1,
    };
}

function toLogEntry(row: LogEntryRow): LogEntry {
    return {
        id: row.id,
        childId: row.child_id,
        timestamp: Date.parse(row.timestamp),
        categoryCode: row.category_code,
        voided: row.voided === 1,
    };
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!databasePromise) databasePromise = initializeDatabase();
    return databasePromise;
}

async function initializeDatabase(): Promise<SQLite.SQLiteDatabase> {
    const database = await SQLite.openDatabaseAsync(databaseName);
    await database.execAsync(`
        PRAGMA foreign_keys = ON;
        CREATE TABLE IF NOT EXISTS Sessions (
            id TEXT PRIMARY KEY NOT NULL,
            date TEXT NOT NULL,
            voided INTEGER NOT NULL DEFAULT 0 CHECK (voided IN (0, 1))
        );
        CREATE TABLE IF NOT EXISTS Children (
            id TEXT PRIMARY KEY NOT NULL,
            session_id TEXT NOT NULL,
            name TEXT NOT NULL,
            age_group TEXT NOT NULL,
            voided INTEGER NOT NULL DEFAULT 0 CHECK (voided IN (0, 1)),
            FOREIGN KEY (session_id) REFERENCES Sessions(id)
        );
        CREATE TABLE IF NOT EXISTS LogEntries (
            id TEXT PRIMARY KEY NOT NULL,
            child_id TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            category_code TEXT NOT NULL CHECK (category_code IN (${categorySqlValues})),
            voided INTEGER NOT NULL DEFAULT 0 CHECK (voided IN (0, 1)),
            FOREIGN KEY (child_id) REFERENCES Children(id)
        );
        CREATE INDEX IF NOT EXISTS idx_children_session_id ON Children(session_id);
        CREATE INDEX IF NOT EXISTS idx_log_entries_child_id ON LogEntries(child_id);
        CREATE INDEX IF NOT EXISTS idx_log_entries_timestamp ON LogEntries(timestamp);
    `);
    return database;
}

export async function createSession(session: Omit<Session, "voided">): Promise<Session> {
    const database = await getDatabase();
    await database.runAsync("INSERT INTO Sessions (id, date) VALUES (?, ?)", session.id, session.date);
    return (await getSession(session.id)) as Session;
}

export async function getSession(id: string, includeVoided = false): Promise<Session | null> {
    const database = await getDatabase();
    const row = await database.getFirstAsync<SessionRow>(
        `SELECT id, date, voided FROM Sessions WHERE id = ?${includeVoided ? "" : " AND voided = 0"}`,
        id,
    );
    return row ? toSession(row) : null;
}

export async function listSessions(includeVoided = false): Promise<Session[]> {
    const database = await getDatabase();
    const rows = await database.getAllAsync<SessionRow>(
        `SELECT id, date, voided FROM Sessions${includeVoided ? "" : " WHERE voided = 0"} ORDER BY date DESC`,
    );
    return rows.map(toSession);
}

export async function updateSession(id: string, date: string): Promise<Session | null> {
    const database = await getDatabase();
    await database.runAsync("UPDATE Sessions SET date = ? WHERE id = ? AND voided = 0", date, id);
    return getSession(id);
}

export async function voidSession(id: string): Promise<void> {
    const database = await getDatabase();
    await database.withTransactionAsync(async () => {
        await database.runAsync("UPDATE Sessions SET voided = 1 WHERE id = ?", id);
        await database.runAsync("UPDATE Children SET voided = 1 WHERE session_id = ?", id);
        await database.runAsync(
            "UPDATE LogEntries SET voided = 1 WHERE child_id IN (SELECT id FROM Children WHERE session_id = ?)",
            id,
        );
    });
}

export const deleteSession = voidSession;

export async function createChild(child: Omit<Child, "voided">): Promise<Child> {
    const database = await getDatabase();
    await database.runAsync(
        "INSERT INTO Children (id, session_id, name, age_group) VALUES (?, ?, ?, ?)",
        child.id,
        child.sessionId,
        child.name,
        child.ageGroup,
    );
    return (await getChild(child.id)) as Child;
}

export async function getChild(id: string, includeVoided = false): Promise<Child | null> {
    const database = await getDatabase();
    const row = await database.getFirstAsync<ChildRow>(
        `SELECT id, session_id, name, age_group, voided FROM Children WHERE id = ?${includeVoided ? "" : " AND voided = 0"}`,
        id,
    );
    return row ? toChild(row) : null;
}

export async function listChildren(sessionId?: string, includeVoided = false): Promise<Child[]> {
    const database = await getDatabase();
    const conditions = [sessionId ? "session_id = ?" : "1 = 1"];
    if (!includeVoided) conditions.push("voided = 0");
    const rows = await database.getAllAsync<ChildRow>(
        `SELECT id, session_id, name, age_group, voided FROM Children WHERE ${conditions.join(" AND ")} ORDER BY name`,
        ...(sessionId ? [sessionId] : []),
    );
    return rows.map(toChild);
}

export async function updateChild(
    id: string,
    changes: Partial<Pick<Child, "name" | "ageGroup" | "sessionId">>,
): Promise<Child | null> {
    const database = await getDatabase();
    const columnNames: Record<string, string> = { sessionId: "session_id", ageGroup: "age_group", name: "name" };
    const fields = Object.entries(changes).filter(([, value]) => value !== undefined);
    if (fields.length) {
        await database.runAsync(
            `UPDATE Children SET ${fields.map(([field]) => `${columnNames[field]} = ?`).join(", ")} WHERE id = ? AND voided = 0`,
            ...fields.map(([, value]) => value as string),
            id,
        );
    }
    return getChild(id);
}

export async function voidChild(id: string): Promise<void> {
    const database = await getDatabase();
    await database.withTransactionAsync(async () => {
        await database.runAsync("UPDATE Children SET voided = 1 WHERE id = ?", id);
        await database.runAsync("UPDATE LogEntries SET voided = 1 WHERE child_id = ?", id);
    });
}

export const deleteChild = voidChild;

export async function createLogEntry(entry: Omit<LogEntry, "voided">): Promise<LogEntry> {
    const database = await getDatabase();
    await database.runAsync(
        "INSERT INTO LogEntries (id, child_id, timestamp, category_code) VALUES (?, ?, ?, ?)",
        entry.id,
        entry.childId,
        new Date(entry.timestamp).toISOString(),
        entry.categoryCode,
    );
    return (await getLogEntry(entry.id)) as LogEntry;
}

export async function getLogEntry(id: string, includeVoided = false): Promise<LogEntry | null> {
    const database = await getDatabase();
    const row = await database.getFirstAsync<LogEntryRow>(
        `SELECT id, child_id, timestamp, category_code, voided FROM LogEntries WHERE id = ?${includeVoided ? "" : " AND voided = 0"}`,
        id,
    );
    return row ? toLogEntry(row) : null;
}

export async function listLogEntries(childId?: string, includeVoided = false): Promise<LogEntry[]> {
    const database = await getDatabase();
    const conditions = [childId ? "child_id = ?" : "1 = 1"];
    if (!includeVoided) conditions.push("voided = 0");
    const rows = await database.getAllAsync<LogEntryRow>(
        `SELECT id, child_id, timestamp, category_code, voided FROM LogEntries WHERE ${conditions.join(" AND ")} ORDER BY timestamp`,
        ...(childId ? [childId] : []),
    );
    return rows.map(toLogEntry);
}

export async function updateLogEntry(
    id: string,
    changes: Partial<Pick<LogEntry, "childId" | "timestamp" | "categoryCode">>,
): Promise<LogEntry | null> {
    const database = await getDatabase();
    const values: Record<string, string> = {};
    if (changes.childId !== undefined) values.child_id = changes.childId;
    if (changes.timestamp !== undefined) values.timestamp = new Date(changes.timestamp).toISOString();
    if (changes.categoryCode !== undefined) values.category_code = changes.categoryCode;
    const fields = Object.entries(values);
    if (fields.length) {
        await database.runAsync(
            `UPDATE LogEntries SET ${fields.map(([field]) => `${field} = ?`).join(", ")} WHERE id = ? AND voided = 0`,
            ...fields.map(([, value]) => value),
            id,
        );
    }
    return getLogEntry(id);
}

export async function voidLogEntry(id: string): Promise<void> {
    const database = await getDatabase();
    await database.runAsync("UPDATE LogEntries SET voided = 1 WHERE id = ?", id);
}

export const deleteLogEntry = voidLogEntry;

export type SessionExportRow = {
    artisteName: string;
    swf: string | null;
    pUp: string | null;
    call: string | null;
    arrive: string | null;
    onSet: string | null;
    overtime: string | null;
    wrap: string | null;
    depart: string | null;
};

type SessionExportRowRecord = {
    artiste_name: string;
    SWF: string | null;
    "P/Up": string | null;
    Call: string | null;
    Arrive: string | null;
    "On Set": string | null;
    Overtime: string | null;
    Wrap: string | null;
    Depart: string | null;
};

export async function getSessionExportRows(date: string): Promise<SessionExportRow[]> {
    const database = await getDatabase();
    const rows = await database.getAllAsync<SessionExportRowRecord>(
        `
            SELECT
                c.name AS artiste_name,
                NULL AS "SWF",
                NULL AS "P/Up",
                MIN(CASE WHEN le.category_code = 'C' THEN le.timestamp END) AS "Call",
                MIN(CASE WHEN le.category_code = 'A' THEN le.timestamp END) AS "Arrive",
                MIN(CASE WHEN le.category_code = 'P' THEN le.timestamp END) AS "On Set",
                NULL AS "Overtime",
                MIN(CASE WHEN le.category_code = 'W' THEN le.timestamp END) AS "Wrap",
                MIN(CASE WHEN le.category_code = 'D' THEN le.timestamp END) AS "Depart"
            FROM Sessions s
            INNER JOIN Children c ON c.session_id = s.id
            LEFT JOIN LogEntries le ON le.child_id = c.id AND le.voided = 0
            WHERE s.date = ? AND s.voided = 0 AND c.voided = 0
            GROUP BY c.id, c.name
            ORDER BY c.name
        `,
        date,
    );
    return rows.map((row) => ({
        artisteName: row.artiste_name,
        swf: row.SWF,
        pUp: row["P/Up"],
        call: row.Call,
        arrive: row.Arrive,
        onSet: row["On Set"],
        overtime: row.Overtime,
        wrap: row.Wrap,
        depart: row.Depart,
    }));
}

export async function getCategoryTotals(childId?: string): Promise<Record<CategoryCode, number>> {
    const database = await getDatabase();
    const rows = await database.getAllAsync<{ category_code: CategoryCode; total: number }>(
        `SELECT category_code, COUNT(*) AS total FROM LogEntries WHERE voided = 0${childId ? " AND child_id = ?" : ""} GROUP BY category_code`,
        ...(childId ? [childId] : []),
    );
    return rows.reduce<Record<CategoryCode, number>>(
        (totals, row) => ({ ...totals, [row.category_code]: row.total }),
        Object.fromEntries(CATEGORY_CODES.map((code) => [code, 0])) as Record<CategoryCode, number>,
    );
}
