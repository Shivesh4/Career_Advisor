import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search, Calendar, MapPin, Building2, ExternalLink,
  Star, Bell, Loader2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// -------------------- Company Lists --------------------
const ATS_SOURCES = {
  GREENHOUSE: [
    "stripe", "airbnb", "asana", "databricks", "atlassian", "hubspot",
    "klaviyo", "figma", "doordash", "brex", "discord", "zapier",
    "rippling", "ramp", "gusto", "datadog", "openai", "affirm",
    "coursera", "linearapp", "retool", "miro", "plaid", "chainalysis", "pilot",
  ],
  LEVER: [
    "datadog", "affirm", "postman", "scaleai", "loom", "figma", "quip",
    "gem", "modernhealth", "vanta", "clearbit", "zapier", "harness",
    "benchling", "intercom", "launchdarkly", "retool", "verkada", "ramp",
    "rippling", "openai", "stripe",
  ],
  WORKDAY: [
    "amazon", "google", "meta", "microsoft", "salesforce",
    "oracle", "adobe", "cisco", "intuit", "dell",
  ],
  ASHBY: [
    "anthropic", "vercel", "notion", "linear", "hex", "benchling",
    "retool", "posthog", "runwayml", "synthesia", "calm",
  ],
};

// -------------------- Helpers --------------------
const decodeHtml = (html: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const highlight = (text: string, query: string) =>
  query
    ? text.replace(
        new RegExp(`(${query})`, "gi"),
        "<mark class='bg-yellow-200 font-semibold'>$1</mark>"
      )
    : text;

const CACHE_KEY = "cachedJobs";
const CACHE_DURATION = 1000 * 60 * 60 * 6; // 6 hours

// ✅ Location filter helpers
const STATE_CODES = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME",
  "MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA",
  "RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"
]);

const norm = (s?: string) =>
  (s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[().]/g, "")
    .trim();

const isUSLocation = (locNorm: string) => {
  if (!locNorm) return false;
  if (
    locNorm.includes("united states") ||
    locNorm === "us" ||
    locNorm.includes(" usa") ||
    /(^|[,\- ])us($|[,\- ])/.test(locNorm)
  ) return true;

  if (/, [A-Z]{2}(,|$)/.test((locNorm || "").toUpperCase())) {
    const m = (locNorm.match(/, ([A-Z]{2})(?:,|$)/) || [])[1];
    if (m && STATE_CODES.has(m.toUpperCase())) return true;
  }
  return false;
};

const matchLocation = (jobLocRaw: string, queryRaw: string) => {
  const loc = norm(jobLocRaw);
  const q = norm(queryRaw);
  if (!q) return true;

  const terms = q.split(",").map(t => t.trim()).filter(Boolean);
  return terms.some(term => {
    if (!term) return false;
    if (term.includes("remote")) {
      if (loc.includes("remote")) {
        if (term.includes("us") || term.includes("united states") || term.includes("usa"))
          return isUSLocation(loc);
        return true;
      }
      return false;
    }
    if (["us","usa","united states","u.s","u s"].includes(term))
      return isUSLocation(loc);
    if (term.length === 2 && STATE_CODES.has(term.toUpperCase())) {
      const up = (loc || "").toUpperCase();
      return up.includes(`, ${term.toUpperCase()}`) || up.endsWith(` ${term.toUpperCase()}`);
    }
    return loc.includes(term);
  });
};

