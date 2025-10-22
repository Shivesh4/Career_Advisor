// import { useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import Navigation from "@/components/Navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Search, MapPin, Briefcase, DollarSign, Clock, BookmarkPlus } from "lucide-react";
// import { toast } from "sonner";

// const Jobs = () => {
//   const [searchParams] = useSearchParams();
//   const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
//   const [location, setLocation] = useState(searchParams.get("loc") || "");
//   const [jobType, setJobType] = useState("all");

//   // Mock job data
//   const jobs = [
//     {
//       id: 1,
//       title: "Senior Frontend Developer",
//       company: "TechCorp Inc.",
//       location: "San Francisco, CA",
//       type: "Full-time",
//       salary: "$120k - $180k",
//       posted: "2 days ago",
//       skills: ["React", "TypeScript", "Tailwind CSS"],
//       description: "We're looking for an experienced frontend developer to join our team.",
//     },
//     {
//       id: 2,
//       title: "Product Manager",
//       company: "Innovation Labs",
//       location: "Remote",
//       type: "Full-time",
//       salary: "$130k - $200k",
//       posted: "1 week ago",
//       skills: ["Product Strategy", "Agile", "Analytics"],
//       description: "Lead product development and strategy for our flagship products.",
//     },
//     {
//       id: 3,
//       title: "UX/UI Designer",
//       company: "Design Studio Pro",
//       location: "New York, NY",
//       type: "Contract",
//       salary: "$90k - $140k",
//       posted: "3 days ago",
//       skills: ["Figma", "User Research", "Prototyping"],
//       description: "Create beautiful and intuitive user experiences for our clients.",
//     },
//     {
//       id: 4,
//       title: "Full Stack Engineer",
//       company: "StartupXYZ",
//       location: "Austin, TX",
//       type: "Full-time",
//       salary: "$110k - $160k",
//       posted: "5 days ago",
//       skills: ["Node.js", "React", "PostgreSQL"],
//       description: "Build scalable web applications from frontend to backend.",
//     },
//   ];

//   const handleApply = (jobTitle: string) => {
//     toast.success(`Application started for ${jobTitle}!`);
//   };

//   const handleSave = (jobTitle: string) => {
//     toast.success(`${jobTitle} saved to your list!`);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />
      
//       <div className="container mx-auto px-4 py-8">
//         {/* Search Section */}
//         <div className="bg-card shadow-card rounded-xl p-6 mb-8">
//           <div className="grid md:grid-cols-3 gap-4">
//             <div className="relative md:col-span-1">
//               <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
//               <Input
//                 placeholder="Job title or keyword"
//                 className="pl-10"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//             <div className="relative">
//               <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
//               <Input
//                 placeholder="Location"
//                 className="pl-10"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//               />
//             </div>
//             <Select value={jobType} onValueChange={setJobType}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Job Type" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Types</SelectItem>
//                 <SelectItem value="full-time">Full-time</SelectItem>
//                 <SelectItem value="contract">Contract</SelectItem>
//                 <SelectItem value="remote">Remote</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Results Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Job Opportunities</h1>
//             <p className="text-muted-foreground">
//               {jobs.length} jobs found {searchQuery && `for "${searchQuery}"`}
//             </p>
//           </div>
//           <Select defaultValue="recent">
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="recent">Most Recent</SelectItem>
//               <SelectItem value="salary">Highest Salary</SelectItem>
//               <SelectItem value="relevant">Most Relevant</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Job Listings */}
//         <div className="space-y-4">
//           {jobs.map((job) => (
//             <Card key={job.id} className="hover:shadow-elevated transition-smooth">
//               <CardHeader>
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
//                     <CardDescription className="text-base">
//                       <span className="font-semibold text-foreground">{job.company}</span>
//                     </CardDescription>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => handleSave(job.title)}
//                   >
//                     <BookmarkPlus className="h-5 w-5" />
//                   </Button>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <p className="text-muted-foreground">{job.description}</p>
                
//                 <div className="flex flex-wrap gap-2">
//                   {job.skills.map((skill) => (
//                     <Badge key={skill} variant="secondary">
//                       {skill}
//                     </Badge>
//                   ))}
//                 </div>

//                 <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
//                   <div className="flex items-center gap-1">
//                     <MapPin className="h-4 w-4" />
//                     {job.location}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Briefcase className="h-4 w-4" />
//                     {job.type}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <DollarSign className="h-4 w-4" />
//                     {job.salary}
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Clock className="h-4 w-4" />
//                     {job.posted}
//                   </div>
//                 </div>

//                 <Button 
//                   onClick={() => handleApply(job.title)}
//                   className="w-full gradient-primary text-white font-semibold"
//                 >
//                   Apply Now
//                 </Button>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Jobs;


