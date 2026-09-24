import { describe, beforeEach, it, expect, jest } from "@jest/globals";

const mockUser = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockBcrypt = {
  compare: jest.fn(),
};

const mockJwt = {
  sign: jest.fn(),
};

jest.unstable_mockModule("../../../models/User.js", () => ({
  default: mockUser,
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: mockBcrypt,
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: mockJwt,
}));

const { registerUser, loginUser, logoutUser } = await import("../../../controllers/authController.js");

const buildRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  cookie: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
});

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  it("returns 400 when required fields are missing during registration", async () => {
    const req = { body: { name: "Ali" } };
    const res = buildRes();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Name, email and password are required",
    });
  });

  it("returns 409 when the email already exists", async () => {
    const req = { body: { name: "Ali", email: "ali@test.com", password: "123456" } };
    const res = buildRes();

    mockUser.findOne.mockResolvedValue({ email: "ali@test.com" });

    await registerUser(req, res);

    expect(mockUser.findOne).toHaveBeenCalledWith({ email: "ali@test.com" });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "User already exists",
    });
  });

  it("creates a user and returns 201 on successful registration", async () => {
    const req = { body: { name: "Ali", email: "ali@test.com", password: "123456" } };
    const res = buildRes();

    mockUser.findOne.mockResolvedValue(null);
    mockUser.create.mockResolvedValue({
      _id: "user-1",
      name: "Ali",
      email: "ali@test.com",
    });

    await registerUser(req, res);

    expect(mockUser.create).toHaveBeenCalledWith({
      name: "Ali",
      email: "ali@test.com",
      password: "123456",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User registered successfully",
        user: {
          id: "user-1",
          name: "Ali",
          email: "ali@test.com",
        },
      }),
    );
  });

  it("returns 401 when the password is incorrect during login", async () => {
    const req = { body: { email: "ali@test.com", password: "wrong-pass" } };
    const res = buildRes();

    mockUser.findOne.mockResolvedValue({
      _id: "user-1",
      name: "Ali",
      email: "ali@test.com",
      password: "hashed-password",
    });
    mockBcrypt.compare.mockResolvedValue(false);

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  it("logs the user in and returns a token on success", async () => {
    const req = { body: { email: "ali@test.com", password: "123456" } };
    const res = buildRes();

    mockUser.findOne.mockResolvedValue({
      _id: "user-1",
      name: "Ali",
      email: "ali@test.com",
      password: "hashed-password",
    });
    mockBcrypt.compare.mockResolvedValue(true);
    mockJwt.sign.mockReturnValue("jwt-token-123");

    await loginUser(req, res);

    expect(mockJwt.sign).toHaveBeenCalledWith(
      { userId: "user-1" },
      "test-secret",
      { expiresIn: "30d" },
    );
    expect(res.cookie).toHaveBeenCalledWith(
      "authToken",
      "jwt-token-123",
      expect.objectContaining({ httpOnly: true }),
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "User in DataBase with correct password ",
        token: "jwt-token-123",
      }),
    );
  });

  it("clears the auth cookie on logout", () => {
    const res = buildRes();

    logoutUser({}, res);

    expect(res.clearCookie).toHaveBeenCalledWith(
      "authToken",
      expect.objectContaining({ httpOnly: true }),
    );
    expect(res.json).toHaveBeenCalledWith({
      message: "Logged out successfully",
    });
  });
});
