import type { Preference } from "@/lib/types";

export type WeatherForecast = {
  summary: string;
  source: "open-meteo";
  rainExpected: boolean;
  precipitationProbability: number;
  maximumTemperature: number;
  minimumTemperature: number;
};

type OpenMeteoResponse = {
  daily?: {
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
  };
};

const rainyWeatherCodes = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
]);

function describeWeather(code: number, rainExpected: boolean) {
  if (rainExpected) return "Rain is possible";
  if (code === 0) return "Clear and bright";
  if ([1, 2].includes(code)) return "Mostly clear";
  if (code === 3) return "Cloudy and mild";
  if ([45, 48].includes(code)) return "Misty at times";
  return "A settled day";
}

export async function getWeatherForecast(
  preference: Preference,
): Promise<WeatherForecast | null> {
  try {
    const params = new URLSearchParams({
      latitude: String(preference.lat ?? -31.95),
      longitude: String(preference.lng ?? 115.86),
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: "auto",
      forecast_days: "1",
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      signal: AbortSignal.timeout(4500),
      next: { revalidate: 1800 },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as OpenMeteoResponse;
    const code = data.daily?.weather_code?.[0];
    const maximumTemperature = data.daily?.temperature_2m_max?.[0];
    const minimumTemperature = data.daily?.temperature_2m_min?.[0];
    const precipitationProbability =
      data.daily?.precipitation_probability_max?.[0];
    if (
      code === undefined ||
      maximumTemperature === undefined ||
      minimumTemperature === undefined ||
      precipitationProbability === undefined
    ) {
      return null;
    }

    const rainExpected =
      precipitationProbability >= 50 || rainyWeatherCodes.has(code);
    const conditions = describeWeather(code, rainExpected);
    const adaptation = rainExpected
      ? "Indoor stops have been prioritised, with outdoor time kept flexible."
      : "The gentlest outdoor stop has been placed earlier in the day.";

    return {
      summary: `${conditions}, ${Math.round(minimumTemperature)}–${Math.round(maximumTemperature)}°C, with a ${precipitationProbability}% chance of rain. ${adaptation}`,
      source: "open-meteo",
      rainExpected,
      precipitationProbability,
      maximumTemperature,
      minimumTemperature,
    };
  } catch {
    return null;
  }
}
