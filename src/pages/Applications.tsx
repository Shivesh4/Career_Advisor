// import Navigation from "@/components/Navigation";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Calendar, Building2, ExternalLink, Clock } from "lucide-react";
// import { Progress } from "@/components/ui/progress";

// const Applications = () => {
//   const applications = [
//     {
//       id: 1,
//       jobTitle: "Senior Frontend Developer",
//       company: "TechCorp Inc.",
//       appliedDate: "2025-10-15",
//       status: "interviewing",
//       progress: 75,
//       nextStep: "Final round interview on Oct 25",
//     },
//     {
//       id: 2,
//       jobTitle: "Product Manager",
//       company: "Innovation Labs",
//       appliedDate: "2025-10-10",
//       status: "pending",
//       progress: 25,
//       nextStep: "Waiting for initial review",
//     },
//     {
//       id: 3,
//       jobTitle: "UX/UI Designer",
//       company: "Design Studio Pro",
//       appliedDate: "2025-10-08",
//       status: "offer",
//       progress: 100,
//       nextStep: "Offer received - respond by Oct 30",
//     },
//     {
//       id: 4,
//       jobTitle: "Full Stack Engineer",
//       company: "StartupXYZ",
//       appliedDate: "2025-10-05",
//       status: "rejected",
//       progress: 50,
//       nextStep: "Application not selected",
//     },
//   ];

//   const getStatusColor = (status: string) => {
//     const colors = {
//       pending: "bg-warning/10 text-warning",
//       interviewing: "bg-primary/10 text-primary",
//       offer: "bg-success/10 text-success",
//       rejected: "bg-destructive/10 text-destructive",
//     };
//     return colors[status as keyof typeof colors] || "bg-muted";
//   };

//   const getStatusLabel = (status: string) => {
//     const labels = {
//       pending: "Pending Review",
//       interviewing: "Interviewing",
//       offer: "Offer Received",
//       rejected: "Not Selected",
//     };
//     return labels[status as keyof typeof labels] || status;
//   };

//   const filterByStatus = (status?: string) => {
//     if (!status) return applications;
//     return applications.filter((app) => app.status === status);
//   };

//   const stats = [
//     {
//       label: "Total Applications",
//       value: applications.length,
//       color: "text-primary",
//     },
//     {
//       label: "In Progress",
//       value: applications.filter((a) => a.status === "interviewing").length,
//       color: "text-primary",
//     },
//     {
//       label: "Offers",
//       value: applications.filter((a) => a.status === "offer").length,
//       color: "text-success",
//     },
//     {
//       label: "Response Rate",
//       value: "75%",
//       color: "text-accent",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />
      
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-2">My Applications</h1>
//           <p className="text-muted-foreground">Track and manage your job applications</p>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid md:grid-cols-4 gap-4 mb-8">
//           {stats.map((stat) => (
//             <Card key={stat.label} className="shadow-card">
//               <CardContent className="pt-6">
//                 <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
//                 <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Applications List */}
//         <Tabs defaultValue="all" className="space-y-6">
//           <TabsList className="grid w-full max-w-md grid-cols-4">
//             <TabsTrigger value="all">All</TabsTrigger>
//             <TabsTrigger value="pending">Pending</TabsTrigger>
//             <TabsTrigger value="interviewing">Active</TabsTrigger>
//             <TabsTrigger value="offer">Offers</TabsTrigger>
//           </TabsList>

//           <TabsContent value="all" className="space-y-4">
//             {applications.map((app) => (
//               <Card key={app.id} className="hover:shadow-elevated transition-smooth">
//                 <CardHeader>
//                   <div className="flex items-start justify-between">
//                     <div className="space-y-2">
//                       <CardTitle className="text-2xl">{app.jobTitle}</CardTitle>
//                       <CardDescription className="flex items-center gap-2 text-base">
//                         <Building2 className="h-4 w-4" />
//                         {app.company}
//                       </CardDescription>
//                     </div>
//                     <Badge className={getStatusColor(app.status)}>
//                       {getStatusLabel(app.status)}
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Application Progress</span>
//                       <span className="font-semibold">{app.progress}%</span>
//                     </div>
//                     <Progress value={app.progress} className="h-2" />
//                   </div>

