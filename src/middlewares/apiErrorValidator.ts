import { NextFunction, Request, Response } from "express";
import { ApiError } from "@src/util/errors/ApiErros";

export interface HttpError extends Error {
  status?: number;
}

export function apiErrorValidator(
  error: HttpError,
  __: Partial<Request>,
  response: Response,
  _: NextFunction
): void {
  const errorCode = error.status || 500;

  response
    .status(errorCode)
    .send(ApiError.format({ code: errorCode, message: error.message }));
}
