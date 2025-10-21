import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase, DollarSign, Clock, BookmarkPlus } from "lucide-react";
import { toast } from "sonner";

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("loc") || "");
  const [jobType, setJobType] = useState("all");

  // Mock job data
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $180k",
      posted: "2 days ago",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      description: "We're looking for an experienced frontend developer to join our team.",
    },
    {
      id: 2,
      title: "Product Manager",
      company: "Innovation Labs",
      location: "Remote",
      type: "Full-time",
      salary: "$130k - $200k",
      posted: "1 week ago",
      skills: ["Product Strategy", "Agile", "Analytics"],
      description: "Lead product development and strategy for our flagship products.",
    },
    {
      id: 3,
      title: "UX/UI Designer",
      company: "Design Studio Pro",
      location: "New York, NY",
      type: "Contract",
      salary: "$90k - $140k",
      posted: "3 days ago",
      skills: ["Figma", "User Research", "Prototyping"],
      description: "Create beautiful and intuitive user experiences for our clients.",
    },
    {
      id: 4,
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$110k - $160k",
      posted: "5 days ago",
      skills: ["Node.js", "React", "PostgreSQL"],
      description: "Build scalable web applications from frontend to backend.",
    },
  ];

  const handleApply = (jobTitle: string) => {
    toast.success(`Application started for ${jobTitle}!`);
  };

  const handleSave = (jobTitle: string) => {
    toast.success(`${jobTitle} saved to your list!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-card shadow-card rounded-xl p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Job title or keyword"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Location"
                className="pl-10"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Job Opportunities</h1>
            <p className="text-muted-foreground">
              {jobs.length} jobs found {searchQuery && `for "${searchQuery}"`}
            </p>
          </div>
          <Select defaultValue="recent">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="salary">Highest Salary</SelectItem>
              <SelectItem value="relevant">Most Relevant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-elevated transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                    <CardDescription className="text-base">
                      <span className="font-semibold text-foreground">{job.company}</span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave(job.title)}
                  >
                    <BookmarkPlus className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{job.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.posted}
                  </div>
                </div>

                <Button 
                  onClick={() => handleApply(job.title)}
                  className="w-full gradient-primary text-white font-semibold"
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
