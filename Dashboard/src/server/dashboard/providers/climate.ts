import type { ClimateCard, ProviderContext, WidgetEnvelope } from "../types.js";
import { clamp, envelope, fallbackEnvelope, fetchJson, readJsonFile } from "../utils.js";

type WorldBankResponse = [
  unknown,
  Array<{
    value: number | null;
    date: string;
  }>
];

interface ManualClimate {
  climate?: {
    warmingC?: number;
    warmingLabel?: string;
    warmingMeta?: string;
  };
}

async function fetchRenewableShare(): Promise<number> {
  const url =
    "https://api.worldbank.org/v2/country/WLD/indicator/EG.FEC.RNEW.ZS?format=json&mrv=1";

  const response = await fetchJson<WorldBankResponse>(url);
  const entry = response[1]?.find((item) => typeof item.value === "number");
  if (!entry?.value) {
    throw new Error("No renewable share data returned");
  }
  return entry.value;
}

export async function loadClimate(context: ProviderContext): Promise<WidgetEnvelope<ClimateCard>> {
  try {
    const [renewableShare, overrides] = await Promise.all([
      fetchRenewableShare(),
      readJsonFile<ManualClimate>(context.manualOverridesPath, {})
    ]);

    const warmingValue = overrides.climate?.warmingC ?? 1.24;
    const warmingLabel = overrides.climate?.warmingLabel ?? "Global Temperature Anomaly";
    const warmingMeta =
      overrides.climate?.warmingMeta ??
      "Placeholder until an automated climate anomaly source is connected.";

    return envelope("degraded", "World Bank + manual override", {
      renewableShare: {
        label: "Renewable Energy Share",
        value: renewableShare,
        unit: "%",
        barPercent: clamp(renewableShare, 0, 100),
        meta: "Latest published annual value from the World Bank."
      },
      warming: {
        label: warmingLabel,
        value: warmingValue,
        unit: "C",
        barPercent: clamp((warmingValue / 2) * 100, 0, 100),
        meta: warmingMeta
      }
    }, "Renewable share is automatic. The warming metric remains a manual placeholder.");
  } catch (error) {
    return fallbackEnvelope(
      "World Bank + manual override",
      {
        renewableShare: {
          label: "Renewable Energy Share",
          value: null,
          unit: "%",
          barPercent: 0
        },
        warming: {
          label: "Global Temperature Anomaly",
          value: 1.24,
          unit: "C",
          barPercent: 62
        }
      },
      `Climate feed unavailable: ${String(error)}`
    );
  }
}
