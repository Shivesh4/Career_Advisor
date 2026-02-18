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

describe("Validation: required inputs", function () {
  this.timeout(90000);
  let driver;
  before(async () => {
    driver = await buildDriver();
  });
  after(async () => {
    if (driver) await driver.quit();
  });

  it("signup shows inline errors or disables submit when empty", async () => {
    await gotoIfAvailable(driver, PATHS.signup);
    await pageLoaded(driver);
    const submit = await softFind(
      driver,
      By.css('button[type="submit"], [data-testid="signup"]'),
      1500
    );
    await clickIfPresent(submit);

    const err = await softFind(
      driver,
      By.xpath(
        "//*[contains(.,'required') or contains(.,'invalid') or contains(@class,'error') or contains(@class,'helper-text')]"
      ),
      3000
    );

    let disabled = false;
    if (submit) disabled = (await submit.getAttribute("disabled")) !== null;

    expect(!!err || disabled).to.equal(true);
  });
});
