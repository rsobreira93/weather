import { Beach, BeachPosition } from "@src/models/beach";

const waveHeight = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHigh: {
    min: 1.0,
    max: 2.0,
  },
  headHigh: {
    min: 2.0,
    max: 2.5,
  },
};

export class Rating {
  constructor(private beach: Beach) {}

  public getRatingBasedOnWindAndWavePositions(
    wavePosition: BeachPosition,
    windPosition: BeachPosition
  ): number {
    if (wavePosition === windPosition) {
      return 1;
    } else if (this.isWindOffShored(wavePosition, windPosition)) {
      return 5;
    }
    return 3;
  }

  public getRatingForSwellPeriod(period: number): number {
    if (period >= 7 && period < 10) return 2;

    if (period >= 10 && period < 14) return 4;

    if (period >= 14) return 5;

    return 1;
  }

  public getRatingBasedForSwellSize(height: number): number {
    if (
      height >= waveHeight.ankleToKnee.min &&
      height < waveHeight.ankleToKnee.max
    )
      return 2;

    if (height >= waveHeight.waistHigh.min && height < waveHeight.waistHigh.max)
      return 3;

    if (height >= waveHeight.headHigh.min) return 5;

    return 1;
  }

  public getPositionFromLocation(coordinates: number): BeachPosition {
    if (coordinates >= 310 || (coordinates < 50 && coordinates >= 0))
      return BeachPosition.N;

    if (coordinates >= 50 && coordinates < 120) return BeachPosition.E;

    if (coordinates >= 120 && coordinates < 220) return BeachPosition.S;

    if (coordinates >= 220 && coordinates < 310) return BeachPosition.W;

    return BeachPosition.E;
  }

  private isWindOffShored(
    wavePosition: BeachPosition,
    windPosition: BeachPosition
  ): boolean {
    return (
      (wavePosition === BeachPosition.N &&
        windPosition === BeachPosition.S &&
        this.beach.position === BeachPosition.N) ||
      (wavePosition === BeachPosition.S &&
        windPosition === BeachPosition.N &&
        this.beach.position === BeachPosition.S) ||
      (wavePosition === BeachPosition.E &&
        windPosition === BeachPosition.W &&
        this.beach.position === BeachPosition.E) ||
      (wavePosition === BeachPosition.W &&
        windPosition === BeachPosition.E &&
        this.beach.position === BeachPosition.W)
    );
  }
}