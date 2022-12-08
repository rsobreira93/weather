import { ClassMiddleware, Controller, Get } from "@overnightjs/core";
import { authMiddleware } from "@src/middlewares/auth";
import { Beach } from "@src/models/beach";
import { Forecast } from "@src/services/Forecast";
import { Request, Response } from "express";

const forecast = new Forecast();
@Controller("forecast")
@ClassMiddleware(authMiddleware)
export class ForecastController {
  @Get("")
  public async getForecastForLoggedUser(
    _: Request,
    response: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({});

      const forecastData = await forecast.processForecastForBeaches(beaches);

      response.status(200).json(forecastData);
    } catch (error: any) {
      console.error(error);
      response.status(500).send({ error: "Something went wrong" });
    }
  }
}
