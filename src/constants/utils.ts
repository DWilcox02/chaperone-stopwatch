function formatDuration(milliseconds: number) {
    const totalMinutes = Math.floor(Math.max(0, milliseconds) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours ? `${hours}h ${minutes.toString().padStart(2, "0")}m` : `${minutes}m`;
}

function formatTimer(milliseconds: number) {
    const totalSeconds = Math.floor(Math.max(0, milliseconds) / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    return `${hours.toString()} : ${minutes.toString()} : ${seconds}`;
}

function formatHoursMinutes(milliseconds: number) {
    const totalMinutes = Math.floor(Math.max(0, milliseconds) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}hrs ${minutes.toString().padStart(2, "0")}mins`;
}

function formatHoursRounded(milliseconds: number) {
    const totalMinutes = Math.floor(Math.max(0, milliseconds) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    return `${hours.toString().padStart(1, "0")}hrs`;
}

function formatClock(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const now = Date.now();

export { formatDuration, formatHoursMinutes, formatClock, formatHoursRounded, formatTimer, now };
