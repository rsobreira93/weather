import { Controller, Get, Middleware, Post } from "@overnightjs/core";
import { authMiddleware } from "@src/middlewares/auth";
import { User } from "@src/models/user";
import { AuthService } from "@src/services/auth";
import { Request, Response } from "express";
import { BaseController } from ".";

@Controller("users")
export class UsersController extends BaseController {
  @Post("")
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const user = new User(request.body);

      const userCreated = await user.save();

      response.status(201).send(userCreated);
    } catch (error: any) {
      this.sendCreateUpdateErrorResponse(response, error);
    }
  }

  @Post("authenticate")
  public async authenticate(
    request: Request,
    response: Response
  ): Promise<Response | undefined> {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user) {
      return this.sendErrorResponse(response, {
        code: 401,
        message: "users not found",
      });
    }

    if (!(await AuthService.comparePassword(password, user.password))) {
      return this.sendErrorResponse(response, {
        code: 401,
        message: "password or email incorrect",
      });
    }

    const token = AuthService.generateToken(user.toJSON());

    return response.status(200).send({ ...user.toJSON(), ...{ token } });
  }

  @Get("me")
  @Middleware(authMiddleware)
  public async me(request: Request, response: Response): Promise<Response> {
    const email = request.decoded ? request.decoded?.email : undefined;

    const user = await User.findOne({ email });

    if (!user) {
      return this.sendErrorResponse(response, {
        code: 404,
        message: "User not found",
      });
    }

    return response.send({ user });
  }
}