// -------------------- Component --------------------
const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [searchRole, setSearchRole] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setSavedJobs(stored);
  }, []);

  // -------------------- Fetch + Cache --------------------
  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoading(true);
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setJobs(cached.data);
        setFilteredJobs(cached.data);
        setLoading(false);
        return;
      }

      const allCompanies = [
        ...ATS_SOURCES.GREENHOUSE,
        ...ATS_SOURCES.LEVER,
        ...ATS_SOURCES.WORKDAY,
        ...ATS_SOURCES.ASHBY,
      ];
      setProgress({ done: 0, total: allCompanies.length });

      const updateProgress = () => setProgress((p) => ({ ...p, done: p.done + 1 }));

      const parallelFetch = async (urls: Promise<any>[]) => {
        const res = await Promise.allSettled(urls);
        return res.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
      };

      const [gh, lv, wd, ab] = await Promise.all([
        // Greenhouse summaries
        parallelFetch(
          ATS_SOURCES.GREENHOUSE.map(async (company) => {
            try {
              const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company}/jobs`);
              updateProgress();
              const data = await res.json();
              return (
                data.jobs?.map((j: any) => ({
                  id: `gh-${j.id}`,
                  title: j.title,
                  company,
                  location: j.location?.name || "Remote",
                  url: j.absolute_url,
                  source: "Greenhouse",
                  jobType: "Not specified",
                  description: j.content || "",
                  datePosted: j.updated_at || null,
                  status: "saved",
                })) || []
              );
            } catch {
              updateProgress();
              return [];
            }
          })
        ),
        // Lever summaries
        parallelFetch(
          ATS_SOURCES.LEVER.map(async (company) => {
            try {
              const res = await fetch(`https://api.lever.co/v0/postings/${company}?mode=json`);
              updateProgress();
              const data = await res.json();
              return Array.isArray(data)
                ? data.map((j: any) => ({
                    id: `lv-${j.id}`,
                    title: j.text,
                    company,
                    location: j.categories?.location || "Remote",
                    url: j.hostedUrl,
                    source: "Lever",
                    jobType: j.categories?.commitment || "Not specified",
                    description: j.description || "",
                    datePosted: j.createdAt ? new Date(j.createdAt).toISOString() : null,
                    status: "saved",
                  }))
                : [];
            } catch {
              updateProgress();
              return [];
            }
          })
        ),
        // Workday
        parallelFetch(
          ATS_SOURCES.WORKDAY.map(async (company) => {
            try {
              const res = await fetch(
                `https://${company}.wd1.myworkdayjobs.com/en-US/wday/cxs/${company}/jobs`
              );
              updateProgress();
              const text = await res.text();
              const matches = text.match(
                /"title":"(.*?)".*?"locations":\["(.*?)"\].*?"externalPath":"(.*?)"/g
              );
              return (
                matches?.map((m, i) => {
                  const p = m.match(
                    /"title":"(.*?)".*?"locations":\["(.*?)"\].*?"externalPath":"(.*?)"/
                  );
                  return {
                    id: `wd-${company}-${i}`,
                    title: p?.[1] || "Untitled",
                    company,
                    location: p?.[2] || "Remote",
                    url: `https://${company}.wd1.myworkdayjobs.com${p?.[3]}`,
                    source: "Workday",
                    jobType: "Not specified",
                    description: "Workday job posting",
                    datePosted: null,
                    status: "saved",
                  };
                }) || []
              );
            } catch {
              updateProgress();
              return [];
            }
          })
        ),
        // Ashby
        parallelFetch(
          ATS_SOURCES.ASHBY.map(async (company) => {
            try {
              const res = await fetch(
                `https://api.ashbyhq.com/posting-api/job-board/${company}`
              );
              updateProgress();
              const data = await res.json();
              return (
                data.jobs?.map((j: any) => ({
                  id: `ab-${j.id}`,
                  title: j.title,
                  company,
                  location: j.location?.name || "Remote",
                  url: j.applyUrl,
                  source: "Ashby",
                  jobType: j.employmentType || "Not specified",
                  description: j.description || "",
                  datePosted: j.publishedAt || null,
                  status: "saved",
                })) || []
              );
            } catch {
              updateProgress();
              return [];
            }
          })
        ),
      ]);

      const combined = [...gh.flat(), ...lv.flat(), ...wd.flat(), ...ab.flat()];
      setJobs(combined);
      setFilteredJobs(combined);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: combined }));
      setLoading(false);

      // ✅ Background enrichment (fetch job type & description)
      const enrichJobDetails = async () => {
        const enriched = await Promise.all(
          combined.map(async (job) => {
            try {
              // ----- Greenhouse -----
              if (job.source === "Greenhouse") {
                const id = job.id.replace("gh-", "");
                const url = `https://boards-api.greenhouse.io/v1/boards/${job.company}/jobs/${id}`;
                const res = await fetch(url);
                if (!res.ok) return job;
                const data = await res.json();
                const rawContent =
                  data.content || data.job_post?.content || data.job_description || "";
                const plainDescription = rawContent
                  .replace(/<[^>]+>/g, " ")
                  .replace(/\s+/g, " ")
                  .trim();

                return {
                  ...job,
                  jobType:
                    data.metadata?.find((m: any) => m.name === "Employment Type")?.value ||
                    data.metadata?.find((m: any) => m.name === "Type")?.value ||
                    job.jobType,
                  description: plainDescription || job.description,
                  requirements:
                    data.metadata?.find((m: any) => m.name === "Requirements")?.value ||
                    data.metadata?.find((m: any) => m.name === "Qualifications")?.value ||
                    "",
                };
              }

              // ----- Lever -----
              if (job.source === "Lever") {
                const id = job.id.replace("lv-", "");
                const url = `https://api.lever.co/v0/postings/${job.company}/${id}`;
                const res = await fetch(url);
                if (!res.ok) return job;
                const data = await res.json();
                const desc =
                  data.descriptionPlain ||
                  data.description ||
                  (Array.isArray(data.lists)
                    ? data.lists
                        .map((l: any) =>
                          l.text ? `${l.text}: ${(l.content || []).join(", ")}` : ""
                        )
                        .join("\n")
                    : "");
                const cleanDesc = desc.replace(/<[^>]+>/g, " ").trim();

                return {
                  ...job,
                  jobType: data.categories?.commitment || job.jobType,
                  description: cleanDesc || job.description,
                };
              }

              return job;
            } catch {
              return job;
            }
          })
        );
        setJobs(enriched);
        setFilteredJobs(enriched);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: enriched })
        );
      };

      enrichJobDetails();

      // 🔔 Notify new jobs
      if (cached && cached.data) {
        const newOnes = combined.filter(
          (j) => !cached.data.some((c: any) => c.id === j.id)
        );
        if (newOnes.length > 0)
          setNotifications([`${newOnes.length} new job openings found!`]);
      }
    };

    fetchAllJobs();
  }, []);

  // -------------------- Filters --------------------
  useEffect(() => {
    const filtered = jobs.filter((j) => {
      const roleOk = (j.title || "").toLowerCase().includes((searchRole || "").toLowerCase());
      const locOk = matchLocation(j.location || "", searchLocation || "");
      return roleOk && locOk;
    });
    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [searchRole, searchLocation, jobs]);

  // -------------------- Save --------------------
  const handleSave = (job: any) => {
    const stored = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    const exists = stored.find((j: any) => j.id === job.id);
    const updated = exists ? stored.filter((j: any) => j.id !== job.id) : [...stored, job];
    localStorage.setItem("savedJobs", JSON.stringify(updated));
    setSavedJobs(updated);
  };

  // -------------------- Pagination --------------------
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          Find Jobs {loading && <Loader2 className="animate-spin h-5 w-5 text-blue-500" />}
        </h1>

        {notifications.map((n, i) => (
          <div key={i} className="bg-green-100 text-green-800 px-3 py-2 mb-3 rounded-md flex items-center gap-2">
            <Bell className="h-4 w-4" /> {n}
          </div>
        ))}

        {loading && (
          <p className="text-sm text-muted-foreground mb-4">
            Fetching {progress.done} / {progress.total} company boards…
          </p>
        )}

        {/* Search Inputs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by role"
              className="pl-9"
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
            />
          </div>
          <div className="relative flex-1 min-w-[250px]">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location (e.g. USA, Remote, CA, Texas)"
              className="pl-9"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Listings */}
        {!loading && currentJobs.length === 0 ? (
          <p className="text-muted-foreground">No jobs found.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {currentJobs.map((job) => {
                const isSaved = savedJobs.some((j) => j.id === job.id);
                return (
                  <Card key={job.id} className="hover:shadow-md transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <img
                          src={`https://logo.clearbit.com/${job.company}.com`}
                          alt=""
                          className="h-6 w-6 rounded-full border"
                          onError={(e) => ((e.currentTarget.style.display = "none"))}
                        />
                        <CardTitle
                          className="text-lg"
                          dangerouslySetInnerHTML={{
                            __html: highlight(job.title, searchRole),
                          }}
                        />
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" /> {job.company}
                      </CardDescription>
                      <p
                        className="text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{
                          __html: highlight(job.location, searchLocation),
                        }}
                      />
                    </CardHeader>
                    <CardContent>
                      {job.datePosted && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          {new Date(job.datePosted).toLocaleDateString()}
                        </p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" className="flex-1" onClick={() => setSelectedJob(job)}>
                          View <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                          variant={isSaved ? "default" : "outline"}
                          className="flex items-center gap-1"
                          onClick={() => handleSave(job)}
                        >
                          <Star className={`h-4 w-4 ${isSaved ? "text-yellow-400" : ""}`} />{" "}
                          {isSaved ? "Saved" : "Save"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="flex justify-between items-center">
              <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                Previous
              </Button>
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        {selectedJob && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedJob.title}</DialogTitle>
            </DialogHeader>
            <p className="text-lg font-semibold">{selectedJob.company}</p>
            <p className="text-muted-foreground text-sm mb-2">{selectedJob.location}</p>
            <p className="text-sm mb-1">
              <strong>Job Type:</strong> {selectedJob.jobType}
            </p>
            {selectedJob.datePosted && (
              <p className="text-sm mb-2">
                <strong>Date Posted:</strong>{" "}
                {new Date(selectedJob.datePosted).toLocaleDateString()}
              </p>
            )}
            <h3 className="font-semibold mt-4 mb-2">Description</h3>
            <div
              className="text-sm text-muted-foreground leading-relaxed space-y-2"
              dangerouslySetInnerHTML={{
                __html: decodeHtml(selectedJob.description || "No description available"),
              }}
            />
            {selectedJob.requirements && (
              <>
                <h3 className="font-semibold mt-4 mb-2">Requirements</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedJob.requirements}
                </p>
              </>
            )}
            <Button
              variant="default"
              className="mt-6"
              onClick={() => window.open(selectedJob.url, "_blank")}
            >
              Apply Now <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Jobs;
