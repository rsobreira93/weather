import mongoose, { Document, model, Schema } from "mongoose";

export enum GeoPosition {
  S = "S",
  E = "E",
  W = "W",
  N = "N",
}

export interface Beach {
  _id?: string;
  name: string;
  position: GeoPosition;
  lng: number;
  lat: number;
  user: string;
}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
