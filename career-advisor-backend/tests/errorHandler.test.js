import { mockReqRes } from "./setupTests.js";
const mod = await import("../src/middleware/errorHandler.js");
const errorHandler = mod.default || mod.errorHandler || mod;

test("uses err.status", async () => {
  const { req, res } = mockReqRes();
  await errorHandler({ status: 418, message: "teapot" }, req, res);
  expect(res.status).toHaveBeenCalledWith(418);
});

test("defaults to 500", async () => {
  const { req, res } = mockReqRes();
  await errorHandler(new Error("boom"), req, res);
  expect(res.status).toHaveBeenCalledWith(500);
});
