
import fs from "fs";
import path from "path";

const ART_ROOT = path.resolve(".artifacts", "runs");

function latestRunDir() {
  if (!fs.existsSync(ART_ROOT)) return null;
  const dirs = fs
    .readdirSync(ART_ROOT)
    .filter((d) => fs.statSync(path.join(ART_ROOT, d)).isDirectory());
  if (!dirs.length) return null;
  dirs.sort(); // timestamped names sort naturally
  return path.join(ART_ROOT, dirs[dirs.length - 1]);
}

function pickStatus(t) {
  if (t.pass) return "Passed";
  if (t.fail) return "Failed";
  if (t.pending) return "Skipped";
  return "Unknown";
}

(async () => {
  const runDir = latestRunDir();
  if (!runDir) {
    console.error("No runs found in .artifacts/runs");
    process.exit(1);
  }
  const mergedPath = path.join(runDir, "merged.json");
  if (!fs.existsSync(mergedPath)) {
    console.error("No merged.json in run dir", runDir);
    process.exit(1);
  }

  const SOURCE = process.env.SOURCE || "frontend-selenium";
  // Comma-separated tags: e.g. TAGS=release-3.0,ui,smoke
  const TAGS = (process.env.TAGS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const data = JSON.parse(fs.readFileSync(mergedPath, "utf-8"));

  // Flatten tests from mochawesome merged JSON:
  const tests = (data.results || [])
    .flatMap((r) => r.suites || [])
    .flatMap((s) =>
      (s.tests || []).map((t) => ({
        suite: s.title || "",
        title: t.title || "",
        state: pickStatus(t),
        duration: typeof t.duration === "number" ? t.duration : 0,
      }))
    );

  const totals = tests.reduce(
    (acc, t) => {
      acc.total++;
      acc.duration += t.duration || 0;
      if (t.state === "Passed") acc.passed++;
      else if (t.state === "Failed") acc.failed++;
      else if (t.state === "Skipped") acc.skipped++;
      return acc;
    },
    { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0 }
  );

  const success = totals.total
    ? Math.round((totals.passed / totals.total) * 100)
    : 0;

  const meta = {
    run_dir: runDir,
    run_id: path.basename(runDir),
    started_at: new Date().toISOString(),
    source: SOURCE,
    tags: TAGS,
    totals,
    success_rate: success,
  };

  fs.writeFileSync(
    path.join(runDir, "run_meta.json"),
    JSON.stringify(meta, null, 2),
    "utf-8"
  );
  console.log("Wrote run_meta.json:", path.join(runDir, "run_meta.json"));
})();
