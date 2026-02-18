import { jest } from "@jest/globals";
import { mockReqRes } from "./setupTests.js";

// prisma mock
jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
  __esModule: true,
}));

// email mock
jest.unstable_mockModule("../src/utils/email.js", () => ({
  transporter: { sendMail: jest.fn(async () => ({ accepted: ["ok@test"] })) },
  sendVerificationEmail: jest.fn(async (email, otp) => ({ email, otp })),
  sendResetPasswordEmail: jest.fn(async (email, otp) => ({ email, otp })),
  __esModule: true,
}));

// otp store mock
jest.unstable_mockModule("../src/utils/otpStore.js", () => {
  const store = new Map();
  return {
    saveOTP: (e, o) => store.set(e, o),
    verifyOTP: (e, o) => store.get(e) === o,
    __setOTP: (e, o) => store.set(e, o),
    __esModule: true,
  };
});

// bcrypt & jwt mocks (with default)
jest.unstable_mockModule("bcryptjs", () => {
  const api = { hash: jest.fn(async () => "hashed"), compare: jest.fn() };
  return { ...api, default: api, __esModule: true };
});
jest.unstable_mockModule("jsonwebtoken", () => {
  const api = { sign: jest.fn(() => "token-123"), verify: jest.fn() };
  return { ...api, default: api, __esModule: true };
});

// import after mocks
const prisma = (await import("../src/lib/prisma.js")).default;
const email = await import("../src/utils/email.js");
const otp = await import("../src/utils/otpStore.js");
const bcrypt = await import("bcryptjs");
await import("jsonwebtoken");
const ctrl = await import("../src/controllers/authController.js");

beforeEach(() => jest.clearAllMocks());

test("signup -> creates user & sends OTP", async () => {
  const { req, res } = mockReqRes({ body: { email: "a@b.com", password: "pw", firstName: "A" } });
  prisma.user.findUnique.mockResolvedValue(null);
  prisma.user.create.mockResolvedValue({ id: 1, email: "a@b.com" });

  await ctrl.signup(req, res);

  expect(prisma.user.create).toHaveBeenCalled();
  expect(
    email.transporter.sendMail.mock.calls.length > 0 ||
    email.sendVerificationEmail.mock.calls.length > 0
  ).toBe(true);

  const status = res.status.mock.calls[0]?.[0];
  if (status !== undefined) {
    expect([200, 201]).toContain(status);
  } else {
    // controller responded directly via res.json(...)
    expect(res.json).toHaveBeenCalled();
  }
});

test("login -> invalid password => 400/401", async () => {
  bcrypt.compare.mockResolvedValue(false);
  prisma.user.findUnique.mockResolvedValue({ id: 1, email: "a@b.com", password: "hashed" });

  const { req, res } = mockReqRes({ body: { email: "a@b.com", password: "wrong" } });
  await ctrl.login(req, res);

  expect([400, 401]).toContain(res.status.mock.calls[0][0]);
});

test("forgotPassword -> sends email", async () => {
  prisma.user.findUnique.mockResolvedValue({ id: 1, email: "a@b.com" });
  const { req, res } = mockReqRes({ body: { email: "a@b.com" } });
  await ctrl.forgotPassword(req, res);

  expect(
    email.transporter.sendMail.mock.calls.length > 0 ||
    email.sendResetPasswordEmail.mock.calls.length > 0
  ).toBe(true);

  const status = res.status.mock.calls[0]?.[0];
  if (status !== undefined) {
    expect([200, 202]).toContain(status);
  } else {
    expect(res.json).toHaveBeenCalled();
  }
});

test("verifyEmailOTP -> 400 wrong otp", async () => {
  const { req, res } = mockReqRes({ body: { email: "a@b.com", otp: "111111" } });
  otp.__setOTP("a@b.com", "222222");
  await ctrl.verifyEmailOTP(req, res);
  expect([400, 404]).toContain(res.status.mock.calls[0][0]);
});
