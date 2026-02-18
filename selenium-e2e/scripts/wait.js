
import "dotenv/config";
import waitOn from "wait-on";

const url = process.env.BASE_URL;
if (!url) {
  console.error(
    "ERROR: BASE_URL is not set. Put it in selenium-e2e/.env, e.g. BASE_URL=http://localhost:5173"
  );
  process.exit(1);
}

(async () => {
  try {
    console.log(`[wait] Waiting for ${url} ...`);
    await waitOn({
      resources: [url],
      // Accept 2xx/3xx responses
      validateStatus: (status) => status >= 200 && status < 400,
      timeout: 300000, // 5 minutes
      interval: 500,
      window: 1000,
      log: true,
    });
    console.log(`[wait] ${url} is up.`);
    process.exit(0);
  } catch (err) {
    console.error("[wait] Timed out or failed:", err?.message || err);
    process.exit(1);
  }
})();
