import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
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
    return jwt.sign(payload, "test", {
      expiresIn: "1d",
    });
  }
}
