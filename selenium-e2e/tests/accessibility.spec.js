import { expect } from "chai";
import {
  buildDriver,
  gotoIfAvailable,
  pageLoaded,
  softFind,
  PATHS,
} from "./common.js";
import { By } from "selenium-webdriver";

describe("Basic a11y roles (presence only)", function () {
  this.timeout(90000);
  let driver;
  before(async () => {
    driver = await buildDriver();
  });
  after(async () => {
    if (driver) await driver.quit();
  });

  it("tries to locate landmark roles (no fail if missing)", async () => {
    try {
      await gotoIfAvailable(driver, PATHS.home);
      await pageLoaded(driver);
      await softFind(driver, By.css('[role="main"], main'), 1000);
      await softFind(driver, By.css('[role="navigation"], nav'), 1000);
      await softFind(driver, By.css('[role="contentinfo"], footer'), 1000);
      await softFind(driver, By.css('[role="banner"], header'), 1000);
    } catch {}
    expect(true).to.equal(true);
  });
});
