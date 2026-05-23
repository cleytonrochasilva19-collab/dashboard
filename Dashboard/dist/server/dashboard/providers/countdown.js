import { envelope } from "../utils.js";
export async function loadCountdown() {
    return envelope("live", "Static event schedule", {
        label: "FIFA World Cup 2026 Kickoff",
        targetIso: "2026-06-11T19:00:00Z"
    });
}
