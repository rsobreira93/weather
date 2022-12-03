import { User } from "@src/models/user";

describe("Users functional tests", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  describe("When create a new user", () => {
    it("Should successfully a new user", async () => {
      const newUser = {
        name: "John Doe",
        email: "john@mail.com",
        password: "password",
      };

      const response = await global.testRequest.post("/users").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });

    it("Should return 400 when there is a validation error", async () => {
      const newUser = {
        email: "john@mail.com",
        password: "password",
      };

      const response = await global.testRequest.post("/users").send(newUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: "User validation failed: Path `name` is required.",
      });
    });
  });
});
