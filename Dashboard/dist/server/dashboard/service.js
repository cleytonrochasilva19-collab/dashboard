import fs from "node:fs/promises";
import { EventEmitter } from "node:events";
import { cacheDir, cacheFile, getProviderContext } from "./config.js";
import { loadAthletes } from "./providers/athletes.js";
import { loadBitcoin } from "./providers/bitcoin.js";
import { loadClimate } from "./providers/climate.js";
import { loadCountdown } from "./providers/countdown.js";
import { loadFlights } from "./providers/flights.js";
import { loadIss } from "./providers/iss.js";
import { loadNews } from "./providers/news.js";
import { loadPopulation } from "./providers/population.js";
import { loadTrends } from "./providers/trends.js";
import { loadWeather } from "./providers/weather.js";
const initialSnapshot = {
    generatedAt: new Date(0).toISOString(),
    bitcoin: {
        status: "placeholder",
        source: "Boot",
        updatedAt: null,
        note: "Loading",
        data: { priceUsd: null, change24hPct: null }
    },
    population: {
        status: "placeholder",
        source: "Boot",
        updatedAt: null,
        note: "Loading",
        data: { populationNow: null, birthsToday: null, deathsToday: null, modelYear: null }
    },
    iss: {
        status: "placeholder",
        source: "Boot",
        updatedAt: null,
        note: "Loading",
        data: { latitude: null, longitude: null, velocityKmh: null, region: "Loading" }
    },
    trends: {
        status: "placeholder",
        source: "Boot",
        updatedAt: null,
        note: "Loading",
        data: { google: [], x: [] }
    },
    weather: {
        status: "placeholder",
        source: "Boot",
        updatedAt: null,
        note: "Loading",
        data: []
    },
    flights: {
        status: "placeholder",
        source: "Boot",
        updatedAt: null,
        note: "Loading",
        data: { activeFlights: null }
    },
    countdown: {
        status: "placeholder",
        source: "Boot",
        updatedAt: null,
        note: "Loading",
        data: { label: "Countdown", targetIso: "2026-06-11T19:00:00Z" }
    },
    athletes: {
        status: "placeholder",
        source: "Boot",
        updatedAt: null,
        note: "Loading",
        data: []
    },
    climate: {
        status: "placeholder",
        source: "Boot",
        updatedAt: null,
        note: "Loading",
        data: {
            renewableShare: { label: "Renewable Energy Share", value: null, unit: "%", barPercent: 0 },
            warming: { label: "Global Temperature Anomaly", value: null, unit: "C", barPercent: 0 }
        }
    },
    news: {
        status: "placeholder",
        source: "Boot",
        updatedAt: null,
        note: "Loading",
        data: { headlines: [] }
    }
};
const providers = [
    { key: "bitcoin", intervalMs: 30_000, load: () => loadBitcoin() },
    { key: "population", intervalMs: 60 * 60_000, load: () => loadPopulation() },
    { key: "iss", intervalMs: 30_000, load: () => loadIss() },
    { key: "trends", intervalMs: 30 * 60_000, load: (context) => loadTrends(context) },
    { key: "weather", intervalMs: 10 * 60_000, load: () => loadWeather() },
    { key: "flights", intervalMs: 60_000, load: (context) => loadFlights(context) },
    { key: "countdown", intervalMs: 6 * 60 * 60_000, load: () => loadCountdown() },
    { key: "athletes", intervalMs: 15 * 60_000, load: (context) => loadAthletes(context) },
    { key: "climate", intervalMs: 12 * 60 * 60_000, load: (context) => loadClimate(context) },
    { key: "news", intervalMs: 5 * 60_000, load: () => loadNews() }
];
export class DashboardService extends EventEmitter {
    snapshot = initialSnapshot;
    context = getProviderContext();
    async start() {
        await this.loadCachedSnapshot();
        await Promise.all(providers.map((provider) => this.refreshProvider(provider)));
        for (const provider of providers) {
            setInterval(() => {
                void this.refreshProvider(provider);
            }, provider.intervalMs);
        }
    }
    getSnapshot() {
        return this.snapshot;
    }
    async loadCachedSnapshot() {
        try {
            const raw = await fs.readFile(cacheFile, "utf8");
            this.snapshot = JSON.parse(raw);
        }
        catch {
            this.snapshot = initialSnapshot;
        }
    }
    async refreshProvider(provider) {
        const result = (await provider.load(this.context));
        const nextSnapshot = {
            ...this.snapshot,
            generatedAt: new Date().toISOString(),
            [provider.key]: result
        };
        this.snapshot = nextSnapshot;
        await this.persistSnapshot();
        this.emit("snapshot", this.snapshot);
    }
    async persistSnapshot() {
        await fs.mkdir(cacheDir, { recursive: true });
        await fs.writeFile(cacheFile, JSON.stringify(this.snapshot, null, 2), "utf8");
    }
}
