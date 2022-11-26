import { ForecastProcessingInternalError } from "./../util/errors/ForecastProcessingInternalError";
import { IForecastPoint, StormGlass } from "@src/clients/StormGlass";

export enum BeachPosition {
  S = "S",
  E = "E",
  W = "W",
  N = "N",
}

export interface Beach {
  name: string;
  position: BeachPosition;
  user: string;
  lng: number;
  lat: number;
}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export interface BeachForecast extends Omit<Beach, "user">, IForecastPoint {}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];

    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

        const enrichedBeachData = this.enrichedBeachData(points, beach);

        pointsWithCorrectSources.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (error: any) {
      throw new ForecastProcessingInternalError(error.message);
    }
  }

  private enrichedBeachData(
    points: IForecastPoint[],
    beach: Beach
  ): BeachForecast[] {
    return points.map((enrich) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...enrich,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);

      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }

    return forecastByTime;
  }
}