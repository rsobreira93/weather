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

export interface BeachForecast extends Omit<Beach, "user">, IForecastPoint {}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<BeachForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];

    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

      const enrichedBeachData = points.map((enrich) => ({
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1,
        },
        ...enrich,
      }));

      pointsWithCorrectSources.push(...enrichedBeachData);
    }

    return pointsWithCorrectSources;
  }
}
