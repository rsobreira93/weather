import { ClassMiddleware, Controller, Post } from "@overnightjs/core";
import { authMiddleware } from "@src/middlewares/auth";
import { Beach } from "@src/models/beach";
import { Request, Response } from "express";
import { BaseController } from ".";

@Controller("beaches")
@ClassMiddleware(authMiddleware)
export class BeachesController extends BaseController {
  @Post("")
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const beach = new Beach({
        ...request.body,
        ...{ user: request.decoded },
      });

      const beachCreated = await beach.save();

      response.status(201).send(beachCreated);
    } catch (error: any) {
      this.sendCreateUpdateErrorResponse(response, error);
    }
  }
}
