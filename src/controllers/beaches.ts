import { ClassMiddleware, Controller, Post } from "@overnightjs/core";
import { authMiddleware } from "@src/middlewares/auth";
import { Beach } from "@src/models/beach";
import { Request, Response } from "express";
import mongoose from "mongoose";

@Controller("beaches")
@ClassMiddleware(authMiddleware)
export class BeachesController {
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
      if (error instanceof mongoose.Error.ValidationError) {
        response.status(422).send({ error: error.message });
      } else {
        response.status(500).send({ error: "Internal Server Error" });
      }
    }
  }
}
