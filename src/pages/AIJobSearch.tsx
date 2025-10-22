import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface JobPosting {
  source: string;
  title: string;
  company: string;
  url: string;
  location?: string;
  createdAt?: number;
}

const GREENHOUSE_COMPANIES = ["stripe", "airbnb", "asana", "f5", "square"];
const LEVER_COMPANIES = ["airbnb", "asana", "affirm", "datadog", "stripe"];

const AIJobSearch: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const navigate = useNavigate();

  // ---------- FETCH FROM GREENHOUSE ----------
  const fetchGreenhouseJobs = async (query: string) => {
    const results: JobPosting[] = [];
    for (const company of GREENHOUSE_COMPANIES) {
      try {
        const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${company}/jobs`);
        if (!res.ok) continue;
        const data = await res.json();
        const filtered = data.jobs.filter((job: any) =>
          job.title.toLowerCase().includes(query.toLowerCase())
        );
        filtered.forEach((job: any) =>
          results.push({
            source: "Greenhouse",
            title: job.title,
            company,
            url: job.absolute_url,
            location: job.location?.name,
          })
        );
      } catch (e) {
        console.error(`Greenhouse fetch failed for ${company}`, e);
      }
    }
    return results;
  };

  // ---------- FETCH FROM LEVER ----------
  const fetchLeverJobs = async (query: string) => {
    const results: JobPosting[] = [];
    for (const company of LEVER_COMPANIES) {
      try {
        const res = await fetch(`https://api.lever.co/v0/postings/${company}?mode=json`);
        if (!res.ok) continue;
        const data = await res.json();
        const filtered = data.filter((job: any) =>
          job.text.toLowerCase().includes(query.toLowerCase())
        );
        filtered.forEach((job: any) =>
          results.push({
            source: "Lever",
            title: job.text,
            company,
            url: job.hostedUrl,
            location: job.categories?.location,
            createdAt: job.createdAt,
          })
        );
      } catch (e) {
        console.error(`Lever fetch failed for ${company}`, e);
      }
    }
    return results;
  };

  // ---------- MAIN SEARCH ----------
  const handleSearch = async () => {
    if (!keyword.trim()) return alert("Enter a keyword to search for jobs.");
    setLoading(true);
    setJobs([]);

    try {
      const [greenhouseJobs, leverJobs] = await Promise.all([
        fetchGreenhouseJobs(keyword),
        fetchLeverJobs(keyword),
      ]);

      // Combine & deduplicate (title + company)
      const all = [...greenhouseJobs, ...leverJobs];
      const seen = new Set();
      let uniqueJobs = all.filter((job) => {
        const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Filter by location
      if (location.trim()) {
        uniqueJobs = uniqueJobs.filter((job) =>
          job.location?.toLowerCase().includes(location.toLowerCase())
        );
      }

      // Sort newest first (Lever has timestamps)
      uniqueJobs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setJobs(uniqueJobs);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error("Job fetch error:", err);
      alert("Something went wrong while fetching jobs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center mb-6 text-green-700">
        Live Job Search (Greenhouse + Lever)
      </h1>

      {/* 🔹 Search Inputs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="e.g. software engineer, data analyst..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <input
          type="text"
          placeholder="Filter by location (e.g. Remote, New York, USA)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
        >
          {loading ? "Searching..." : "Search Jobs"}
        </button>
      </div>

      {/* Timestamp */}
      {lastUpdated && (
        <p className="text-sm text-gray-500 mb-4 text-center">
          Last Updated: {lastUpdated}
        </p>
      )}

      {/* Loader */}
      {loading && <p className="text-center text-gray-500">Fetching live jobs...</p>}

      {/* Job listings */}
      {!loading && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <div
              key={idx}
              className="border p-4 rounded hover:bg-gray-50 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-700">
                {job.company} • {job.location || "Location not specified"}
              </p>
              <p className="text-xs text-gray-500">
                Source: {job.source}{" "}
                {job.createdAt && `• Posted ${new Date(job.createdAt).toLocaleDateString()}`}
              </p>
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline mt-1 inline-block"
              >
                View Posting
              </a>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && jobs.length === 0 && keyword && (
        <p className="text-center text-gray-500 mt-6">
          No live openings found for “{keyword}”
          {location ? ` in “${location}”` : ""}.
        </p>
      )}

      {/* 🔹 New Button for Redirecting to Recent Jobs Page */}
      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/jobs")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          View Recent Job Postings
        </button>
      </div>
    </div>
  );
};

export default AIJobSearch;
