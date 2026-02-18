// tests/sanity.spec.js (ESM)
import { By, until } from "selenium-webdriver";
import fs from "node:fs";
import path from "node:path";
import { buildDriver, BASE_URL } from "./common.js";

function saveShot(img, name) {
  const out = path.join(".artifacts", `${name}.png`);
  fs.writeFileSync(out, img, "base64");
  return out;
}

describe("CareerHub E2E Sanity (ESM)", function () {
  this.timeout(60000);

  let driver;

  before(async () => {
    // Use the shared driver that pins to local chromedriver (bypasses Selenium Manager)
    driver = await buildDriver();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("opens homepage and checks the title", async () => {
    const APP_URL = process.env.APP_URL || BASE_URL || "http://localhost:5173";
    await driver.get(APP_URL);

    // Wait for a visible shell element (tweak selector if needed)
    await driver.wait(until.elementLocated(By.css("nav, header, .logo")), 15000);

    const title = await driver.getTitle();
    const img = await driver.takeScreenshot();
    const file = saveShot(img, "home");
    console.log("Saved screenshot:", file, "Title:", title);

    if (!title || !title.trim()) {
      throw new Error("Title should not be empty");
    }
  });
});
