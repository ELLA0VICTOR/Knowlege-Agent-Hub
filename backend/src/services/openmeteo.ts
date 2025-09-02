import { ExternalSourceResult, SourceKey } from '@shared/types';

//
// Geocoding API response
//
interface GeoCodingResponse {
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1_id: number;
    timezone: string;
    country: string;
    population: number;
    country_id: number;
    admin1: string;
  }[];
  generationtime_ms: number;
}

//
// Forecast API response
//
interface ForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

export async function fetchOpenMeteo(query: string): Promise<ExternalSourceResult> {
  const m = query.match(/weather\s+in\s+([a-z\s]+)/i);
  const city = m?.[1]?.trim() || null;
  if (!city) {
    return { key: 'openmeteo' as SourceKey, title: 'Open-Meteo', used: false, items: [] };
  }

  // --- Geocoding request ---
  const geo = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  );
  const gj = (await geo.json()) as GeoCodingResponse;  // ✅ type assertion
  const loc = gj.results?.[0];
  if (!loc) {
    return { key: 'openmeteo', title: 'Open-Meteo', used: false, items: [] };
  }

  const { latitude, longitude, name, country } = loc;

  // --- Forecast request ---
  const fc = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_days=1`
  );
  const fj = (await fc.json()) as ForecastResponse;  // ✅ type assertion

  const t0 = fj.hourly.temperature_2m[0];

  return {
    key: 'openmeteo' as SourceKey,
    title: 'Open-Meteo',
    used: true,
    items: [
      {
        title: `Weather for ${name}, ${country}`,
        snippet: `First-hour temperature: ${t0}°C`,
        data: { latitude, longitude, sampleTempC: t0 }
      }
    ]
  };
}
