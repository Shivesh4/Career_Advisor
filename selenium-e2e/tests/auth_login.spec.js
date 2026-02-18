import { expect } from "chai";
import {
  buildDriver,
  gotoIfAvailable,
  pageLoaded,
  softFind,
  typeIfPresent,
  clickIfPresent,
  waitForUrlContains,
  PATHS,
  By,
} from "./common.js";

describe("Auth: login happy path", function () {
  this.timeout(90000);
  let driver;
  before(async () => {
    driver = await buildDriver();
  });
  after(async () => {
    if (driver) await driver.quit();
  });

  it("logs in and shows post-login indicator", async () => {
    await gotoIfAvailable(driver, PATHS.login);
    await pageLoaded(driver);

    const email = await softFind(
      driver,
      By.css('input[type="email"], input[name*="email" i]')
    );
    const pass = await softFind(
      driver,
      By.css('input[type="password"], input[name*="pass" i]')
    );
    const btn = await softFind(
      driver,
      By.css(
        'button[type="submit"], [data-testid="login"], button:has-text("Login")'
      )
    );
    await typeIfPresent(email, "test@example.com");
    await typeIfPresent(pass, "secret123");
    await clickIfPresent(btn);

    // Outcome: URL changed OR UI shows "Welcome"/"Logout"
    const redirected =
      (await waitForUrlContains(driver, "/applications", 5000)) ||
      (await waitForUrlContains(driver, "/jobs", 5000));
    const welcome = await softFind(
      driver,
      By.xpath("//*[contains(.,'Welcome') or contains(.,'Logout')]"),
      3000
    );
    expect(redirected || !!welcome).to.equal(true);
  });
});
