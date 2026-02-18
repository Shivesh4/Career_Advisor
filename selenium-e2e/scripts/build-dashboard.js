
import fs from "fs";
import path from "path";

const ART_ROOT = path.resolve(".artifacts", "runs");
const OUT = path.resolve(".artifacts", "dashboard.html");

function loadRuns() {
  if (!fs.existsSync(ART_ROOT)) return [];
  const dirs = fs
    .readdirSync(ART_ROOT)
    .filter((d) => fs.statSync(path.join(ART_ROOT, d)).isDirectory());
  dirs.sort(); // oldest -> newest
  const runs = [];
  for (const d of dirs) {
    const metaPath = path.join(ART_ROOT, d, "run_meta.json");
    if (fs.existsSync(metaPath)) {
      try {
        runs.push(JSON.parse(fs.readFileSync(metaPath, "utf-8")));
      } catch {
  
      }
    }
  }
  return runs;
}

function color(status) {
  if (status === "Success") return "#16a34a";
  if (status === "Failure") return "#dc2626";
  return "#6b7280";
}

function render(runs) {
  const totalRuns = runs.length;
  const successRuns = runs.filter((r) => r.totals.failed === 0).length;
  const passRate = totalRuns ? Math.round((successRuns / totalRuns) * 100) : 0;
  const totalTests = runs.reduce((a, r) => a + (r.totals?.total || 0), 0);

  // simple day buckets (last 30 runs)
  const last = runs.slice(-30);
  const bars = last.map((r) => ({
    label: r.run_id,
    ok: r.totals.passed,
    fail: r.totals.failed,
    skip: r.totals.skipped,
  }));

  // sources count
  const sources = {};
  for (const r of runs) {
    const s = r.source || "unknown";
    sources[s] = (sources[s] || 0) + 1;
  }
  const sourceLabels = Object.keys(sources);
  const sourceValues = sourceLabels.map((k) => sources[k]);

  // Build the HTML (Bootstrap + Chart.js via CDN)
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Runs & Results Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1"></script>
  <style>
    body { background:#0b1220; color:#e5e7eb; }
    .card { background:#111827; border:1px solid #1f2937;}
    .badge-success { background:#16a34a;}
    .badge-failure { background:#dc2626;}
    .badge-skip { background:#6b7280;}
    .muted { color:#9ca3af;}
    a { color:#60a5fa; text-decoration:none; }
    a:hover { text-decoration:underline; }
    .status-dot{ display:inline-block; width:10px; height:10px; border-radius:50%; margin-right:6px;}
  </style>
</head>
<body>
<div class="container py-4">
  <h3 class="mb-4">Runs & results</h3>

  <div class="row g-3">
    <div class="col-md-3">
      <div class="card p-3">
        <div class="muted">THIS WEEK</div>
        <div class="display-6">${totalRuns}</div>
        <div class="muted">runs (all time)</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card p-3">
        <div class="muted">SUCCESS RATE</div>
        <div class="display-6">${passRate}%</div>
        <div class="muted">${successRuns} of ${totalRuns} successful</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card p-3">
        <div class="muted">TESTS (all time)</div>
        <div class="display-6">${totalTests.toLocaleString()}</div>
        <div class="muted">from ${totalRuns} runs</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="card p-3">
        <div class="muted">MOST ACTIVE SOURCES</div>
        ${sourceLabels
          .map(
            (s, i) =>
              `<div><span class="status-dot" style="background:${
                ["#60a5fa", "#34d399", "#f59e0b", "#f472b6", "#a78bfa"][i % 5]
              }"></span>${s}: ${sourceValues[i]}</div>`
          )
          .join("")}
      </div>
    </div>
  </div>

  <div class="card p-3 mt-4">
    <div class="muted mb-2">Last ${bars.length} runs</div>
    <canvas id="barChart" height="100"></canvas>
  </div>

  <div class="card p-3 mt-4">
    <div class="d-flex justify-content-between align-items-center">
      <div class="muted">All runs (${totalRuns})</div>
      <div class="muted">Newest first</div>
    </div>
    <div class="table-responsive mt-2">
      <table class="table table-sm table-dark align-middle">
        <thead>
          <tr>
            <th>Run</th><th>Source</th><th>Tags</th><th>Status</th><th>Tests</th><th>Started</th><th>Open</th>
          </tr>
        </thead>
        <tbody>
          ${runs
            .slice()
            .reverse()
            .map((r) => {
              const status = r.totals.failed > 0 ? "Failure" : "Success";
              const badge =
                r.totals.failed > 0 ? "badge-failure" : "badge-success";
              const total = r.totals.total ?? 0;
              const started =
                r.started_at?.replace("T", " ").slice(0, 19) || r.run_id;
              const link = path
                .join("runs", r.run_id, "merged.html")
                .replaceAll("\\\\", "/"); // relative
              const tags = (r.tags || [])
                .map(
                  (t) =>
                    `<span class="badge text-bg-secondary me-1">${t}</span>`
                )
                .join("");
              return `<tr>
              <td>${r.run_id}</td>
              <td>${r.source || ""}</td>
              <td>${tags}</td>
              <td><span class="badge ${badge}">${status}</span></td>
              <td>${total}</td>
              <td>${started}</td>
              <td><a href="${link}">Report</a></td>
            </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  </div>
</div>

<script>
const bars = ${JSON.stringify(bars)};
const ctx = document.getElementById('barChart');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: bars.map(b=>b.label),
    datasets: [
      { label: 'Passed', data: bars.map(b=>b.ok), stack: 's', backgroundColor:'#16a34a' },
      { label: 'Failed', data: bars.map(b=>b.fail), stack: 's', backgroundColor:'#dc2626' },
      { label: 'Skipped', data: bars.map(b=>b.skip), stack: 's', backgroundColor:'#6b7280' },
    ]
  },
  options: {
    responsive:true,
    scales:{ x:{ stacked:true }, y:{ stacked:true, beginAtZero:true } },
    plugins:{ legend:{ labels:{ color:'#e5e7eb' } } }
  }
});
</script>
</body>
</html>`;
}

(async () => {
  const runs = loadRuns();
  const html = render(runs);
  fs.writeFileSync(OUT, html, "utf-8");
  console.log("Dashboard written:", OUT);
})();
