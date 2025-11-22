export function daysBetween(startISO, endISO) {
    const DAY_MS = 1000 * 60 * 60 * 24;
    const start = new Date(startISO);
    const end = new Date(endISO);
    if (isNaN(start) || isNaN(end)) return NaN;
    const ms = end - start;
    return Math.floor(ms / DAY_MS);
}