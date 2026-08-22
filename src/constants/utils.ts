function formatDuration(milliseconds: number) {
    const totalMinutes = Math.floor(Math.max(0, milliseconds) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours ? `${hours}h ${minutes.toString().padStart(2, "0")}m` : `${minutes}m`;
}

function formatClock(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const now = Date.now();

export { formatDuration, formatClock, now };
