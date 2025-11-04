import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Plus, X, Target, BookOpen, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { loadMilestones } from "@/lib/milestoneStore";

const Profile = () => {
  const [skills, setSkills] = useState(["React", "TypeScript", "Node.js", "PostgreSQL"]);
  const [newSkill, setNewSkill] = useState("");

  // 🔽 recommendations loaded from Career Milestone analysis
  type RecCourse = { title: string; provider: string; duration?: string; url?: string };
  type RecArticle = { title: string; provider: string; url?: string };
  const [recCourses, setRecCourses] = useState<RecCourse[]>([]);
  const [recArticles, setRecArticles] = useState<RecArticle[]>([]);

  useEffect(() => {
    const data = loadMilestones();
    if (data) {
      setRecCourses(data.courses.map(({ title, provider, duration, url }) => ({ title, provider, duration, url })));
      setRecArticles(data.articles.map(({ title, provider, url }) => ({ title, provider, url })));
    }
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      toast.success("Skill added!");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
    toast.success("Skill removed");
  };

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const handleResumeUpload = () => {
    toast.success("Resume uploaded successfully!");
  };

  const skillGaps = [
    { skill: "AWS Cloud", importance: "High", courses: 3 },
    { skill: "System Design", importance: "Medium", courses: 5 },
    { skill: "GraphQL", importance: "Medium", courses: 4 },
  ];

  const resources = [
    { title: "Advanced React Patterns", type: "Course", duration: "12 hours" },
    { title: "System Design Interview Prep", type: "Article Series", duration: "6 articles" },
    { title: "PostgreSQL Performance Tuning", type: "Video", duration: "45 min" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-3xl">My Profile</CardTitle>
              <CardDescription>Manage your professional information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max 2MB</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" defaultValue="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Current Title</Label>
                <Input id="title" placeholder="Senior Software Engineer" defaultValue="Senior Software Engineer" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Summary</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your experience and career goals..."
                  className="min-h-[100px]"
                  defaultValue="Passionate software engineer with 5+ years of experience building scalable web applications."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="San Francisco, CA" defaultValue="San Francisco, CA" />
              </div>
            </CardContent>
          </Card>

          {/* Skills Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl">Skills</CardTitle>
              <CardDescription>Add skills to help match you with relevant opportunities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="ml-2 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                />
                <Button onClick={handleAddSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resume Section */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl">Resume</CardTitle>
              <CardDescription>Upload your latest resume (PDF, DOC, DOCX)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-smooth cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">Drag and drop your resume here, or click to browse</p>
                <Button onClick={handleResumeUpload} variant="outline">
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 🔽 Recommended Courses (dynamic) */}
          {recCourses.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Recommended Courses</CardTitle>
                <CardDescription>Based on your resume & target role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recCourses.map((c, idx) => {
                    const label = `${c.provider}${c.duration ? ` · ${c.duration}` : ""}`;
                    const open = () => {
                      const q = encodeURIComponent(`${c.title} ${c.provider}`);
                      window.open(c.url || `https://www.google.com/search?q=${q}`, "_blank", "noopener,noreferrer");
                    };
                    return (
                      <div
                        key={`${c.title}-${idx}`}
                        onClick={open}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth cursor-pointer"
                      >
                        <div>
                          <p className="font-semibold">{c.title}</p>
                          <p className="text-sm text-muted-foreground">{label}</p>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 🔽 Recommended Articles (dynamic) */}
          {recArticles.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Recommended Articles</CardTitle>
                <CardDescription>Curated from your resume signals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recArticles.map((a, idx) => {
                    const open = () => {
                      const q = encodeURIComponent(`${a.title} ${a.provider}`);
                      window.open(a.url || `https://www.google.com/search?q=${q}`, "_blank", "noopener,noreferrer");
                    };
                    return (
                      <div
                        key={`${a.title}-${idx}`}
                        onClick={open}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth cursor-pointer"
                      >
                        <div>
                          <p className="font-semibold">{a.title}</p>
                          <p className="text-sm text-muted-foreground">{a.provider}</p>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} size="lg" className="gradient-primary text-white font-semibold">
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
