import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Building2, ExternalLink, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Applications = () => {
  const applications = [
    {
      id: 1,
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      appliedDate: "2025-10-15",
      status: "interviewing",
      progress: 75,
      nextStep: "Final round interview on Oct 25",
    },
    {
      id: 2,
      jobTitle: "Product Manager",
      company: "Innovation Labs",
      appliedDate: "2025-10-10",
      status: "pending",
      progress: 25,
      nextStep: "Waiting for initial review",
    },
    {
      id: 3,
      jobTitle: "UX/UI Designer",
      company: "Design Studio Pro",
      appliedDate: "2025-10-08",
      status: "offer",
      progress: 100,
      nextStep: "Offer received - respond by Oct 30",
    },
    {
      id: 4,
      jobTitle: "Full Stack Engineer",
      company: "StartupXYZ",
      appliedDate: "2025-10-05",
      status: "rejected",
      progress: 50,
      nextStep: "Application not selected",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-warning/10 text-warning",
      interviewing: "bg-primary/10 text-primary",
      offer: "bg-success/10 text-success",
      rejected: "bg-destructive/10 text-destructive",
    };
    return colors[status as keyof typeof colors] || "bg-muted";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Pending Review",
      interviewing: "Interviewing",
      offer: "Offer Received",
      rejected: "Not Selected",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const filterByStatus = (status?: string) => {
    if (!status) return applications;
    return applications.filter((app) => app.status === status);
  };

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      color: "text-primary",
    },
    {
      label: "In Progress",
      value: applications.filter((a) => a.status === "interviewing").length,
      color: "text-primary",
    },
    {
      label: "Offers",
      value: applications.filter((a) => a.status === "offer").length,
      color: "text-success",
    },
    {
      label: "Response Rate",
      value: "75%",
      color: "text-accent",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground">Track and manage your job applications</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-card">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Applications List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="interviewing">Active</TabsTrigger>
            <TabsTrigger value="offer">Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} className="hover:shadow-elevated transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{app.jobTitle}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-base">
                        <Building2 className="h-4 w-4" />
                        {app.company}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {getStatusLabel(app.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Application Progress</span>
                      <span className="font-semibold">{app.progress}%</span>
                    </div>
                    <Progress value={app.progress} className="h-2" />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Applied {new Date(app.appliedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {app.nextStep}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Details
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                    {app.status === "interviewing" && (
                      <Button className="flex-1 gradient-primary text-white">
                        Schedule Interview
                      </Button>
                    )}
                    {app.status === "offer" && (
                      <Button className="flex-1 bg-success text-white hover:bg-success/90">
                        Review Offer
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {["pending", "interviewing", "offer"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              {filterByStatus(status).map((app) => (
                <Card key={app.id} className="hover:shadow-elevated transition-smooth">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-2xl">{app.jobTitle}</CardTitle>
                        <CardDescription className="flex items-center gap-2 text-base">
                          <Building2 className="h-4 w-4" />
                          {app.company}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        {getStatusLabel(app.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Application Progress</span>
                        <span className="font-semibold">{app.progress}%</span>
                      </div>
                      <Progress value={app.progress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Applied {new Date(app.appliedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {app.nextStep}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        View Details
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                      {app.status === "interviewing" && (
                        <Button className="flex-1 gradient-primary text-white">
                          Schedule Interview
                        </Button>
                      )}
                      {app.status === "offer" && (
                        <Button className="flex-1 bg-success text-white hover:bg-success/90">
                          Review Offer
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Applications;
