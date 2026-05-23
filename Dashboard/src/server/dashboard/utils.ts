import fs from "node:fs/promises";
import type { WidgetEnvelope, WidgetStatus } from "./types.js";

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status} for ${url}`);
  }
  return (await response.json()) as T;
}

export async function fetchText(url: string, init?: RequestInit): Promise<string> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status} for ${url}`);
  }
  return response.text();
}

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await fs.mkdir(new URL(".", `file://${filePath}`), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

export function envelope<T>(
  status: WidgetStatus,
  source: string,
  data: T,
  note?: string
): WidgetEnvelope<T> {
  return {
    status,
    source,
    updatedAt: new Date().toISOString(),
    note,
    data
  };
}

export function fallbackEnvelope<T>(
  source: string,
  data: T,
  note: string,
  status: WidgetStatus = "placeholder"
): WidgetEnvelope<T> {
  return {
    status,
    source,
    updatedAt: null,
    note,
    data
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
