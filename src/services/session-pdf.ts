import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { listLogEntries, type LogEntry } from "./database";

const GRID_START_HOUR = 7;
const GRID_END_HOUR = 23;
const MINUTES_PER_CELL = 10;
const REPORT_CATEGORY_CODES = new Set(["C", "A", "O", "M", "R", "P", "S", "W", "D"]);

function escapeHtml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function getGridStart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), GRID_START_HOUR, 0, 0, 0);
}

function getCellIndex(timestamp: number, gridStart: Date): number {
    return Math.floor((timestamp - gridStart.getTime()) / (MINUTES_PER_CELL * 60 * 1000));
}

function formatHour(hour: number): string {
    return `${String(hour).padStart(2, "0")}00`;
}

function formatCellCodes(codes: string[]): string {
    return codes.length ? codes.map(escapeHtml).join("<br>") : "";
}

export function injectLogEntriesIntoTimeGrid(entries: LogEntry[], reportDate: string): string {
    const gridStart = getGridStart(new Date(`${reportDate}T00:00:00`));
    const cells = Array.from({ length: (GRID_END_HOUR - GRID_START_HOUR) * 6 }, () => [] as string[]);

    entries
        .filter(
            (entry) =>
                !entry.voided && Number.isFinite(entry.timestamp) && REPORT_CATEGORY_CODES.has(entry.categoryCode),
        )
        .sort((first, second) => first.timestamp - second.timestamp)
        .forEach((entry) => {
            const cellIndex = getCellIndex(entry.timestamp, gridStart);
            if (cellIndex >= 0 && cellIndex < cells.length) cells[cellIndex].push(entry.categoryCode);
        });

    return Array.from({ length: GRID_END_HOUR - GRID_START_HOUR }, (_, hourIndex) => {
        const hour = GRID_START_HOUR + hourIndex;
        const cellsForHour = cells
            .slice(hourIndex * 6, hourIndex * 6 + 6)
            .map((codes, intervalIndex) => {
                const minuteLabel = (intervalIndex + 1) * 10;
                return `<td class="time-cell" data-time="${formatHour(hour)}-${minuteLabel}">${formatCellCodes(codes)}</td>`;
            })
            .join("");
        return `<tr><th class="hour-label">${formatHour(hour)}</th>${cellsForHour}</tr>`;
    }).join("");
}

export function createChildReportHtml(childName: string, reportDate: string, entries: LogEntry[]): string {
    const intervalHeaders = [10, 20, 30, 40, 50, 60].map((minute) => `<th>${minute}</th>`).join("");
    return `<!doctype html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
        @page { size: landscape; margin: 24px; }
        body { color: #1f2933; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        h1 { font-size: 22px; margin: 0 0 4px; }
        p { color: #52606d; margin: 0 0 18px; }
        table { border-collapse: collapse; table-layout: fixed; width: 100%; }
        th, td { border: 1px solid #9aa5b1; height: 34px; padding: 4px; text-align: center; }
        thead th { background: #e4e7eb; font-size: 11px; height: 22px; }
        .hour-label { background: #f0f4f8; font-size: 11px; width: 48px; }
        .time-cell { color: #102a43; font-size: 12px; font-weight: 600; }
    </style>
</head>
<body>
    <h1>${escapeHtml(childName)}</h1>
    <p>Session date: ${escapeHtml(reportDate)} | Time grid: 0700-2300</p>
    <table>
        <thead><tr><th>Hour</th>${intervalHeaders}</tr></thead>
        <tbody>${injectLogEntriesIntoTimeGrid(entries, reportDate)}</tbody>
    </table>
</body>
</html>`;
}

export async function exportChildPdfReport(childId: string, childName: string, reportDate: string): Promise<string> {
    const entries = await listLogEntries(childId);
    const result = await Print.printToFileAsync({
        html: createChildReportHtml(childName, reportDate, entries),
    });

    if (!(await Sharing.isAvailableAsync())) {
        throw new Error("Sharing is not available on this device.");
    }

    await Sharing.shareAsync(result.uri, {
        mimeType: "application/pdf",
        dialogTitle: `Export ${childName} report`,
        UTI: "com.adobe.pdf",
    });
    return result.uri;
}
