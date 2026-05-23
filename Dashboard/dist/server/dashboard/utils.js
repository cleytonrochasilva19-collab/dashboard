import fs from "node:fs/promises";
export async function fetchJson(url, init) {
    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(`Request failed with ${response.status} for ${url}`);
    }
    return (await response.json());
}
export async function fetchText(url, init) {
    const response = await fetch(url, init);
    if (!response.ok) {
        throw new Error(`Request failed with ${response.status} for ${url}`);
    }
    return response.text();
}
export async function readJsonFile(filePath, fallback) {
    try {
        const raw = await fs.readFile(filePath, "utf8");
        return JSON.parse(raw);
    }
    catch {
        return fallback;
    }
}
export async function writeJsonFile(filePath, value) {
    await fs.mkdir(new URL(".", `file://${filePath}`), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}
export function envelope(status, source, data, note) {
    return {
        status,
        source,
        updatedAt: new Date().toISOString(),
        note,
        data
    };
}
export function fallbackEnvelope(source, data, note, status = "placeholder") {
    return {
        status,
        source,
        updatedAt: null,
        note,
        data
    };
}
export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
export function startOfUtcDay(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
