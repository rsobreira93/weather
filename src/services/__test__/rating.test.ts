import { Beach, BeachPosition } from "@src/models/beach";
import { Rating } from "../Rating";

describe("Rating service", () => {
  const defaultBeach: Beach = {
    lat: -33.792726,
    lng: 151.289824,
    name: "Manly",
    position: BeachPosition.E,
    user: "some-user",
  };

  const defaultRating = new Rating(defaultBeach);

  describe("Calculate rating for a give point", () => {
    //Implementation
  });

  describe("Get rating based on wind and wave positions", () => {
    it("should get rating 1 for a beach with onshore winds", async () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.E
      );

      expect(rating).toBe(1);
    });

    it("Should get rating 3 for a beach with cross winds", async () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.S
      );
      expect(rating).toBe(3);
    });

    it("Should get rating 5 for a beach with offshore winds", async () => {
      const rating = defaultRating.getRatingBasedOnWindAndWavePositions(
        BeachPosition.E,
        BeachPosition.W
      );

      expect(rating).toBe(5);
    });

    describe("Get rating based on swell period", () => {
      it("Should get a rating of 1 of a period of 5 seconds", () => {
        const rating = defaultRating.getRatingForSwellPeriod(5);

        expect(rating).toBe(1);
      });
      it("Should get a rating of 2 of a period of 9 seconds", () => {
        const rating = defaultRating.getRatingForSwellPeriod(9);

        expect(rating).toBe(2);
      });
      it("Should get a rating of 4 of a period of 12 seconds", () => {
        const rating = defaultRating.getRatingForSwellPeriod(12);

        expect(rating).toBe(4);
      });
      it("Should get a rating of 5 of a period of 14 seconds", () => {
        const rating = defaultRating.getRatingForSwellPeriod(14);

        expect(rating).toBe(5);
      });
    });

    describe("Get rating based on swell height", () => {
      it("should get a rating 1 for less than ankle to knee high swell", () => {
        const rating = defaultRating.getRatingBasedForSwellSize(0.2);

        expect(rating).toBe(1);
      });
      it("should get a rating 2 for an ankle to knee high swell", () => {
        const rating = defaultRating.getRatingBasedForSwellSize(0.6);

        expect(rating).toBe(2);
      });
      it("should get a rating 3 for waist high swell", () => {
        const rating = defaultRating.getRatingBasedForSwellSize(1.5);

        expect(rating).toBe(3);
      });
      it("should get a rating 5 for overhead swell", () => {
        const rating = defaultRating.getRatingBasedForSwellSize(2.5);

        expect(rating).toBe(5);
      });
    });

    describe("Get position base on points location", () => {
      it("Should get the point based on a east location", () => {
        const response = defaultRating.getPositionFromLocation(92);

        expect(response).toBe(BeachPosition.E);
      });
      it("Should get the point based on a north location 1", () => {
        const response = defaultRating.getPositionFromLocation(360);

        expect(response).toBe(BeachPosition.N);
      });
      it("Should get the point based on a north location 2", () => {
        const response = defaultRating.getPositionFromLocation(40);

        expect(response).toBe(BeachPosition.N);
      });
      it("Should get the point based on a South location", () => {
        const response = defaultRating.getPositionFromLocation(200);

        expect(response).toBe(BeachPosition.S);
      });
      it("Should get the point based on a west location", () => {
        const response = defaultRating.getPositionFromLocation(300);

        expect(response).toBe(BeachPosition.W);
      });
    });
  });
});