//                   <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-1">
//                       <Calendar className="h-4 w-4" />
//                       Applied {new Date(app.appliedDate).toLocaleDateString()}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-4 w-4" />
//                       {app.nextStep}
//                     </div>
//                   </div>

//                   <div className="flex gap-2">
//                     <Button variant="outline" className="flex-1">
//                       View Details
//                       <ExternalLink className="ml-2 h-4 w-4" />
//                     </Button>
//                     {app.status === "interviewing" && (
//                       <Button className="flex-1 gradient-primary text-white">
//                         Schedule Interview
//                       </Button>
//                     )}
//                     {app.status === "offer" && (
//                       <Button className="flex-1 bg-success text-white hover:bg-success/90">
//                         Review Offer
//                       </Button>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </TabsContent>

//           {["pending", "interviewing", "offer"].map((status) => (
//             <TabsContent key={status} value={status} className="space-y-4">
//               {filterByStatus(status).map((app) => (
//                 <Card key={app.id} className="hover:shadow-elevated transition-smooth">
//                   <CardHeader>
//                     <div className="flex items-start justify-between">
//                       <div className="space-y-2">
//                         <CardTitle className="text-2xl">{app.jobTitle}</CardTitle>
//                         <CardDescription className="flex items-center gap-2 text-base">
//                           <Building2 className="h-4 w-4" />
//                           {app.company}
//                         </CardDescription>
//                       </div>
//                       <Badge className={getStatusColor(app.status)}>
//                         {getStatusLabel(app.status)}
//                       </Badge>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-muted-foreground">Application Progress</span>
//                         <span className="font-semibold">{app.progress}%</span>
//                       </div>
//                       <Progress value={app.progress} className="h-2" />
//                     </div>

//                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                       <div className="flex items-center gap-1">
//                         <Calendar className="h-4 w-4" />
//                         Applied {new Date(app.appliedDate).toLocaleDateString()}
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Clock className="h-4 w-4" />
//                         {app.nextStep}
//                       </div>
//                     </div>

//                     <div className="flex gap-2">
//                       <Button variant="outline" className="flex-1">
//                         View Details
//                         <ExternalLink className="ml-2 h-4 w-4" />
//                       </Button>
//                       {app.status === "interviewing" && (
//                         <Button className="flex-1 gradient-primary text-white">
//                           Schedule Interview
//                         </Button>
//                       )}
//                       {app.status === "offer" && (
//                         <Button className="flex-1 bg-success text-white hover:bg-success/90">
//                           Review Offer
//                         </Button>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </TabsContent>
//           ))}
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default Applications;

// import { useState } from "react";
// import Navigation from "@/components/Navigation";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Calendar,
//   Building2,
//   Search,
//   ExternalLink,
//   Filter,
//   X,
//   Star,
//   Archive,
//   Trash2,
//   Zap,
// } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// const Applications = () => {
//   const [selectedJob, setSelectedJob] = useState<any>(null);
//   const [filters, setFilters] = useState({
//     query: "",
//     appliedFrom: "",
//     appliedUntil: "",
//     jobType: "",
//     status: "",
//   });

