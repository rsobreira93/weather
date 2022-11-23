import { InternalErrors } from "./InternalErrors";

export class ClientErrors extends InternalErrors {
  constructor(message: string) {
    const internalMessage =
      "Unexpected error when trying to communicate to StormGlass";
    super(`${internalMessage}: ${message}`, 500);
  }
}

export class StormGlassResponseError extends InternalErrors {
  constructor(message: string) {
    const internalMessage =
      "Unexpected error returned by the StormGlass service";
    super(`${internalMessage}: ${message}`, 500);
  }
}
