import { envelope, fallbackEnvelope, fetchJson } from "../utils.js";
export async function loadIss() {
    try {
        const iss = await fetchJson("https://api.wheretheiss.at/v1/satellites/25544");
        const regionResponse = await fetchJson("https://api.bigdatacloud.net/data/reverse-geocode-client" +
            `?latitude=${iss.latitude}&longitude=${iss.longitude}&localityLanguage=en`);
        const region = regionResponse.countryName ||
            regionResponse.locality ||
            regionResponse.principalSubdivision ||
            "International Waters";
        return envelope("live", "Where The ISS At", {
            latitude: iss.latitude,
            longitude: iss.longitude,
            velocityKmh: Math.round(iss.velocity),
            region
        });
    }
    catch (error) {
        return fallbackEnvelope("Where The ISS At", {
            latitude: null,
            longitude: null,
            velocityKmh: null,
            region: "Unavailable"
        }, `ISS feed unavailable: ${String(error)}`);
    }
}
