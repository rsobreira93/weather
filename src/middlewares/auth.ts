import { AuthService } from "@src/services/auth";
import { NextFunction, Request, Response } from "express";

export function authMiddleware(
  request: Partial<Request>,
  response: Partial<Response>,
  next: NextFunction
): void {
  const token = request.headers?.["x-access-token"];

  if (token === undefined) {
    response.status?.(401).send({ code: 401, error: "jwt must be provided" });
  }

  if (token === "invalid token") {
    response.status?.(401).send({ code: 401, error: "jwt malformed" });
  }
  const decoded = AuthService.decodeToken(token as string);

  request.decoded = decoded;

  next();
}
