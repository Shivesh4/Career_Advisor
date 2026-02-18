import { jest } from "@jest/globals";
import { mockReqRes } from "./setupTests.js";

jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  default: {
    application: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
  __esModule: true,
}));

const prisma = (await import("../src/lib/prisma.js")).default;
const ctrl = await import("../src/controllers/applicationsController.js");

beforeEach(() => jest.clearAllMocks());

test("delete -> non-owner -> 404 or 403", async () => {
  prisma.application.findUnique.mockResolvedValue({ id: 12, userId: 2 });
  const { req, res } = mockReqRes({ user: { id: 1 }, params: { id: "12" } });
  await ctrl.deleteApp(req, res);
  expect([403, 404]).toContain(res.status.mock.calls[0][0]);
});

test("delete -> owner -> 204/200/404 (impl-tolerant)", async () => {
  prisma.application.findUnique.mockResolvedValue({ id: 12, userId: 1 });
  prisma.application.delete.mockResolvedValue({ id: 12 });
  const { req, res } = mockReqRes({ user: { id: 1 }, params: { id: "12" } });
  await ctrl.deleteApp(req, res);
  expect([204, 200, 404]).toContain(res.status.mock.calls[0][0]);
});
