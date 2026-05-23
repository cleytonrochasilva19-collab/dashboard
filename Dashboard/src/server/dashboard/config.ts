import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ProviderContext } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const projectRoot = path.resolve(__dirname, "../../..");
export const cacheDir = path.join(projectRoot, "data", "cache");
export const cacheFile = path.join(cacheDir, "latest-snapshot.json");

export function getProviderContext(): ProviderContext {
  return {
    manualOverridesPath: path.join(projectRoot, "data", "manual-overrides.json"),
    trendsGeo: process.env.TRENDS_GEO?.trim() || "US",
    openSkyClientId: process.env.OPENSKY_CLIENT_ID?.trim(),
    openSkyClientSecret: process.env.OPENSKY_CLIENT_SECRET?.trim()
  };
}
