import {
  ClassMiddleware,
  Controller,
  Get,
  Middleware,
} from "@overnightjs/core";
import { authMiddleware } from "@src/middlewares/auth";
import { Beach } from "@src/models/beach";
import { Forecast } from "@src/services/Forecast";
import { ApiError } from "@src/util/errors/ApiErros";
import { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { BaseController } from ".";

const forecast = new Forecast();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  keyGenerator(request: Request): string {
    return request.ip;
  },
  handler(_, response: Response): void {
    response.status(429).send(
      ApiError.format({
        code: 429,
        message: "Too many requests to the /forecast endpoint.",
      })
    );
  },
});

@Controller("forecast")
@ClassMiddleware(authMiddleware)
export class ForecastController extends BaseController {
  @Get("")
  @Middleware(rateLimiter)
  public async getForecastForLoggedUser(
    _: Request,
    response: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({});

      const forecastData = await forecast.processForecastForBeaches(beaches);

      response.status(200).json(forecastData);
    } catch (error: any) {
      this.sendErrorResponse(response, {
        code: 500,
        message: "Something went wrong",
      });
    }
  }
}
