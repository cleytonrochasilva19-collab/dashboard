import { envelope, fallbackEnvelope, readJsonFile } from "../utils.js";
const fallbackAthletes = [
    {
        id: "cr7",
        label: "CR7 Road to 1000 Goals",
        current: 965,
        target: 1000,
        remaining: 35,
        accent: "#f5c542",
        meta: "Manual placeholder"
    },
    {
        id: "messi",
        label: "Messi Road to 1000 Goals",
        current: 899,
        target: 1000,
        remaining: 101,
        accent: "#4ea1ff",
        meta: "Manual placeholder"
    }
];
export async function loadAthletes(context) {
    const overrides = await readJsonFile(context.manualOverridesPath, {});
    const athletes = overrides.athletes?.map((athlete) => ({
        ...athlete,
        remaining: Math.max(0, athlete.target - athlete.current)
    }));
    if (!athletes || athletes.length === 0) {
        return fallbackEnvelope("Manual override file", fallbackAthletes, "Connect a sports data provider or update data/manual-overrides.json.");
    }
    return envelope("placeholder", "Manual override file", athletes, "Manual override until a sports data source is connected.");
}
