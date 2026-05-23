import type { WeatherCity, WidgetEnvelope } from "../types.js";
import { envelope, fallbackEnvelope, fetchJson } from "../utils.js";

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
    time?: string;
  };
}

const cities = [
  { name: "Sao Paulo", latitude: -23.55, longitude: -46.63, timezone: "America/Sao_Paulo" },
  { name: "Washington", latitude: 38.9, longitude: -77.03, timezone: "America/New_York" },
  { name: "Tokyo", latitude: 35.68, longitude: 139.65, timezone: "Asia/Tokyo" },
  { name: "Shanghai", latitude: 31.23, longitude: 121.47, timezone: "Asia/Shanghai" },
  { name: "London", latitude: 51.5, longitude: -0.12, timezone: "Europe/London" },
  { name: "Mumbai", latitude: 19.07, longitude: 72.87, timezone: "Asia/Kolkata" },
  { name: "Paris", latitude: 48.85, longitude: 2.35, timezone: "Europe/Paris" }
] as const;

async function fetchCityWeather(city: (typeof cities)[number]): Promise<WeatherCity> {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${city.latitude}&longitude=${city.longitude}` +
    "&current=temperature_2m,weather_code&timezone=auto";

  const data = await fetchJson<OpenMeteoResponse>(url);

  return {
    name: city.name,
    timezone: city.timezone,
    temperatureC: data.current?.temperature_2m ?? null,
    weatherCode: data.current?.weather_code ?? null,
    localTimeIso: new Date().toISOString()
  };
}

export async function loadWeather(): Promise<WidgetEnvelope<WeatherCity[]>> {
  try {
    const result = await Promise.all(cities.map((city) => fetchCityWeather(city)));
    return envelope("live", "Open-Meteo", result);
  } catch (error) {
    return fallbackEnvelope(
      "Open-Meteo",
      [],
      `Weather feed unavailable: ${String(error)}`
    );
  }
}
