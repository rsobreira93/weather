import { compare, hash } from "bcrypt";

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
}
