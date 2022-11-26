import config from "../config/default.json";
import { connect as mongooseConnect, connection } from "mongoose";

let dbConfig: any = config.App.database;

export const connect = async (): Promise<void> => {
  await mongooseConnect((dbConfig = config.App.database.mongoUrl));
};

export const close = (): Promise<void> => connection.close();
