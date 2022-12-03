import { Controller, Post } from "@overnightjs/core";
import { User } from "@src/models/user";
import { Request, Response } from "express";
import mongoose from "mongoose";

@Controller("users")
export class UsersController {
  @Post("")
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const user = new User(request.body);

      const userCreated = await user.save();

      response.status(201).send(userCreated);
    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        response.status(400).send({ error: error.message });
      } else {
        response.status(500).send({ error: "Internal Server Error" });
      }
    }
  }
}
