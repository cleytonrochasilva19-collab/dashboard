import { XMLParser } from "fast-xml-parser";
import { envelope, fallbackEnvelope, fetchText } from "../utils.js";
const parser = new XMLParser({
    ignoreAttributes: false,
    processEntities: false
});
function toArray(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}
export async function loadNews() {
    try {
        const xml = await fetchText("https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en");
        const parsed = parser.parse(xml);
        const headlines = toArray(parsed.rss?.channel?.item)
            .map((item) => item.title?.trim())
            .filter((title) => Boolean(title))
            .slice(0, 20);
        return envelope("live", "Google News RSS", { headlines });
    }
    catch (error) {
        return fallbackEnvelope("Google News RSS", { headlines: ["News feed unavailable."] }, `News feed unavailable: ${String(error)}`);
    }
}
