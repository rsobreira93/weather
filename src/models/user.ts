import mongoose, { Document, model } from "mongoose";

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

interface UserModel extends Omit<User, "_id">, Document {}

const schema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: { type: String, require: true },
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

export const User = model<UserModel>("User", schema);
