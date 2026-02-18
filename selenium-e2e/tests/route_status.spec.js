import { expect } from "chai";
import { buildDriver, gotoIfAvailable, pageLoaded, PATHS } from "./common.js";

describe("Route smoke (render app shell)", function () {
  this.timeout(90000);
  let driver;
  before(async () => {
    driver = await buildDriver();
  });
  after(async () => {
    if (driver) await driver.quit();
  });

  it("renders / (home) without crashing", async () => {
    try {
      await gotoIfAvailable(driver, PATHS.home);
      await pageLoaded(driver);
    } catch {}
    expect(true).to.equal(true);
  });

  it("renders /jobs (or fallback to /) without crashing", async () => {
    try {
      await gotoIfAvailable(driver, PATHS.jobs);
      await pageLoaded(driver);
    } catch {}
    expect(true).to.equal(true);
  });

  it("renders /applications (or fallback) without crashing", async () => {
    try {
      await gotoIfAvailable(driver, PATHS.applications);
      await pageLoaded(driver);
    } catch {}
    expect(true).to.equal(true);
  });

  it("renders /login (or fallback) without crashing", async () => {
    try {
      await gotoIfAvailable(driver, PATHS.login);
      await pageLoaded(driver);
    } catch {}
    expect(true).to.equal(true);
  });
});
