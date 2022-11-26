import { Beach } from "@src/models/beach";

describe("Beaches functional tests", () => {
  beforeAll(async () => await Beach.deleteMany({}));
  describe("When creating a beach", () => {
    it("Should create a beach with success", async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: "Manly",
        position: "E",
      };

      const response = await global.testRequest.post("/beaches").send(newBeach);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it("Should return 422 where there is a validation error", async () => {
      const newBeach = {
        lat: "invalid_string",
        lng: 151.289824,
        name: "Manly",
        position: "E",
      };
      const response = await global.testRequest.post("/beaches").send(newBeach);

      expect(response.statusCode).toBe(422);
      expect(response.body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"',
      });
    });
  });
});
