import mongoose, { Document, model } from "mongoose";

export enum BeachPosition {
  S = "S",
  E = "E",
  W = "W",
  N = "N",
}

export interface Beach {
  _id?: string;
  name: string;
  position: BeachPosition;
  //   user: string;
  lng: number;
  lat: number;
}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, require: true },
    lng: { type: Number, require: true },
    name: { type: String, require: true },
    position: { type: String, require: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret.id;
        delete ret.__v;
      },
    },
  }
);

interface BeachModel extends Omit<Beach, "_id">, Document {}
export const Beach = model<BeachModel>("Beach", schema);
