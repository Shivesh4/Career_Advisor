import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, TrendingUp, Users, Award, Rocket } from "lucide-react";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  // const handleSearch = () => {
  //   navigate(`/jobs?q=${searchQuery}&loc=${location}`);
  // };
// inside Home.tsx
const handleSearch = () => {
  const qs = new URLSearchParams({
    q: searchQuery.trim(),
    loc: location.trim(),
  }).toString();
  navigate(`/jobs?${qs}`);
};

  const features = [
    {
      icon: Search,
      title: "Smart Job Search",
      description: "Find your perfect role with AI-powered matching",
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Analysis",
      description: "Get personalized recommendations to advance your career",
    },
    {
      icon: Users,
      title: "Application Tracking",
      description: "Manage all your applications in one place",
    },
    {
      icon: Award,
      title: "Career Resources",
      description: "Access courses, articles, and expert advice",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero -z-10" />
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Rocket className="mr-2 h-4 w-4" />
                AI-Powered Career Platform
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Find Your Dream Job{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Faster
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Discover opportunities that match your skills, track applications effortlessly, 
                and get AI-powered insights to accelerate your career growth.
              </p>

              {/* Search Bar */}
              <div className="bg-card shadow-elevated rounded-xl p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Job title or keyword"
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="City or remote"
                      className="pl-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSearch} 
                  className="w-full gradient-primary text-white font-semibold"
                  size="lg"
                >
                  Search Jobs
                </Button>
              </div>

              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Popular:</span>
                {["Software Engineer", "Product Manager", "Designer"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      navigate(`/jobs?q=${term}`);
                    }}
                    className="text-primary hover:underline transition-smooth"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="Professional career growth"
                className="relative rounded-3xl shadow-elevated w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and AI-driven insights to help you land your dream job
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-card p-6 rounded-xl shadow-card hover:shadow-elevated transition-smooth group"
              >
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-center text-white shadow-elevated">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals who've found their dream careers through CareerHub
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/jobs")}
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Browse Jobs
              </Button>
              <Button
                size="lg"
                onClick={() => navigate("/profile")}
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Create Profile
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
