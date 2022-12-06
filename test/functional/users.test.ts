import { User } from "@src/models/user";
import { AuthService } from "@src/services/auth";

describe("Users functional tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  describe("When create a new user", () => {
    it("Should successfully a new user with encrypted password", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@mail.com",
        password: "password",
      };

      const response = await global.testRequest.post("/users").send(newUser);

      expect(response.status).toBe(201);
      await expect(
        AuthService.comparePassword(newUser.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        })
      );
    });

    it("Should return 400 when there is a validation error", async () => {
      const newUser = {
        email: "john@mail.com",
        password: "password",
      };

      const response = await global.testRequest.post("/users").send(newUser);

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: "User validation failed: name: Path `name` is required.",
      });
    });

    it("Should return 409 when the user email already exists", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@mail.com",
        password: "password",
      };

      await global.testRequest.post("/users").send(newUser);
      const response = await global.testRequest.post("/users").send(newUser);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error: "User validation failed: email: already exists in the database.",
      });
    });
  });

  describe("When authenticating a user", () => {
    it("Should generate a token for a valid user", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@mail.com",
        password: "password",
      };

      await new User(newUser).save();
      const response = await global.testRequest
        .post("/users/authenticate")
        .send({ email: newUser.email, password: newUser.password });

      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });

    it("should return UNAUTHORIZED if the user with the given email does not found", async () => {
      const response = await global.testRequest
        .post("/users/authenticate")
        .send({ email: "some-email@mail.com", password: "1234" });

      expect(response.status).toBe(401);
    });

    it("should return UNAUTHORIZED if the user found but the password not match", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@mail.com",
        password: "password",
      };

      await new User(newUser).save();

      const response = await global.testRequest
        .post("/users/authenticate")
        .send({ email: newUser.email, password: "different-password" });

      expect(response.status).toBe(401);
    });
  });
});
