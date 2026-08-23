import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { getSessionExportRows, type SessionExportRow } from "./database";

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

export function sessionRowsToCsv(rows: SessionExportRow[]): string {
    return [SESSION_EXPORT_HEADERS.join(","), ...rows.map(formatRow)].join("\n");
}

export async function exportSessionCsv(date: string): Promise<string> {
    const rows = await getSessionExportRows(date);
    const file = new File(Paths.cache, `session-${date}.csv`);
    file.write(sessionRowsToCsv(rows));

    if (!(await Sharing.isAvailableAsync())) {
        throw new Error("Sharing is not available on this device.");
    }

    await Sharing.shareAsync(file.uri, {
        mimeType: "text/csv",
        dialogTitle: `Export session ${date}`,
        UTI: "public.comma-separated-values-text",
    });
    return file.uri;
}