import React, { useState, useEffect } from "react";

interface JobPosting {
  source: string;
  title: string;
  company: string;
  url: string;
  location?: string;
  updatedAt?: string;
  createdAt?: number;
}

const GREENHOUSE_COMPANIES = [
  "stripe",
  "airbnb",
  "asana",
  "openai",
  "notion",
  "datadog",
  "square",
  "dropbox",
  "plaid",
  "figma",
  "doordash",
  "discord",
  "f5",
];

const LEVER_COMPANIES = [
  "airbnb",
  "asana",
  "affirm",
  "datadog",
  "notion",
  "stripe",
  "square",
  "openai",
];

const Jobs: React.FC = () => {
  const [role, setRole] = useState("software engineer");
  const [location, setLocation] = useState("remote");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const RECENT_DAYS = 21; // last 3 weeks

  // 🔹 Greenhouse API fetch
  const fetchGreenhouseJobs = async (role: string) => {
    const results: JobPosting[] = [];
    for (const company of GREENHOUSE_COMPANIES) {
      try {
        const res = await fetch(
          `https://boards-api.greenhouse.io/v1/boards/${company}/jobs`
        );
        if (!res.ok) continue;
        const data = await res.json();

        // filter by role
        const filtered = data.jobs.filter((job: any) =>
          job.title.toLowerCase().includes(role.toLowerCase())
        );

        filtered.forEach((job: any) => {
          results.push({
            source: "Greenhouse",
            title: job.title,
            company,
            url: job.absolute_url,
            location: job.location?.name,
            updatedAt: job.updated_at,
          });
        });
      } catch (err) {
        console.error(`Error fetching Greenhouse jobs for ${company}`, err);
      }
    }
    return results;
  };

  // 🔹 Lever API fetch
  const fetchLeverJobs = async (role: string) => {
    const results: JobPosting[] = [];
    for (const company of LEVER_COMPANIES) {
      try {
        const res = await fetch(
          `https://api.lever.co/v0/postings/${company}?mode=json`
        );
        if (!res.ok) continue;
        const data = await res.json();

        // filter by role
        const filtered = data.filter((job: any) =>
          job.text.toLowerCase().includes(role.toLowerCase())
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
      } catch (err) {
        console.error(`Error fetching Lever jobs for ${company}`, err);
      }
    }
    return results;
  };

  const handleSearch = async () => {
    if (!role.trim()) return alert("Enter a job role to search");
    setLoading(true);
    setJobs([]);

    try {
      const [greenhouseJobs, leverJobs] = await Promise.all([
        fetchGreenhouseJobs(role),
        fetchLeverJobs(role),
      ]);

      // combine all jobs
      const all = [...greenhouseJobs, ...leverJobs];
      const seen = new Set<string>();
      let unique = all.filter((job) => {
        const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // 🔹 filter by location (if given)
      if (location.trim()) {
        unique = unique.filter((job) =>
          job.location?.toLowerCase().includes(location.toLowerCase())
        );
      }

      // 🔹 filter by recent timeframe
      const now = new Date();
      const cutoff = now.getTime() - RECENT_DAYS * 24 * 60 * 60 * 1000;

      unique = unique.filter((job) => {
        if (job.createdAt) {
          // Lever timestamp in ms
          return job.createdAt >= cutoff;
        } else if (job.updatedAt) {
          // Greenhouse ISO timestamp
          return new Date(job.updatedAt).getTime() >= cutoff;
        }
        return false;
      });

      // 🔹 sort newest first
      unique.sort((a, b) => {
        const aTime =
          a.createdAt || (a.updatedAt ? new Date(a.updatedAt).getTime() : 0);
        const bTime =
          b.createdAt || (b.updatedAt ? new Date(b.updatedAt).getTime() : 0);
        return bTime - aTime;
      });

      setJobs(unique);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(); // fetch initial jobs
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
        Recent Job Postings (Greenhouse + Lever)
      </h1>

      {/* 🔹 Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Enter job role (e.g. Software Engineer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <input
          type="text"
          placeholder="Enter location (e.g. Remote, New York)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {lastUpdated && (
        <p className="text-sm text-gray-500 mb-4 text-center">
          Last Updated: {lastUpdated}
        </p>
      )}

      {loading && <p className="text-center text-gray-500">Fetching recent jobs...</p>}

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
                {job.updatedAt &&
                  `• Updated ${new Date(job.updatedAt).toLocaleDateString()}`}
                {job.createdAt &&
                  `• Posted ${new Date(job.createdAt).toLocaleDateString()}`}
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

      {!loading && jobs.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No recent job postings found for “{role}” in “{location}” within the
          last {RECENT_DAYS / 7} weeks.
        </p>
      )}
    </div>
  );
};

export default Jobs;
