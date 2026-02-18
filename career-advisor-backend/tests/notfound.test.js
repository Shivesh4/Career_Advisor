import request from "supertest";
let mod;

beforeAll(async () => { mod = await import("../src/server.js"); });

test("unknown route -> 404", async () => {
  if (!mod?.app) return;
  const res = await request(mod.app).get("/no_such_path_123");
  expect(res.statusCode).toBe(404);
});