//   const [applications, setApplications] = useState([
//     {
//       id: 1,
//       jobTitle: "Intern - Software Engineering",
//       company: "PDC Protodyne Corporation",
//       appliedDate: "2025-10-10",
//       status: "saved",
//       location: "USA - CT - Bloomfield - 1302 Hall Boulevard, USA",
//       jobType: "Internship",
//       description:
//         "At Labcorp, we believe in the power of science to change lives. Our work combines unparalleled diagnostic laboratories, drug development capabilities, and commercial innovations.",
//     },
//     {
//       id: 2,
//       jobTitle: "AI Intern",
//       company: "Red Hat Consulting",
//       appliedDate: "2025-10-12",
//       status: "applied",
//       location: "Boston, USA",
//       jobType: "Internship",
//       description: "Assist in developing AI-powered tools and data pipelines for enterprise clients.",
//     },
//     {
//       id: 3,
//       jobTitle: "Full Stack Developer",
//       company: "Mercury",
//       appliedDate: "2025-10-04",
//       status: "offer",
//       location: "San Francisco, CA, USA",
//       jobType: "Full-time",
//       description: "Work on backend APIs and frontend dashboards in a fast-paced fintech startup.",
//     },
//     {
//       id: 4,
//       jobTitle: "Software Engineer Co-op",
//       company: "StartupXYZ",
//       appliedDate: "2025-09-28",
//       status: "rejected",
//       location: "Remote",
//       jobType: "Co-op",
//       description: "Worked on backend integrations and RESTful APIs.",
//     },
//   ]);

//   const [archivedJobs, setArchivedJobs] = useState<any[]>([]);

//   // 🔍 Dynamic filtering (local)
//   const filteredApplications = applications.filter((job) => {
//     const q = filters.query.toLowerCase();
//     const matchesQuery =
//       !q || job.jobTitle.toLowerCase().includes(q) || job.company.toLowerCase().includes(q);
//     const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
//     const matchesStatus = !filters.status || job.status === filters.status;

//     const appliedDate = new Date(job.appliedDate).getTime();
//     const fromDate = filters.appliedFrom ? new Date(filters.appliedFrom).getTime() : null;
//     const untilDate = filters.appliedUntil ? new Date(filters.appliedUntil).getTime() : null;

//     const matchesDateRange =
//       (!fromDate || appliedDate >= fromDate) && (!untilDate || appliedDate <= untilDate);

//     return matchesQuery && matchesJobType && matchesStatus && matchesDateRange;
//   });

//   const handleStatusChange = (id: number, newStatus: string) => {
//     setApplications((prev) =>
//       prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
//     );
//     setSelectedJob((prev: any) => (prev ? { ...prev, status: newStatus } : prev));
//   };

//   const handleDelete = (id: number) => {
//     setApplications((prev) => prev.filter((job) => job.id !== id));
//     setArchivedJobs((prev) => prev.filter((job) => job.id !== id));
//     setSelectedJob(null);
//   };

//   const handleArchive = (job: any) => {
//     setArchivedJobs((prev) => [...prev, job]);
//     setApplications((prev) => prev.filter((a) => a.id !== job.id));
//     setSelectedJob(null);
//   };

//   const columns = ["saved", "applied", "offer", "rejected"];
//   const filterByStatus = (status: string) =>
//     filteredApplications.filter((a) => a.status === status);

//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />

//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold">Your Job Tracker</h1>
//             <p className="text-muted-foreground">Track and manage your job applications easily</p>
//           </div>
//           <div className="flex gap-2 mt-4 md:mt-0">
//             <Button variant="outline">Import CSV</Button>
//             <Button variant="outline">Export CSV</Button>
//           </div>
//         </div>

//         {/* Filter Bar */}
//         <div className="flex flex-wrap gap-3 mb-8 items-center">
//           <div className="relative flex-1 min-w-[250px]">
//             <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search roles or companies"
//               className="pl-9"
//               value={filters.query}
//               onChange={(e) => setFilters({ ...filters, query: e.target.value })}
//             />
//           </div>

//           <Input
//             type="date"
//             className="w-[160px]"
//             value={filters.appliedFrom}
//             onChange={(e) => setFilters({ ...filters, appliedFrom: e.target.value })}
//           />
//           <Input
//             type="date"
//             className="w-[160px]"
//             value={filters.appliedUntil}
//             onChange={(e) => setFilters({ ...filters, appliedUntil: e.target.value })}
//           />

