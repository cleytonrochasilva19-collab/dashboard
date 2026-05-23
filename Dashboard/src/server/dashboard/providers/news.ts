import { XMLParser } from "fast-xml-parser";
import type { NewsCard, WidgetEnvelope } from "../types.js";
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

export async function loadNews(): Promise<WidgetEnvelope<NewsCard>> {
  try {
    const xml = await fetchText(
      "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en"
    );
    const parsed = parser.parse(xml) as {
      rss?: { channel?: { item?: RssItem[] | RssItem } };
    };

    const headlines = toArray(parsed.rss?.channel?.item)
      .map((item) => item.title?.trim())
      .filter((title): title is string => Boolean(title))
      .slice(0, 20);

    return envelope("live", "Google News RSS", { headlines });
  } catch (error) {
    return fallbackEnvelope(
      "Google News RSS",
      { headlines: ["News feed unavailable."] },
      `News feed unavailable: ${String(error)}`
    );
  }
}
