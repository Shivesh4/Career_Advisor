// tests/common.js
import { Builder, By, until, Key } from "selenium-webdriver";
import * as dotenv from "dotenv";
import { createRequire } from "node:module";

dotenv.config();
const require = createRequire(import.meta.url);

// Try to resolve a local chromedriver binary (disables Selenium Manager)
let chromedriverPath = null;
try {
  const mod = require("chromedriver"); // CommonJS export
  if (mod?.path) chromedriverPath = mod.path;
} catch {
  // If not installed/resolvable, we'll fall back to Selenium Manager (not recommended with spaces in path)
}

export const BASE_URL = (
  process.env.BASE_URL || "http://localhost:8080"
).replace(/\/+$/, "");
const E2E_FLAG = process.env.E2E_FLAG || "e2e=1"; // allows your app to enable mocks if it supports it

export const PATHS = {
  home: process.env.HOME_PATH || "/",
  applications: process.env.APPLICATIONS_PATH || "/applications",
  ats: process.env.ATS_PATH || "/ats-scoring",
  jobs: process.env.JOBS_PATH || "/jobs",
  login: process.env.LOGIN_PATH || "/login",
  signup: process.env.SIGNUP_PATH || "/signup",
  profile: process.env.PROFILE_PATH || "/profile",
  notfound: process.env.NOTFOUND_PATH || "/__force-404__",
};

// ---- Driver builder (ESM, pinned to local chromedriver if available) ----
export async function buildDriver() {
  const chromeMod = await import("selenium-webdriver/chrome.js");
  const options = new chromeMod.Options();

  // Headless by default; set HEADLESS=false to run headed
  const headless = process.env.HEADLESS !== "false";
  if (headless) {
    options.addArguments("--headless=new", "--disable-gpu");
  }

  // Unique temp profile/cache per run (keeps state isolated)
  const path = (await import("path")).default;
  const fs = (await import("fs")).default;

  const baseTmp = path.resolve(process.cwd(), ".artifacts", "chrometmp");
  if (!fs.existsSync(baseTmp)) fs.mkdirSync(baseTmp, { recursive: true });

  const stamp = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  const userDataDir = path.join(baseTmp, `profile_${stamp}`);
  const diskCacheDir = path.join(baseTmp, `cache_${stamp}`);
  fs.mkdirSync(userDataDir, { recursive: true });
  fs.mkdirSync(diskCacheDir, { recursive: true });

  options.addArguments(
    "--window-size=1400,1000",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    `--user-data-dir=${userDataDir}`,
    `--disk-cache-dir=${diskCacheDir}`,
    "--media-cache-size=1",
    "--disable-features=Translate,BackForwardCache,AcceptCHFrame",
    "--disable-extensions",
    "--disable-background-networking",
    "--no-first-run",
    "--no-default-browser-check"
  );

  // Optional: point to a non-stable Chrome build via env
  if (process.env.CHROME_BINARY) {
    options.setChromeBinaryPath(process.env.CHROME_BINARY);
  }

  // Optional: quiet down profile errors
  options.setUserPreferences?.({
    "profile.default_content_setting_values.notifications": 2,
    "download.prompt_for_download": false,
    "safebrowsing.enabled": true,
  });

  const builder = new Builder().forBrowser("chrome").setChromeOptions(options);

  // KEY: pin service to local chromedriver to bypass Selenium Manager (path issues)
  if (chromedriverPath) {
    const service = new chromeMod.ServiceBuilder(chromedriverPath);
    builder.setChromeService(service);
  }

  const driver = await builder.build();
  await driver
    .manage()
    .setTimeouts({ implicit: 0, pageLoad: 25000, script: 15000 });
  return driver;
}

// ---- Helpers (unchanged) ----
export async function pageLoaded(driver, timeout = 15000) {
  await driver.wait(until.elementLocated(By.css("body")), timeout);
  await driver.wait(async () => {
    const rs = await driver.executeScript("return document.readyState");
    return rs === "complete";
  }, timeout);
}

export function withFlag(url) {
  return url.includes("?") ? `${url}&${E2E_FLAG}` : `${url}?${E2E_FLAG}`;
}

export async function gotoIfAvailable(driver, pathOrUrl) {
  const raw = pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${BASE_URL}${pathOrUrl}`;
  const url = withFlag(raw);
  try {
    await driver.get(url);
    await pageLoaded(driver);
  } catch {
    await driver.get(withFlag(`${BASE_URL}${PATHS.home}`));
    await pageLoaded(driver);
  }
}

export async function softFind(driver, locator, timeout = 2500) {
  try {
    await driver.wait(until.elementLocated(locator), timeout);
    const el = await driver.findElement(locator);
    await driver.wait(until.elementIsVisible(el), timeout);
    return el;
  } catch {
    return null;
  }
}

export async function typeIfPresent(el, value) {
  try {
    if (!el) return false;
    await el.clear();
    await el.sendKeys(value);
    return true;
  } catch {
    return false;
  }
}

export async function clickIfPresent(el) {
  try {
    if (el) {
      await el.click();
      return true;
    }
  } catch {}
  return false;
}

export async function waitForUrlContains(driver, piece, timeout = 5000) {
  try {
    await driver.wait(
      async () => (await driver.getCurrentUrl()).includes(piece),
      timeout
    );
    return true;
  } catch {
    return false;
  }
}

export async function getTextIfPresent(el) {
  try {
    return el ? await el.getText() : "";
  } catch {
    return "";
  }
}

export async function currentUrl(driver) {
  try {
    return await driver.getCurrentUrl();
  } catch {
    return "";
  }
}

export { By, until, Key };
