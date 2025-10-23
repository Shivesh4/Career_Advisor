import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, FileText, MessageSquare } from "lucide-react";
import { ATSAnalysis } from "@/types/ats";
import { Progress } from "@/components/ui/progress";

interface ATSResultsProps {
  analysis: ATSAnalysis;
}

const ATSResults = ({ analysis }: ATSResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      {/* Match Score */}
      <Card>
        <CardHeader>
          <CardTitle>ATS Match Score</CardTitle>
          <CardDescription>How well your resume matches the job description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-6xl font-bold ${getScoreColor(analysis.matchScore)}`}>
                {analysis.matchScore}%
              </span>
              <span className="text-lg text-muted-foreground">
                {getScoreLabel(analysis.matchScore)}
              </span>
            </div>
            <Progress value={analysis.matchScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Skills Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Matching Skills
            </CardTitle>
            <CardDescription>Skills you have that match the job</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.matchingSkills.length > 0 ? (
                analysis.matchingSkills.map((skill, index) => (
                  <Badge key={index} variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No matching skills found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Missing Skills
            </CardTitle>
            <CardDescription>Skills to develop for this role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.missingSkills.length > 0 ? (
                analysis.missingSkills.map((skill, index) => (
                  <Badge key={index} variant="default" className="bg-red-100 text-red-800 hover:bg-red-200">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No missing skills identified</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cover Letter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            AI-Generated Cover Letter
          </CardTitle>
          <CardDescription>Customized for this job application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
            {analysis.coverLetter}
          </div>
        </CardContent>
      </Card>

      {/* Feedback Areas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Resume Improvement Feedback
          </CardTitle>
          <CardDescription>Areas to enhance your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.feedbackAreas.map((feedback, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">{feedback}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ATSResults;
