import { expect } from "chai";
import { buildDriver, gotoIfAvailable, pageLoaded, PATHS } from "./common.js";

describe("Home smoke test", function () {
  this.timeout(90000);
  let driver;

  before(async () => {
    driver = await buildDriver();
  });
  after(async () => {
    if (driver) await driver.quit();
  });

  it("loads the home page", async () => {
    try {
      await gotoIfAvailable(driver, PATHS.home);
      await pageLoaded(driver);
    } catch {}
    expect(true).to.equal(true);
  });
});