//           <Select
//             value={filters.jobType}
//             onValueChange={(val) => setFilters({ ...filters, jobType: val })}
//           >
//             <SelectTrigger className="w-[140px]">
//               <SelectValue placeholder="Job Type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="Internship">Internship</SelectItem>
//               <SelectItem value="Full-time">Full-time</SelectItem>
//               <SelectItem value="Co-op">Co-op</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select
//             value={filters.status}
//             onValueChange={(val) => setFilters({ ...filters, status: val })}
//           >
//             <SelectTrigger className="w-[140px]">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="saved">Saved</SelectItem>
//               <SelectItem value="applied">Applied</SelectItem>
//               <SelectItem value="offer">Offer</SelectItem>
//               <SelectItem value="rejected">Rejected</SelectItem>
//             </SelectContent>
//           </Select>

//           <Button variant="outline" size="icon" title="Filter">
//             <Filter className="h-4 w-4" />
//           </Button>
//         </div>

//         {/* Tabs */}
//         <Tabs defaultValue="active" className="space-y-6">
//           <TabsList className="grid w-full max-w-md grid-cols-2">
//             <TabsTrigger value="active">Active</TabsTrigger>
//             <TabsTrigger value="archived">Archived</TabsTrigger>
//           </TabsList>

//           {/* Active Tab */}
//           <TabsContent value="active">
//             <div className="grid md:grid-cols-4 gap-4">
//               {columns.map((col) => (
//                 <div key={col} className="space-y-4">
//                   <h2 className="text-lg font-semibold capitalize border-b pb-2">{col}</h2>
//                   {filterByStatus(col).map((app) => (
//                     <Card key={app.id} className="hover:shadow-md transition-all">
//                       <CardHeader>
//                         <div>
//                           <CardTitle className="text-lg">{app.jobTitle}</CardTitle>
//                           <CardDescription className="flex items-center gap-1">
//                             <Building2 className="h-4 w-4" /> {app.company}
//                           </CardDescription>
//                         </div>
//                       </CardHeader>
//                                 <CardContent className="space-y-3">
//   {/* Show applied date only if NOT in saved column */}
//   {app.status !== "saved" && (
//     <div className="flex flex-col gap-1 text-sm text-muted-foreground">
//       <span className="flex items-center gap-1">
//         <Calendar className="h-4 w-4" /> Applied{" "}
//         {new Date(app.appliedDate).toLocaleDateString()}
//       </span>
//     </div>
//   )}

//   <Button
//     variant="outline"
//     className="w-full mt-2"
//     onClick={() => setSelectedJob(app)}
//   >
//     View Details <ExternalLink className="ml-2 h-4 w-4" />
//   </Button>
// </CardContent>
                      
//                     </Card>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           </TabsContent>

//           {/* Archived Tab */}
//           <TabsContent value="archived">
//             {archivedJobs.length === 0 ? (
//               <p className="text-muted-foreground">No archived applications yet.</p>
//             ) : (
//               <div className="grid md:grid-cols-3 gap-4">
//                 {archivedJobs.map((job) => (
//                   <Card key={job.id}>
//                     <CardHeader>
//                       <CardTitle className="text-lg">{job.jobTitle}</CardTitle>
//                       <CardDescription>{job.company}</CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm text-muted-foreground">
//                         Archived from {job.status} on{" "}
//                         {new Date(job.appliedDate).toLocaleDateString()}
//                       </p>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Job Details Dialog */}
//       <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
//         {selectedJob && (
//           <DialogContent className="max-w-3xl">
//             <DialogHeader className="flex justify-between items-start">
//               <DialogTitle className="text-2xl font-bold">{selectedJob.jobTitle}</DialogTitle>
//               <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)}>
//                 <X className="h-5 w-5" />
//               </Button>
//             </DialogHeader>

//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <p className="text-lg font-semibold">{selectedJob.company}</p>
//                 <p className="text-muted-foreground text-sm">{selectedJob.location}</p>
//               </div>

