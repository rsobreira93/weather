import { User } from "@src/models/user";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { App } from "../../config/default.json";
export interface DecodedUser extends Omit<User, "_id"> {
  id: string;
}

export class AuthService {
  public static async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  public static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  public static generateToken(payload: object): string {
    return jwt.sign(payload, App.auth.key, {
      expiresIn: App.auth.tokenExpiresIn,
    });
  }

  public static decodeToken(token: string): DecodedUser {
    return jwt.decode(token) as unknown as DecodedUser;
  }
}
