import { describe, beforeEach, it, expect, jest } from "@jest/globals";

const mockJwt = {
  verify: jest.fn(),
};

const mockUser = {
  findById: jest.fn(),
};

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: mockJwt,
}));

jest.unstable_mockModule("../../../models/User.js", () => ({
  default: mockUser,
}));

const { authMiddleware } = await import("../../../middleware/authMiddleware.js");

describe("authMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects requests with no auth token", async () => {
    const req = { cookies: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("attaches the user to req and calls next for valid tokens", async () => {
    const req = { cookies: { authToken: "valid-token" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    mockJwt.verify.mockReturnValue({ userId: "user-1" });
    mockUser.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user-1",
        name: "Ali",
        email: "ali@test.com",
      }),
    });

    await authMiddleware(req, res, next);

    expect(mockJwt.verify).toHaveBeenCalledWith("valid-token", process.env.JWT_SECRET);
    expect(req.user).toEqual({
      _id: "user-1",
      name: "Ali",
      email: "ali@test.com",
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects requests when the token is invalid or expired", async () => {
    const req = { cookies: { authToken: "bad-token" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    mockJwt.verify.mockImplementation(() => {
      throw new Error("jwt expired");
    });

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
