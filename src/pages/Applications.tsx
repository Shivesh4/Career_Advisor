import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Building2,
  Search,
  ExternalLink,
  Filter,
  X,
  Star,
  Archive,
  Trash2,
  Zap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ✅ Decode encoded HTML from Lever/Greenhouse descriptions
const decodeHtml = (html: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const Applications = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [filters, setFilters] = useState({
    query: "",
    appliedFrom: "",
    appliedUntil: "",
    jobType: "",
    status: "",
  });

  const [applications, setApplications] = useState<any[]>([]);
  const [archivedJobs, setArchivedJobs] = useState<any[]>([]);
  const [favoriteJobs, setFavoriteJobs] = useState<any[]>([]);

  // 🧠 Load saved jobs from localStorage
  useEffect(() => {
    const savedFromLocal = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setApplications(savedFromLocal);
  }, []);

  // 🔄 Keep synced if localStorage changes or tab refocuses
  useEffect(() => {
    const syncLocal = () => {
      const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      setApplications(saved);
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") syncLocal();
    };
    window.addEventListener("storage", syncLocal);
    document.addEventListener("visibilitychange", handleVisibility);
    syncLocal();
    return () => {
      window.removeEventListener("storage", syncLocal);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // 🔍 Filtering logic
  const filteredApplications = applications.filter((job) => {
    const q = filters.query.toLowerCase();
    const matchesQuery =
      !q ||
      job.jobTitle?.toLowerCase().includes(q) ||
      job.title?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q);
    const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
    const matchesStatus = !filters.status || job.status === filters.status;
    const appliedDate = job.appliedDate ? new Date(job.appliedDate).getTime() : 0;
    const fromDate = filters.appliedFrom ? new Date(filters.appliedFrom).getTime() : null;
    const untilDate = filters.appliedUntil ? new Date(filters.appliedUntil).getTime() : null;
    const matchesDateRange =
      (!fromDate || appliedDate >= fromDate) &&
      (!untilDate || appliedDate <= untilDate);
    return matchesQuery && matchesJobType && matchesStatus && matchesDateRange;
  });

  // Handlers
  const handleStatusChange = (id: string | number, newStatus: string) => {
    setApplications((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
    );
    setSelectedJob((prev: any) => (prev ? { ...prev, status: newStatus } : prev));
  };

  const handleDelete = (id: string | number) => {
    setApplications((prev) => prev.filter((job) => job.id !== id));
    setArchivedJobs((prev) => prev.filter((job) => job.id !== id));
    setFavoriteJobs((prev) => prev.filter((job) => job.id !== id));
    const updated = JSON.parse(localStorage.getItem("savedJobs") || "[]").filter(
      (job: any) => job.id !== id
    );
    localStorage.setItem("savedJobs", JSON.stringify(updated));
    setSelectedJob(null);
  };

  const handleArchive = (job: any) => {
    if (!archivedJobs.some((j) => j.id === job.id)) {
      setArchivedJobs((prev) => [...prev, job]);
    }
    setApplications((prev) => prev.filter((a) => a.id !== job.id));
    setFavoriteJobs((prev) => prev.filter((a) => a.id !== job.id));
    setSelectedJob(null);
  };

  const handleFavorite = (job: any) => {
    if (favoriteJobs.some((f) => f.id === job.id)) {
      setFavoriteJobs((prev) => prev.filter((f) => f.id !== job.id)); // unsave
    } else {
      setFavoriteJobs((prev) => [...prev, job]);
    }
    setSelectedJob(null);
  };

  const columns = ["saved", "applied", "offer", "rejected"];
  const filterByStatus = (status: string) =>
    filteredApplications.filter((a) => a.status === status);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Your Job Tracker</h1>
            <p className="text-muted-foreground">
              Track and manage your job applications easily
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles or companies"
              className="pl-9"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
            />
          </div>

          <Input
            type="date"
            className="w-[160px]"
            value={filters.appliedFrom}
            onChange={(e) => setFilters({ ...filters, appliedFrom: e.target.value })}
          />
          <Input
            type="date"
            className="w-[160px]"
            value={filters.appliedUntil}
            onChange={(e) => setFilters({ ...filters, appliedUntil: e.target.value })}
          />

          <Select
            value={filters.jobType}
            onValueChange={(val) => setFilters({ ...filters, jobType: val })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Internship">Internship</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Co-op">Co-op</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(val) => setFilters({ ...filters, status: val })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="saved">Saved</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" title="Filter">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          {/* Active Tab */}
          <TabsContent value="active">
            <div className="grid md:grid-cols-4 gap-4">
              {columns.map((col) => (
                <div key={col} className="space-y-4">
                  <h2 className="text-lg font-semibold capitalize border-b pb-2">{col}</h2>
                  {filterByStatus(col).map((app) => (
                    <Card key={app.id} className="hover:shadow-md transition-all">
                      <CardHeader>
                        <div>
                          <CardTitle className="text-lg">{app.jobTitle || app.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" /> {app.company}
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        {app.status !== "saved" && app.appliedDate && (
                          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" /> Applied{" "}
                              {new Date(app.appliedDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {/* ✅ Show date posted */}
                        {app.datePosted && (
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Posted on {new Date(app.datePosted).toLocaleDateString()}
                          </span>
                        )}

                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => setSelectedJob(app)}
                        >
                          View Details <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Archived Tab */}
          <TabsContent value="archived">
            {archivedJobs.length === 0 ? (
              <p className="text-muted-foreground">No archived applications yet.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {archivedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg">{job.jobTitle || job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" /> {job.company}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">{job.location}</p>
                    </CardHeader>
                    <CardContent>
                      {job.datePosted && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Posted on {new Date(job.datePosted).toLocaleDateString()}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => setSelectedJob(job)}
                      >
                        View Details <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            {favoriteJobs.length === 0 ? (
              <p className="text-muted-foreground">No favorite applications yet.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {favoriteJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg">{job.jobTitle || job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" /> {job.company}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground">{job.location}</p>
                    </CardHeader>
                    <CardContent>
                      {job.datePosted && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Posted on {new Date(job.datePosted).toLocaleDateString()}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => setSelectedJob(job)}
                      >
                        View Details <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ✅ Job Details Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        {selectedJob && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
              <div className="flex justify-between items-start w-full">
                <DialogTitle className="text-2xl font-bold">
                  {selectedJob.jobTitle || selectedJob.title}
                </DialogTitle>
                {/* <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)}>
                  <X className="h-5 w-5" />
                </Button> */}
              </div>
            </DialogHeader>

            <div className="flex justify-between items-center mb-4 mt-2">
              <div>
                <p className="text-lg font-semibold">{selectedJob.company}</p>
                <p className="text-muted-foreground text-sm">{selectedJob.location}</p>
              </div>

              <div className="flex gap-2">
                {selectedJob.status === "saved" && (
                  <Button variant="outline" className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-blue-500" /> Apply
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => handleFavorite(selectedJob)}
                >
                  <Star className="h-4 w-4 text-blue-500" /> Favorite
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => handleArchive(selectedJob)}
                >
                  <Archive className="h-4 w-4 text-blue-500" /> Archive
                </Button>
                <Button
                  variant="destructive"
                  className="flex items-center gap-1"
                  onClick={() => handleDelete(selectedJob.id)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>

            {/* ✅ Job Info */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <p>
                  <strong>Job Type:</strong> {selectedJob.jobType || "Not specified"}
                </p>

                {selectedJob.datePosted && (
                  <p>
                    <strong>Date Posted:</strong>{" "}
                    {new Date(selectedJob.datePosted).toLocaleDateString()}
                  </p>
                )}

                {selectedJob.status !== "saved" && selectedJob.appliedDate && (
                  <p>
                    <strong>Applied On:</strong>{" "}
                    {new Date(selectedJob.appliedDate).toLocaleDateString()}
                  </p>
                )}

                <div>
                  <h3 className="text-lg font-semibold mt-4 mb-2">Description</h3>
                  {selectedJob.description ? (
                    <div
                      className="text-sm text-muted-foreground leading-relaxed space-y-2"
                      dangerouslySetInnerHTML={{
                        __html: decodeHtml(selectedJob.description),
                      }}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No description available.
                    </p>
                  )}
                </div>

                {selectedJob.requirements && (
                  <div>
                    <h3 className="text-lg font-semibold mt-4 mb-2">Requirements</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {selectedJob.requirements}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Application Status</h4>
                  <Select
                    value={selectedJob.status}
                    onValueChange={(val) => handleStatusChange(selectedJob.id, val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saved">Saved</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <textarea
                    placeholder="Add notes or reminders for this job..."
                    className="w-full border rounded-md p-2 text-sm bg-muted"
                    rows={5}
                  />
                </div>

                {selectedJob.url && (
                  <Button
                    variant="default"
                    className="w-full mt-4"
                    onClick={() => window.open(selectedJob.url, "_blank")}
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Applications;
