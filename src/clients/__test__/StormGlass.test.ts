import { StormGlass } from "@src/clients/StormGlass";
import stormGlassWeather3HoursFixture from "@test/fixtures/stormglass_weather_3_hours.json";
import stormGlassNormalizedResponse3HoursFixture from "@test/fixtures/stormglass_normalized_response_3_hours.json";
import * as HTTPUtil from "@src/util/Request";

jest.mock("@src/util/Request");

describe("StormGlass client", () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;

  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it("should return the normalized forecast from the  StormGlass service", async () => {
    const Latitude = -6.10249;
    const Longitude = -38.2092;

    mockedRequest.get.mockResolvedValueOnce({
      data: stormGlassWeather3HoursFixture,
    } as HTTPUtil.IResponse);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(Latitude, Longitude);

    expect(response).toEqual(stormGlassNormalizedResponse3HoursFixture);
  });

  it("should exclude incomplete data points", async () => {
    const Latitude = -6.10249;
    const Longitude = -38.2092;

    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300,
          },
          time: "2022-04-26T00:00:00+00:00",
        },
      ],
    };

    mockedRequest.get.mockResolvedValue({
      data: incompleteResponse,
    } as HTTPUtil.IResponse);

    const stormGlass = new StormGlass(mockedRequest);
    const response = await stormGlass.fetchPoints(Latitude, Longitude);

    expect(response).toEqual([]);
  });

  it("should get a generic error from the StormGlass service when the request fail before reaching the service", async () => {
    const Latitude = -6.10249;
    const Longitude = -38.2092;

    mockedRequest.get.mockRejectedValue("Network Error");

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(Latitude, Longitude)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: "Network Error"'
    );
  });

  it("should get a StormGlassResponseError when the StormGlass service responds with error", async () => {
    const Latitude = -6.10249;
    const Longitude = -38.2092;

    class FakeAxiosError extends Error {
      constructor(public response: object) {
        super();
      }
    }

    mockedRequest.get.mockRejectedValue(
      new FakeAxiosError({
        status: 429,
        data: { errors: ["Rate Limit reached"] },
      })
    );

    MockedRequestClass.isRequestError.mockReturnValue(true);

    MockedRequestClass.extractErrorData.mockReturnValue({
      status: 429,
      data: { errors: ["Rate Limit reached"] },
    });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(Latitude, Longitude)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
