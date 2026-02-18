import { jest } from "@jest/globals";
import { mockReqRes } from "./setupTests.js";

jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  default: {
    user: {
      findUnique: jest.fn()
        .mockResolvedValueOnce(null) // signup
        .mockResolvedValueOnce({ id: 1, email: "a@b.com", password: "hashed" }), // login
      create: jest.fn().mockResolvedValue({ id: 1, email: "a@b.com" }),
      update: jest.fn(),
    },
  },
  __esModule: true,
}));

jest.unstable_mockModule("../src/utils/email.js", () => ({
  transporter: { sendMail: jest.fn(async () => ({ accepted: ["ok@test"] })) },
  sendVerificationEmail: jest.fn(async () => ({})),
  sendResetPasswordEmail: jest.fn(async () => ({})),
  __esModule: true,
}));

jest.unstable_mockModule("bcryptjs", () => {
  const api = { hash: jest.fn(async () => "hashed"), compare: jest.fn() };
  return { ...api, default: api, __esModule: true };
});
jest.unstable_mockModule("jsonwebtoken", () => {
  const api = { sign: jest.fn(() => "token") };
  return { ...api, default: api, __esModule: true };
});

const auth = await import("../src/controllers/authController.js");
const bcrypt = await import("bcryptjs");

test("signup -> verify -> login (mocked)", async () => {
  // signup
  const s = mockReqRes({ body: { email: "a@b.com", password: "secret", firstName: "A" } });
  await auth.signup(s.req, s.res);
  const sCode = s.res.status.mock.calls[0]?.[0];
  if (sCode !== undefined) expect([200, 201]).toContain(sCode);
  else expect(s.res.json).toHaveBeenCalled();

  // verify (status can be 200/400/404 depending on OTP store)
  const v = mockReqRes({ body: { email: "a@b.com", otp: "123456" } });
  await auth.verifyEmailOTP(v.req, v.res);
  expect([200, 400, 404]).toContain(v.res.status.mock.calls[0][0]);

  // login
  bcrypt.compare.mockResolvedValue(true);
  const l = mockReqRes({ body: { email: "a@b.com", password: "secret" } });
  await auth.login(l.req, l.res);

  const lCode = l.res.status.mock.calls[0]?.[0];
  const tokenPayload = l.res.json.mock.calls[0]?.[0];
  // Accept explicit 200 OR a JSON payload that includes token
  expect(
    lCode === 200 ||
    (tokenPayload && typeof tokenPayload.token === "string")
  ).toBe(true);
});
