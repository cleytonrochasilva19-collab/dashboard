import type { FlightsCard, ProviderContext, WidgetEnvelope } from "../types.js";
import { envelope, fallbackEnvelope, fetchJson } from "../utils.js";

interface OpenSkyTokenResponse {
  access_token: string;
}

interface OpenSkyStatesResponse {
  states?: unknown[];
}

async function fetchAccessToken(context: ProviderContext): Promise<string | null> {
  if (!context.openSkyClientId || !context.openSkyClientSecret) {
    return null;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: context.openSkyClientId,
    client_secret: context.openSkyClientSecret
  });

  const response = await fetch("https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!response.ok) {
    throw new Error(`OpenSky token request failed with ${response.status}`);
  }

  const token = (await response.json()) as OpenSkyTokenResponse;
  return token.access_token;
}

export async function loadFlights(context: ProviderContext): Promise<WidgetEnvelope<FlightsCard>> {
  try {
    const token = await fetchAccessToken(context);
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const states = await fetchJson<OpenSkyStatesResponse>(
      "https://opensky-network.org/api/states/all",
      headers ? { headers } : undefined
    );

    return envelope(
      token ? "live" : "degraded",
      token ? "OpenSky Network (authenticated)" : "OpenSky Network (public)",
      {
        activeFlights: states.states?.length ?? 0
      },
      token ? undefined : "Public OpenSky access is rate-limited. Add credentials for reliability."
    );
  } catch (error) {
    return fallbackEnvelope(
      "OpenSky Network",
      { activeFlights: null },
      "Flights feed needs OpenSky credentials or a reachable public endpoint."
    );
  }
}
