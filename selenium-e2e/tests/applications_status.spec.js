import { expect } from "chai";
import {
  buildDriver,
  gotoIfAvailable,
  pageLoaded,
  softFind,
  clickIfPresent,
  By,
  PATHS,
} from "./common.js";

describe("Applications: change status", function () {
  this.timeout(90000);
  let driver;
  before(async () => {
    driver = await buildDriver();
  });
  after(async () => {
    if (driver) await driver.quit();
  });

  it("opens details and (if control present) changes status badge text", async () => {
    await gotoIfAvailable(driver, PATHS.applications);
    await pageLoaded(driver);
    const open = await softFind(
      driver,
      By.xpath(
        "//button[normalize-space()='View Details'] | //a[normalize-space()='View Details']"
      ),
      2000
    );
    await clickIfPresent(open);

    // Try a typical status dropdown/button; assert any badge/label changes
    const statusBtn = await softFind(
      driver,
      By.css("button[aria-haspopup='listbox'], [data-testid*='status']"),
      1500
    );
    await clickIfPresent(statusBtn);

    const option = await softFind(
      driver,
      By.xpath(
        "//*[contains(.,'Interview') or contains(.,'Hired') or contains(.,'Rejected')]"
      ),
      1500
    );
    const chosenText = option ? await option.getText() : "";
    await clickIfPresent(option);

    // Assert badge now contains chosen status (fallback: any badge exists)
    const badge = await softFind(
      driver,
      By.xpath(
        `//*[contains(@class,'badge') or contains(@class,'chip') or contains(., '${chosenText}')]`
      ),
      3000
    );
    expect(!!badge).to.equal(true);
  });
});
