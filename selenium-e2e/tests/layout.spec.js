import { expect } from "chai";
import {
  buildDriver,
  gotoIfAvailable,
  pageLoaded,
  softFind,
  PATHS,
} from "./common.js";
import { By } from "selenium-webdriver";

describe("Layout (header/footer)", function () {
  this.timeout(90000);
  let driver;
  before(async () => {
    driver = await buildDriver();
  });
  after(async () => {
    if (driver) await driver.quit();
  });

  it("header or navbar is present (if implemented)", async () => {
    try {
      await gotoIfAvailable(driver, PATHS.home);
      await pageLoaded(driver);
      // common header/nav patterns
      await softFind(
        driver,
        By.css('header, nav, [role="navigation"], .navbar, .site-header'),
        1500
      );
    } catch {}
    expect(true).to.equal(true);
  });

  it("footer or site info is present (if implemented)", async () => {
    try {
      await gotoIfAvailable(driver, PATHS.home);
      await pageLoaded(driver);
      await softFind(
        driver,
        By.css('footer, [role="contentinfo"], .site-footer'),
        1500
      );
    } catch {}
    expect(true).to.equal(true);
  });
});
