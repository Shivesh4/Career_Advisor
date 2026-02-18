
const fs = require("fs");
const path = require("path");
const { merge } = require("mochawesome-merge");
const marge = require("mochawesome-report-generator");

function listCandidateJsons(dir) {
  return fs
    .readdirSync(dir)
    .filter(
      (f) =>
        f.toLowerCase().endsWith(".json") && f.toLowerCase() !== "merged.json"
    )
    .map((f) => path.join(dir, f));
}

function filterValidJsons(files) {
  const valid = [];
  for (const file of files) {
    try {
      const txt = fs.readFileSync(file, "utf8");
      if (!txt || txt.trim().length < 2) continue;
      JSON.parse(txt); // validate
      valid.push(file.replace(/\\/g, "/"));
    } catch {
      // skip corrupt/truncated file
    }
  }
  return valid;
}

async function main() {
  const runDir = process.argv[2];
  if (!runDir || !fs.existsSync(runDir)) {
    console.error("Run directory not found:", runDir);
    process.exit(1);
  }

  const candidates = listCandidateJsons(runDir);
  const files = filterValidJsons(candidates);
  if (!files.length) {
    console.error("No valid mochawesome JSON files to merge in:", runDir);
    process.exit(1);
  }

  const merged = await merge({ files });

  const mergedPath = path.join(runDir, "merged.json");
  fs.writeFileSync(mergedPath, JSON.stringify(merged, null, 2), "utf8");

  await marge.create(merged, {
    reportDir: runDir,
    reportFilename: "merged",
    inline: true,
    reportTitle: "UI Test Report",
  });

  console.log("Wrote:", mergedPath);
  console.log("HTML :", path.join(runDir, "merged.html"));
}

main().catch((e) => {
  console.error("merge-and-report failed:", e);
  process.exit(1);
});
