import { jest } from "@jest/globals";
import { mockReqRes } from "./setupTests.js";

jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  default: {
    application: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
  __esModule: true,
}));

const prisma = (await import("../src/lib/prisma.js")).default;
const ctrl = await import("../src/controllers/applicationsController.js");

beforeEach(() => jest.clearAllMocks());

test("cannot update someone else's application -> 403/404", async () => {
  prisma.application.findUnique.mockResolvedValue({ id: 10, userId: 2, status: "APPLIED" });
  const { req, res, next } = mockReqRes({ user: { id: 1 }, params: { id: "10" }, body: { status: "OFFER" } });
  await ctrl.updateAppStatus(req, res, next);
  if (res.status.mock.calls.length) {
    expect([403, 404]).toContain(res.status.mock.calls[0][0]);
  } else {
    expect(next).toHaveBeenCalled();
  }
  expect(prisma.application.update).not.toHaveBeenCalled();
});

test("update on missing application -> 404 or next(e)", async () => {
  prisma.application.findUnique.mockResolvedValue(null);
  const { req, res, next } = mockReqRes({ user: { id: 1 }, params: { id: "999" }, body: { status: "OFFER" } });
  await ctrl.updateAppStatus(req, res, next);
  if (res.status.mock.calls.length) {
    expect(res.status).toHaveBeenCalledWith(404);
  } else {
    expect(next).toHaveBeenCalled();
  }
});
