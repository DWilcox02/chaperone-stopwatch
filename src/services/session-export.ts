import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { getSessionExportRows, type SessionExportRow } from "./database";
import type { DatabaseAdapter } from "./database";

export const SESSION_EXPORT_HEADERS = [
    "Artiste name",
    "SWF",
    "P/Up",
    "Call",
    "Arrive",
    "On Set",
    "Overtime",
    "Wrap",
    "Depart",
] as const;

function csvCell(value: string | null): string {
    const cell = value ?? "-";
    return `"${cell.replaceAll('"', '""')}"`;
}

function formatRow(row: SessionExportRow): string {
    return [row.artisteName, row.swf, row.pUp, row.call, row.arrive, row.onSet, row.overtime, row.wrap, row.depart]
        .map(csvCell)
        .join(",");
}

export type SessionExportFileAdapter = {
    writeCacheFile: (name: string, contents: string) => string | Promise<string>;
};

export type SessionExportSharingAdapter = {
    isAvailable: () => Promise<boolean>;
    share: (uri: string, date: string) => Promise<void>;
};

export type SessionExportService = {
    export: (date: string) => Promise<string>;
};

const expoFileAdapter: SessionExportFileAdapter = {
    writeCacheFile: (name, contents) => {
        const file = new File(Paths.cache, name);
        file.write(contents);
        return file.uri;
    },
};

const expoSharingAdapter: SessionExportSharingAdapter = {
    isAvailable: () => Sharing.isAvailableAsync(),
    share: (uri, date) =>
        Sharing.shareAsync(uri, {
            mimeType: "text/csv",
            dialogTitle: `Export session ${date}`,
            UTI: "public.comma-separated-values-text",
        }).then(() => undefined),
};

export function createSessionExportService({
    database,
    file = expoFileAdapter,
    sharing = expoSharingAdapter,
}: {
    database: Pick<DatabaseAdapter, "getSessionExportRows">;
    file?: SessionExportFileAdapter;
    sharing?: SessionExportSharingAdapter;
}): SessionExportService {
    return {
        async export(date) {
            const rows = await database.getSessionExportRows(date);
            const uri = await file.writeCacheFile(`session-${date}.csv`, sessionRowsToCsv(rows));
            if (!(await sharing.isAvailable())) throw new Error("Sharing is not available on this device.");
            await sharing.share(uri, date);
            return uri;
        },
    };
}

export function sessionRowsToCsv(rows: SessionExportRow[]): string {
    return [SESSION_EXPORT_HEADERS.join(","), ...rows.map(formatRow)].join("\n");
}

export async function exportSessionCsv(date: string): Promise<string> {
    return createSessionExportService({ database: { getSessionExportRows } }).export(date);
}
