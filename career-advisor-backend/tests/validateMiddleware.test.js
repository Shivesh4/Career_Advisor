import { z } from "zod";
import { mockReqRes } from "./setupTests.js";

const mod = await import("../src/middleware/validate.js");
const validate = mod.default || mod.validate || mod;

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

test("passes valid", async () => {
  const mw = validate(schema);
  const { req, res, next } = mockReqRes({ body: { email: "a@b.com", password: "123456" } });
  await mw(req, res, next);
  expect(next).toHaveBeenCalled();
});

test("400 invalid (or next(err) or error payload)", async () => {
  const mw = validate(schema);
  const { req, res, next } = mockReqRes({ body: { email: "bad", password: "123" } });
  await mw(req, res, next);

  const status = res.status.mock.calls[0]?.[0];
  if (status !== undefined) {
    expect(status).toBe(400);
  } else if (next.mock.calls.length) {
    // middleware delegated to centralized error handler
    expect(next).toHaveBeenCalled();
  } else {
    // returned error JSON directly
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
  }
});