//               {/* Saved → Apply | Favorite | Archive | Delete */}
//               {selectedJob.status === "saved" && (
//                 <div className="flex gap-2">
//                   <Button variant="outline" className="flex items-center gap-1">
//                     <Zap className="h-4 w-4 text-blue-500" /> Apply
//                   </Button>
//                   <Button variant="outline" className="flex items-center gap-1">
//                     <Star className="h-4 w-4 text-blue-500" /> Favorite
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="flex items-center gap-1"
//                     onClick={() => handleArchive(selectedJob)}
//                   >
//                     <Archive className="h-4 w-4 text-blue-500" /> Archive
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     className="flex items-center gap-1"
//                     onClick={() => handleDelete(selectedJob.id)}
//                   >
//                     <Trash2 className="h-4 w-4" /> Delete
//                   </Button>
//                 </div>
//               )}

//               {/* Others → Favorite | Archive | Delete */}
//               {selectedJob.status !== "saved" && (
//                 <div className="flex gap-2">
//                   <Button variant="outline" className="flex items-center gap-1">
//                     <Star className="h-4 w-4 text-blue-500" /> Favorite
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="flex items-center gap-1"
//                     onClick={() => handleArchive(selectedJob)}
//                   >
//                     <Archive className="h-4 w-4 text-blue-500" /> Archive
//                   </Button>
//                   <Button
//                     variant="destructive"
//                     className="flex items-center gap-1"
//                     onClick={() => handleDelete(selectedJob.id)}
//                   >
//                     <Trash2 className="h-4 w-4" /> Delete
//                   </Button>
//                 </div>
//               )}
//             </div>

//             {/* Job Details */}
//             <div className="grid md:grid-cols-3 gap-6">
//               <div className="md:col-span-2 space-y-4">
//                 <p>
//                   <strong>Job Type:</strong> {selectedJob.jobType}
//                 </p>
//                 {/* Show "Applied On" only if not in saved section */}
// {selectedJob.status !== "saved" && (
//   <p>
//     <strong>Applied On:</strong>{" "}
//     {new Date(selectedJob.appliedDate).toLocaleDateString()}
//   </p>
// )}


//                 <div>
//                   <h3 className="text-lg font-semibold mt-4">Description</h3>
//                   <p className="text-sm text-muted-foreground leading-relaxed">
//                     {selectedJob.description}
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-semibold mb-2">Application Status</h4>
//                   <Select
//                     value={selectedJob.status}
//                     onValueChange={(val) => handleStatusChange(selectedJob.id, val)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="saved">Saved</SelectItem>
//                       <SelectItem value="applied">Applied</SelectItem>
//                       <SelectItem value="offer">Offer</SelectItem>
//                       <SelectItem value="rejected">Rejected</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div>
//                   <h4 className="font-semibold mb-2">Notes</h4>
//                   <textarea
//                     placeholder="Add notes or reminders for this job..."
//                     className="w-full border rounded-md p-2 text-sm bg-muted"
//                     rows={5}
//                   />
//                 </div>
//               </div>
//             </div>
//           </DialogContent>
//         )}
//       </Dialog>
//     </div>
//   );
// };

// export default Applications;



import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogClose,
} from "@/components/ui/dialog";


