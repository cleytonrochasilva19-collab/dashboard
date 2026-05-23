export type WidgetStatus = "live" | "degraded" | "placeholder";

export interface WidgetEnvelope<T> {
  status: WidgetStatus;
  source: string;
  updatedAt: string | null;
  note?: string;
  data: T;
}

export interface PriceCard {
  priceUsd: number | null;
  change24hPct: number | null;
}

export interface PopulationCard {
  populationNow: number | null;
  birthsToday: number | null;
  deathsToday: number | null;
  modelYear: number | null;
}

export interface IssCard {
  latitude: number | null;
  longitude: number | null;
  velocityKmh: number | null;
  region: string;
}

export interface TrendItem {
  rank: number;
  title: string;
}

export interface TrendsCard {
  google: TrendItem[];
  x: TrendItem[];
}

export interface WeatherCity {
  name: string;
  timezone: string;
  temperatureC: number | null;
  weatherCode: number | null;
  localTimeIso: string;
}

export interface FlightsCard {
  activeFlights: number | null;
}

export interface CountdownCard {
  label: string;
  targetIso: string;
}

export interface AthleteProgress {
  id: string;
  label: string;
  current: number;
  target: number;
  remaining: number;
  accent: string;
  meta?: string;
}

export interface ClimateBar {
  label: string;
  value: number | null;
  unit: string;
  barPercent: number;
  meta?: string;
}

export interface ClimateCard {
  renewableShare: ClimateBar;
  warming: ClimateBar;
}

export interface NewsCard {
  headlines: string[];
}

export interface DashboardSnapshot {
  generatedAt: string;
  bitcoin: WidgetEnvelope<PriceCard>;
  population: WidgetEnvelope<PopulationCard>;
  iss: WidgetEnvelope<IssCard>;
  trends: WidgetEnvelope<TrendsCard>;
  weather: WidgetEnvelope<WeatherCity[]>;
  flights: WidgetEnvelope<FlightsCard>;
  countdown: WidgetEnvelope<CountdownCard>;
  athletes: WidgetEnvelope<AthleteProgress[]>;
  climate: WidgetEnvelope<ClimateCard>;
  news: WidgetEnvelope<NewsCard>;
}
