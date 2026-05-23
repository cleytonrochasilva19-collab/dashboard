import { XMLParser } from "fast-xml-parser";
import type { ProviderContext, TrendItem, TrendsCard, WidgetEnvelope } from "../types.js";
import { envelope, fallbackEnvelope, fetchText } from "../utils.js";

const parser = new XMLParser({
  ignoreAttributes: false,
  processEntities: false
});

interface RssItem {
  title?: string;
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

async function fetchGoogleTrends(geo: string): Promise<TrendItem[]> {
  const xml = await fetchText(`https://trends.google.com/trending/rss?geo=${encodeURIComponent(geo)}`);
  const parsed = parser.parse(xml) as {
    rss?: { channel?: { item?: RssItem[] | RssItem } };
  };

  return toArray(parsed.rss?.channel?.item)
    .map((item) => item.title?.trim())
    .filter((title): title is string => Boolean(title))
    .slice(0, 8)
    .map((title, index) => ({
      rank: index + 1,
      title
    }));
}

export async function loadTrends(context: ProviderContext): Promise<WidgetEnvelope<TrendsCard>> {
  try {
    const google = await fetchGoogleTrends(context.trendsGeo);
    return envelope("degraded", `Google Trends RSS (${context.trendsGeo})`, {
      google,
      x: []
    }, "X trends require authenticated API access and remain a placeholder.");
  } catch (error) {
    return fallbackEnvelope(
      "Google Trends RSS",
      {
        google: [],
        x: []
      },
      `Trends feed unavailable: ${String(error)}`
    );
  }
}
