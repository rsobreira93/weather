import { SetupServer } from "./server";
import config from "../config/default.json";

(async (): Promise<void> => {
  const server = new SetupServer(config.App.port);
  await server.init();
  server.start();
})();