const Applications = () => {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [filters, setFilters] = useState({
    query: "",
    appliedFrom: "",
    appliedUntil: "",
    jobType: "",
    status: "",
  });

  const [applications, setApplications] = useState([
    {
      id: 1,
      jobTitle: "Intern - Software Engineering",
      company: "PDC Protodyne Corporation",
      appliedDate: "2025-10-10",
      status: "saved",
      location: "USA - CT - Bloomfield - 1302 Hall Boulevard, USA",
      jobType: "Internship",
      description:
        "At Labcorp, we believe in the power of science to change lives. Our work combines unparalleled diagnostic laboratories, drug development capabilities, and commercial innovations.",
    },
    {
      id: 2,
      jobTitle: "AI Intern",
      company: "Red Hat Consulting",
      appliedDate: "2025-10-12",
      status: "applied",
      location: "Boston, USA",
      jobType: "Internship",
      description: "Assist in developing AI-powered tools and data pipelines for enterprise clients.",
    },
    {
      id: 3,
      jobTitle: "Full Stack Developer",
      company: "Mercury",
      appliedDate: "2025-10-04",
      status: "offer",
      location: "San Francisco, CA, USA",
      jobType: "Full-time",
      description: "Work on backend APIs and frontend dashboards in a fast-paced fintech startup.",
    },
    {
      id: 4,
      jobTitle: "Software Engineer Co-op",
      company: "StartupXYZ",
      appliedDate: "2025-09-28",
      status: "rejected",
      location: "Remote",
      jobType: "Co-op",
      description: "Worked on backend integrations and RESTful APIs.",
    },
  ]);

  const [archivedJobs, setArchivedJobs] = useState<any[]>([]);
  const [favoriteJobs, setFavoriteJobs] = useState<any[]>([]);

  // 🔍 Filtering logic (local only)
  const filteredApplications = applications.filter((job) => {
    const q = filters.query.toLowerCase();
    const matchesQuery =
      !q || job.jobTitle.toLowerCase().includes(q) || job.company.toLowerCase().includes(q);

    const matchesJobType = !filters.jobType || job.jobType === filters.jobType;
    const matchesStatus = !filters.status || job.status === filters.status;

    const appliedDate = new Date(job.appliedDate).getTime();
    const fromDate = filters.appliedFrom ? new Date(filters.appliedFrom).getTime() : null;
    const untilDate = filters.appliedUntil ? new Date(filters.appliedUntil).getTime() : null;

    const matchesDateRange =
      (!fromDate || appliedDate >= fromDate) && (!untilDate || appliedDate <= untilDate);

    return matchesQuery && matchesJobType && matchesStatus && matchesDateRange;
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    setApplications((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
    );
    setSelectedJob((prev: any) => (prev ? { ...prev, status: newStatus } : prev));
  };

  const handleDelete = (id: number) => {
    setApplications((prev) => prev.filter((job) => job.id !== id));
    setArchivedJobs((prev) => prev.filter((job) => job.id !== id));
    setFavoriteJobs((prev) => prev.filter((job) => job.id !== id));
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
    if (!favoriteJobs.some((f) => f.id === job.id)) {
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
            <p className="text-muted-foreground">Track and manage your job applications easily</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">Import CSV</Button>
            <Button variant="outline">Export CSV</Button>
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
                          <CardTitle className="text-lg">{app.jobTitle}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" /> {app.company}
                          </CardDescription>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        {app.status !== "saved" && (
                          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" /> Applied{" "}
                              {new Date(app.appliedDate).toLocaleDateString()}
                            </span>
                          </div>
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
                  <Card key={job.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{job.jobTitle}</CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Archived on {new Date(job.appliedDate).toLocaleDateString()}
                      </p>
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
                  <Card key={job.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{job.jobTitle}</CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Favorited on {new Date(job.appliedDate).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Job Details Dialog */}
    <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
  {selectedJob && (
    <DialogContent className="max-w-3xl">
      {/* ✅ Clean header alignment */}
      <DialogHeader>
        <div className="flex justify-between items-start w-full">
          <DialogTitle className="text-2xl font-bold">{selectedJob.jobTitle}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedJob(null)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </DialogHeader>

      {/* ✅ Job Details Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-lg font-semibold">{selectedJob.company}</p>
          <p className="text-muted-foreground text-sm">{selectedJob.location}</p>
        </div>

        {/* Action Buttons */}
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

      {/* Job Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <p>
            <strong>Job Type:</strong> {selectedJob.jobType}
          </p>
          {selectedJob.status !== "saved" && (
            <p>
              <strong>Applied On:</strong>{" "}
              {new Date(selectedJob.appliedDate).toLocaleDateString()}
            </p>
          )}

          <div>
            <h3 className="text-lg font-semibold mt-4">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedJob.description}
            </p>
          </div>
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
        </div>
      </div>
    </DialogContent>
  )}
</Dialog>

    </div>
  );
};

export default Applications;
