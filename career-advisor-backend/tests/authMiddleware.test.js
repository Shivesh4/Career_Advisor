import { jest } from "@jest/globals";
import { mockReqRes } from "./setupTests.js";

jest.unstable_mockModule("jsonwebtoken", () => {
  const api = { verify: jest.fn() };
  return { ...api, default: api, __esModule: true };
});

const jwt = await import("jsonwebtoken");
const mod = await import("../src/middleware/authMiddleware.js");
const authMiddleware = mod.authMiddleware || mod.default || mod.middleware || Object.values(mod)[0];

test("401 if missing header", async () => {
  const { req, res, next } = mockReqRes();
  await authMiddleware(req, res, next);
  expect(res.status).toHaveBeenCalledWith(401);
});

test("401 if invalid token", async () => {
  const { req, res, next } = mockReqRes({ headers: { authorization: "Bearer bad" } });
  jwt.verify.mockImplementation(() => { throw new Error("invalid"); });
  await authMiddleware(req, res, next);
  expect(res.status).toHaveBeenCalledWith(401);
});

test("next on valid token", async () => {
  const { req, res, next } = mockReqRes({ headers: { authorization: "Bearer good" } });
  jwt.verify.mockReturnValue({ id: 1 });
  await authMiddleware(req, res, next);
  expect(next).toHaveBeenCalled();
  expect(req.user.id).toBe(1);
});
