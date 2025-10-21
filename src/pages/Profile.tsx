import { useState } from "react";
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

const Profile = () => {
  const [skills, setSkills] = useState(["React", "TypeScript", "Node.js", "PostgreSQL"]);
  const [newSkill, setNewSkill] = useState("");

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
    {
      title: "Advanced React Patterns",
      type: "Course",
      duration: "12 hours",
    },
    {
      title: "System Design Interview Prep",
      type: "Article Series",
      duration: "6 articles",
    },
    {
      title: "PostgreSQL Performance Tuning",
      type: "Video",
      duration: "45 min",
    },
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
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF. Max 2MB
                  </p>
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
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:text-destructive"
                    >
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
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop your resume here, or click to browse
                </p>
                <Button onClick={handleResumeUpload} variant="outline">
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Skill Gap Analysis */}
          <Card className="shadow-card border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">AI Skill Gap Analysis</CardTitle>
              </div>
              <CardDescription>
                Based on your profile and career goals, here are skills to develop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {skillGaps.map((gap) => (
                  <div
                    key={gap.skill}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth"
                  >
                    <div>
                      <p className="font-semibold">{gap.skill}</p>
                      <p className="text-sm text-muted-foreground">
                        {gap.courses} recommended courses
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={gap.importance === "High" ? "default" : "secondary"}>
                        {gap.importance}
                      </Badge>
                      <Button size="sm" className="gradient-primary text-white">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Learn
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Career Resources */}
          <Card className="shadow-card border-accent/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-accent" />
                <CardTitle className="text-2xl">Recommended Resources</CardTitle>
              </div>
              <CardDescription>
                Curated learning materials based on your interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div
                    key={resource.title}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-smooth"
                  >
                    <div>
                      <p className="font-semibold">{resource.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {resource.type} · {resource.duration}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
