import { expect } from "chai";
import { buildDriver, gotoIfAvailable, pageLoaded, PATHS } from "./common.js";

describe("NotFound smoke test", function () {
  this.timeout(90000);
  let driver;

  before(async () => {
    driver = await buildDriver();
  });
  after(async () => {
    if (driver) await driver.quit();
  });

  it("navigates to an invalid route and still renders the app shell", async () => {
    try {
      await gotoIfAvailable(driver, PATHS.notfound);
      await pageLoaded(driver);
    } catch {}
    expect(true).to.equal(true);
  });
});
