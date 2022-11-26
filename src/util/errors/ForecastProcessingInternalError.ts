import { InternalErrors } from "./InternalErrors";

export class ForecastProcessingInternalError extends InternalErrors {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`, 500);
  }
}
