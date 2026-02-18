
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import "dotenv/config";

const ARTIFACTS_DIR = path.resolve(".artifacts");
const JSON_REPORT = path.join(ARTIFACTS_DIR, "mocha.json");
const EXCEL_PATH = path.resolve("selenium_test_report.xlsx");

async function main() {
  if (!fs.existsSync(JSON_REPORT)) {
    console.error(`No JSON report found at ${JSON_REPORT}`);
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(JSON_REPORT, "utf-8"));
  const runTimestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  const baseUrl = process.env.BASE_URL || "";
  const environment = "Chrome (headless)";

  const tests = (report.tests || []).map((t) => ({
    Suite: (t.fullTitle || "").replace(t.title || "", "").trim(),
    Test: t.title || "",
    Status:
      t.state === "passed"
        ? "Passed"
        : t.state === "failed"
        ? "Failed"
        : t.pending
        ? "Skipped"
        : "Unknown",
    Duration_ms: typeof t.duration === "number" ? t.duration : "",
    Error:
      t.err && (t.err.message || t.err.stack)
        ? `${t.err.message || ""} ${t.err.stack || ""}`.trim()
        : "",
  }));

  const stats = report.stats || {};
  const summaryRow = {
    Run_Timestamp: runTimestamp,
    Base_URL: baseUrl,
    Environment: environment,
    Total_Tests: stats.tests ?? tests.length,
    Passed: stats.passes ?? tests.filter((x) => x.Status === "Passed").length,
    Failed: stats.failures ?? tests.filter((x) => x.Status === "Failed").length,
    Skipped:
      stats.pending ?? tests.filter((x) => x.Status === "Skipped").length,
    Total_Duration_ms:
      stats.duration ??
      tests.reduce((a, b) => a + (Number(b.Duration_ms) || 0), 0),
  };

  const wb = new ExcelJS.Workbook();
  if (fs.existsSync(EXCEL_PATH)) {
    await wb.xlsx.readFile(EXCEL_PATH);
  }

  let summarySheet = wb.getWorksheet("Summary");
  if (!summarySheet) {
    summarySheet = wb.addWorksheet("Summary");
    summarySheet.columns = [
      { header: "Run_Timestamp", key: "Run_Timestamp", width: 20 },
      { header: "Base_URL", key: "Base_URL", width: 30 },
      { header: "Environment", key: "Environment", width: 20 },
      { header: "Total_Tests", key: "Total_Tests", width: 12 },
      { header: "Passed", key: "Passed", width: 10 },
      { header: "Failed", key: "Failed", width: 10 },
      { header: "Skipped", key: "Skipped", width: 10 },
      { header: "Total_Duration_ms", key: "Total_Duration_ms", width: 18 },
    ];
  }
  summarySheet.addRow(summaryRow);

  let resultsSheet = wb.getWorksheet("Test Results");
  if (!resultsSheet) {
    resultsSheet = wb.addWorksheet("Test Results");
    resultsSheet.columns = [
      { header: "Run_Timestamp", key: "Run_Timestamp", width: 20 },
      { header: "Suite", key: "Suite", width: 40 },
      { header: "Test", key: "Test", width: 60 },
      { header: "Status", key: "Status", width: 10 },
      { header: "Duration_ms", key: "Duration_ms", width: 14 },
      { header: "Environment", key: "Environment", width: 20 },
      { header: "Base_URL", key: "Base_URL", width: 30 },
      { header: "Error", key: "Error", width: 80 },
    ];
  }

  tests.forEach((t) => {
    resultsSheet.addRow({
      Run_Timestamp: runTimestamp,
      Suite: t.Suite,
      Test: t.Test,
      Status: t.Status,
      Duration_ms: t.Duration_ms,
      Environment: environment,
      Base_URL: baseUrl,
      Error: t.Error,
    });
  });

  await wb.xlsx.writeFile(EXCEL_PATH);
  console.log(`Excel report written to ${EXCEL_PATH}`);
}

main().catch((err) => {
  console.error("report-to-excel failed:", err);
  process.exit(1);
});
