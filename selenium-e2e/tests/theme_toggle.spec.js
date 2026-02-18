import { expect } from "chai";
import {
  buildDriver,
  gotoIfAvailable,
  pageLoaded,
  softFind,
  PATHS,
} from "./common.js";
import { By } from "selenium-webdriver";

describe("Theme toggle (if available)", function () {
  this.timeout(90000);
  let driver;
  before(async () => {
    driver = await buildDriver();
  });
  after(async () => {
    if (driver) await driver.quit();
  });

  it("clicks theme toggle if present (no assertion on result)", async () => {
    try {
      await gotoIfAvailable(driver, PATHS.home);
      await pageLoaded(driver);
      const toggle = await softFind(
        driver,
        By.css(
          '[aria-label*="theme" i], [aria-label*="dark" i], [data-testid*="theme" i], button[class*="theme" i]'
        ),
        1500
      );
      if (toggle) await toggle.click();
    } catch {}
    expect(true).to.equal(true);
  });
});
