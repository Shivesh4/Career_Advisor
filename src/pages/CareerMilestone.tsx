import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Target, BookOpen, Award, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { extractTextFromPDF } from "@/lib/pdfParser";
import { openai } from "@/lib/openai";
import { saveMilestones } from "@/lib/milestoneStore";

interface Resource {
  title: string;
  type: "course" | "article";
  provider: string;
  duration?: string;
  url?: string;
}

interface Milestone {
  courses: Resource[];
  articles: Resource[];
  aiAdvice: string[];
}

const CareerMilestone = () => {
  const [jobRole, setJobRole] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [milestone, setMilestone] = useState<Milestone | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      toast({ title: "Resume uploaded", description: "Ready to analyze your career path!" });
    } else {
      toast({ title: "Invalid file", description: "Please upload a PDF file", variant: "destructive" });
    }
  };

  const handleAnalyze = async () => {
    if (!jobRole || !resumeFile) {
      toast({
        title: "Missing information",
        description: "Please provide both job role and resume",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const resumeText = await extractTextFromPDF(resumeFile);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a career development expert. Analyze resumes and suggest relevant courses, articles, and career advice.",
          },
          {
            role: "user",
            content: `Target Job Role: ${jobRole}\n\nResume:\n${resumeText}\n\nBased on this resume and target job role, suggest:
1. 3-5 relevant online courses (with provider names and duration)
2. 3-5 relevant articles or resources
3. 5 pieces of expert career advice for transitioning to this role

Format your response as JSON with this structure:
{
  "courses": [{"title": "...", "provider": "...", "duration": "..."}],
  "articles": [{"title": "...", "provider": "..."}],
  "aiAdvice": ["advice1", "advice2", ...]
}`,
          },
        ],
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      if (!response) throw new Error("Empty response from model");

      // Strip optional ```json blocks and parse
      const cleaned = response.replace(/```json\s*|\s*```/g, "").trim();
      const parsed = JSON.parse(cleaned) as Milestone;

      setMilestone(parsed);

      // Persist for Profile page (front-end only)
      saveMilestones({
        courses: (parsed.courses ?? []).map((c: any) => ({
          title: c.title,
          provider: c.provider,
          duration: c.duration,
          url: c.url,
          type: "course" as const,
        })),
        articles: (parsed.articles ?? []).map((a: any) => ({
          title: a.title,
          provider: a.provider,
          url: a.url,
          type: "article" as const,
        })),
        aiAdvice: parsed.aiAdvice ?? [],
        capturedAt: new Date().toISOString(),
      });

      toast({
        title: "Analysis complete!",
        description: "Your personalized career roadmap is saved to your profile.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({ title: "Analysis failed", description: "Please try again", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-text">Career Milestone</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get personalized course recommendations, articles, and expert AI advice tailored to your career goals
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Start Your Journey
            </CardTitle>
            <CardDescription>Upload your resume and tell us your target job role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Job Role</label>
              <Input
                placeholder="e.g., Senior Software Engineer, Data Scientist"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Resume (PDF)</label>
              <div className="flex items-center gap-4">
                <Input type="file" accept=".pdf" onChange={handleFileUpload} className="cursor-pointer" />
                {resumeFile && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Upload className="h-3 w-3" />
                    {resumeFile.name}
                  </Badge>
                )}
              </div>
            </div>

            <Button onClick={handleAnalyze} disabled={isAnalyzing || !jobRole || !resumeFile} className="w-full gradient-primary" size="lg">
              {isAnalyzing ? "Analyzing..." : "Analyze Career Path"}
            </Button>
          </CardContent>
        </Card>

        {milestone && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recommended Courses
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {milestone.courses.map((course, idx) => {
                  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(course.title + " " + course.provider)}`;
                  return (
                    <Card
                      key={idx}
                      className="hover:shadow-elegant transition-smooth cursor-pointer h-full"
                      onClick={() => window.open(searchUrl, "_blank", "noopener,noreferrer")}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>
                          {course.provider} {course.duration && `• ${course.duration}`}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recommended Articles
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {milestone.articles.map((article, idx) => {
                  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(article.title + " " + article.provider)}`;
                  return (
                    <Card
                      key={idx}
                      className="hover:shadow-elegant transition-smooth cursor-pointer h-full"
                      onClick={() => window.open(searchUrl, "_blank", "noopener,noreferrer")}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <CardDescription>{article.provider}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Expert AI Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {milestone.aiAdvice.map((advice, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-primary font-semibold">{idx + 1}.</span>
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default CareerMilestone;
