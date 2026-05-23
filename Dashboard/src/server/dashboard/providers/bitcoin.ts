import type { PriceCard, WidgetEnvelope } from "../types.js";
import { envelope, fetchJson, fallbackEnvelope } from "../utils.js";

interface CoinGeckoResponse {
  bitcoin?: {
    usd?: number;
    usd_24h_change?: number;
  };
}

export async function loadBitcoin(): Promise<WidgetEnvelope<PriceCard>> {
  try {
    const data = await fetchJson<CoinGeckoResponse>(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
    );

    const priceUsd = data.bitcoin?.usd ?? null;
    const change24hPct = data.bitcoin?.usd_24h_change ?? null;

    return envelope("live", "CoinGecko", { priceUsd, change24hPct });
  } catch (error) {
    return fallbackEnvelope(
      "CoinGecko",
      { priceUsd: null, change24hPct: null },
      `Bitcoin feed unavailable: ${String(error)}`
    );
  }
}
