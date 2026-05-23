import type { PopulationCard, WidgetEnvelope } from "../types.js";
import { envelope, fallbackEnvelope, fetchJson, startOfUtcDay } from "../utils.js";

type WorldBankResponse = [
  unknown,
  Array<{
    value: number | null;
    date: string;
  }>
];

async function fetchIndicator(indicator: string): Promise<{ value: number; year: number }> {
  const url =
    `https://api.worldbank.org/v2/country/WLD/indicator/${indicator}` +
    "?format=json&mrv=1";

  const response = await fetchJson<WorldBankResponse>(url);
  const entry = response[1]?.find((item) => typeof item.value === "number");
  if (!entry || entry.value === null) {
    throw new Error(`No World Bank data for ${indicator}`);
  }

  return {
    value: entry.value,
    year: Number(entry.date)
  };
}

export async function loadPopulation(): Promise<WidgetEnvelope<PopulationCard>> {
  try {
    const [population, birthRate, deathRate] = await Promise.all([
      fetchIndicator("SP.POP.TOTL"),
      fetchIndicator("SP.DYN.CBRT.IN"),
      fetchIndicator("SP.DYN.CDRT.IN")
    ]);

    const baseDate = new Date(Date.UTC(population.year, 0, 1));
    const now = new Date();
    const msPerYear = 365.2425 * 24 * 60 * 60 * 1000;
    const birthsPerYear = (population.value * birthRate.value) / 1000;
    const deathsPerYear = (population.value * deathRate.value) / 1000;
    const netPerMs = (birthsPerYear - deathsPerYear) / msPerYear;
    const populationNow = Math.round(
      population.value + (now.getTime() - baseDate.getTime()) * netPerMs
    );

    const utcDayStart = startOfUtcDay(now);
    const dayProgress = (now.getTime() - utcDayStart.getTime()) / (24 * 60 * 60 * 1000);
    const birthsToday = Math.round((birthsPerYear / 365.2425) * dayProgress);
    const deathsToday = Math.round((deathsPerYear / 365.2425) * dayProgress);

    return envelope("live", "World Bank annual indicators + interpolation", {
      populationNow,
      birthsToday,
      deathsToday,
      modelYear: population.year
    });
  } catch (error) {
    return fallbackEnvelope(
      "World Bank",
      {
        populationNow: null,
        birthsToday: null,
        deathsToday: null,
        modelYear: null
      },
      `Population model unavailable: ${String(error)}`
    );
  }
}
