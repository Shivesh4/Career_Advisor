import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Target, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { extractTextFromPDF } from "@/lib/pdfParser";
import { openai } from "@/lib/openai";
import { ATSAnalysis } from "@/types/ats";
import ATSResults from "@/components/ATSResults";

const ATSScoring = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetLocation, setTargetLocation] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ATSAnalysis | null>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setResumeFile(file);
        toast({
          title: "Resume uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setResumeFile(file);
        toast({
          title: "Resume uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
      }
    }
  };

  const analyzeResume = async (includeScore: boolean, includeCoverLetter: boolean) => {
    if (!resumeFile || !jobDescription.trim()) {
      toast({
        title: "Missing information",
        description: "Please upload a resume and provide a job description.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Extract text from PDF
      const resumeText = await extractTextFromPDF(resumeFile);
      
      // Prepare the prompt based on what's requested
      let prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following resume against the job description and provide:\n\n`;
      
      if (includeScore) {
        prompt += `1. An ATS match score from 0-100\n`;
        prompt += `2. List of matching skills (skills from resume that match job requirements)\n`;
        prompt += `3. List of missing skills (skills mentioned in job description but not in resume)\n`;
      }
      
      if (includeCoverLetter) {
        prompt += `4. A professional cover letter (3-4 paragraphs) tailored to this job\n`;
      }
      
      prompt += `5. Specific feedback on resume improvement areas\n\n`;
      prompt += `Resume:\n${resumeText}\n\n`;
      prompt += `Job Description:\n${jobDescription}\n\n`;
      
      if (targetRole) {
        prompt += `Target Role: ${targetRole}\n`;
      }
      if (targetLocation) {
        prompt += `Target Location: ${targetLocation}\n`;
      }
      
      prompt += `\nProvide your response in the following JSON format:\n`;
      prompt += `{\n`;
      if (includeScore) {
        prompt += `  "matchScore": <number 0-100>,\n`;
        prompt += `  "matchingSkills": [<array of strings>],\n`;
        prompt += `  "missingSkills": [<array of strings>],\n`;
      }
      if (includeCoverLetter) {
        prompt += `  "coverLetter": "<string>",\n`;
      }
      prompt += `  "feedbackAreas": [<array of strings>]\n`;
      prompt += `}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert ATS system and career counselor. Provide detailed, actionable feedback."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      // Ensure all fields exist
      const analysis: ATSAnalysis = {
        matchScore: result.matchScore || 0,
        matchingSkills: result.matchingSkills || [],
        missingSkills: result.missingSkills || [],
        coverLetter: result.coverLetter || "",
        feedbackAreas: result.feedbackAreas || []
      };
      
      setAnalysisResults(analysis);
      
      toast({
        title: "Analysis complete",
        description: "Your ATS analysis is ready!",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An error occurred during analysis.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleComputeScore = () => analyzeResume(true, false);
  const handleDraftCoverLetter = () => analyzeResume(false, true);
  const handleDoBoth = () => analyzeResume(true, true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              ATS Score & Skill Gap Analysis
            </h1>
            <p className="text-muted-foreground text-lg">
              Compare your resume with job descriptions and get AI-powered insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Resume Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  1) Upload Resume (PDF)
                </CardTitle>
                <CardDescription>
                  Upload your resume to analyze against job descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileInput}
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    {resumeFile ? (
                      <div>
                        <p className="text-sm font-medium mb-1">{resumeFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Click to change file
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium mb-1">
                          Drag and drop file here
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Limit 200MB per file • PDF
                        </p>
                        <Button variant="outline" size="sm" type="button">
                          Browse files
                        </Button>
                      </div>
                    )}
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Job Description Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  2) Paste Job Description
                </CardTitle>
                <CardDescription>
                  Copy and paste the job description you're applying for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste a JD here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </CardContent>
            </Card>
          </div>

          {/* Optional Fields */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Additional Information (Optional)</CardTitle>
              <CardDescription>
                Help us provide more accurate insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Target Role (optional)
                </label>
                <Input
                  placeholder="e.g., Data Scientist"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Target Location (optional)
                </label>
                <Input
                  placeholder="e.g., Dallas, TX"
                  value={targetLocation}
                  onChange={(e) => setTargetLocation(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex justify-center mb-8">
            <Button
              size="lg"
              onClick={handleDoBoth}
              disabled={isAnalyzing}
              className="gradient-primary px-8"
            >
              {isAnalyzing ? "Analyzing..." : "Compute Match Score & Draft Cover Letter"}
            </Button>
          </div>

          {/* Results Section */}
          {analysisResults ? (
            <ATSResults analysis={analysisResults} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Upload a resume and job description, then click a button above to see your analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Your analysis results will appear here
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ATSScoring;
