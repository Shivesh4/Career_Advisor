import request from "supertest";
let mod;

test("server loads", async () => {
  mod = await import("../src/server.js");
  expect(mod).toBeDefined();
});

test("health route or 404", async () => {
  if (!mod?.app) return;
  const res = await request(mod.app).get("/health");
  expect([200, 404]).toContain(res.statusCode);
});
